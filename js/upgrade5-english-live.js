// ============================================================================
// 升级5：🎥 真实实况短片伴读 · 💡 十万个为什么深度讲解 · 🇬🇧 趣味英语点读跟读 & 闯关擂台
// 覆盖四大升级诉求：
//   1. 真实实况短片同步纪录片级解说 + 实况眼力小侦探互动问答
//   2. 每张卡新增 3 个小朋友最好奇的「十万个为什么」深度语音故事 + 一键连播全套讲解
//   3. 每张卡新增「🇬🇧 趣味英语小课堂」：英文物种名片 + 3张点读科学词卡 + 双句跟读 + 开口跟读测评(兼容语音识别与录音回放双模式)
//   4. 第 4 站新增游戏 4：「🎬🇬🇧 实况观察 & 毒物英语大闯关」（看真实短片猜物种 + 听英文口令抓毒物）
// ============================================================================

(function () {
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightWords(enText, kwList) {
    const target = new Set((kwList || []).map((w) => String(w || "").toLowerCase()));
    return String(enText || "").replace(/[A-Za-z]+(?:'[A-Za-z]+|-?[A-Za-z]+)*/g, (tok) => {
      const safe = esc(tok);
      if (target.has(tok.toLowerCase())) {
        return `<span class="en-key-word">${safe}</span>`;
      }
      return safe;
    });
  }

  // --------------------------------------------------------------------------
  // 英文开口跟读引擎（优先 Web Speech en-US 实时识别评分，自动降级为录音自听对比，iPad 100% 可用！）
  // --------------------------------------------------------------------------
  class KidsEnglishShadowing {
    constructor() {
      this.rec = null;
      this.mediaRecorder = null;
      this.mediaStream = null;
      this.chunks = [];
      this.playbackAudio = null;
      this.isActive = false;
      this.stopTimer = null;
    }

    stopAll() {
      this.isActive = false;
      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }
      if (this.rec) {
        try { this.rec.abort(); } catch (_) {}
        this.rec = null;
      }
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        try { this.mediaRecorder.stop(); } catch (_) {}
      }
      this.mediaRecorder = null;
      if (this.mediaStream) {
        try { this.mediaStream.getTracks().forEach((t) => t.stop()); } catch (_) {}
        this.mediaStream = null;
      }
      if (this.playbackAudio) {
        try { this.playbackAudio.pause(); } catch (_) {}
        this.playbackAudio = null;
      }
    }

    startPractice(targetEn, callbacks) {
      const cb = callbacks || {};
      this.stopAll();
      if (window.DoubaoTTS) window.DoubaoTTS.stop();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      const actionVid = document.getElementById("modalActionVideo");
      if (actionVid && !actionVid.paused) actionVid.pause();

      const targetWords = (String(targetEn || "").toLowerCase().match(/[a-z]+/g) || []).filter(
        (w) => w.length >= 2
      );

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const isStandaloneIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && window.navigator.standalone === true;

      if (SR && !isStandaloneIOS) {
        try {
          const rec = new SR();
          this.rec = rec;
          this.isActive = true;
          rec.lang = "en-US";
          rec.continuous = false;
          rec.interimResults = true;
          rec.maxAlternatives = 3;

          let bestTranscript = "";
          let settled = false;

          const finishEval = (spoken) => {
            if (settled) return;
            settled = true;
            this.isActive = false;
            if (this.stopTimer) {
              clearTimeout(this.stopTimer);
              this.stopTimer = null;
            }
            const cleanSpoken = String(spoken || "").trim();
            if (!cleanSpoken) {
              if (cb.onFallbackRecord) {
                this._startRecorderFallback(targetEn, cb);
                return;
              }
              if (cb.onHint) cb.onHint("没太听清哦～离麦克风近一点再试一次吧！");
              return;
            }
            const spokenSet = new Set(cleanSpoken.toLowerCase().match(/[a-z]+/g) || []);
            const matched = targetWords.filter((w) => {
              if (spokenSet.has(w)) return true;
              for (const sw of spokenSet) {
                if (sw.length >= 3 && (w.startsWith(sw) || sw.startsWith(w))) return true;
              }
              return false;
            });
            const ratio = targetWords.length > 0 ? matched.length / targetWords.length : 1;
            if (cb.onResult) {
              cb.onResult({
                transcript: cleanSpoken,
                matchedWords: matched,
                totalWords: targetWords.length,
                score: ratio >= 0.6 ? 3 : matched.length >= 1 ? 2 : 1
              });
            }
          };

          rec.onstart = () => {
            if (cb.onListening) cb.onListening("🎙️ 正在听你读英文…大胆大声读出来吧！");
          };

          rec.onresult = (ev) => {
            let combined = "";
            for (let i = 0; i < ev.results.length; i++) {
              combined += " " + ev.results[i][0].transcript;
            }
            bestTranscript = combined.trim();
            if (cb.onInterim && bestTranscript) {
              cb.onInterim(bestTranscript);
            }
          };

          rec.onerror = () => {
            if (!settled) {
              settled = true;
              this.isActive = false;
              this._startRecorderFallback(targetEn, cb);
            }
          };

          rec.onend = () => {
            finishEval(bestTranscript);
          };

          rec.start();
          this.stopTimer = setTimeout(() => {
            if (this.isActive && this.rec) {
              try { this.rec.stop(); } catch (_) {}
            }
          }, 5800);
          return;
        } catch (_) {
          // Fall through to MediaRecorder fallback
        }
      }

      this._startRecorderFallback(targetEn, cb);
    }

    async _startRecorderFallback(targetEn, cb) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (cb.onHint) cb.onHint("当前浏览器未开启麦克风权限，先点上方单词卡听发音跟读吧！");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;
        this.chunks = [];
        const mr = new MediaRecorder(stream);
        this.mediaRecorder = mr;
        this.isActive = true;

        if (cb.onListening) {
          cb.onListening("🎙️ 正在录下你的英文朗读（读完再点一下按钮即可听回放拿星星）！");
        }

        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) this.chunks.push(e.data);
        };

        mr.onstop = () => {
          this.isActive = false;
          if (this.mediaStream) {
            try { this.mediaStream.getTracks().forEach((t) => t.stop()); } catch (_) {}
            this.mediaStream = null;
          }
          const blob = new Blob(this.chunks, { type: mr.mimeType || "audio/mp4" });
          const url = URL.createObjectURL(blob);
          if (cb.onRecorded) {
            cb.onRecorded({ audioUrl: url, targetEn });
          }
        };

        mr.start();
        this.stopTimer = setTimeout(() => {
          if (this.isActive && this.mediaRecorder && this.mediaRecorder.state === "recording") {
            try { this.mediaRecorder.stop(); } catch (_) {}
          }
        }, 5500);
      } catch (_) {
        this.isActive = false;
        if (cb.onHint) cb.onHint("请允许麦克风权限后再试，或直接跟着语音大声开口读哦！");
      }
    }
  }

  const shadowingEngine = new KidsEnglishShadowing();

  // --------------------------------------------------------------------------
  // 在每张超级档案卡中挂载：
  //   A. 左侧实况短片同步解说 + 实况眼力小侦探条
  //   B. 右侧「🙋‍♀️ 小朋友最好奇的十万个为什么（3连问）」+「🇬🇧 趣味英语小课堂」
  // --------------------------------------------------------------------------
  function mountCardExtensions(options) {
    const opts = options || {};
    const item = opts.item;
    if (!item) return;

    const ruby = opts.ruby || ((s) => s);
    const speak = opts.speak || (() => {});
    const renderClauses = opts.renderClauses || ((s) => esc(s));
    const addStars = opts.addStars || (() => {});
    const state = opts.state || {};
    const saveState = opts.saveState || (() => {});
    const stopVoiceStudio = opts.stopVoiceStudio || (() => {});

    if (!Array.isArray(state.unlockedCuriosities)) state.unlockedCuriosities = [];
    if (!Array.isArray(state.wonSpotChallenges)) state.wonSpotChallenges = [];
    if (!Array.isArray(state.wonEnShadowing)) state.wonEnShadowing = [];

    const extra = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || null;
    const bi1 = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[item.id]) || null;
    const realVid = (window.REAL_VIDEOS && window.REAL_VIDEOS[item.id]) || null;

    // 1. 挂载实况短片解说与观察互动栏（位于左侧视图切换下方）
    const liveMount = document.getElementById("modalRealVideoCompanion");
    if (liveMount) {
      if (realVid || (extra && extra.liveCommentary)) {
        const spotDone = state.wonSpotChallenges.includes(item.id);
        const isRealisticScene = Boolean(realVid && realVid.kind === "realistic_scene");
        const badgeLabel = realVid
          ? isRealisticScene
            ? "🎨 写实动态还原"
            : realVid.exact
            ? "🎥 物种真身实况短片"
            : "🎥 实景近亲/实验实拍"
          : "🎙️ 现场观察导览";
        const tagClass = isRealisticScene ? "realistic_scene" : realVid && realVid.exact ? "exact" : "related";
        const subTitle = realVid && realVid.label ? realVid.label : `${item.name}生态观察`;

        liveMount.style.display = "block";
        liveMount.innerHTML = `
          <div class="real-video-companion-card">
            <div class="rv-header-row">
              <div class="rv-badge-group">
                <span class="rv-authentic-tag ${tagClass}">${esc(badgeLabel)}</span>
                <span class="rv-sub-label">${ruby(subTitle)}</span>
              </div>
              <div class="rv-action-btns">
                <button type="button" class="rv-mini-action" id="btnJumpStoryVideo" title="观看写实插画+姐姐全程配音的生活实例短片">🎬 姐姐配音剧场</button>
                ${
                  extra && extra.liveCommentary
                    ? `<button type="button" class="rv-mini-action" id="btnPlayLiveCommentary">🎙️ 边看边听解说</button>`
                    : ""
                }
                ${
                  extra && extra.spotChallenge
                    ? `<button type="button" class="rv-mini-action spot-btn ${spotDone ? "done" : ""}" id="btnOpenSpotChallenge">
                         ${spotDone ? "✅ 眼力已通关" : "👀 观察小侦探 (+2⭐)"}
                       </button>`
                    : ""
                }
              </div>
            </div>
            <div id="rvLiveSpeechBox" style="display:none;margin-top:8px;"></div>
            <div id="rvSpotChallengeBox" style="display:none;margin-top:8px;"></div>
          </div>
        `;

        const btnJumpStory = document.getElementById("btnJumpStoryVideo");
        if (btnJumpStory && typeof opts.switchToStoryVideo === "function") {
          btnJumpStory.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            stopVoiceStudio();
            shadowingEngine.stopAll();
            opts.switchToStoryVideo();
          });
        }

        const btnLiveComm = document.getElementById("btnPlayLiveCommentary");
        if (btnLiveComm && extra && extra.liveCommentary) {
          btnLiveComm.addEventListener("click", () => {
            stopVoiceStudio();
            shadowingEngine.stopAll();
            // 如果有真实实况视频，自动切到真实实况画面并静音循环播放，实现BBC纪录片同步配音感！
            if (realVid && typeof opts.switchToRealVideo === "function") {
              opts.switchToRealVideo({ muteForNarration: true });
            }
            const sBox = document.getElementById("rvLiveSpeechBox");
            if (!sBox) return;
            sBox.style.display = "block";
            sBox.innerHTML = `
              <div class="kid-voice-bubble tts-reading-scope rv-commentary-bubble" title="点击暂停或重播实况解说">
                <div class="tts-toy-status"></div>
                <div class="tts-clauses-body">🎬 ${renderClauses(extra.liveCommentary)}</div>
              </div>
            `;
            const bubble = sBox.querySelector(".kid-voice-bubble");
            if (bubble) {
              bubble.addEventListener("click", () => {
                speak(extra.liveCommentary, {
                  toggleIfPlaying: true,
                  scopeEl: bubble,
                  statusMountEl: sBox.querySelector(".tts-toy-status")
                });
              });
            }
            speak(extra.liveCommentary, {
              toggleIfPlaying: true,
              scopeEl: bubble || sBox,
              triggerBtn: btnLiveComm,
              statusMountEl: sBox.querySelector(".tts-toy-status"),
              defaultBtnHTML: "🎙️ 边看边听解说"
            });
          });
        }

        const btnSpot = document.getElementById("btnOpenSpotChallenge");
        if (btnSpot && extra && extra.spotChallenge) {
          btnSpot.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            stopVoiceStudio();
            const cBox = document.getElementById("rvSpotChallengeBox");
            if (!cBox) return;
            if (cBox.style.display === "block") {
              cBox.style.display = "none";
              return;
            }
            const sc = extra.spotChallenge;
            cBox.style.display = "block";
            cBox.innerHTML = `
              <div class="card-quiz-box spot-detective-box">
                <div class="card-quiz-question tts-reading-scope" id="spotQuestionScope">
                  <div class="tts-toy-status"></div>
                  <div class="tts-clauses-body">${renderClauses(sc.q)}</div>
                </div>
                <div class="card-quiz-options">
                  ${sc.opts
                    .map(
                      (optTxt, idx) => `
                    <button type="button" class="card-quiz-opt-btn" data-sright="${idx === sc.ans ? "1" : "0"}">
                      ${idx === 0 ? "🔍 A." : "🔍 B."} ${ruby(optTxt)}
                    </button>
                  `
                    )
                    .join("")}
                </div>
                <div id="spotQuizFeedback" style="margin-top:8px;"></div>
              </div>
            `;

            const qScope = document.getElementById("spotQuestionScope");
            if (qScope) {
              qScope.addEventListener("click", () => {
                speak(null, {
                  toggleIfPlaying: true,
                  scopeEl: qScope,
                  statusMountEl: qScope.querySelector(".tts-toy-status")
                });
              });
            }

            cBox.querySelectorAll(".card-quiz-opt-btn").forEach((ob) => {
              ob.addEventListener("click", () => {
                const ok = ob.getAttribute("data-sright") === "1";
                const fb = document.getElementById("spotQuizFeedback");
                if (!fb) return;
                if (ok) {
                  cBox.querySelectorAll(".card-quiz-opt-btn").forEach((x) => x.classList.remove("picked-wrong"));
                  ob.classList.add("picked-right");
                  if (window.SFX) window.SFX.chime();
                  if (!state.wonSpotChallenges.includes(item.id)) {
                    state.wonSpotChallenges.push(item.id);
                    saveState();
                    addStars(2);
                    btnSpot.classList.add("done");
                    btnSpot.textContent = "✅ 眼力已通关 (+2⭐)";
                  }
                  fb.innerHTML = `
                    <div class="kid-voice-bubble tts-reading-scope" style="border-color:#4ade80;background:rgba(74,222,128,0.18);margin-top:6px;">
                      <div class="tts-toy-status"></div>
                      <div class="tts-clauses-body">🎉👁️ ${renderClauses(sc.explain)}</div>
                    </div>
                  `;
                  const expScope = fb.querySelector(".kid-voice-bubble");
                  speak(null, {
                    scopeEl: expScope || fb,
                    statusMountEl: fb.querySelector(".tts-toy-status"),
                    playTapSfx: false
                  });
                } else {
                  ob.classList.remove("picked-wrong");
                  void ob.offsetWidth;
                  ob.classList.add("picked-wrong");
                  if (window.SFX) window.SFX.bonk();
                  fb.innerHTML = `<div style="font-size:0.84rem;font-weight:800;color:#fbbf24;padding:4px;">💡 再仔细看看短片或照片里的细节，换另一个试试！</div>`;
                }
              });
            });
          });
        }
      } else {
        liveMount.style.display = "none";
        liveMount.innerHTML = "";
      }
    }

    // 1.5 挂载 v6.0「🏠 生活中的真实实例 · 写实插画伴读卡」（让小朋友一听就懂！）
    const lifeMount = document.getElementById("modalLifeExampleMount");
    if (lifeMount) {
      if (extra && extra.lifeStory) {
        const lifeTitle = extra.lifeTitle || "🏠 生活中的真实小例子";
        const lifeTag = extra.lifeSceneTag || "生活科学实例";
        const lifeIcon = extra.lifeIcon || "🏠✨";
        const illuSrc = extra.illuSrc || "";

        lifeMount.style.display = "block";
        lifeMount.innerHTML = `
          <div class="life-example-card">
            <div class="life-example-header">
              <div class="life-example-title-wrap">
                <span class="life-scene-tag">${esc(lifeIcon)} ${esc(lifeTag)}</span>
                <span class="life-example-title">${ruby(lifeTitle)}</span>
              </div>
              <button type="button" class="mini-btn on" id="btnSpeakLifeStory" style="padding:6px 13px;font-size:0.82rem;">
                🔊 听生活实例
              </button>
            </div>
            ${
              illuSrc
                ? `
              <div class="life-example-illu-wrap" id="lifeIlluTrigger" title="点击观看写实插画+姐姐配音生活剧场视频">
                <img src="${esc(illuSrc)}" alt="${esc(item.name)}生活实例写实图解" class="life-example-illu-img" loading="lazy" />
                <span class="life-example-play-badge">🎬 点画看配音生活剧场</span>
              </div>
            `
                : ""
            }
            <div class="kid-voice-bubble life-example-story-bubble tts-reading-scope" id="lifeStorySpeechScope" title="点击开始或暂停姐姐讲生活小例子">
              <div class="tts-toy-status" id="lifeStoryStatusMount"></div>
              <span class="tts-seg" data-tts-seg="${esc(lifeTitle)}。" style="display:none;"></span>
              <div class="tts-clauses-body">💡 ${renderClauses(extra.lifeStory)}</div>
            </div>
          </div>
        `;

        const illuTrig = document.getElementById("lifeIlluTrigger");
        if (illuTrig && typeof opts.switchToStoryVideo === "function") {
          illuTrig.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            stopVoiceStudio();
            shadowingEngine.stopAll();
            opts.switchToStoryVideo();
          });
        }

        const btnLife = document.getElementById("btnSpeakLifeStory");
        const lifeScope = document.getElementById("lifeStorySpeechScope");
        const fullLifeSpoken = `${lifeTitle}。${extra.lifeStory}`;
        const triggerLifeSpeak = () => {
          stopVoiceStudio();
          shadowingEngine.stopAll();
          const vEl = document.getElementById("modalActionVideo");
          if (vEl && !vEl.paused) vEl.pause();
          speak(fullLifeSpoken, {
            toggleIfPlaying: true,
            scopeEl: lifeScope,
            triggerBtn: btnLife,
            statusMountEl: document.getElementById("lifeStoryStatusMount"),
            defaultBtnHTML: "🔊 听生活实例"
          });
        };
        if (btnLife) btnLife.addEventListener("click", triggerLifeSpeak);
        if (lifeScope) lifeScope.addEventListener("click", triggerLifeSpeak);
      } else {
        lifeMount.style.display = "none";
        lifeMount.innerHTML = "";
      }
    }

    // 2. 挂载右侧「🙋‍♀️ 好奇宝宝十万个为什么 (3连问)」+「🇬🇧 趣味英语小课堂」
    const rightExtraMount = document.getElementById("modalCuriosityAndEnglishMount");
    if (!rightExtraMount || !extra) return;

    const curiosities = Array.isArray(extra.curiosities) ? extra.curiosities : [];
    const unlockedCount = curiosities.filter((_, idx) =>
      state.unlockedCuriosities.includes(`${item.id}_${idx}`)
    ).length;

    const vocabList = Array.isArray(extra.vocab) ? extra.vocab : [];
    const enScene = extra.enScene || null;
    const shadowWon = state.wonEnShadowing.includes(item.id);

    rightExtraMount.innerHTML = `
      <!-- 模块 A：小朋友最好奇的「十万个为什么」深度语音故事区 -->
      <div class="curiosity-panel-card">
        <div class="curiosity-header">
          <div>
            <span class="curiosity-title">🙋‍♀️ 好奇宝宝「十万个为什么」</span>
            <span class="curiosity-count-pill" id="curiosityProgressBadge">💡 已解锁 ${unlockedCount}/${curiosities.length}</span>
          </div>
          <button type="button" class="mini-btn curiosity-playall-btn" id="btnPlayAllStory" title="像听故事电台一样连播整张卡的深度秘密">
            📻 连讲全部秘密
          </button>
        </div>

        <div class="curiosity-q-list" id="curiosityQList">
          ${curiosities
            .map((c, idx) => {
              const cidKey = `${item.id}_${idx}`;
              const isLit = state.unlockedCuriosities.includes(cidKey);
              return `
                <button type="button" class="curiosity-q-btn ${isLit ? "unlocked" : ""}" data-cidx="${idx}">
                  <span class="cq-icon">${c.icon || "💡"}</span>
                  <span class="cq-text">${ruby(c.q)}</span>
                  <span class="cq-arrow">${isLit ? "🔊" : "✨+1⭐"}</span>
                </button>
              `;
            })
            .join("")}
        </div>

        <div id="curiosityAnswerStage"></div>
      </div>

      <!-- 模块 B：🇬🇧 趣味英语小课堂（物种名片 + 点读科学词卡 + 双句跟读 + 开口测评） -->
      <div class="english-explorer-card">
        <div class="en-explorer-header">
          <div class="en-species-badge" id="btnSpeakEnSpecies" title="点击跟读英文名字（读2遍）">
            <span class="en-flag-chip">🇬🇧 英文名片</span>
            <span class="en-species-name">${esc(extra.enName || "")}</span>
            ${extra.enPron ? `<span class="en-species-pron">${esc(extra.enPron)}</span>` : ""}
            <span class="en-tap-horn">🔊</span>
          </div>
          <button type="button" class="en-shadow-entry-btn ${shadowWon ? "won" : ""}" id="btnToggleShadowing">
            🎙️ ${shadowWon ? "跟读已摘星 🌟" : "我来开口读 (+2⭐)"}
          </button>
        </div>

        <!-- 3 张可点读核心科学单词卡 -->
        <div class="en-vocab-grid">
          ${vocabList
            .map(
              (v, vIdx) => `
            <button type="button" class="en-vocab-pill" data-vidx="${vIdx}" title="点我听单词发音和例句">
              <span class="ev-icon">${v.icon || "🔤"}</span>
              <span class="ev-word">${esc(v.w)}</span>
              <span class="ev-zh">${esc(v.zh)}</span>
            </button>
          `
            )
            .join("")}
        </div>
        <div id="enVocabExampleToast" class="en-vocab-toast" style="display:none;"></div>

        <!-- 进阶第 2 句情景双语胶囊（配合上方第 1 句，双句进阶磨耳朵！） -->
        ${
          enScene && enScene.en
            ? `
          <div class="en-scene-sentence-box tts-reading-scope" id="enSceneSentenceBox" title="点击听这句地道英语（连读2遍+中文解释）">
            <div class="tts-toy-status"></div>
            <div class="en-scene-top">
              <span class="bilingual-tag">🇬🇧 实况情景句 ×2遍</span>
              <span style="font-size:0.75rem;color:var(--text-muted);font-weight:800;">👆 点句子跟读</span>
            </div>
            <div class="en-scene-en">${highlightWords(enScene.en, enScene.kw)}</div>
            <div class="en-scene-zh">${ruby(enScene.zh)}</div>
          </div>
        `
            : ""
        }

        <!-- 🎙️ 开口说英文互动跟读台 -->
        <div id="enShadowingStage" class="en-shadowing-stage" style="display:none;"></div>
      </div>
    `;

    // 绑定「十万个为什么」单题点击展开与朗读
    const ansStage = document.getElementById("curiosityAnswerStage");
    const qBtns = rightExtraMount.querySelectorAll(".curiosity-q-btn");

    const openCuriosityIdx = (idx) => {
      const c = curiosities[idx];
      if (!c || !ansStage) return;
      stopVoiceStudio();
      shadowingEngine.stopAll();

      qBtns.forEach((b, i) => b.classList.toggle("active", i === idx));

      const cidKey = `${item.id}_${idx}`;
      if (!state.unlockedCuriosities.includes(cidKey)) {
        state.unlockedCuriosities.push(cidKey);
        saveState();
        addStars(1);
        const targetBtn = qBtns[idx];
        if (targetBtn) {
          targetBtn.classList.add("unlocked");
          const arrow = targetBtn.querySelector(".cq-arrow");
          if (arrow) arrow.textContent = "🔊";
        }
        const nowCnt = curiosities.filter((_, i) =>
          state.unlockedCuriosities.includes(`${item.id}_${i}`)
        ).length;
        const badge = document.getElementById("curiosityProgressBadge");
        if (badge) badge.textContent = `💡 已解锁 ${nowCnt}/${curiosities.length}`;
      }

      ansStage.innerHTML = `
        <div class="kid-voice-bubble curiosity-answer-bubble tts-reading-scope" title="点击暂停或重新听姐姐讲">
          <div class="tts-toy-status"></div>
          <div class="curiosity-q-echo tts-seg" data-tts-seg="${esc(c.q)}">${c.icon || "💡"} ${ruby(c.q)}</div>
          <div class="tts-clauses-body">${renderClauses(c.a)}</div>
        </div>
      `;
      const bubble = ansStage.querySelector(".kid-voice-bubble");
      const curSpoken = `${c.q}${c.a}`;
      if (bubble) {
        bubble.addEventListener("click", () => {
          speak(curSpoken, {
            toggleIfPlaying: true,
            scopeEl: bubble,
            statusMountEl: ansStage.querySelector(".tts-toy-status")
          });
        });
      }
      speak(curSpoken, {
        scopeEl: bubble || ansStage,
        statusMountEl: ansStage.querySelector(".tts-toy-status"),
        playTapSfx: false
      });
    };

    qBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        const idx = parseInt(btn.getAttribute("data-cidx"), 10);
        openCuriosityIdx(idx);
      });
    });

    // 绑定「📻 连讲全部秘密」
    const btnPlayAll = document.getElementById("btnPlayAllStory");
    if (btnPlayAll && curiosities.length > 0) {
      btnPlayAll.addEventListener("click", () => {
        stopVoiceStudio();
        shadowingEngine.stopAll();
        curiosities.forEach((_, idx) => {
          const cidKey = `${item.id}_${idx}`;
          if (!state.unlockedCuriosities.includes(cidKey)) {
            state.unlockedCuriosities.push(cidKey);
            addStars(1);
          }
        });
        saveState();
        qBtns.forEach((b) => {
          b.classList.add("unlocked");
          const arrow = b.querySelector(".cq-arrow");
          if (arrow) arrow.textContent = "🔊";
        });
        const badge = document.getElementById("curiosityProgressBadge");
        if (badge) badge.textContent = `💡 已解锁 ${curiosities.length}/${curiosities.length}`;

        // 组合一段约 520 字以内的完整连播故事（适配 600 字单次合成上限，0断层丝滑连读！）
        const combinedParagraphs = curiosities
          .map((c, i) => `秘密${i + 1}：${c.q}${c.a}`)
          .join(" ");
        const trimmedStory = combinedParagraphs.slice(0, 560);

        ansStage.innerHTML = `
          <div class="kid-voice-bubble curiosity-answer-bubble tts-reading-scope" title="点击停止或重播全套秘密">
            <div class="tts-toy-status"></div>
            <div class="tts-clauses-body">📻 ${renderClauses(trimmedStory)}</div>
          </div>
        `;
        const bubble = ansStage.querySelector(".kid-voice-bubble");
        speak(null, {
          toggleIfPlaying: true,
          scopeEl: bubble || ansStage,
          triggerBtn: btnPlayAll,
          statusMountEl: ansStage.querySelector(".tts-toy-status"),
          defaultBtnHTML: "📻 连讲全部秘密"
        });
      });
    }

    // 绑定英文物种名片点读
    const btnEnSpecies = document.getElementById("btnSpeakEnSpecies");
    if (btnEnSpecies && extra.enName) {
      btnEnSpecies.addEventListener("click", () => {
        stopVoiceStudio();
        shadowingEngine.stopAll();
        btnEnSpecies.classList.remove("pop-anim");
        void btnEnSpecies.offsetWidth;
        btnEnSpecies.classList.add("pop-anim");
        const text = `${extra.enName}! ${extra.enName}! ${item.name}！`;
        speak(text, {
          toggleIfPlaying: true,
          segments: [{ el: btnEnSpecies, text }]
        });
      });
    }

    // 绑定 3 张科学单词点读卡
    const vocabToast = document.getElementById("enVocabExampleToast");
    rightExtraMount.querySelectorAll(".en-vocab-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        stopVoiceStudio();
        shadowingEngine.stopAll();
        const vIdx = parseInt(pill.getAttribute("data-vidx"), 10);
        const v = vocabList[vIdx];
        if (!v) return;

        rightExtraMount.querySelectorAll(".en-vocab-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const spoken = `${v.w}! ${v.w}! ${v.zh}！${v.ex || ""}`;
        if (vocabToast) {
          vocabToast.style.display = "block";
          vocabToast.innerHTML = `
            <span class="ev-toast-word">${v.icon || "🔤"} <strong>${esc(v.w)}</strong>（${esc(v.zh)}）</span>
            ${v.ex ? `<span class="ev-toast-ex">例句：<em>${esc(v.ex)}</em></span>` : ""}
          `;
        }
        speak(spoken, {
          toggleIfPlaying: true,
          segments: [{ el: pill, text: spoken }]
        });
      });
    });

    // 绑定第 2 句情景双语点击跟读
    const sceneBox = document.getElementById("enSceneSentenceBox");
    if (sceneBox && enScene && enScene.en) {
      sceneBox.addEventListener("click", () => {
        stopVoiceStudio();
        shadowingEngine.stopAll();
        const spoken = `${enScene.en} ${enScene.en} ${enScene.zh}`;
        speak(spoken, {
          toggleIfPlaying: true,
          segments: [{ el: sceneBox, text: spoken }],
          scopeEl: sceneBox,
          statusMountEl: sceneBox.querySelector(".tts-toy-status")
        });
      });
    }

    // 绑定「🎙️ 我来开口读」跟读挑战台
    const btnToggleShadow = document.getElementById("btnToggleShadowing");
    const shadowStage = document.getElementById("enShadowingStage");
    if (btnToggleShadow && shadowStage) {
      let currentTargetIdx = 0;
      const targets = [];
      if (extra.enName) {
        targets.push({ label: "🌟 读物种英文名", en: extra.enName, zh: item.name });
      }
      if (bi1 && bi1.en) {
        targets.push({ label: "🗣️ 读经典短句", en: bi1.en, zh: bi1.zh });
      }
      if (enScene && enScene.en) {
        targets.push({ label: "🎬 读实况情景句", en: enScene.en, zh: enScene.zh });
      }

      const renderShadowStage = () => {
        const cur = targets[currentTargetIdx] || targets[0];
        if (!cur) return;
        shadowStage.innerHTML = `
          <div class="shadow-mode-tabs">
            ${targets
              .map(
                (t, idx) => `
              <button type="button" class="shadow-tab-pill ${idx === currentTargetIdx ? "active" : ""}" data-tidx="${idx}">
                ${t.label}
              </button>
            `
              )
              .join("")}
          </div>
          <div class="shadow-target-display" id="shadowTargetDisplay">
            <div class="shadow-en-big" id="shadowEnWords">${esc(cur.en)}</div>
            <div class="shadow-zh-small">${ruby(cur.zh)}</div>
          </div>
          <div class="shadow-controls-row">
            <button type="button" class="mini-btn" id="btnShadowListenFirst">👂 先听示范</button>
            <button type="button" class="big-action-btn shadow-mic-btn" id="btnShadowStartMic">
              🎙️ 点我大声跟读
            </button>
          </div>
          <div id="shadowFeedbackBox" class="shadow-feedback-box">
            💡 先点【👂 先听示范】，再点【🎙️ 点我大声跟读】试试看！
          </div>
        `;

        shadowStage.querySelectorAll(".shadow-tab-pill").forEach((tb) => {
          tb.addEventListener("click", () => {
            shadowingEngine.stopAll();
            if (window.SFX) window.SFX.pop();
            currentTargetIdx = parseInt(tb.getAttribute("data-tidx"), 10) || 0;
            renderShadowStage();
          });
        });

        const btnListen = document.getElementById("btnShadowListenFirst");
        if (btnListen) {
          btnListen.addEventListener("click", () => {
            shadowingEngine.stopAll();
            speak(`${cur.en} ${cur.en}`);
          });
        }

        const btnMic = document.getElementById("btnShadowStartMic");
        const fbBox = document.getElementById("shadowFeedbackBox");
        const enWordsEl = document.getElementById("shadowEnWords");

        if (btnMic) {
          btnMic.addEventListener("click", () => {
            if (shadowingEngine.isActive) {
              shadowingEngine.stopAll();
              btnMic.classList.remove("listening");
              btnMic.innerHTML = "🎙️ 点我大声跟读";
              return;
            }
            if (window.SFX) window.SFX.pop();
            shadowingEngine.startPractice(cur.en, {
              onListening: (msg) => {
                btnMic.classList.add("listening");
                btnMic.innerHTML = "⏹️ 读完点我完成";
                if (fbBox) fbBox.innerHTML = `<span style="color:#fb7185;font-weight:900;">${esc(msg)}</span>`;
              },
              onInterim: (txt) => {
                if (fbBox) fbBox.innerHTML = `🗣️ 听到你读：<strong>“${esc(txt)}”</strong>`;
              },
              onResult: (res) => {
                btnMic.classList.remove("listening");
                btnMic.innerHTML = "🎙️ 再读一遍";
                const matchedSet = new Set(res.matchedWords || []);
                if (enWordsEl) {
                  enWordsEl.innerHTML = String(cur.en).replace(/[A-Za-z]+/g, (w) => {
                    if (matchedSet.has(w.toLowerCase())) {
                      return `<span class="shadow-word-hit">${esc(w)}</span>`;
                    }
                    return esc(w);
                  });
                }
                if (window.SFX) window.SFX.chime();
                if (!state.wonEnShadowing.includes(item.id)) {
                  state.wonEnShadowing.push(item.id);
                  saveState();
                  addStars(2);
                  btnToggleShadow.classList.add("won");
                  btnToggleShadow.innerHTML = "🎙️ 跟读已摘星 🌟";
                }
                const starsStr = "⭐".repeat(res.score || 2);
                if (fbBox) {
                  fbBox.innerHTML = `
                    <div class="shadow-success-banner">
                      🎉 ${starsStr} 太棒啦！听到你读 <strong>“${esc(res.transcript)}”</strong>，勇敢开口就是英语小达人！
                    </div>
                  `;
                }
              },
              onRecorded: ({ audioUrl }) => {
                btnMic.classList.remove("listening");
                btnMic.innerHTML = "🎙️ 再录一遍";
                if (window.SFX) window.SFX.chime();
                if (!state.wonEnShadowing.includes(item.id)) {
                  state.wonEnShadowing.push(item.id);
                  saveState();
                  addStars(2);
                  btnToggleShadow.classList.add("won");
                  btnToggleShadow.innerHTML = "🎙️ 跟读已摘星 🌟";
                }
                if (fbBox) {
                  fbBox.innerHTML = `
                    <div class="shadow-success-banner">
                      🌟 你的英文朗读录好啦（+2⭐）！快点下面按钮听听自己的发音，再和示范比一比：
                      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
                        <button type="button" class="mini-btn on" id="btnPlayMyEnVoice">▶️ 听我读的英文</button>
                        <button type="button" class="mini-btn" id="btnPlayModelAgain">🔊 再听标准示范</button>
                      </div>
                    </div>
                  `;
                  const bMy = document.getElementById("btnPlayMyEnVoice");
                  if (bMy) {
                    bMy.addEventListener("click", () => {
                      if (shadowingEngine.playbackAudio) {
                        try { shadowingEngine.playbackAudio.pause(); } catch (_) {}
                      }
                      const a = new Audio(audioUrl);
                      shadowingEngine.playbackAudio = a;
                      a.play().catch(() => {});
                    });
                  }
                  const bMod = document.getElementById("btnPlayModelAgain");
                  if (bMod) {
                    bMod.addEventListener("click", () => speak(`${cur.en} ${cur.en}`));
                  }
                }
              },
              onHint: (msg) => {
                btnMic.classList.remove("listening");
                btnMic.innerHTML = "🎙️ 点我大声跟读";
                if (fbBox) fbBox.innerHTML = `<span style="color:#fbbf24;font-weight:800;">💡 ${esc(msg)}</span>`;
              }
            });
          });
        }
      };

      btnToggleShadow.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        if (shadowStage.style.display === "block") {
          shadowingEngine.stopAll();
          shadowStage.style.display = "none";
        } else {
          shadowStage.style.display = "block";
          renderShadowStage();
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 第 4 站新增游戏 4：🎬🇬🇧 实况侦探 & 毒物英语大闯关
  // --------------------------------------------------------------------------
  class LiveEnglishArena {
    constructor(mountEl, options) {
      this.mountEl = mountEl;
      this.opts = options || {};
      this.ruby = this.opts.ruby || ((s) => s);
      this.getPhoto = this.opts.getPhoto || (() => null);
      this.speak = this.opts.speak || (() => {});
      this.onWinStars = this.opts.onWinStars || (() => {});
      this.onOpenCard = this.opts.onOpenCard || (() => {});

      this.mode = "live_guess"; // 'live_guess' | 'en_listen'
      this.streak = 0;
      this.currentAnswer = null;
      this.choices = [];
      this.answered = false;
    }

    init() {
      if (!this.mountEl) return;
      this.nextRound();
    }

    stopMedia() {
      const v = this.mountEl && this.mountEl.querySelector("video");
      if (v) {
        try { v.pause(); } catch (_) {}
      }
      shadowingEngine.stopAll();
    }

    _getLivePool() {
      const rv = window.REAL_VIDEOS || {};
      return (window.CATALOG_DATA || []).filter(
        (x) => x.chapter !== "ch0" && rv[x.id] && rv[x.id].exact
      );
    }

    _getEnPool() {
      const ce = window.CURIOSITY_ENGLISH_DATA || {};
      return (window.CATALOG_DATA || []).filter(
        (x) => x.chapter !== "ch0" && ce[x.id] && ce[x.id].enName && this.getPhoto(x.id)
      );
    }

    nextRound() {
      const livePool = this._getLivePool();
      const enPool = this._getEnPool();
      const pool =
        this.mode === "live_guess" && livePool.length >= 4
          ? livePool
          : enPool.length >= 4
          ? enPool
          : window.CATALOG_DATA.filter((x) => x.chapter !== "ch0");

      if (!pool.length) return;
      const ans = pool[Math.floor(Math.random() * pool.length)];
      const distractors = pool
        .filter((x) => x.id !== ans.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      this.currentAnswer = ans;
      this.choices = [ans, ...distractors].sort(() => Math.random() - 0.5);
      this.answered = false;
      this.render();

      if (this.mode === "en_listen") {
        setTimeout(() => this._playEnglishPrompt(), 180);
      }
    }

    _playEnglishPrompt() {
      const ans = this.currentAnswer;
      if (!ans) return;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[ans.id]) || {};
      const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[ans.id]) || {};
      const clueEn = (ce.enScene && ce.enScene.en) || bi.en || "";
      const spoken = `${ce.enName || ""}! ${ce.enName || ""}! ${clueEn}`;
      this.speak(spoken);
    }

    render() {
      if (!this.mountEl || !this.currentAnswer) return;
      const ans = this.currentAnswer;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[ans.id]) || {};
      const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[ans.id]) || {};
      const rv = (window.REAL_VIDEOS && window.REAL_VIDEOS[ans.id]) || null;
      const clueEn = (ce.enScene && ce.enScene.en) || bi.en || "";
      const clueKw = (ce.enScene && ce.enScene.kw) || bi.kw || [];

      this.mountEl.innerHTML = `
        <div class="live-en-arena-shell">
          <div class="live-en-top-bar">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${this.mode === "live_guess" ? "active" : ""}" data-lemode="live_guess">
                🎥 模式A：看动态短片 · 猜猜我是谁
              </button>
              <button type="button" class="scene-pill ${this.mode === "en_listen" ? "active" : ""}" data-lemode="en_listen">
                🇬🇧 模式B：听英语口令 · 闪电认毒物
              </button>
            </div>
            <div class="live-en-streak-pill">🔥 连胜：${this.streak} 题</div>
          </div>

          <div class="live-en-stage-grid">
            <!-- 左侧出题舞台 -->
            <div class="live-en-prompt-card">
              ${
                this.mode === "live_guess" && rv
                  ? `
                <div class="live-en-video-frame">
                  <video src="${esc(rv.src)}" autoplay loop muted playsinline controls class="live-en-video"></video>
                  <span class="live-en-corner-tag">${rv.kind === "realistic_scene" ? "🎨 写实动态短片 · 猜猜镜头里是谁？" : "🎥 野外真实实拍 · 猜猜镜头里是谁？"}</span>
                </div>
                <div class="live-en-clue-bar">
                  <button type="button" class="mini-btn on" id="btnArenaVoiceHint">🎙️ 听动作提示</button>
                  <button type="button" class="mini-btn" id="btnArenaEnHint">🇬🇧 听英文名提示</button>
                </div>
              `
                  : `
                <div class="live-en-audio-box">
                  <div style="font-size:3rem;margin-bottom:6px;">🇬🇧🎧</div>
                  <div style="font-size:0.9rem;color:var(--c-teal);font-weight:900;margin-bottom:6px;">仔细听英文名字与线索，找出对应的生物！</div>
                  <div class="live-en-big-word">${esc(ce.enName || "Mystery Creature")}</div>
                  ${ce.enPron ? `<div style="color:var(--text-muted);font-size:0.86rem;margin-bottom:8px;">${esc(ce.enPron)}</div>` : ""}
                  <div class="live-en-sentence">${highlightWords(clueEn, clueKw)}</div>
                  <button type="button" class="big-action-btn" id="btnReplayEnClue" style="margin-top:14px;padding:10px 20px;min-height:42px;font-size:0.92rem;">
                    🔊 再听一遍英语口令
                  </button>
                </div>
              `
              }
            </div>

            <!-- 右侧四选一实拍图文选项 -->
            <div>
              <h3 style="margin:0 0 12px;font-size:1.22rem;">
                ${this.mode === "live_guess" ? "🕵️‍♀️ 镜头里的真实主角是哪一位？" : "🇬🇧 这句英语说的是大百科里的谁？"}
              </h3>
              <div class="live-en-choices-grid">
                ${this.choices
                  .map((c) => {
                    const cPhoto = this.getPhoto(c.id);
                    const cExtra = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[c.id]) || {};
                    return `
                      <button type="button" class="live-en-choice-card" data-cid="${c.id}">
                        ${
                          cPhoto
                            ? `<img src="${esc(cPhoto)}" alt="" class="lec-thumb" />`
                            : `<div class="lec-thumb lec-emoji">${c.emoji}</div>`
                        }
                        <div class="lec-meta">
                          <div class="lec-name">${this.ruby(c.name)}</div>
                          <div class="lec-sub">
                            ${
                              this.mode === "live_guess"
                                ? `🇬🇧 ${esc(cExtra.enName || c.code)}`
                                : esc(c.code)
                            }
                          </div>
                        </div>
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              <div id="liveEnArenaFeedback" style="margin-top:14px;min-height:60px;"></div>
            </div>
          </div>
        </div>
      `;

      this.mountEl.querySelectorAll("[data-lemode]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.stopMedia();
          this.mode = b.getAttribute("data-lemode");
          this.nextRound();
        });
      });

      const btnVoiceHint = document.getElementById("btnArenaVoiceHint");
      if (btnVoiceHint && ce.liveCommentary) {
        // 提示时不直接念出物种名字：把名字替换成「这位神秘主角」
        const masked = String(ce.liveCommentary).split(ans.name).join("这位神秘主角");
        btnVoiceHint.addEventListener("click", () => this.speak(masked));
      }

      const btnEnHint = document.getElementById("btnArenaEnHint");
      if (btnEnHint && ce.enName) {
        btnEnHint.addEventListener("click", () => this.speak(`${ce.enName}! ${ce.enName}!`));
      }

      const btnReplay = document.getElementById("btnReplayEnClue");
      if (btnReplay) {
        btnReplay.addEventListener("click", () => this._playEnglishPrompt());
      }

      this.mountEl.querySelectorAll(".live-en-choice-card").forEach((cardBtn) => {
        cardBtn.addEventListener("click", () => {
          const picked = cardBtn.getAttribute("data-cid");
          const fb = document.getElementById("liveEnArenaFeedback");
          if (!fb) return;

          if (picked === ans.id) {
            cardBtn.classList.add("picked-right");
            if (!this.answered) {
              this.answered = true;
              this.streak += 1;
              this.onWinStars(2);
              const streakEl = this.mountEl.querySelector(".live-en-streak-pill");
              if (streakEl) streakEl.textContent = `🔥 连胜：${this.streak} 题`;
            }
            if (window.SFX) window.SFX.chime();
            const vocabChips = (ce.vocab || [])
              .map((v) => `<span class="arena-mini-vocab">${v.icon || ""} ${esc(v.w)} ${esc(v.zh)}</span>`)
              .join("");

            fb.innerHTML = `
              <div class="arena-win-card">
                <div style="font-weight:900;font-size:1rem;color:#4ade80;">
                  🎉 答对啦 (+2⭐)！正是 ${this.ruby(ans.name)}（🇬🇧 ${esc(ce.enName || "")}）！
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;">${vocabChips}</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
                  <button type="button" class="mini-btn" id="btnArenaOpenArchive">📖 打开它的完整档案</button>
                  <button type="button" class="big-action-btn" id="btnArenaNext" style="padding:8px 18px;min-height:38px;font-size:0.9rem;">下一题 ➜</button>
                </div>
              </div>
            `;
            this.speak(`太棒啦！${ce.enName || ""}，就是${ans.name}！`, { playTapSfx: false });

            const bOpen = document.getElementById("btnArenaOpenArchive");
            if (bOpen) bOpen.addEventListener("click", () => this.onOpenCard(ans.id));
            const bNext = document.getElementById("btnArenaNext");
            if (bNext) bNext.addEventListener("click", () => this.nextRound());
          } else {
            cardBtn.classList.remove("picked-wrong");
            void cardBtn.offsetWidth;
            cardBtn.classList.add("picked-wrong");
            this.streak = 0;
            const streakEl = this.mountEl.querySelector(".live-en-streak-pill");
            if (streakEl) streakEl.textContent = `🔥 连胜：0 题`;
            if (window.SFX) window.SFX.bonk();
            fb.innerHTML = `<div style="color:#fbbf24;font-weight:800;padding:6px;">💡 差一点点哦！点左边的提示按钮听听线索再选吧！</div>`;
          }
        });
      });
    }
  }

  window.CuriosityEnglishModule = {
    mountCardExtensions,
    stopShadowing: () => shadowingEngine.stopAll(),
    LiveEnglishArena
  };
})();
