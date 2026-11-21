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
    const trackMission = opts.trackMission || (() => {});

    if (!Array.isArray(state.unlockedCuriosities)) state.unlockedCuriosities = [];
    if (!Array.isArray(state.wonSpotChallenges)) state.wonSpotChallenges = [];
    if (!Array.isArray(state.wonEnShadowing)) state.wonEnShadowing = [];
    if (!Array.isArray(state.masteredWords)) state.masteredWords = [];
    if (!Array.isArray(state.wonCardSpelling)) state.wonCardSpelling = [];

    const extra = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || null;
    const enCard = window.DUWU_I18N ? window.DUWU_I18N.getCardEn(item.id) : null;
    const en = window.isEn ? window.isEn() : true;
    const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt, { cardId: item.id }) : esc(txt));
    const speakTextSmart = (txt, spOpts) => {
      if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
        window.DoubaoTTS.speakEnglishNarration(txt, spOpts);
      } else {
        speak(txt, spOpts);
      }
    };
    const bi1 = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[item.id]) || null;
    const realVid = (window.REAL_VIDEOS && window.REAL_VIDEOS[item.id]) || null;

    // 1. 挂载实况短片解说与观察互动栏（位于左侧视图切换下方）
    const liveMount = document.getElementById("modalRealVideoCompanion");
    if (liveMount) {
      const liveText = en && enCard && enCard.liveCommentary ? enCard.liveCommentary : (extra && extra.liveCommentary) || "";
      const spotObj = en && enCard && enCard.spotChallenge ? enCard.spotChallenge : (extra && extra.spotChallenge) || null;
      if (realVid || liveText) {
        const spotDone = state.wonSpotChallenges.includes(item.id);
        const isRealisticScene = Boolean(realVid && realVid.kind === "realistic_scene");
        const badgeLabel = en
          ? (realVid ? (isRealisticScene ? "🎨 Illustrated Scene" : "🎥 Real Nature Clip") : "🎙️ Science Guide")
          : (realVid
              ? isRealisticScene ? "🎨 写实动态还原" : realVid.exact ? "🎥 物种真身实况短片" : "🎥 实景近亲/实验实拍"
              : "🎙️ 现场观察导览");
        const tagClass = isRealisticScene ? "realistic_scene" : realVid && realVid.exact ? "exact" : "related";
        const subTitle = en
          ? `${(enCard && enCard.enName) || (extra && extra.enName) || item.name} Discovery`
          : (realVid && realVid.label ? realVid.label : `${item.name}生态观察`);

        liveMount.style.display = "block";
        liveMount.innerHTML = `
          <div class="real-video-companion-card">
            <div class="rv-header-row">
              <div class="rv-badge-group">
                <span class="rv-authentic-tag ${tagClass}">${esc(badgeLabel)}</span>
                <span class="rv-sub-label">${en ? esc(subTitle) : ruby(subTitle)}</span>
              </div>
              <div class="rv-action-btns">
                <button type="button" class="rv-mini-action" id="btnJumpStoryVideo">${en ? "🎬 Story Video" : "🎬 姐姐配音剧场"}</button>
                ${
                  liveText
                    ? `<button type="button" class="rv-mini-action" id="btnPlayLiveCommentary">${en ? "🎙️ Watch & Listen" : "🎙️ 边看边听解说"}</button>`
                    : ""
                }
                ${
                  spotObj
                    ? `<button type="button" class="rv-mini-action spot-btn ${spotDone ? "done" : ""}" id="btnOpenSpotChallenge">
                         ${spotDone ? (en ? "✅ Spotted!" : "✅ 眼力已通关") : (en ? "👀 Detective Quiz (+2⭐)" : "👀 观察小侦探 (+2⭐)")}
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
        if (btnLiveComm && liveText) {
          btnLiveComm.addEventListener("click", () => {
            stopVoiceStudio();
            shadowingEngine.stopAll();
            if (realVid && typeof opts.switchToRealVideo === "function") {
              opts.switchToRealVideo({ muteForNarration: true });
            }
            const sBox = document.getElementById("rvLiveSpeechBox");
            if (!sBox) return;
            sBox.style.display = "block";
            sBox.innerHTML = `
              <div class="kid-voice-bubble tts-reading-scope rv-commentary-bubble">
                <div class="tts-toy-status"></div>
                <div class="tts-clauses-body">🎬 ${en ? flip(liveText) : renderClauses(liveText)}</div>
              </div>
            `;
            const bubble = sBox.querySelector(".kid-voice-bubble");
            if (bubble) {
              bubble.addEventListener("click", (e) => {
                if (e.target.closest(".fw-card")) return;
                speakTextSmart(liveText, {
                  toggleIfPlaying: true,
                  scopeEl: bubble,
                  statusMountEl: sBox.querySelector(".tts-toy-status")
                });
              });
            }
            speakTextSmart(liveText, {
              toggleIfPlaying: true,
              scopeEl: bubble || sBox,
              triggerBtn: btnLiveComm,
              statusMountEl: sBox.querySelector(".tts-toy-status"),
              defaultBtnHTML: en ? "🎙️ Watch & Listen" : "🎙️ 边看边听解说"
            });
          });
        }

        const btnSpot = document.getElementById("btnOpenSpotChallenge");
        if (btnSpot && spotObj) {
          btnSpot.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            stopVoiceStudio();
            const cBox = document.getElementById("rvSpotChallengeBox");
            if (!cBox) return;
            if (cBox.style.display === "block") {
              cBox.style.display = "none";
              return;
            }
            const sc = spotObj;
            cBox.style.display = "block";
            cBox.innerHTML = `
              <div class="card-quiz-box spot-detective-box">
                <div class="card-quiz-question tts-reading-scope" id="spotQuestionScope">
                  <div class="tts-toy-status"></div>
                  <div class="tts-clauses-body">${en ? flip(sc.q) : renderClauses(sc.q)}</div>
                </div>
                <div class="card-quiz-options">
                  ${sc.opts
                    .map(
                      (optTxt, idx) => `
                    <button type="button" class="card-quiz-opt-btn" data-sright="${idx === sc.ans ? "1" : "0"}">
                      ${idx === 0 ? "🔍 A." : "🔍 B."} ${en ? esc(optTxt) : ruby(optTxt)}
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
              qScope.addEventListener("click", (e) => {
                if (e.target.closest(".fw-card")) return;
                speakTextSmart(sc.q, {
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
                    trackMission("knowledge", 1);
                    btnSpot.classList.add("done");
                    btnSpot.textContent = en ? "✅ Spotted! (+2⭐)" : "✅ 眼力已通关 (+2⭐)";
                  }
                  fb.innerHTML = `
                    <div class="kid-voice-bubble tts-reading-scope" style="border-color:#4ade80;background:rgba(74,222,128,0.18);margin-top:6px;">
                      <div class="tts-toy-status"></div>
                      <div class="tts-clauses-body">🎉👁️ ${en ? flip(sc.explain) : renderClauses(sc.explain)}</div>
                    </div>
                  `;
                  const expScope = fb.querySelector(".kid-voice-bubble");
                  speakTextSmart(sc.explain, {
                    scopeEl: expScope || fb,
                    statusMountEl: fb.querySelector(".tts-toy-status"),
                    playTapSfx: false
                  });
                } else {
                  ob.classList.remove("picked-wrong");
                  void ob.offsetWidth;
                  ob.classList.add("picked-wrong");
                  if (window.SFX) window.SFX.bonk();
                  fb.innerHTML = `<div style="font-size:0.84rem;font-weight:800;color:var(--c-warn-text);padding:4px;">${en ? "💡 Look closer at the science clues and try the other choice!" : "💡 再仔细看看短片或照片里的细节，换另一个试试！"}</div>`;
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

    // 1.5 挂载 v6.0/v8.0「🏠 生活中的真实实例 · 大图绘本插画伴读卡」
    const lifeMount = document.getElementById("modalLifeExampleMount");
    if (lifeMount) {
      const lifeStoryTxt = en && enCard && enCard.lifeStory ? enCard.lifeStory : (extra && extra.lifeStory) || "";
      if (lifeStoryTxt) {
        const lifeTitle = en && enCard && enCard.lifeTitle ? enCard.lifeTitle : (extra && extra.lifeTitle) || "🏠 Real-Life Example";
        const lifeTag = en && enCard && enCard.lifeSceneTag ? enCard.lifeSceneTag : (extra && extra.lifeSceneTag) || "Everyday Science";
        const lifeIcon = (extra && extra.lifeIcon) || "🏠✨";
        const illuSrc = (extra && extra.illuSrc) || `assets/illustrations/${item.id}.jpg`;

        lifeMount.style.display = "block";
        lifeMount.innerHTML = `
          <div class="life-example-card ${en ? "storybook-life-card" : ""}">
            <div class="life-example-header">
              <div class="life-example-title-wrap">
                <span class="life-scene-tag">${esc(lifeIcon)} ${esc(lifeTag)}</span>
                <span class="life-example-title">${en ? flip(lifeTitle) : ruby(lifeTitle)}</span>
              </div>
              <button type="button" class="mini-btn on" id="btnSpeakLifeStory" style="padding:6px 13px;font-size:0.82rem;">
                ${en ? "🔊 Listen Story" : "🔊 听生活实例"}
              </button>
            </div>
            ${
              illuSrc
                ? `
              <div class="life-example-illu-wrap ${en ? "storybook-illu-prominent" : ""}" id="lifeIlluTrigger" title="${en ? "Tap illustration to watch narrated story clip" : "点击观看写实插画+姐姐配音生活剧场视频"}">
                <img src="${esc(illuSrc)}" alt="${esc(en && enCard ? enCard.enName : item.name)} illustration" class="life-example-illu-img" loading="lazy" />
                <span class="life-example-play-badge">${en ? "🎬 Tap Picture to Watch Story Clip" : "🎬 点画看配音生活剧场"}</span>
              </div>
            `
                : ""
            }
            <div class="kid-voice-bubble life-example-story-bubble tts-reading-scope" id="lifeStorySpeechScope">
              <div class="tts-toy-status" id="lifeStoryStatusMount"></div>
              <span class="tts-seg" data-tts-seg="${esc(lifeTitle)}." style="display:none;"></span>
              <div class="tts-clauses-body">💡 ${en ? flip(lifeStoryTxt) : renderClauses(lifeStoryTxt)}</div>
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
        const fullLifeSpoken = en ? `${lifeTitle}. ${lifeStoryTxt}` : `${lifeTitle}。${lifeStoryTxt}`;
        const triggerLifeSpeak = () => {
          stopVoiceStudio();
          shadowingEngine.stopAll();
          const vEl = document.getElementById("modalActionVideo");
          if (vEl && !vEl.paused) vEl.pause();
          speakTextSmart(fullLifeSpoken, {
            toggleIfPlaying: true,
            scopeEl: lifeScope,
            triggerBtn: btnLife,
            statusMountEl: document.getElementById("lifeStoryStatusMount"),
            defaultBtnHTML: en ? "🔊 Listen Story" : "🔊 听生活实例"
          });
        };
        if (btnLife) btnLife.addEventListener("click", triggerLifeSpeak);
        if (lifeScope) lifeScope.addEventListener("click", (e) => {
          if (e.target.closest(".fw-card")) return;
          if (!en) triggerLifeSpeak();
        });
      } else {
        lifeMount.style.display = "none";
        lifeMount.innerHTML = "";
      }
    }

    // 2. 挂载右侧「🙋‍♀️ 好奇宝宝十万个为什么 (3连问)」+「🇬🇧 本卡核心词汇小课堂」
    const rightExtraMount = document.getElementById("modalCuriosityAndEnglishMount");
    if (!rightExtraMount || !extra) return;

    const curiosities = en && enCard && Array.isArray(enCard.curiosities) && enCard.curiosities.length
      ? enCard.curiosities
      : (Array.isArray(extra.curiosities) ? extra.curiosities : []);
    const unlockedCount = curiosities.filter((_, idx) =>
      state.unlockedCuriosities.includes(`${item.id}_${idx}`)
    ).length;

    // v8.0: Surface KET/PET + Kids-AWL Core Words that appear in or link to this card!
    let cardCoreVocab = [];
    if (Array.isArray(window.CORE_VOCAB_DATA) && window.CORE_VOCAB_DATA.length) {
      const linked = window.CORE_VOCAB_DATA.filter((cv) => Array.isArray(cv.cards) && cv.cards.includes(item.id));
      cardCoreVocab = linked.slice(0, 4);
      if (cardCoreVocab.length < 3 && enCard) {
        const hay = `${enCard.summary || ""} ${enCard.lifeStory || ""}`.toLowerCase();
        const usedW = new Set(cardCoreVocab.map((c) => c.w));
        for (const cv of window.CORE_VOCAB_DATA) {
          if (usedW.has(cv.w)) continue;
          if (new RegExp(`\\b${cv.w}\\b`, "i").test(hay)) {
            usedW.add(cv.w);
            cardCoreVocab.push(cv);
            if (cardCoreVocab.length >= 4) break;
          }
        }
      }
    }
    const vocabList = cardCoreVocab.length >= 2
      ? cardCoreVocab.map((cv) => ({ w: cv.w, zh: cv.zh, ipa: cv.ipa, pos: cv.pos, level: cv.level, theme: cv.theme, ex: cv.ex, enDef: cv.enDef, icon: "⭐" }))
      : (Array.isArray(extra.vocab) ? extra.vocab : []);

    const enScene = extra.enScene || null;
    const shadowWon = state.wonEnShadowing.includes(item.id);
    const spellWon = state.wonCardSpelling.includes(item.id);
    const masteredSet = new Set(state.masteredWords || []);
    const isEnSlow = Boolean(window.DoubaoTTS && window.DoubaoTTS.enSlowMode);

    rightExtraMount.innerHTML = `
      <!-- 模块 A：小朋友最好奇的「十万个为什么 / Curious Why?」深度故事区 -->
      <div class="curiosity-panel-card">
        <div class="curiosity-header">
          <div>
            <span class="curiosity-title">🙋‍♀️ ${en ? "Curious Why? (3 Fun Secrets)" : "好奇宝宝「十万个为什么」"}</span>
            <span class="curiosity-count-pill" id="curiosityProgressBadge">💡 ${en ? `Unlocked ${unlockedCount}/${curiosities.length}` : `已解锁 ${unlockedCount}/${curiosities.length}`}</span>
          </div>
          <button type="button" class="mini-btn curiosity-playall-btn" id="btnPlayAllStory">
            ${en ? "📻 Listen All 3" : "📻 连讲全部秘密"}
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
                  <span class="cq-text">${en ? esc(c.q) : ruby(c.q)}</span>
                  <span class="cq-arrow">${isLit ? "🔊" : "✨+1⭐"}</span>
                </button>
              `;
            })
            .join("")}
        </div>

        <div id="curiosityAnswerStage"></div>
      </div>

      <!-- 模块 B：🇬🇧 本卡核心词汇课堂（KET/PET + Kids-AWL 核心词卡 + 拼词闯关 + 开口跟读） -->
      <div class="english-explorer-card">
        <div class="en-explorer-header">
          <div class="en-species-badge" id="btnSpeakEnSpecies" title="Tap to hear species name">
            <span class="en-flag-chip">${en ? "⭐ Core Words" : "🇬🇧 核心词卡"}</span>
            <span class="en-species-name">${esc(extra.enName || "")}</span>
            ${extra.enPron ? `<span class="en-species-pron">${esc(extra.enPron)}</span>` : ""}
            <span class="en-tap-horn">🔊</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="mini-btn ${isEnSlow ? "on" : ""}" id="btnCardEnSlow" style="padding:5px 10px;min-height:34px;font-size:0.78rem;">
              ${isEnSlow ? (en ? "🐢 Slow" : "🐢 慢速") : (en ? "🐇 Normal" : "🐇 常速")}
            </button>
            ${
              vocabList.length > 0
                ? `<button type="button" class="en-spell-entry-btn ${spellWon ? "won" : ""}" id="btnToggleCardSpell">
                     🧩 ${spellWon ? (en ? "Spelled 🌟" : "拼词已通关 🌟") : (en ? "Spell Challenge (+2⭐)" : "拼词闯关 (+2⭐)")}
                   </button>`
                : ""
            }
            <button type="button" class="en-shadow-entry-btn ${shadowWon ? "won" : ""}" id="btnToggleShadowing">
              🎙️ ${shadowWon ? (en ? "Spoken 🌟" : "跟读已摘星 🌟") : (en ? "Speak Aloud (+2⭐)" : "我来开口读 (+2⭐)")}
            </button>
          </div>
        </div>

        <!-- 本卡核心词汇点读卡（彩色矢量图标 + KET/PET 级别标） -->
        <div class="en-vocab-grid">
          ${vocabList
            .map((v, vIdx) => {
              const vKey = String(v.w || "").toLowerCase();
              const isMast = masteredSet.has(vKey) || (window.WordBox && window.WordBox.getCoreProgress(vKey).mastered);
              const svgIcon = (v.theme && window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[v.theme]) || "";
              return `
            <button type="button" class="en-vocab-pill ${isMast ? "is-mastered" : ""}" data-vidx="${vIdx}" data-vkey="${esc(vKey)}">
              ${isMast ? `<span class="ev-mastered-dot" title="Mastered">✓</span>` : ""}
              ${v.level ? `<span class="wb-lvl-tag ev-lvl lvl-${esc(v.level).toLowerCase()}">${esc(v.level)}</span>` : ""}
              <span class="ev-icon">${svgIcon || v.icon || "🔤"}</span>
              <span class="ev-word">${esc(v.w)}</span>
              ${v.ipa ? `<span class="ev-ipa">${esc(v.ipa)}</span>` : ""}
              <span class="ev-zh">${esc(v.zh)}</span>
            </button>
          `;
            })
            .join("")}
        </div>
        <div id="enVocabExampleToast" class="en-vocab-toast" style="display:none;"></div>

        <!-- 🧩 本卡核心词字母积木拼词台 -->
        <div id="enCardSpellStage" class="en-card-spell-stage" style="display:none;"></div>

        ${
          enScene && enScene.en
            ? `
          <div class="en-scene-sentence-box tts-reading-scope" id="enSceneSentenceBox">
            <div class="tts-toy-status"></div>
            <div class="en-scene-top">
              <span class="bilingual-tag">🇬🇧 ${en ? "Key Science Sentence" : "实况情景句 ×2遍"}</span>
              <span style="font-size:0.75rem;color:var(--text-muted);font-weight:800;">${en ? "👆 Tap words to flip · tap card to listen" : "👆 点句子跟读"}</span>
            </div>
            <div class="en-scene-en">${en ? flip(enScene.en) : highlightWords(enScene.en, enScene.kw)}</div>
            ${!en ? `<div class="en-scene-zh">${ruby(enScene.zh)}</div>` : ""}
          </div>
        `
            : ""
        }

        <!-- 🎙️ 开口说英文互动跟读台 -->
        <div id="enShadowingStage" class="en-shadowing-stage" style="display:none;"></div>
      </div>
    `;

    // 绑定「十万个为什么 / Curious Why?」单题点击展开与朗读
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
        trackMission("knowledge", 1);
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
        if (badge) badge.textContent = en ? `💡 Unlocked ${nowCnt}/${curiosities.length}` : `💡 已解锁 ${nowCnt}/${curiosities.length}`;
      }

      ansStage.innerHTML = `
        <div class="kid-voice-bubble curiosity-answer-bubble tts-reading-scope">
          <div class="tts-toy-status"></div>
          <div class="curiosity-q-echo tts-seg" data-tts-seg="${esc(c.q)}">${c.icon || "💡"} ${en ? flip(c.q) : ruby(c.q)}</div>
          <div class="tts-clauses-body">${en ? flip(c.a) : renderClauses(c.a)}</div>
        </div>
      `;
      const bubble = ansStage.querySelector(".kid-voice-bubble");
      const curSpoken = `${c.q} ${c.a}`;
      if (bubble) {
        bubble.addEventListener("click", (e) => {
          if (e.target.closest(".fw-card")) return;
          speakTextSmart(curSpoken, {
            toggleIfPlaying: true,
            scopeEl: bubble,
            statusMountEl: ansStage.querySelector(".tts-toy-status")
          });
        });
      }
      speakTextSmart(curSpoken, {
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

    // 绑定「📻 连讲全部秘密 / Listen All 3」
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
        if (badge) badge.textContent = en ? `💡 Unlocked ${curiosities.length}/${curiosities.length}` : `💡 已解锁 ${curiosities.length}/${curiosities.length}`;

        const combinedParagraphs = curiosities
          .map((c, i) => (en ? `Secret ${i + 1}: ${c.q} ${c.a}` : `秘密${i + 1}：${c.q}${c.a}`))
          .join(" ");
        const trimmedStory = en ? combinedParagraphs : combinedParagraphs.slice(0, 560);

        ansStage.innerHTML = `
          <div class="kid-voice-bubble curiosity-answer-bubble tts-reading-scope">
            <div class="tts-toy-status"></div>
            <div class="tts-clauses-body">📻 ${en ? flip(trimmedStory) : renderClauses(trimmedStory)}</div>
          </div>
        `;
        const bubble = ansStage.querySelector(".kid-voice-bubble");
        speakTextSmart(trimmedStory, {
          toggleIfPlaying: true,
          scopeEl: bubble || ansStage,
          triggerBtn: btnPlayAll,
          statusMountEl: ansStage.querySelector(".tts-toy-status"),
          defaultBtnHTML: en ? "📻 Listen All 3" : "📻 连讲全部秘密"
        });
      });
    }

    // 绑定卡片内英语语速切换 (🐢 慢速 / 🐇 常速)
    const btnCardEnSlow = document.getElementById("btnCardEnSlow");
    if (btnCardEnSlow) {
      btnCardEnSlow.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        const nextSlow = !(window.DoubaoTTS && window.DoubaoTTS.enSlowMode);
        if (window.DoubaoTTS) window.DoubaoTTS.enSlowMode = nextSlow;
        btnCardEnSlow.classList.toggle("on", nextSlow);
        btnCardEnSlow.textContent = nextSlow ? "🐢 慢速" : "🐇 常速";
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
        if (window.DoubaoTTS && window.DoubaoTTS.enSlowMode && window.DoubaoTTS.speakEnglish) {
          window.DoubaoTTS.speakEnglish(extra.enName, { slow: true, repeat: 2 });
          return;
        }
        const text = `${extra.enName}! ${extra.enName}! ${item.name}！`;
        speak(text, {
          toggleIfPlaying: true,
          segments: [{ el: btnEnSpecies, text }]
        });
      });
    }

    // 绑定 3 张科学单词点读卡（使用纯正英文+中文+英文例句分轨朗读！）
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

        if (vocabToast) {
          vocabToast.style.display = "block";
          vocabToast.innerHTML = `
            <span class="ev-toast-word">${v.icon || "🔤"} <strong>${esc(v.w)}</strong>（${esc(v.zh)}）</span>
            ${v.ex ? `<span class="ev-toast-ex">例句：<em>${esc(v.ex)}</em></span>` : ""}
            ${v.ex ? `<button type="button" class="mini-btn" id="btnVocabSlowEx" style="padding:3px 9px;min-height:28px;font-size:0.75rem;margin-left:auto;">🐢 慢速听例句</button>` : ""}
          `;
          const bSlowEx = document.getElementById("btnVocabSlowEx");
          if (bSlowEx) {
            bSlowEx.addEventListener("click", (ev) => {
              ev.stopPropagation();
              if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
                window.DoubaoTTS.speakEnglish(v.ex, { slow: true, repeat: 1 });
              }
            });
          }
        }
        if (window.DoubaoTTS && window.DoubaoTTS.speakBilingualWord) {
          window.DoubaoTTS.speakBilingualWord(v.w, v.zh, v.ex);
        } else {
          const spoken = `${v.w}! ${v.w}! ${v.zh}！${v.ex || ""}`;
          speak(spoken, {
            toggleIfPlaying: true,
            segments: [{ el: pill, text: spoken }]
          });
        }
      });
    });

    // 绑定「🧩 拼词闯关 (+2⭐)」本卡 3 词字母积木拼词台
    const btnToggleSpell = document.getElementById("btnToggleCardSpell");
    const spellStage = document.getElementById("enCardSpellStage");
    if (btnToggleSpell && spellStage && vocabList.length > 0) {
      let curSpellIdx = 0;
      const doneInCard = new Set();
      vocabList.forEach((vv, idx) => {
        if ((state.masteredWords || []).includes(String(vv.w || "").toLowerCase())) {
          doneInCard.add(idx);
        }
      });
      let tiles = [];
      let slots = [];
      let solvedCur = false;
      let wrongSet = new Set();
      let spellDecoyOn = true;

      const setupWord = (idx) => {
        curSpellIdx = idx;
        const v = vocabList[idx];
        const letters = String(v.w || "").toLowerCase().replace(/[^a-z]/g, "").split("");
        let poolChars = letters.slice();
        if (spellDecoyOn && window.EnglishDistractorEngine && window.EnglishDistractorEngine.pickConfusableLetters) {
          poolChars = poolChars.concat(window.EnglishDistractorEngine.pickConfusableLetters(letters.join(""), 3, true));
        }
        const shuf = poolChars.slice().sort(() => Math.random() - 0.5);
        if (letters.length >= 3 && shuf.slice(0, letters.length).join("") === letters.join("")) shuf.reverse();
        tiles = shuf.map((ch, i) => ({ id: i, ch, used: false }));
        slots = letters.map(() => null);
        solvedCur = false;
        wrongSet = new Set();
      };

      const renderCardSpell = () => {
        const v = vocabList[curSpellIdx];
        if (!v) return;
        const target = String(v.w || "").toLowerCase().replace(/[^a-z]/g, "");
        const hasWrong = wrongSet.size > 0;
        spellStage.innerHTML = `
          <div class="shadow-mode-tabs">
            ${vocabList
              .map((vv, i) => {
                const isDone = doneInCard.has(i) || (state.masteredWords || []).includes(String(vv.w || "").toLowerCase());
                return `
                  <button type="button" class="shadow-tab-pill ${i === curSpellIdx ? "active" : ""}" data-cspidx="${i}">
                    ${isDone ? "✅" : vv.icon || "🔤"} 第${i + 1}词 · ${esc(vv.zh)}
                  </button>
                `;
              })
              .join("")}
          </div>
          <div class="card-spell-prompt">
            <span>${v.icon || "🔤"} 拼出「<strong>${esc(v.zh)}</strong>」（${target.length} 字母${spellDecoyOn ? " · 含3干扰" : ""}）</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" class="mini-btn ${spellDecoyOn ? "on" : ""}" id="btnCardSpellDecoy" style="padding:4px 9px;min-height:30px;font-size:0.76rem;">
                ${spellDecoyOn ? "🔥 +3干扰" : "🌱 无干扰"}
              </button>
              <button type="button" class="mini-btn on" id="btnCardSpellHear" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">🔊 听读音</button>
            </div>
          </div>
          <div class="wb-slots-row compact ${solvedCur ? "solved" : ""} ${hasWrong ? "shake-row" : ""}">
            ${slots
              .map((s, si) => {
                const cls = solvedCur
                  ? "slot-solved"
                  : wrongSet.has(si)
                  ? "slot-wrong"
                  : hasWrong && s && !wrongSet.has(si)
                  ? "slot-right"
                  : s && s.isHint
                  ? "slot-hint"
                  : s
                  ? "slot-filled"
                  : "slot-empty";
                return `<button type="button" class="wb-letter-slot compact ${cls}" data-cspslot="${si}">${s ? esc(s.ch.toUpperCase()) : ""}</button>`;
              })
              .join("")}
          </div>
          <div class="wb-tiles-tray compact">
            ${tiles
              .map(
                (t) => `
              <button type="button" class="wb-letter-tile compact ${t.used ? "used" : ""}" data-csptile="${t.id}" ${t.used ? "disabled" : ""}>
                ${esc(t.ch.toUpperCase())}
              </button>
            `
              )
              .join("")}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px;justify-content:space-between;">
            ${
              solvedCur
                ? `<span style="color:var(--c-ok-text);font-weight:900;font-size:0.88rem;">🎉 拼对啦！<strong>${esc(v.w)}</strong> = ${esc(v.zh)}！</span>
                   ${
                     curSpellIdx + 1 < vocabList.length
                       ? `<button type="button" class="big-action-btn" id="btnCardSpellNext" style="padding:6px 14px;min-height:34px;font-size:0.82rem;">拼下一个词 ➜</button>`
                       : `<span style="color:var(--c-gold-text);font-weight:900;font-size:0.84rem;">🏆 本卡 3 词全部拼通啦！</span>`
                   }`
                : `<div style="display:flex;gap:6px;flex-wrap:wrap;">
                     <button type="button" class="mini-btn on" id="btnCardSpellHint" style="padding:4px 10px;min-height:32px;font-size:0.78rem;">💡 提示字母</button>
                     <button type="button" class="mini-btn" id="btnCardSpellReset" style="padding:4px 10px;min-height:32px;font-size:0.78rem;">🔄 重拼</button>
                   </div>
                   ${hasWrong ? `<span style="color:var(--c-warn-text);font-weight:800;font-size:0.8rem;">点橙色格子退回字母再试试～</span>` : ""}`
            }
          </div>
        `;

        spellStage.querySelectorAll("[data-cspidx]").forEach((b) => {
          b.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            setupWord(parseInt(b.getAttribute("data-cspidx"), 10) || 0);
            renderCardSpell();
          });
        });

        const bDecoy = document.getElementById("btnCardSpellDecoy");
        if (bDecoy) {
          bDecoy.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            spellDecoyOn = !spellDecoyOn;
            setupWord(curSpellIdx);
            renderCardSpell();
          });
        }

        const bHear = document.getElementById("btnCardSpellHear");
        if (bHear) {
          bHear.addEventListener("click", () => {
            if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
              window.DoubaoTTS.speakEnglish(v.w, { repeat: 2 });
            }
          });
        }

        const checkSolved = () => {
          if (slots.some((s) => !s)) return;
          const attempt = slots.map((s) => s.ch).join("");
          if (attempt === target) {
            solvedCur = true;
            wrongSet.clear();
            doneInCard.add(curSpellIdx);
            if (window.SFX) window.SFX.chime();
            if (!state.masteredWords.includes(target)) {
              state.masteredWords.push(target);
              saveState();
            }
            // 点亮上方单词卡的已掌握绿勾
            const pillEl = rightExtraMount.querySelector(`.en-vocab-pill[data-vkey="${target}"]`);
            if (pillEl && !pillEl.classList.contains("is-mastered")) {
              pillEl.classList.add("is-mastered");
              const dot = document.createElement("span");
              dot.className = "ev-mastered-dot";
              dot.textContent = "✓";
              pillEl.prepend(dot);
            }
            trackMission("words", 1);
            if (window.DoubaoTTS && window.DoubaoTTS.speakBilingualWord) {
              window.DoubaoTTS.speakBilingualWord(v.w, v.zh, v.ex, { includeZh: false, playTapSfx: false });
            }
            if (doneInCard.size >= vocabList.length && !state.wonCardSpelling.includes(item.id)) {
              state.wonCardSpelling.push(item.id);
              saveState();
              addStars(2);
              btnToggleSpell.classList.add("won");
              btnToggleSpell.innerHTML = "🧩 拼词已通关 🌟";
              if (window.PlaygroundFX) window.PlaygroundFX.celebrate(spellStage);
            }
          } else {
            wrongSet.clear();
            for (let i = 0; i < target.length; i++) {
              if (slots[i] && slots[i].ch !== target[i]) wrongSet.add(i);
            }
            if (window.SFX) window.SFX.bonk();
          }
        };

        spellStage.querySelectorAll("[data-csptile]").forEach((tb) => {
          tb.addEventListener("click", () => {
            if (solvedCur) return;
            const tid = parseInt(tb.getAttribute("data-csptile"), 10);
            const tile = tiles.find((t) => t.id === tid && !t.used);
            const eIdx = slots.findIndex((s) => !s);
            if (!tile || eIdx === -1) return;
            if (window.SFX) window.SFX.pop();
            tile.used = true;
            slots[eIdx] = { tileId: tile.id, ch: tile.ch, isHint: false };
            wrongSet.clear();
            checkSolved();
            renderCardSpell();
          });
        });

        spellStage.querySelectorAll("[data-cspslot]").forEach((sb) => {
          sb.addEventListener("click", () => {
            if (solvedCur) return;
            const si = parseInt(sb.getAttribute("data-cspslot"), 10);
            const s = slots[si];
            if (!s || s.isHint) return;
            if (window.SFX) window.SFX.pop();
            const tile = tiles.find((t) => t.id === s.tileId);
            if (tile) tile.used = false;
            slots[si] = null;
            wrongSet.clear();
            renderCardSpell();
          });
        });

        const bHint = document.getElementById("btnCardSpellHint");
        if (bHint) {
          bHint.addEventListener("click", () => {
            let idx = -1;
            for (let i = 0; i < target.length; i++) {
              if (!slots[i] || slots[i].ch !== target[i]) {
                idx = i;
                break;
              }
            }
            if (idx === -1) return;
            if (slots[idx]) {
              const old = tiles.find((t) => t.id === slots[idx].tileId);
              if (old) old.used = false;
              slots[idx] = null;
            }
            let tile = tiles.find((t) => !t.used && t.ch === target[idx]);
            if (!tile) {
              for (let j = idx + 1; j < slots.length; j++) {
                if (slots[j] && !slots[j].isHint && slots[j].ch === target[idx]) {
                  tile = tiles.find((t) => t.id === slots[j].tileId);
                  slots[j] = null;
                  if (tile) tile.used = false;
                  break;
                }
              }
            }
            if (!tile) return;
            if (window.SFX) window.SFX.pop();
            tile.used = true;
            slots[idx] = { tileId: tile.id, ch: tile.ch, isHint: true };
            wrongSet.clear();
            checkSolved();
            renderCardSpell();
          });
        }

        const bReset = document.getElementById("btnCardSpellReset");
        if (bReset) {
          bReset.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            setupWord(curSpellIdx);
            renderCardSpell();
          });
        }

        const bNext = document.getElementById("btnCardSpellNext");
        if (bNext) {
          bNext.addEventListener("click", () => {
            if (window.SFX) window.SFX.pop();
            setupWord(curSpellIdx + 1);
            renderCardSpell();
          });
        }
      };

      btnToggleSpell.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        if (spellStage.style.display === "block") {
          spellStage.style.display = "none";
        } else {
          spellStage.style.display = "block";
          setupWord(0);
          renderCardSpell();
        }
      });
    }

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
                if (fbBox) fbBox.innerHTML = `<span style="color:var(--c-err-text);font-weight:900;">${esc(msg)}</span>`;
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
                  trackMission("words", 1);
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
                  trackMission("words", 1);
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
                if (fbBox) fbBox.innerHTML = `<span style="color:var(--c-warn-text);font-weight:800;">💡 ${esc(msg)}</span>`;
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
      this.onTrackMission = this.opts.onTrackMission || (() => {});
      this.onMasterWord = this.opts.onMasterWord || (() => {});

      this.mode = "live_guess"; // 'live_guess' | 'en_listen' | 'en_cloze'
      this.streak = 0;
      this.currentAnswer = null;
      this.choices = [];
      this.answered = false;
      this.clozeData = null;
      this.clozeShowZh = false;
      this.enBlindListen = false;
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

    _buildWordRegex(word) {
      const raw = String(word || "").trim().toLowerCase();
      const escW = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const forms = [escW(raw) + "(?:s|es|ed|ing)?"];
      if (raw.endsWith("y") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "(?:ies|ied)");
      if (raw.endsWith("f") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "ves");
      if (raw.endsWith("fe") && raw.length > 3) forms.push(escW(raw.slice(0, -2)) + "ves");
      if (raw.endsWith("e") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "(?:ed|ing)");
      return new RegExp(`\\b(?:${forms.join("|")})\\b`, "i");
    }

    _getClozePool() {
      const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
      const out = [];
      for (const item of window.CATALOG_DATA || []) {
        const ce = ceMap[item.id];
        if (!ce || !Array.isArray(ce.vocab)) continue;
        for (const v of ce.vocab) {
          if (!v || !v.w || !v.ex) continue;
          const re = this._buildWordRegex(v.w);
          if (re.test(v.ex)) {
            out.push({ item, vocab: v, re });
          }
        }
      }
      return out;
    }

    nextRound() {
      if (this.mode === "en_cloze") {
        const pool = this._getClozePool();
        if (pool.length < 4) return;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        let distractors = [];
        if (window.EnglishDistractorEngine && window.EnglishDistractorEngine.pickConfusableVocab) {
          const allVocabObjs = pool.map((p) => ({
            ...p.vocab,
            key: String(p.vocab.w || "").toLowerCase(),
            chapter: p.item.chapter
          }));
          const targetObj = {
            ...pick.vocab,
            key: String(pick.vocab.w || "").toLowerCase(),
            chapter: pick.item.chapter
          };
          distractors = window.EnglishDistractorEngine.pickConfusableVocab(targetObj, allVocabObjs, 3);
        }
        if (distractors.length < 3) {
          const seenW = new Set([pick.vocab.w.toLowerCase(), ...distractors.map((d) => d.w.toLowerCase())]);
          const shuffled = pool.slice().sort(() => Math.random() - 0.5);
          for (const c of shuffled) {
            const low = c.vocab.w.toLowerCase();
            if (!seenW.has(low)) {
              seenW.add(low);
              distractors.push(c.vocab);
              if (distractors.length >= 3) break;
            }
          }
        }
        this.currentAnswer = pick.item;
        this.clozeShowZh = false;
        this.clozeData = {
          vocab: pick.vocab,
          re: pick.re,
          options: [pick.vocab, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5)
        };
        this.answered = false;
        this.render();
        setTimeout(() => this._playEnglishPrompt(false), 180);
        return;
      }

      this.clozeData = null;
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
      let distractors = [];
      if (window.EnglishDistractorEngine && window.EnglishDistractorEngine.pickConfusableSpecies) {
        distractors = window.EnglishDistractorEngine.pickConfusableSpecies(ans, pool, 3);
      } else {
        distractors = pool
          .filter((x) => x.id !== ans.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }

      this.currentAnswer = ans;
      this.choices = [ans, ...distractors].sort(() => Math.random() - 0.5);
      this.answered = false;
      this.render();

      if (this.mode === "en_listen") {
        setTimeout(() => this._playEnglishPrompt(false), 180);
      }
    }

    _playEnglishPrompt(slow) {
      const ans = this.currentAnswer;
      if (!ans) return;
      if (this.mode === "en_cloze" && this.clozeData && this.clozeData.vocab) {
        const ex = this.clozeData.vocab.ex;
        if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
          window.DoubaoTTS.speakEnglish(ex, { slow: Boolean(slow), repeat: 1 });
        } else {
          this.speak(ex);
        }
        return;
      }
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[ans.id]) || {};
      const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[ans.id]) || {};
      const clueEn = (ce.enScene && ce.enScene.en) || bi.en || "";
      const spoken = `${ce.enName || ""}! ${ce.enName || ""}! ${clueEn}`;
      if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
        window.DoubaoTTS.speakEnglish(spoken, { slow: Boolean(slow), repeat: 1 });
      } else {
        this.speak(spoken);
      }
    }

    render() {
      if (!this.mountEl || !this.currentAnswer) return;
      const ans = this.currentAnswer;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[ans.id]) || {};
      const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[ans.id]) || {};
      const rv = (window.REAL_VIDEOS && window.REAL_VIDEOS[ans.id]) || null;
      const clueEn = (ce.enScene && ce.enScene.en) || bi.en || "";
      const clueKw = (ce.enScene && ce.enScene.kw) || bi.kw || [];
      const ansPhoto = this.getPhoto(ans.id);

      const isCloze = this.mode === "en_cloze" && this.clozeData;
      const clozeHtml = isCloze
        ? esc(this.clozeData.vocab.ex).replace(
            this._buildWordRegex(this.clozeData.vocab.w),
            `<span class="wb-blank-pill">______</span>`
          )
        : "";

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
              <button type="button" class="scene-pill ${this.mode === "en_cloze" ? "active" : ""}" data-lemode="en_cloze">
                🧩 模式C：听句填词 · 科学单词闪电战
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
                  : isCloze
                  ? `
                <div class="live-en-audio-box">
                  ${ansPhoto ? `<img src="${esc(ansPhoto)}" alt="" style="width:92px;height:92px;object-fit:cover;border-radius:18px;border:2px solid var(--c-teal);margin-bottom:8px;" />` : `<div style="font-size:3rem;margin-bottom:6px;">${this.clozeData.vocab.icon || "🧩"}</div>`}
                  <div style="font-size:0.86rem;color:var(--c-teal);font-weight:900;margin-bottom:6px;">
                    来自【${this.ruby(ans.name)} · ${esc(ce.enName || "")}】的科学例句：
                  </div>
                  <div class="live-en-sentence" style="font-size:1.14rem;">${clozeHtml}</div>
                  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
                    <button type="button" class="big-action-btn" id="btnReplayEnClue" style="padding:9px 18px;min-height:40px;font-size:0.9rem;">
                      🔊 再听整句
                    </button>
                    <button type="button" class="mini-btn on" id="btnReplayEnSlow">
                      🐢 慢速细听
                    </button>
                  </div>
                </div>
              `
                  : `
                <div class="live-en-audio-box">
                  <div style="font-size:3rem;margin-bottom:6px;">🇬🇧🎧</div>
                  <div style="font-size:0.9rem;color:var(--c-teal-text);font-weight:900;margin-bottom:6px;">
                    ${this.enBlindListen && !this.answered ? "🎧 纯听盲猜模式：只靠耳朵听懂英文线索！" : "仔细听英文名字与线索，在右边同家族易混选项中找出主角！"}
                  </div>
                  ${
                    this.enBlindListen && !this.answered
                      ? `<div class="live-en-big-word" style="letter-spacing:0.12em;">🎧 • • • ? • • •</div>`
                      : `<div class="live-en-big-word">${esc(ce.enName || "Mystery Creature")}</div>
                         ${ce.enPron ? `<div style="color:var(--text-muted);font-size:0.86rem;margin-bottom:8px;">${esc(ce.enPron)}</div>` : ""}
                         <div class="live-en-sentence">${highlightWords(clueEn, clueKw)}</div>`
                  }
                  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
                    <button type="button" class="big-action-btn" id="btnReplayEnClue" style="padding:9px 18px;min-height:40px;font-size:0.9rem;">
                      🔊 再听一遍口令
                    </button>
                    <button type="button" class="mini-btn on" id="btnReplayEnSlow">
                      🐢 慢速清晰听
                    </button>
                    <button type="button" class="mini-btn ${this.enBlindListen ? "on" : ""}" id="btnToggleBlindListen">
                      ${this.enBlindListen ? "👁️ 显示英文文字" : "🎧 纯听挑战"}
                    </button>
                  </div>
                </div>
              `
              }
            </div>

            <!-- 右侧四选一选项 -->
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                <h3 style="margin:0;font-size:1.18rem;">
                  ${
                    this.mode === "live_guess"
                      ? "🕵️‍♀️ 镜头里的真实主角是哪一位？"
                      : isCloze
                      ? "🧩 听读音 + 辨形近词：横线里缺的是哪个英文词？"
                      : "🇬🇧 这句英语说的是下面哪一位？"
                  }
                </h3>
                ${
                  isCloze && !this.answered
                    ? this.clozeShowZh
                      ? `<span class="mini-btn on" style="pointer-events:none;">💡 词义：${esc(this.clozeData.vocab.zh)}</span>`
                      : `<button type="button" class="mini-btn" id="btnClozeHintZh" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">💡 偷看词义提示</button>`
                    : ""
                }
              </div>
              <div class="live-en-choices-grid">
                ${
                  isCloze
                    ? this.clozeData.options
                        .map(
                          (vo, oIdx) => `
                        <button type="button" class="live-en-choice-card cloze-opt-card" data-cword="${esc(vo.w.toLowerCase())}">
                          <div class="lec-thumb lec-letter-badge">${["A", "B", "C", "D"][oIdx] || "•"}</div>
                          <div class="lec-meta">
                            <div class="lec-name cloze-opt-word">${esc(vo.w)}</div>
                            <div class="lec-sub cloze-opt-reveal">${this.answered ? `${vo.icon || ""} ${esc(vo.zh)}` : "🎧 辨音选词"}</div>
                          </div>
                        </button>
                      `
                        )
                        .join("")
                    : this.choices
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
                        .join("")
                }
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
        const masked = String(ce.liveCommentary).split(ans.name).join("这位神秘主角");
        btnVoiceHint.addEventListener("click", () => this.speak(masked));
      }

      const btnEnHint = document.getElementById("btnArenaEnHint");
      if (btnEnHint && ce.enName) {
        btnEnHint.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(ce.enName, { repeat: 2 });
          } else {
            this.speak(`${ce.enName}! ${ce.enName}!`);
          }
        });
      }

      const btnReplay = document.getElementById("btnReplayEnClue");
      if (btnReplay) btnReplay.addEventListener("click", () => this._playEnglishPrompt(false));
      const btnReplaySlow = document.getElementById("btnReplayEnSlow");
      if (btnReplaySlow) btnReplaySlow.addEventListener("click", () => this._playEnglishPrompt(true));
      const btnBlind = document.getElementById("btnToggleBlindListen");
      if (btnBlind) {
        btnBlind.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.enBlindListen = !this.enBlindListen;
          this.render();
        });
      }
      const btnClozeHint = document.getElementById("btnClozeHintZh");
      if (btnClozeHint) {
        btnClozeHint.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.clozeShowZh = true;
          this.render();
        });
      }

      if (isCloze) {
        const rightW = this.clozeData.vocab.w.toLowerCase();
        const optMap = new Map(this.clozeData.options.map((o) => [o.w.toLowerCase(), o]));
        this.mountEl.querySelectorAll(".cloze-opt-card").forEach((optBtn) => {
          optBtn.addEventListener("click", () => {
            const picked = optBtn.getAttribute("data-cword");
            const fb = document.getElementById("liveEnArenaFeedback");
            if (!fb) return;
            if (picked === rightW) {
              optBtn.classList.add("picked-right");
              // 答对后把 4 个形近词的真实中文意思全部揭示出来，顺带一网打尽！
              this.mountEl.querySelectorAll(".cloze-opt-card").forEach((btn) => {
                const wObj = optMap.get(btn.getAttribute("data-cword"));
                const sub = btn.querySelector(".cloze-opt-reveal");
                if (wObj && sub) sub.textContent = `${wObj.icon || ""} ${wObj.zh}`;
              });
              if (!this.answered) {
                this.answered = true;
                this.streak += 1;
                this.onWinStars(2);
                this.onTrackMission("words", 1);
                this.onMasterWord(rightW);
                const streakEl = this.mountEl.querySelector(".live-en-streak-pill");
                if (streakEl) streakEl.textContent = `🔥 连胜：${this.streak} 题`;
              }
              if (window.SFX) window.SFX.chime();
              if (window.PlaygroundFX) window.PlaygroundFX.celebrate(optBtn);
              fb.innerHTML = `
                <div class="arena-win-card">
                  <div style="font-weight:900;font-size:1rem;color:var(--c-ok-text);">
                    🎉 填词成功 (+2⭐)！<strong>${esc(this.clozeData.vocab.w)}</strong> = ${this.clozeData.vocab.icon || ""} ${esc(this.clozeData.vocab.zh)}！
                  </div>
                  <div class="cloze-win-ex">
                    ${esc(this.clozeData.vocab.ex)}
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
                    <button type="button" class="mini-btn" id="btnArenaOpenArchive">📖 打开原书卡片</button>
                    <button type="button" class="big-action-btn" id="btnArenaNext" style="padding:8px 18px;min-height:38px;font-size:0.9rem;">下一题 ➜</button>
                  </div>
                </div>
              `;
              if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
                window.DoubaoTTS.speakEnglish(this.clozeData.vocab.ex, { playTapSfx: false });
              }
              const bOpen = document.getElementById("btnArenaOpenArchive");
              if (bOpen) bOpen.addEventListener("click", () => this.onOpenCard(ans.id));
              const bNext = document.getElementById("btnArenaNext");
              if (bNext) bNext.addEventListener("click", () => this.nextRound());
            } else {
              const wrongObj = optMap.get(picked);
              if (wrongObj) {
                const sub = optBtn.querySelector(".cloze-opt-reveal");
                if (sub) sub.textContent = `${wrongObj.icon || ""} ${wrongObj.zh}`;
              }
              optBtn.classList.remove("picked-wrong");
              void optBtn.offsetWidth;
              optBtn.classList.add("picked-wrong");
              this.streak = 0;
              const streakEl = this.mountEl.querySelector(".live-en-streak-pill");
              if (streakEl) streakEl.textContent = `🔥 连胜：0 题`;
              if (window.SFX) window.SFX.bonk();
              fb.innerHTML = `<div style="color:var(--c-warn-text);font-weight:800;padding:6px;">💡 ${wrongObj ? `<strong>${esc(wrongObj.w)}</strong> 是「${esc(wrongObj.zh)}」哦！` : ""}再点左边【🐢 慢速细听】分辨形近词！</div>`;
            }
          });
        });
        return;
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
              this.onTrackMission(this.mode === "en_listen" ? "words" : "knowledge", 1);
              const streakEl = this.mountEl.querySelector(".live-en-streak-pill");
              if (streakEl) streakEl.textContent = `🔥 连胜：${this.streak} 题`;
            }
            if (window.SFX) window.SFX.chime();
            const vocabChips = (ce.vocab || [])
              .map((v) => `<span class="arena-mini-vocab">${v.icon || ""} ${esc(v.w)} ${esc(v.zh)}</span>`)
              .join("");

            fb.innerHTML = `
              <div class="arena-win-card">
                <div style="font-weight:900;font-size:1rem;color:var(--c-ok-text);">
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
            fb.innerHTML = `<div style="color:var(--c-warn-text);font-weight:800;padding:6px;">💡 差一点点哦！点左边的提示按钮听听线索再选吧！</div>`;
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
