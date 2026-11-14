// ============================================================================
// 升级模块 4：🎙️「我是毒物馆小馆长」专属配音录音间 (Curator Voice Studio)
// 支持：
//   1. 按住说话录音、松开即结束（无自动时长限制，支持桌面鼠标与 iPad/手机触屏长按）
//   2. 每种毒物支持录制并保存多条配音（可逐条试听、全部连播、单条删除）
//   3. 本地 IndexedDB 秒存 + 云端 /duwu/api/recordings 同步！
// ============================================================================

(function () {
  const DB_NAME = "duwu_curator_voices_v1";
  const STORE_NAME = "recordings";

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

  function extractArchiveId(idOrRec) {
    if (!idOrRec) return "";
    if (typeof idOrRec === "object") {
      if (idOrRec.archiveId) return String(idOrRec.archiveId);
      if (idOrRec.id) return String(idOrRec.id).split("__")[0];
      return "";
    }
    return String(idOrRec).split("__")[0];
  }

  class CuratorVoiceStudio {
    constructor(onChange) {
      this.onChange = onChange || (() => {});
      this.db = null;
      this.localById = new Map(); // clipId -> { id, archiveId, blob, mimeType, duration, updatedAt }
      this.cloudById = new Map(); // clipId -> { id, archiveId, mimeType, duration, updatedAt, url }
      this.cloudAvailable = false;

      this.activeRecorder = null;
      this.activeStream = null;
      this.recordChunks = [];
      this.recordStartMs = 0;
      this.recordTimer = null;
      this.currentAudio = null;
      this.playingClipId = null;
      this.isPlayingAll = false;
      this.recordingArchiveId = null;
      this.isHolding = false;
      this.isStartingRecord = false;
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
                const archiveId = extractArchiveId(rec);
                if (archiveId) {
                  this.localById.set(rec.id, {
                    ...rec,
                    archiveId,
                    updatedAt: rec.updatedAt || 0
                  });
                }
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
      const archiveId = extractArchiveId(rec);
      const normalized = { ...rec, archiveId };
      this.localById.set(normalized.id, normalized);
      if (!this.db) return Promise.resolve();
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).put(normalized);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (_) {
          resolve();
        }
      });
    }

    deleteLocal(clipId) {
      this.localById.delete(clipId);
      if (!this.db) return Promise.resolve();
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction(STORE_NAME, "readwrite");
          tx.objectStore(STORE_NAME).delete(clipId);
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
          this.cloudById.clear();
          data.items.forEach((it) => {
            if (!it || !it.id) return;
            const archiveId = extractArchiveId(it);
            this.cloudById.set(it.id, {
              id: it.id,
              archiveId,
              mimeType: it.mimeType || "audio/mp4",
              duration: it.duration || 1,
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
          const archiveId = extractArchiveId(rec);
          this.cloudById.set(rec.id, {
            id: rec.id,
            archiveId,
            mimeType: rec.mimeType,
            duration: rec.duration,
            updatedAt: info.updatedAt || rec.updatedAt || Date.now(),
            url: `./api/recordings/${encodeURIComponent(rec.id)}?t=${info.updatedAt || Date.now()}`
          });
          this.emitChange();
          return true;
        }
      } catch (_) {}
      return false;
    }

    async removeFromCloud(clipId) {
      this.cloudById.delete(clipId);
      try {
        await fetch(`./api/recordings/${encodeURIComponent(clipId)}`, { method: "DELETE" });
      } catch (_) {}
    }

    // 获取某个毒物的全部配音列表（按录制时间从早到晚排序：#1, #2, #3...）
    getClips(archiveId) {
      if (!archiveId) return [];
      const clipIds = new Set();
      this.localById.forEach((v, k) => {
        if (v.archiveId === archiveId) clipIds.add(k);
      });
      this.cloudById.forEach((v, k) => {
        if (v.archiveId === archiveId) clipIds.add(k);
      });

      const list = [];
      clipIds.forEach((cid) => {
        const loc = this.localById.get(cid);
        const cld = this.cloudById.get(cid);
        list.push({
          id: cid,
          archiveId,
          blob: loc ? loc.blob : null,
          mimeType: (loc && loc.mimeType) || (cld && cld.mimeType) || "audio/mp4",
          duration: (loc && loc.duration) || (cld && cld.duration) || 1,
          updatedAt: (loc && loc.updatedAt) || (cld && cld.updatedAt) || 0,
          url: cld ? cld.url : "",
          synced: Boolean(cld)
        });
      });

      list.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
      return list;
    }

    hasVoice(archiveId) {
      return this.getClips(archiveId).length > 0;
    }

    getVoiceCount(archiveId) {
      return this.getClips(archiveId).length;
    }

    getVoicedCount() {
      const voicedArchives = new Set();
      this.localById.forEach((v) => {
        if (v.archiveId) voicedArchives.add(v.archiveId);
      });
      this.cloudById.forEach((v) => {
        if (v.archiveId) voicedArchives.add(v.archiveId);
      });
      return voicedArchives.size;
    }

    emitChange() {
      this.onChange(this.getVoicedCount());
    }

    stopPlayback() {
      this.isPlayingAll = false;
      this.playingClipId = null;
      if (this.currentAudio) {
        try {
          this.currentAudio.onended = null;
          this.currentAudio.onerror = null;
          this.currentAudio.pause();
        } catch (_) {}
        this.currentAudio = null;
      }
    }

    stopActiveRecording() {
      this.isHolding = false;
      this.isStartingRecord = false;
      if (this.recordTimer) {
        clearInterval(this.recordTimer);
        this.recordTimer = null;
      }
      if (this.activeRecorder && this.activeRecorder.state !== "inactive") {
        try {
          this.activeRecorder.stop();
        } catch (_) {}
      }
      if (this.activeStream) {
        this.activeStream.getTracks().forEach((t) => t.stop());
        this.activeStream = null;
      }
    }

    // 挂载到超级闪卡弹窗内的录音互动条（按住录音、松开结束 + 多条配音管理）
    mountWidget(mountEl, item, onAwardFirstStar) {
      if (!mountEl) return;
      this.stopPlayback();

      const formatDur = (sec) => {
        const s = Math.max(1, Math.round(Number(sec) || 1));
        if (s < 60) return `${s}秒`;
        const m = Math.floor(s / 60);
        const rem = s % 60;
        return rem > 0 ? `${m}分${rem}秒` : `${m}分`;
      };

      const renderBar = (statusMsg) => {
        const clips = this.getClips(item.id);
        const hasRec = clips.length > 0;
        const anySynced = clips.some((c) => c.synced);

        const defaultSub = hasRec
          ? `${anySynced ? "☁️ 已同步云端 · " : "💾 已存本机 · "}长按右侧按钮可继续录新配音（已录 ${clips.length} 条）`
          : `💡 按住右侧按钮不放开始讲「${item.name}」，松开手指即完成配音！`;

        mountEl.innerHTML = `
          <div class="curator-voice-card ${hasRec ? "voiced" : ""}" id="curatorVoiceCardBox">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:190px;">
                <span style="font-size:1.5rem;" id="voiceStateIcon">${hasRec ? "👑" : "🎙️"}</span>
                <div>
                  <div style="font-weight:900;font-size:0.95rem;" id="voiceStateTitle">
                    ${hasRec ? `小馆长已配音 · 共 ${clips.length} 条` : "我是毒物馆小馆长 · 按住录解说！"}
                  </div>
                  <div style="font-size:0.76rem;color:var(--text-muted);" id="voiceStatusSub">
                    ${statusMsg || defaultSub}
                  </div>
                </div>
              </div>

              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                ${
                  clips.length >= 2
                    ? `<button type="button" class="voice-btn play ${this.isPlayingAll ? "playing" : ""}" id="btnVoicePlayAll">
                         ${this.isPlayingAll ? "⏹️ 停止连播" : `🎵 连播全部 (${clips.length})`}
                       </button>`
                    : ""
                }
                <button type="button" class="voice-btn record hold-to-record-btn" id="btnVoiceRec">
                  ${hasRec ? "🎙️ 按住再录一条" : "🎙️ 按住说话配音"}
                </button>
              </div>
            </div>

            ${
              hasRec
                ? `<div class="voice-clips-list" id="voiceClipsList">
                     ${clips
                       .map((clip, idx) => {
                         const isPlayingThis = this.playingClipId === clip.id;
                         return `
                           <div class="voice-clip-item ${isPlayingThis ? "playing" : ""}" data-clip-id="${clip.id}">
                             <button type="button" class="voice-clip-play-btn" data-clip-id="${clip.id}" title="点击播放或停止这条配音">
                               <span class="clip-play-icon">${isPlayingThis ? "⏹️" : "🎧"}</span>
                               <span class="clip-label">配音 #${idx + 1}</span>
                               <span class="clip-dur">${formatDur(clip.duration)}</span>
                               <span class="clip-sync-tag" title="${clip.synced ? "已同步云端" : "已保存在本机"}">${clip.synced ? "☁️" : "💾"}</span>
                             </button>
                             <button type="button" class="voice-clip-del-btn" data-clip-id="${clip.id}" title="删除这条配音">🗑️</button>
                           </div>
                         `;
                       })
                       .join("")}
                   </div>`
                : ""
            }
          </div>
        `;

        const cardBox = mountEl.querySelector("#curatorVoiceCardBox");
        const iconEl = mountEl.querySelector("#voiceStateIcon");
        const titleEl = mountEl.querySelector("#voiceStateTitle");
        const subEl = mountEl.querySelector("#voiceStatusSub");
        const btnRec = mountEl.querySelector("#btnVoiceRec");
        const btnPlayAll = mountEl.querySelector("#btnVoicePlayAll");

        // 播放单条配音辅助函数
        const playSingleClip = (clip, onFinishCallback) => {
          this.stopPlayback();
          if (window.DoubaoTTS) window.DoubaoTTS.stop();
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();

          let srcUrl = "";
          let revokeAfter = false;
          if (clip.blob) {
            srcUrl = URL.createObjectURL(clip.blob);
            revokeAfter = true;
          } else if (clip.url) {
            srcUrl = clip.url;
          }
          if (!srcUrl) {
            if (onFinishCallback) onFinishCallback();
            return;
          }

          this.playingClipId = clip.id;
          const audio = new Audio(srcUrl);
          this.currentAudio = audio;
          renderBar(`🔊 正在播放「${item.name}」的配音…`);

          const cleanup = () => {
            if (revokeAfter) URL.revokeObjectURL(srcUrl);
            if (this.currentAudio === audio) {
              this.currentAudio = null;
              this.playingClipId = null;
            }
          };

          audio.onended = () => {
            cleanup();
            if (onFinishCallback) {
              onFinishCallback();
            } else {
              renderBar();
            }
          };
          audio.onerror = () => {
            cleanup();
            if (onFinishCallback) {
              onFinishCallback();
            } else {
              renderBar("⚠️ 播放中断，请再点一次试试");
            }
          };
          audio.play().catch(() => {
            cleanup();
            renderBar();
          });
        };

        // 绑定每条配音的播放 / 停止按钮
        mountEl.querySelectorAll(".voice-clip-play-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const cid = btn.getAttribute("data-clip-id");
            if (this.playingClipId === cid) {
              this.stopPlayback();
              renderBar();
              return;
            }
            const target = clips.find((c) => c.id === cid);
            if (target) {
              if (window.SFX) window.SFX.pop();
              playSingleClip(target, null);
            }
          });
        });

        // 绑定每条配音的删除按钮
        mountEl.querySelectorAll(".voice-clip-del-btn").forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const cid = btn.getAttribute("data-clip-id");
            if (!cid) return;
            if (this.playingClipId === cid || this.isPlayingAll) {
              this.stopPlayback();
            }
            await this.deleteLocal(cid);
            await this.removeFromCloud(cid);
            if (window.SFX) window.SFX.pop();
            this.emitChange();
            renderBar("🗑️ 已删除该条配音！");
          });
        });

        // 绑定「连播全部」按钮
        if (btnPlayAll) {
          btnPlayAll.addEventListener("click", () => {
            if (this.isPlayingAll) {
              this.stopPlayback();
              renderBar();
              return;
            }
            if (!clips.length) return;
            if (window.SFX) window.SFX.pop();
            let idx = 0;
            const playNext = () => {
              if (!this.isPlayingAll || idx >= clips.length) {
                this.isPlayingAll = false;
                this.playingClipId = null;
                renderBar("🎉 全部配音连播完毕！");
                return;
              }
              const currentClip = clips[idx++];
              playSingleClip(currentClip, () => {
                if (this.isPlayingAll) {
                  playNext();
                } else {
                  renderBar();
                }
              });
              this.isPlayingAll = true;
            };
            this.isPlayingAll = true;
            playNext();
          });
        }

        // 绑定「按住说话配音，松开结束」逻辑
        if (btnRec) {
          btnRec.addEventListener("contextmenu", (e) => e.preventDefault());

          const startHoldRecord = async (ev) => {
            if (ev.type === "mousedown" && ev.button !== 0) return;
            if (ev.cancelable) ev.preventDefault();
            if (this.isHolding || this.isStartingRecord) return;

            this.stopPlayback();
            if (window.DoubaoTTS) window.DoubaoTTS.stop();
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
              renderBar("⚠️ 当前浏览器未开启麦克风权限（请用 HTTPS 或 Safari/Chrome 打开）");
              return;
            }

            if (ev.pointerId != null && btnRec.setPointerCapture) {
              try {
                btnRec.setPointerCapture(ev.pointerId);
              } catch (_) {}
            }

            this.isHolding = true;
            this.isStartingRecord = true;
            const pressDownMs = Date.now();

            // 监听全局松开事件（无论手指或鼠标在按钮内还是滑出按钮外松开，都能立即结束配音）
            const handleRelease = () => {
              window.removeEventListener("pointerup", handleRelease, true);
              window.removeEventListener("pointercancel", handleRelease, true);
              window.removeEventListener("touchend", handleRelease, true);
              window.removeEventListener("touchcancel", handleRelease, true);
              window.removeEventListener("mouseup", handleRelease, true);
              window.removeEventListener("blur", handleRelease, true);

              if (!this.isHolding) return;
              this.isHolding = false;

              if (this.activeRecorder && this.activeRecorder.state === "recording") {
                this.stopActiveRecording();
              }
            };

            window.addEventListener("pointerup", handleRelease, true);
            window.addEventListener("pointercancel", handleRelease, true);
            window.addEventListener("touchend", handleRelease, true);
            window.addEventListener("touchcancel", handleRelease, true);
            window.addEventListener("mouseup", handleRelease, true);
            window.addEventListener("blur", handleRelease, true);

            // 原地更新 UI 状态（不重建 DOM，确保触屏长按手势不断开）
            if (cardBox) cardBox.classList.add("is-recording");
            if (iconEl) iconEl.textContent = "🔴";
            if (titleEl) titleEl.textContent = "正在准备麦克风… 请继续按住";
            if (subEl) subEl.textContent = "🎤 保持按住说话，松开手指即代表配音结束！";
            btnRec.classList.add("stop");
            btnRec.innerHTML = `🔴 准备中… 松开结束`;

            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              this.isStartingRecord = false;

              // 如果在等待麦克风开启/系统授权弹窗期间用户已经松手
              if (!this.isHolding) {
                stream.getTracks().forEach((t) => t.stop());
                const waitedMs = Date.now() - pressDownMs;
                if (waitedMs > 550) {
                  renderBar("✅ 麦克风已就绪！请【按住录音键不放】开始说话，松开即结束～");
                } else {
                  renderBar("💡 请【一直按住】录音键说话，松开手指才代表配音结束哦！");
                }
                return;
              }

              this.activeStream = stream;
              const mime = pickSupportedMime();
              const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
              this.activeRecorder = recorder;
              this.recordingArchiveId = item.id;
              this.recordChunks = [];
              this.recordStartMs = Date.now();

              recorder.ondataavailable = (dataEv) => {
                if (dataEv.data && dataEv.data.size > 0) this.recordChunks.push(dataEv.data);
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
                const elapsedMs = Date.now() - this.recordStartMs;
                const finalMime = recorder.mimeType || mime || "audio/mp4";
                const blob = new Blob(this.recordChunks, { type: finalMime });
                const dur = Math.max(1, Math.round(elapsedMs / 1000));

                if (elapsedMs < 350 || blob.size < 200) {
                  renderBar("💡 录音时间太短啦！请【一直按住】按钮说话，讲完再松开手指哦！");
                  return;
                }

                const wasFirst = !this.hasVoice(item.id);
                const nowMs = Date.now();
                const randSuffix = Math.random().toString(36).slice(2, 6);
                const clipId = `${item.id}__${nowMs}_${randSuffix}`;
                const recObj = {
                  id: clipId,
                  archiveId: item.id,
                  blob,
                  mimeType: finalMime,
                  duration: dur,
                  updatedAt: nowMs
                };

                await this.saveLocal(recObj);
                if (wasFirst && onAwardFirstStar) onAwardFirstStar();
                if (window.SFX) window.SFX.chime();
                this.emitChange();

                const totalNow = this.getVoiceCount(item.id);
                renderBar(`☁️ 第 ${totalNow} 条配音已录好（${formatDur(dur)}），正在同步云端…`);
                const synced = await this.uploadToCloud(recObj);
                renderBar(
                  synced
                    ? `🎉 第 ${totalNow} 条配音保存并同步云端成功！可以点下方按钮试听或继续录新配音！`
                    : `💾 第 ${totalNow} 条配音已保存在本机！可以随时试听或继续录新配音！`
                );
              };

              recorder.start(200);
              if (window.SFX) window.SFX.pop();

              if (titleEl) titleEl.textContent = "正在录小馆长专属解说…";
              if (subEl) subEl.textContent = "🎤 对着麦克风大声开讲吧！一直按住不放，松开立即完成保存！";
              btnRec.innerHTML = `🔴 录音中 (<span id="voiceTickSec">0</span>s) · 松开结束`;

              this.recordTimer = setInterval(() => {
                if (!this.isHolding) {
                  this.stopActiveRecording();
                  return;
                }
                const sec = Math.max(0, Math.floor((Date.now() - this.recordStartMs) / 1000));
                const tickEl = mountEl.querySelector("#voiceTickSec");
                if (tickEl) tickEl.textContent = String(sec);
              }, 250);
            } catch (_) {
              this.isHolding = false;
              this.isStartingRecord = false;
              renderBar("🔒 请在弹出的提示框里点击『允许使用麦克风』哦！");
            }
          };

          if (window.PointerEvent) {
            btnRec.addEventListener("pointerdown", startHoldRecord);
          } else {
            btnRec.addEventListener("touchstart", startHoldRecord, { passive: false });
            btnRec.addEventListener("mousedown", startHoldRecord);
          }
        }
      };

      renderBar();
    }
  }

  window.CuratorVoiceModule = {
    CuratorVoiceStudio
  };
})();
