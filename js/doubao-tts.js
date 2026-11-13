// ============================================================================
// 豆包大模型语音朗读引擎 (Doubao seed-tts-2.0 Client + IndexedDB 永久缓存)
// 四重防重复计费护盾：
//   1. 内存 Blob 秒播缓存 (0ms)
//   2. 浏览器 IndexedDB 离线永久缓存 (重启/断网也不再请求)
//   3. 前端并发单飞去重 (连点按钮绝不重复发请求)
//   4. 服务端 SHA-256 永久磁盘缓存 (跨设备全家共享同一份 MP3，永不二次调豆包计费!)
// ============================================================================

(function () {
  const DB_NAME = "duwu_doubao_tts_cache_v1";
  const STORE_NAME = "clips";
  const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
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
      .slice(0, 260);
  }

  class DoubaoTTSPlayer {
    constructor() {
      this.enabled = true;
      this.db = null;
      this.memCache = new Map();      // normText -> Blob
      this.inflight = new Map();      // normText -> Promise<Blob>
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.playsInline = true;
      this.currentObjectUrl = null;
      this.currentNormText = "";
      this.state = "idle";            // 'idle' | 'loading' | 'playing'
      this.reqToken = 0;
      this.unlocked = false;
      this.listeners = new Set();

      this.audio.addEventListener("ended", () => {
        if (this.state === "playing") this._finishPlayback();
      });
      this.audio.addEventListener("error", () => {
        if (this.state === "playing") this._finishPlayback();
      });

      this._openDB();
      this._bindGestureUnlock();
    }

    _bindGestureUnlock() {
      const unlock = () => {
        if (this.unlocked || this.state !== "idle") return;
        this.unlocked = true;
        try {
          this.audio.src = SILENT_WAV;
          const p = this.audio.play();
          if (p && typeof p.then === "function") {
            p.then(() => {
              if (this.state === "idle") this.audio.pause();
            }).catch(() => {
              this.unlocked = false;
            });
          }
        } catch (_) {
          this.unlocked = false;
        }
      };
      window.addEventListener("pointerdown", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
    }

    onStatus(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    _emit() {
      this.listeners.forEach((fn) => {
        try { fn(this.state, this.currentNormText); } catch (_) {}
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

    normalizeText(rawText) {
      return normalizeTtsText(rawText);
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

    _finishPlayback() {
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
        this.currentObjectUrl = null;
      }
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
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      this._finishPlayback();
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

    async speak(rawText, options) {
      const opts = options || {};
      if (!this.enabled) return;

      const key = normalizeTtsText(rawText);
      if (!key) return;

      // 若点击同一句且正在播放，支持一键停止
      if (opts.toggleIfPlaying && (this.state === "playing" || this.state === "loading") && this.currentNormText === key) {
        this.stop();
        return;
      }

      // 立即同步暂停旧播放（保持 iPad Safari 手势激活上下文！）
      this.stop();
      if (!this.unlocked) {
        this.unlocked = true;
        try {
          this.audio.src = SILENT_WAV;
          const up = this.audio.play();
          if (up && typeof up.then === "function") {
            up.then(() => {
              if (this.state !== "playing") this.audio.pause();
            }).catch(() => {});
          }
        } catch (_) {}
      }
      const myToken = ++this.reqToken;
      this.currentNormText = key;
      this.state = "loading";
      this._emit();

      try {
        const blob = await this._fetchOrLoadBlob(key);
        if (myToken !== this.reqToken || !this.enabled) return;

        const objUrl = URL.createObjectURL(blob);
        this.currentObjectUrl = objUrl;
        this.audio.src = objUrl;
        this.state = "playing";
        this._emit();
        await this.audio.play();
      } catch (_) {
        if (myToken !== this.reqToken || !this.enabled) return;
        this._finishPlayback();
        // 离线无后端且未缓存时，优雅降级浏览器内置语音兜底
        if ("speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(key);
            u.lang = "zh-CN";
            u.rate = 0.98;
            u.pitch = 1.06;
            window.speechSynthesis.speak(u);
          } catch (_) {}
        }
      }
    }
  }

  window.DoubaoTTS = new DoubaoTTSPlayer();
})();
