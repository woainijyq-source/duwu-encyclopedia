// ============================================================================
// 升级模块 4：🎙️「我是毒物馆小馆长」专属配音录音间 (Curator Voice Studio)
// 支持 iPad Safari / 桌面端录音 + 本地 IndexedDB 秒存 + 云端 /duwu/api/recordings 同步！
// 录好后全书 99 卡自动点亮金色【🎙️小馆长已配音】勋章，全家手机跨设备都能听！
// ============================================================================

(function () {
  const DB_NAME = "duwu_curator_voices_v1";
  const STORE_NAME = "recordings";
  const MAX_RECORD_SEC = 35;

  function pickSupportedMime() {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = [
      "audio/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus"
    ];
    for (const m of candidates) {
      try {
        if (MediaRecorder.isTypeSupported(m)) return m;
      } catch (_) {}
    }
    return "";
  }

  class CuratorVoiceStudio {
    constructor(onChange) {
      this.onChange = onChange || (() => {});
      this.db = null;
      this.localMap = new Map();   // archiveId -> { blob, mimeType, duration, updatedAt }
      this.cloudMap = new Map();   // archiveId -> { mimeType, duration, updatedAt, url }
      this.cloudAvailable = false;

      this.activeRecorder = null;
      this.activeStream = null;
      this.recordChunks = [];
      this.recordStartMs = 0;
      this.recordTimer = null;
      this.currentAudio = null;
      this.recordingArchiveId = null;
    }

    async init() {
      await this.openDB();
      await this.loadLocalAll();
      await this.fetchCloudList();
      this.emitChange();
    }

    openDB() {
      return new Promise((resolve) => {
        if (!window.indexedDB) return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "id" });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        req.onerror = () => resolve(null);
      });
    }

    loadLocalAll() {
      return new Promise((resolve) => {
        if (!this.db) return resolve();
        try {
          const tx = this.db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => {
            (req.result || []).forEach((rec) => {
              if (rec && rec.id && rec.blob) {
                this.localMap.set(rec.id, rec);
              }
            });
            resolve();
          };
          req.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }

    saveLocal(rec) {
      this.localMap.set(rec.id, rec);
      if (!this.db) return Promise.resolve();
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).put(rec);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }

    deleteLocal(id) {
      this.localMap.delete(id);
      if (!this.db) return Promise.resolve();
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).delete(id);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }

    async fetchCloudList() {
      try {
        const res = await fetch("./api/recordings", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.items)) {
          this.cloudAvailable = true;
          this.cloudMap.clear();
          data.items.forEach((it) => {
            this.cloudMap.set(it.id, {
              mimeType: it.mimeType || "audio/mp4",
              duration: it.duration || 0,
              updatedAt: it.updatedAt || 0,
              url: `./api/recordings/${encodeURIComponent(it.id)}?t=${it.updatedAt || Date.now()}`
            });
          });
        }
      } catch (_) {
        // 本地静态预览无后端时静默降级为纯本地 IndexedDB 模式
      }
    }

    async uploadToCloud(rec) {
      try {
        const res = await fetch(`./api/recordings/${encodeURIComponent(rec.id)}`, {
          method: "POST",
          headers: {
            "Content-Type": rec.mimeType || "audio/mp4",
            "X-Duration-Sec": String(rec.duration || 1)
          },
          body: rec.blob
        });
        if (res.ok) {
          const info = await res.json();
          this.cloudAvailable = true;
          this.cloudMap.set(rec.id, {
            mimeType: rec.mimeType,
            duration: rec.duration,
            updatedAt: info.updatedAt || Date.now(),
            url: `./api/recordings/${encodeURIComponent(rec.id)}?t=${info.updatedAt || Date.now()}`
          });
          this.emitChange();
          return true;
        }
      } catch (_) {}
      return false;
    }

    async removeFromCloud(id) {
      this.cloudMap.delete(id);
      try {
        await fetch(`./api/recordings/${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch (_) {}
    }

    hasVoice(id) {
      return this.localMap.has(id) || this.cloudMap.has(id);
    }

    getVoicedCount() {
      const s = new Set([...this.localMap.keys(), ...this.cloudMap.keys()]);
      return s.size;
    }

    emitChange() {
      this.onChange(this.getVoicedCount());
    }

    stopPlayback() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
    }

    stopActiveRecording() {
      if (this.recordTimer) {
        clearInterval(this.recordTimer);
        this.recordTimer = null;
      }
      if (this.activeRecorder && this.activeRecorder.state !== "inactive") {
        try { this.activeRecorder.stop(); } catch (_) {}
      }
      if (this.activeStream) {
        this.activeStream.getTracks().forEach((t) => t.stop());
        this.activeStream = null;
      }
    }

    // 挂载到超级闪卡弹窗内的录音互动条
    mountWidget(mountEl, item, onAwardFirstStar) {
      if (!mountEl) return;
      this.stopPlayback();

      const renderBar = (statusMsg) => {
        const hasRec = this.hasVoice(item.id);
        const recMeta = this.localMap.get(item.id) || this.cloudMap.get(item.id);
        const isRecNow = this.activeRecorder && this.activeRecorder.state === "recording" && this.recordingArchiveId === item.id;
        const secStr = recMeta && recMeta.duration ? `${recMeta.duration}秒` : "";

        mountEl.innerHTML = `
          <div class="curator-voice-card ${hasRec ? "voiced" : ""}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.5rem;">${isRecNow ? "🔴" : hasRec ? "👑" : "🎙️"}</span>
                <div>
                  <div style="font-weight:900;font-size:0.95rem;">
                    ${isRecNow ? "正在录小馆长专属解说…" : hasRec ? `小馆长已配音 ${secStr ? `(${secStr})` : ""}` : "我是毒物馆小馆长 · 点我录解说！"}
                  </div>
                  <div style="font-size:0.76rem;color:var(--text-muted);" id="voiceStatusSub">
                    ${statusMsg || (hasRec ? (this.cloudMap.has(item.id) ? "☁️ 已同步云端 · 全家设备都能听！" : "💾 已保存在本机") : `试着用自己的话讲讲「${item.name}」的秘密吧！`)}
                  </div>
                </div>
              </div>

              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                ${
                  isRecNow
                    ? `<button class="voice-btn stop" id="btnVoiceStop">⏹️ 完成保存 (<span id="voiceTickSec">0</span>s)</button>`
                    : hasRec
                      ? `
                        <button class="voice-btn play" id="btnVoicePlay">🎧 听我的配音</button>
                        <button class="voice-btn record" id="btnVoiceRec">🎙️ 重录</button>
                        <button class="voice-btn del" id="btnVoiceDel" title="删除配音">🗑️</button>
                      `
                      : `<button class="voice-btn record" id="btnVoiceRec">🎙️ 按下开始录音</button>`
                }
              </div>
            </div>
          </div>
        `;

        const btnRec = mountEl.querySelector("#btnVoiceRec");
        const btnStop = mountEl.querySelector("#btnVoiceStop");
        const btnPlay = mountEl.querySelector("#btnVoicePlay");
        const btnDel = mountEl.querySelector("#btnVoiceDel");

        if (btnRec) {
          btnRec.addEventListener("click", async () => {
            this.stopPlayback();
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
              renderBar("⚠️ 当前浏览器未开启麦克风权限（请用 HTTPS 或 Safari/Chrome 打开）");
              return;
            }
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              this.activeStream = stream;
              const mime = pickSupportedMime();
              const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
              this.activeRecorder = recorder;
              this.recordingArchiveId = item.id;
              this.recordChunks = [];
              this.recordStartMs = Date.now();

              recorder.ondataavailable = (ev) => {
                if (ev.data && ev.data.size > 0) this.recordChunks.push(ev.data);
              };

              recorder.onstop = async () => {
                if (this.recordTimer) {
                  clearInterval(this.recordTimer);
                  this.recordTimer = null;
                }
                if (this.activeStream) {
                  this.activeStream.getTracks().forEach((t) => t.stop());
                  this.activeStream = null;
                }
                const finalMime = recorder.mimeType || mime || "audio/mp4";
                const blob = new Blob(this.recordChunks, { type: finalMime });
                const dur = Math.max(1, Math.round((Date.now() - this.recordStartMs) / 1000));
                if (blob.size < 200) {
                  renderBar("⚠️ 录音太短啦，再试一次吧！");
                  return;
                }
                const wasFirst = !this.hasVoice(item.id);
                const recObj = {
                  id: item.id,
                  blob,
                  mimeType: finalMime,
                  duration: dur,
                  updatedAt: Date.now()
                };
                await this.saveLocal(recObj);
                if (wasFirst && onAwardFirstStar) onAwardFirstStar();
                if (window.SFX) window.SFX.chime();
                this.emitChange();
                renderBar("☁️ 正在同步到家庭云端展厅…");
                const synced = await this.uploadToCloud(recObj);
                renderBar(synced ? "🎉 配音保存并同步云端成功！全家都能听到啦！" : "💾 已保存在本机展厅！");
              };

              recorder.start(250);
              if (window.SFX) window.SFX.pop();
              renderBar("🎤 对着 iPad 麦克风大声开讲吧！（最长 35 秒）");

              this.recordTimer = setInterval(() => {
                const sec = Math.round((Date.now() - this.recordStartMs) / 1000);
                const tickEl = mountEl.querySelector("#voiceTickSec");
                if (tickEl) tickEl.textContent = String(sec);
                if (sec >= MAX_RECORD_SEC) {
                  this.stopActiveRecording();
                }
              }, 300);
            } catch (err) {
              renderBar("🔒 请在弹出的提示框里点击『允许使用麦克风』哦！");
            }
          });
        }

        if (btnStop) {
          btnStop.addEventListener("click", () => {
            this.stopActiveRecording();
          });
        }

        if (btnPlay) {
          btnPlay.addEventListener("click", () => {
            this.stopPlayback();
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            const loc = this.localMap.get(item.id);
            const cld = this.cloudMap.get(item.id);
            let srcUrl = "";
            let revokeAfter = false;
            if (loc && loc.blob) {
              srcUrl = URL.createObjectURL(loc.blob);
              revokeAfter = true;
            } else if (cld && cld.url) {
              srcUrl = cld.url;
            }
            if (!srcUrl) return;

            const audio = new Audio(srcUrl);
            this.currentAudio = audio;
            btnPlay.textContent = "🔊 播放中…";
            audio.onended = () => {
              if (revokeAfter) URL.revokeObjectURL(srcUrl);
              btnPlay.textContent = "🎧 听我的配音";
            };
            audio.onerror = () => {
              if (revokeAfter) URL.revokeObjectURL(srcUrl);
              btnPlay.textContent = "🎧 听我的配音";
            };
            audio.play().catch(() => {
              btnPlay.textContent = "🎧 听我的配音";
            });
          });
        }

        if (btnDel) {
          btnDel.addEventListener("click", async () => {
            this.stopPlayback();
            await this.deleteLocal(item.id);
            await this.removeFromCloud(item.id);
            if (window.SFX) window.SFX.pop();
            this.emitChange();
            renderBar("🗑️ 已清空这段配音，随时可以重录！");
          });
        }
      };

      renderBar();
    }
  }

  window.CuratorVoiceModule = {
    CuratorVoiceStudio
  };
})();
