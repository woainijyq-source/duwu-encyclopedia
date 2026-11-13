// ============================================================================
// 语音讲解引擎 (Doubao seed-tts-2.0 Client + WebAudio 解码 + 逐句放大高亮 + 永久缓存)
// 四重防重复计费护盾：
//   1. 内存 Blob + AudioBuffer 缓存 (0ms)
//   2. 浏览器 IndexedDB 离线永久缓存 (刷新/重开永不二次请求)
//   3. 前端并发单飞去重 (连点按钮绝不重复发请求)
//   4. 服务端 SHA-256 永久磁盘缓存 (跨设备共享同一份 MP3，永不二次调 API 计费!)
// ============================================================================

(function () {
  const DB_NAME = "duwu_doubao_tts_cache_v1";
  const STORE_NAME = "clips";
  const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE0F}✓✗×➕➖👇👆👈👉➜]+/gu;

  function normalizeTtsText(raw) {
    return String(raw || "")
      .replace(/\+1\s*❤️/g, "加1颗红心")
      .replace(/°C/g, "摄氏度")
      .replace(/mmHg/g, "毫米汞柱")
      .replace(/BPM/g, "次每分钟")
      .replace(EMOJI_RE, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);
  }

  function cleanMoleculeForSpeech(mol) {
    return String(mol || "")
      .replace(/\s*[\(（][A-Za-z0-9,\s\-αβγ/]+[\)）]/g, "")
      .replace(/[\(（][A-Za-z0-9,\s\-]+/g, "（")
      .replace(/\+/g, "加")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitIntoClauses(text) {
    const str = String(text || "").trim();
    if (!str) return [];
    const raw =
      str.match(/(?:[0-9]+\.[0-9]+|[^。！？；，：.!?])+(?:[。！？；，：”』」）》]+|[.!?]+(?=\s|$)|$)/g) || [
        str
      ];
    const merged = [];
    let buf = "";
    for (const part of raw) {
      buf += part;
      const hasMultiEnWords = /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(buf);
      const pureLen = buf.replace(/[『』「」【】（）()《》“”\s，。！？；：、.!?]/g, "").length;
      if (
        hasMultiEnWords ||
        pureLen >= 7 ||
        /[。！？；.!?]$/.test(buf.trim())
      ) {
        merged.push(buf.trim());
        buf = "";
      }
    }
    if (buf.trim()) {
      if (merged.length > 0) merged[merged.length - 1] += buf;
      else merged.push(buf.trim());
    }
    return merged;
  }

  function escapeAttr(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderClausesHTML(text, rubyFn, bilingualObj) {
    const clauses = splitIntoClauses(text);
    const rFn = typeof rubyFn === "function" ? rubyFn : (x) => x;

    const formatClauseContent = (c) => {
      if (/[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(c)) {
        return `<span class="inline-en-badge">🇬🇧</span> ${rFn(c)}`;
      }
      return rFn(c);
    };

    const items = clauses.map((c, idx) => {
      const hasEn = /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(c);
      return `<span class="tts-seg tts-clause ${hasEn ? "tts-clause-inline-en" : ""}" data-tts-seg="${escapeAttr(c)}" data-clause-idx="${idx}">${formatClauseContent(c)}</span>`;
    });

    if (bilingualObj && bilingualObj.en && bilingualObj.zh) {
      const spokenPair = `${bilingualObj.en} ${bilingualObj.zh}`;
      const bilingualHTML = `
        <span class="tts-seg tts-clause tts-bilingual-clause" data-tts-seg="${escapeAttr(spokenPair)}" data-bilingual-en="${escapeAttr(bilingualObj.en)}" title="点击可单独跟读这句英语">
          <span class="bilingual-tag">🇬🇧 顺便学英文</span>
          <span class="bilingual-en">${escapeAttr(bilingualObj.en)}</span>
          <span class="bilingual-zh">${rFn(bilingualObj.zh)}</span>
        </span>
      `.trim();

      const insertIdx =
        bilingualObj.pos === "mid" && items.length >= 2 ? 1 : items.length;
      items.splice(insertIdx, 0, bilingualHTML);
    }

    return items.join("");
  }

  function calcSegmentWeight(rawSegText) {
    const raw = String(rawSegText || "").trim();
    const norm = normalizeTtsText(raw);
    if (!norm) return 1.5;

    let w = 0;
    const enWords = norm.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
    for (const word of enWords) {
      w += Math.max(1.38, word.length * 0.34);
    }
    const withoutEn = norm.replace(/[A-Za-z]+(?:'[A-Za-z]+)?/g, "");
    for (const ch of withoutEn) {
      if (/[\u4e00-\u9fff]/.test(ch)) w += 1.0;
      else if (/[0-9]/.test(ch)) w += 0.55;
      else w += 0.16;
    }
    const majorStops = (raw.match(/[。！？；…!?]|\.(?=\s|$)/g) || []).length;
    const minorStops = (raw.match(/[，、：—,:;]/g) || []).length;
    w += majorStops * 2.1 + minorStops * 1.15;
    return Math.max(1.8, w);
  }

  class DoubaoTTSPlayer {
    constructor() {
      this.enabled = true;
      this.db = null;
      this.memCache = new Map();       // normText -> Blob
      this.decodedCache = new Map();   // normText -> AudioBuffer
      this.inflight = new Map();       // normText -> Promise<Blob>

      this.audioCtx = null;
      this.activeSource = null;
      this.playStartCtxTime = 0;
      this.playOffsetSec = 0;
      this.playDurationSec = 0;

      // Fallback HTMLAudioElement if WebAudio decode fails
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.playsInline = true;
      this.currentObjectUrl = null;
      this.usingHtmlAudio = false;
      this.usingSpeechSynth = false;
      this.fallbackStartMs = 0;

      this.currentNormText = "";
      this.state = "idle";             // 'idle' | 'loading' | 'playing'
      this.reqToken = 0;
      this.rafId = null;
      this.activeContext = null;       // { scopeEl, triggerBtn, statusMountEl, segments, timings, defaultBtnLabel }
      this.listeners = new Set();

      this.audio.addEventListener("ended", () => {
        if (this.usingHtmlAudio && this.state === "playing") this._finishPlayback();
      });
      this.audio.addEventListener("error", () => {
        if (this.usingHtmlAudio && this.state === "playing") this._finishPlayback();
      });

      this._openDB();
    }

    normalizeText(rawText) {
      return normalizeTtsText(rawText);
    }

    cleanMolecule(mol) {
      return cleanMoleculeForSpeech(mol);
    }

    splitIntoClauses(text) {
      return splitIntoClauses(text);
    }

    renderClausesHTML(text, rubyFn, bilingualObj) {
      return renderClausesHTML(text, rubyFn, bilingualObj);
    }

    onStatus(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    _emit() {
      this.listeners.forEach((fn) => {
        try {
          fn(this.state, this.currentNormText);
        } catch (_) {}
      });
    }

    _ensureAudioContext() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!this.audioCtx) {
        try {
          this.audioCtx = new Ctx();
        } catch (_) {
          return null;
        }
      }
      if (this.audioCtx.state === "suspended") {
        try {
          this.audioCtx.resume();
        } catch (_) {}
      }
      // Play a 1-sample silent buffer synchronously inside user tap to unlock iOS/iPadOS WebAudio
      try {
        const silentBuf = this.audioCtx.createBuffer(1, 1, 22050);
        const src = this.audioCtx.createBufferSource();
        src.buffer = silentBuf;
        src.connect(this.audioCtx.destination);
        src.start(0);
      } catch (_) {}
      return this.audioCtx;
    }

    _decodeAudioData(arrayBuf) {
      return new Promise((resolve, reject) => {
        const ctx = this._ensureAudioContext();
        if (!ctx) return reject(new Error("no_audio_ctx"));
        try {
          const res = ctx.decodeAudioData(
            arrayBuf,
            (decoded) => resolve(decoded),
            (err) => reject(err || new Error("decode_err"))
          );
          if (res && typeof res.then === "function") {
            res.then(resolve).catch(reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    _openDB() {
      return new Promise((resolve) => {
        if (!window.indexedDB) return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "key" });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        req.onerror = () => resolve(null);
      });
    }

    async _getFromIDB(key) {
      if (!this.db) await this._openDB();
      if (!this.db) return null;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readonly");
          const req = tx.objectStore(STORE_NAME).get(key);
          req.onsuccess = () => {
            const rec = req.result;
            resolve(rec && rec.blob ? rec.blob : null);
          };
          req.onerror = () => resolve(null);
        } catch (_) {
          resolve(null);
        }
      });
    }

    async _saveToIDB(key, blob) {
      if (!this.db) await this._openDB();
      if (!this.db) return;
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).put({
            key,
            blob,
            savedAt: Date.now()
          });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }

    async hasCachedLocal(rawText) {
      const key = normalizeTtsText(rawText);
      if (!key) return false;
      if (this.memCache.has(key)) return true;
      const blob = await this._getFromIDB(key);
      if (blob) {
        this.memCache.set(key, blob);
        return true;
      }
      return false;
    }

    async _fetchOrLoadBlob(key) {
      if (this.memCache.has(key)) {
        return this.memCache.get(key);
      }
      const idbBlob = await this._getFromIDB(key);
      if (idbBlob && idbBlob.size > 400) {
        this.memCache.set(key, idbBlob);
        return idbBlob;
      }

      if (this.inflight.has(key)) {
        return this.inflight.get(key);
      }

      const p = (async () => {
        const res = await fetch(`./api/tts?t=${encodeURIComponent(key)}`);
        if (!res.ok) {
          throw new Error(`tts_http_${res.status}`);
        }
        const ctype = (res.headers.get("content-type") || "").toLowerCase();
        if (!ctype.includes("audio")) {
          throw new Error("tts_non_audio");
        }
        const blob = await res.blob();
        if (!blob || blob.size < 400) {
          throw new Error("tts_tiny_blob");
        }
        this.memCache.set(key, blob);
        await this._saveToIDB(key, blob);
        return blob;
      })().finally(() => {
        this.inflight.delete(key);
      });

      this.inflight.set(key, p);
      return p;
    }

    // 结合字数标点权重 + 真实音频波形静音谷（换气停顿点）计算每一句的精确起止时间！
    _computeSegmentTimings(audioBuffer, segments, totalDuration) {
      const dur = totalDuration || (audioBuffer ? audioBuffer.duration : 1);
      if (!segments || !segments.length) return [];
      if (segments.length === 1) {
        return [{ start: 0, end: dur, el: segments[0].el }];
      }

      const weights = segments.map((s) => calcSegmentWeight(s.text));
      const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

      let speechStart = 0.04;
      let speechEnd = Math.max(speechStart + 0.2, dur - 0.08);
      let rmsFrames = null;
      const frameSec = 0.02; // 20ms window
      let avgRms = 0.05;

      if (audioBuffer && audioBuffer.numberOfChannels > 0) {
        try {
          const pcm = audioBuffer.getChannelData(0);
          const sr = audioBuffer.sampleRate || 24000;
          const step = Math.max(1, Math.floor(sr * frameSec));
          const nFrames = Math.floor(pcm.length / step);
          rmsFrames = new Float32Array(nFrames);
          let sumRms = 0;
          for (let f = 0; f < nFrames; f++) {
            let sq = 0;
            const base = f * step;
            for (let i = 0; i < step; i += 2) {
              const v = pcm[base + i] || 0;
              sq += v * v;
            }
            const rms = Math.sqrt(sq / (step / 2));
            rmsFrames[f] = rms;
            sumRms += rms;
          }
          avgRms = sumRms / Math.max(1, nFrames);
          const silenceThresh = Math.max(0.004, avgRms * 0.14);

          let firstActive = 0;
          while (firstActive < nFrames && rmsFrames[firstActive] < silenceThresh) firstActive++;
          let lastActive = nFrames - 1;
          while (lastActive > firstActive && rmsFrames[lastActive] < silenceThresh) lastActive--;

          speechStart = Math.max(0, (firstActive - 1) * frameSec);
          speechEnd = Math.min(dur, (lastActive + 2) * frameSec);
        } catch (_) {
          rmsFrames = null;
        }
      }

      const activeSpan = Math.max(0.2, speechEnd - speechStart);
      const boundaries = [0];
      let cumW = 0;

      for (let i = 0; i < segments.length - 1; i++) {
        cumW += weights[i];
        const expectedSec = speechStart + activeSpan * (cumW / totalWeight);
        let chosenSec = expectedSec;

        if (rmsFrames && rmsFrames.length > 10) {
          const prevBound = boundaries[boundaries.length - 1];
          const minAllowed = Math.max(prevBound + 0.28, expectedSec - 0.68);
          const maxAllowed = Math.min(speechEnd - (segments.length - 1 - i) * 0.25, expectedSec + 0.68);

          if (maxAllowed > minAllowed + 0.06) {
            const startF = Math.max(1, Math.floor(minAllowed / frameSec));
            const endF = Math.min(rmsFrames.length - 2, Math.ceil(maxAllowed / frameSec));
            let bestScore = Infinity;
            let bestF = Math.round(expectedSec / frameSec);

            for (let f = startF; f <= endF; f++) {
              // 3-frame (60ms) local window energy + small distance penalty from expectedSec
              const localRms = (rmsFrames[f - 1] + rmsFrames[f] * 1.5 + rmsFrames[f + 1]) / 3.5;
              const distSec = Math.abs(f * frameSec - expectedSec);
              const score = localRms + distSec * avgRms * 0.55;
              if (score < bestScore) {
                bestScore = score;
                bestF = f;
              }
            }
            chosenSec = bestF * frameSec;
          }
        }

        boundaries.push(chosenSec);
      }
      boundaries.push(dur);

      return segments.map((seg, i) => ({
        start: boundaries[i],
        end: boundaries[i + 1],
        el: seg.el,
        text: seg.text
      }));
    }

    _applyWaitingUI(ctx) {
      if (!ctx) return;
      if (ctx.triggerBtn) {
        ctx.triggerBtn.classList.remove("is-playing");
        ctx.triggerBtn.classList.add("is-loading");
        ctx.triggerBtn.innerHTML = `<span class="tts-spinner" aria-hidden="true"></span><span>正在准备…</span>`;
      }
      if (ctx.scopeEl) {
        ctx.scopeEl.classList.remove("tts-scope-playing");
        ctx.scopeEl.classList.add("tts-scope-loading");
      }
      if (ctx.statusMountEl) {
        ctx.statusMountEl.innerHTML = `
          <div class="tts-live-bar loading">
            <span class="tts-spinner" aria-hidden="true"></span>
            <span>正在合成语音讲解，请稍候…</span>
          </div>
        `;
      }
      if (ctx.segments && ctx.segments.length > 0 && ctx.segments[0].el) {
        ctx.segments[0].el.classList.add("is-waiting");
      }
    }

    _applyPlayingUI(ctx) {
      if (!ctx) return;
      if (ctx.triggerBtn) {
        ctx.triggerBtn.classList.remove("is-loading");
        ctx.triggerBtn.classList.add("is-playing");
        ctx.triggerBtn.innerHTML = `<span class="tts-wave-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>停止讲解</span>`;
      }
      if (ctx.scopeEl) {
        ctx.scopeEl.classList.remove("tts-scope-loading");
        ctx.scopeEl.classList.add("tts-scope-playing");
      }
      if (ctx.statusMountEl) {
        ctx.statusMountEl.innerHTML = `
          <div class="tts-live-bar playing">
            <span class="tts-wave-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span>正在讲解 · 跟着放大的句子一起看！</span>
            <div class="tts-mini-progress"><div class="tts-mini-progress-fill"></div></div>
          </div>
        `;
      }
      if (ctx.segments) {
        ctx.segments.forEach((s) => {
          if (s.el) s.el.classList.remove("is-waiting");
        });
      }
    }

    _clearActiveUI() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      const ctx = this.activeContext;
      if (!ctx) return;
      if (ctx.triggerBtn) {
        ctx.triggerBtn.classList.remove("is-loading", "is-playing");
        ctx.triggerBtn.innerHTML = ctx.defaultBtnHTML || `🔊 给我讲解`;
      }
      if (ctx.scopeEl) {
        ctx.scopeEl.classList.remove("tts-scope-loading", "tts-scope-playing");
      }
      if (ctx.statusMountEl) {
        ctx.statusMountEl.innerHTML = "";
      }
      if (ctx.segments) {
        ctx.segments.forEach((s) => {
          if (s.el) {
            s.el.classList.remove("is-waiting", "is-reading", "was-read", "will-read");
          }
        });
      }
      this.activeContext = null;
    }

    _startHighlightLoop() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      let lastActiveIdx = -1;

      const tick = () => {
        if (this.state !== "playing" || !this.activeContext) return;
        const ctx = this.activeContext;

        let elapsed = 0;
        if (this.usingSpeechSynth && this.fallbackStartMs) {
          elapsed = Math.max(0, (performance.now() - this.fallbackStartMs) / 1000);
        } else if (!this.usingHtmlAudio && this.audioCtx) {
          elapsed = Math.max(0, this.audioCtx.currentTime - this.playStartCtxTime + this.playOffsetSec);
        } else {
          elapsed = this.audio.currentTime || 0;
        }

        const total = Math.max(0.1, this.playDurationSec || 1);
        const pct = Math.min(100, Math.round((elapsed / total) * 100));
        if (ctx.statusMountEl) {
          const fill = ctx.statusMountEl.querySelector(".tts-mini-progress-fill");
          if (fill) fill.style.width = `${pct}%`;
        }

        const timings = ctx.timings || [];
        if (timings.length > 0) {
          let activeIdx = timings.findIndex((t) => elapsed >= t.start && elapsed < t.end);
          if (activeIdx === -1) {
            activeIdx = elapsed >= timings[timings.length - 1].start ? timings.length - 1 : 0;
          }

          if (activeIdx !== lastActiveIdx) {
            lastActiveIdx = activeIdx;
            timings.forEach((t, i) => {
              if (!t.el) return;
              const isCur = i === activeIdx;
              t.el.classList.toggle("is-reading", isCur);
              t.el.classList.toggle("was-read", i < activeIdx);
              t.el.classList.toggle("will-read", i > activeIdx);
              if (isCur && typeof t.el.scrollIntoView === "function") {
                try {
                  t.el.scrollIntoView({ block: "nearest", behavior: "smooth" });
                } catch (_) {}
              }
            });
          }
        }

        this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);
    }

    _finishPlayback() {
      if (this.activeSource) {
        try {
          this.activeSource.onended = null;
          this.activeSource.stop();
          this.activeSource.disconnect();
        } catch (_) {}
        this.activeSource = null;
      }
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
        this.currentObjectUrl = null;
      }
      this._clearActiveUI();
      this.state = "idle";
      this.currentNormText = "";
      this._emit();
    }

    stop() {
      this.reqToken++;
      try {
        this.audio.pause();
      } catch (_) {}
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
      this._finishPlayback();
    }

    _collectSegments(opts, fallbackText) {
      if (Array.isArray(opts.segments) && opts.segments.length > 0) {
        return opts.segments;
      }
      if (opts.scopeEl) {
        const nodes = Array.from(opts.scopeEl.querySelectorAll("[data-tts-seg]"));
        if (nodes.length > 0) {
          return nodes.map((el) => ({
            el,
            text: el.getAttribute("data-tts-seg") || el.textContent || ""
          }));
        }
      }
      return [{ el: opts.scopeEl || null, text: fallbackText }];
    }

    async speak(rawText, options) {
      const opts = options || {};
      if (!this.enabled) return;

      const segments = this._collectSegments(opts, rawText);
      const combinedRaw = rawText || segments.map((s) => s.text).join(" ");
      const key = normalizeTtsText(combinedRaw);
      if (!key) return;

      // 若点击同一句且正在加载或播放，支持一键停止
      if (
        opts.toggleIfPlaying &&
        (this.state === "playing" || this.state === "loading") &&
        this.currentNormText === key
      ) {
        if (window.SFX) window.SFX.pop();
        this.stop();
        return;
      }

      // 立即在用户点击手势内解锁 WebAudio 上下文 + 播放按键音反馈
      this._ensureAudioContext();
      if (window.SFX && opts.playTapSfx !== false) {
        window.SFX.pop();
      }

      this.stop();
      const myToken = ++this.reqToken;
      this.currentNormText = key;
      this.state = "loading";

      this.activeContext = {
        scopeEl: opts.scopeEl || null,
        triggerBtn: opts.triggerBtn || null,
        statusMountEl: opts.statusMountEl || null,
        defaultBtnHTML: opts.defaultBtnHTML || (opts.triggerBtn ? `🔊 给我讲解` : ""),
        segments,
        timings: []
      };

      this._applyWaitingUI(this.activeContext);
      this._emit();

      try {
        const blob = await this._fetchOrLoadBlob(key);
        if (myToken !== this.reqToken || !this.enabled) return;

        // 优先使用 WebAudio 解码播放（不受异步等待后的 iOS 自动播放限制，且能精确对齐静音谷）
        let audioBuffer = this.decodedCache.get(key) || null;
        if (!audioBuffer && this.audioCtx) {
          try {
            const arrBuf = await blob.arrayBuffer();
            audioBuffer = await this._decodeAudioData(arrBuf);
            if (audioBuffer) this.decodedCache.set(key, audioBuffer);
          } catch (_) {
            audioBuffer = null;
          }
        }

        if (myToken !== this.reqToken || !this.enabled) return;

        if (audioBuffer && this.audioCtx) {
          if (this.audioCtx.state === "suspended") {
            await this.audioCtx.resume();
          }
          this.usingHtmlAudio = false;
          this.usingSpeechSynth = false;
          this.playDurationSec = audioBuffer.duration;
          this.playOffsetSec = 0;

          if (this.activeContext) {
            this.activeContext.timings = this._computeSegmentTimings(
              audioBuffer,
              this.activeContext.segments,
              audioBuffer.duration
            );
          }

          const src = this.audioCtx.createBufferSource();
          src.buffer = audioBuffer;
          src.connect(this.audioCtx.destination);
          this.activeSource = src;
          this.playStartCtxTime = this.audioCtx.currentTime;
          this.state = "playing";

          this._applyPlayingUI(this.activeContext);
          this._emit();
          this._startHighlightLoop();

          src.onended = () => {
            if (myToken === this.reqToken && this.state === "playing") {
              this._finishPlayback();
            }
          };
          src.start(0);
          return;
        }

        // 备用降级：HTMLAudioElement
        this.usingHtmlAudio = true;
        this.usingSpeechSynth = false;
        const objUrl = URL.createObjectURL(blob);
        this.currentObjectUrl = objUrl;
        this.audio.src = objUrl;

        await new Promise((resolve) => {
          const onLoaded = () => {
            this.audio.removeEventListener("loadedmetadata", onLoaded);
            resolve();
          };
          this.audio.addEventListener("loadedmetadata", onLoaded);
          setTimeout(resolve, 300);
        });

        if (myToken !== this.reqToken || !this.enabled) return;
        const dur = Number.isFinite(this.audio.duration) && this.audio.duration > 0
          ? this.audio.duration
          : Math.max(2, key.length * 0.24);
        this.playDurationSec = dur;

        if (this.activeContext) {
          this.activeContext.timings = this._computeSegmentTimings(
            null,
            this.activeContext.segments,
            dur
          );
        }

        this.state = "playing";
        this._applyPlayingUI(this.activeContext);
        this._emit();
        this._startHighlightLoop();
        await this.audio.play();
      } catch (_) {
        if (myToken !== this.reqToken || !this.enabled) return;
        // 离线且未缓存时降级系统内置语音，同时维持逐句放大高亮！
        if ("speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const estDur = Math.max(2, key.length * 0.24);
            this.usingHtmlAudio = false;
            this.usingSpeechSynth = true;
            this.fallbackStartMs = performance.now();
            this.playDurationSec = estDur;
            if (this.activeContext) {
              this.activeContext.timings = this._computeSegmentTimings(
                null,
                this.activeContext.segments,
                estDur
              );
            }
            const u = new SpeechSynthesisUtterance(key);
            u.lang = "zh-CN";
            u.rate = 0.98;
            u.pitch = 1.06;
            u.onend = () => {
              if (myToken === this.reqToken) this._finishPlayback();
            };
            u.onerror = () => {
              if (myToken === this.reqToken) this._finishPlayback();
            };
            this.state = "playing";
            this._applyPlayingUI(this.activeContext);
            this._emit();
            this._startHighlightLoop();
            window.speechSynthesis.speak(u);
            return;
          } catch (_) {}
        }
        this._finishPlayback();
      }
    }
  }

  window.DoubaoTTS = new DoubaoTTSPlayer();
})();
