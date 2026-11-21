// ============================================================================
// 《奇妙毒物科学游乐园》随时互动语音伙伴 (DOUDOU New API · DeepSeek + 豆包语音朗读)
// 功能亮点：
//   1. 讲百科或逛游乐园时，随时点击【🎤 随时互动】按钮即可跟 AI 说话提问。
//   2. 支持浏览器实时语音识别 (Web Speech API 说完自动发送) + 快捷问题气泡 + 键盘/听写输入。
//   3. 后端调用 DOUDOU New API (DeepSeek-V4.1-Flash)，结合当前打开的百科卡片上下文回答，
//      并在回答中自然穿插一句适合8岁小朋友跟读的英文短句。
//   4. 回答生成后自动调用豆包语音朗读，同样具备等待过渡动画、逐句字体放大高亮与永久缓存！
// ============================================================================

(function () {
  class InteractiveAICompanion {
    constructor(options) {
      const opts = options || {};
      this.ruby = typeof opts.ruby === "function" ? opts.ruby : (s) => s;
      this.getCurrentCard = typeof opts.getCurrentCard === "function" ? opts.getCurrentCard : () => null;
      this.onStopOtherAudio = typeof opts.onStopOtherAudio === "function" ? opts.onStopOtherAudio : () => {};

      this.isOpen = false;
      this.isListening = false;
      this.isThinking = false;
      this.recognition = null;
      this.silenceTimer = null;
      this.liveTranscript = "";
      this.history = []; // [{ role: "user"|"assistant", content: "..." }]
      this.activeCard = null;
      this.reqSeq = 0;
      this.chatLang = window.isEn && window.isEn() ? "en" : "zh"; // v8.0 default follows global EN/ZH mode

      this._initDOM();
      this._initSpeechRecognition();
      window.addEventListener("duwu:langchange", () => {
        const en = window.isEn && window.isEn();
        this.chatLang = en ? "en" : "zh";
        const fabTxt = document.querySelector("#fabAiCompanion .ai-fab-text");
        if (fabTxt) fabTxt.textContent = en ? "Ask Frog AI" : "随时互动";
        if (typeof this._syncLangModeUI === "function") this._syncLangModeUI();
      });
    }

    _initDOM() {
      const en = window.isEn && window.isEn();
      // 1. 右下角全局常驻【🐸 Ask Frog AI / 🎤 随时互动】悬浮按钮（配箭毒蛙小博士头像！）
      const fab = document.createElement("button");
      fab.id = "fabAiCompanion";
      fab.className = "ai-fab-btn";
      fab.type = "button";
      fab.innerHTML = `
        <img src="assets/art/mascot_happy.jpg" alt="Professor Dart" class="ai-fab-mascot" />
        <span class="ai-fab-text">${en ? "Ask Frog AI" : "随时互动"}</span>
      `;
      fab.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        this.open(this.getCurrentCard(), { autoListen: true });
      });
      document.body.appendChild(fab);

      // 2. 随时互动语音问答抽屉弹窗 (层级高于百科闪卡弹窗)
      const backdrop = document.createElement("div");
      backdrop.id = "aiCompanionBackdrop";
      backdrop.className = "ai-companion-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.innerHTML = `
        <div class="ai-companion-panel">
          <div class="ai-companion-header">
            <div class="ai-context-chip" id="aiContextChip">
              <span id="aiContextEmoji" style="font-size:1.45rem;">🧪</span>
              <div>
                <div class="ai-context-title" id="aiContextTitle">随时语音互动</div>
                <div class="ai-context-sub" id="aiContextSub">随时提问 · 边聊百科边学英文</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
              <button type="button" class="mini-btn" id="btnAiLangToggle" title="切换中文百科问答或纯英文外教对话">
                🇬🇧 切英文对话
              </button>
              <button type="button" class="close-circle-btn" id="btnCloseAiCompanion" aria-label="关闭互动面板" style="position:static;width:40px;height:40px;">✕</button>
            </div>
          </div>

          <!-- 对话展示区（带逐句放大高亮与中英穿插胶囊） -->
          <div class="ai-chat-stage" id="aiChatStage">
            <div class="ai-welcome-box" id="aiWelcomeBox">
              <div style="font-size:1.02rem;font-weight:900;color:var(--c-teal);margin-bottom:4px;">
                👋 嗨！对这张百科卡有什么好奇的问题吗？
              </div>
              <div style="font-size:0.88rem;color:var(--text-sub);line-height:1.55;">
                直接点下方麦克风跟 AI 说话，或者点一个快捷问题，我会立刻用语音给你解答，还会顺便教你一句英文哦！
              </div>
            </div>
            <div id="aiTurnContainer"></div>
          </div>

          <!-- 推荐快捷问题气泡 -->
          <div class="ai-quick-chips" id="aiQuickChips"></div>

          <!-- 语音识别实时状态与大麦克风按钮 + 文本输入栏 -->
          <div class="ai-input-dock">
            <div class="ai-voice-bar" id="aiVoiceBar">
              <button type="button" class="ai-mic-hero-btn" id="btnAiMicToggle">
                <span class="ai-mic-ring"></span>
                <span id="aiMicBtnIcon">🎙️</span>
                <span id="aiMicBtnLabel">点我跟 AI 说话</span>
              </button>
              <div class="ai-live-transcript" id="aiLiveTranscript">
                直接说话提问，或点击上方问题气泡 ✨
              </div>
              <button type="button" class="ai-send-voice-btn" id="btnAiSendVoice" style="display:none;">
                ✅ 发送
              </button>
            </div>

            <form class="ai-text-form" id="aiTextForm">
              <input
                type="text"
                id="aiTextInput"
                class="ai-text-input"
                placeholder="也可以在这里打字或用键盘语音输入问题…"
                maxlength="160"
                autocomplete="off"
              />
              <button type="submit" class="big-action-btn ai-text-submit" id="btnAiTextSubmit">
                发送提问
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      this.backdropEl = backdrop;
      this.contextEmojiEl = document.getElementById("aiContextEmoji");
      this.contextTitleEl = document.getElementById("aiContextTitle");
      this.contextSubEl = document.getElementById("aiContextSub");
      this.chatStageEl = document.getElementById("aiChatStage");
      this.welcomeBoxEl = document.getElementById("aiWelcomeBox");
      this.turnContainerEl = document.getElementById("aiTurnContainer");
      this.quickChipsEl = document.getElementById("aiQuickChips");
      this.voiceBarEl = document.getElementById("aiVoiceBar");
      this.micBtnEl = document.getElementById("btnAiMicToggle");
      this.micIconEl = document.getElementById("aiMicBtnIcon");
      this.micLabelEl = document.getElementById("aiMicBtnLabel");
      this.liveTranscriptEl = document.getElementById("aiLiveTranscript");
      this.sendVoiceBtnEl = document.getElementById("btnAiSendVoice");
      this.textFormEl = document.getElementById("aiTextForm");
      this.textInputEl = document.getElementById("aiTextInput");
      this.langToggleBtnEl = document.getElementById("btnAiLangToggle");

      if (this.langToggleBtnEl) {
        this.langToggleBtnEl.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.stopListening({ submitIfText: false });
          this.chatLang = this.chatLang === "zh" ? "en" : "zh";
          if (this.recognition) {
            this.recognition.lang = this.chatLang === "en" ? "en-US" : "zh-CN";
          }
          this._syncLangModeUI();
          this._renderQuickChips(this.activeCard);
        });
      }

      document.getElementById("btnCloseAiCompanion").addEventListener("click", () => this.close());
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.close();
      });

      this.micBtnEl.addEventListener("click", () => {
        if (window.DoubaoTTS) window.DoubaoTTS._ensureAudioContext();
        if (this.isListening) {
          this.stopListening({ submitIfText: true });
        } else {
          this.startListening();
        }
      });

      this.sendVoiceBtnEl.addEventListener("click", () => {
        if (window.DoubaoTTS) window.DoubaoTTS._ensureAudioContext();
        this.stopListening({ submitIfText: true });
      });

      this.textFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        if (window.DoubaoTTS) window.DoubaoTTS._ensureAudioContext();
        const q = (this.textInputEl.value || "").trim();
        if (!q) return;
        this.textInputEl.value = "";
        this.stopListening({ submitIfText: false });
        this.askQuestion(q);
      });
    }

    _initSpeechRecognition() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this.recognition = null;
        return;
      }
      try {
        const rec = new SR();
        rec.lang = "zh-CN";
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onstart = () => {
          this.isListening = true;
          this.liveTranscript = "";
          this._syncListeningUI();
        };

        rec.onresult = (event) => {
          let interim = "";
          let finalStr = "";
          for (let i = 0; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalStr += res[0].transcript;
            } else {
              interim += res[0].transcript;
            }
          }
          const combined = (finalStr + interim).trim();
          if (combined) {
            this.liveTranscript = combined;
            this.liveTranscriptEl.textContent = `🗣️ “${combined}”`;
            this.liveTranscriptEl.classList.add("has-text");
            this.sendVoiceBtnEl.style.display = "inline-flex";

            if (this.silenceTimer) clearTimeout(this.silenceTimer);
            this.silenceTimer = setTimeout(() => {
              if (this.isListening && this.liveTranscript.trim()) {
                this.stopListening({ submitIfText: true });
              }
            }, 1350);
          }
        };

        rec.onerror = () => {
          this.isListening = false;
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
          this._syncListeningUI("语音未听清，可再点麦克风或点上方问题气泡哦！");
        };

        rec.onend = () => {
          const hadListening = this.isListening;
          this.isListening = false;
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
          this._syncListeningUI();
          const finalQ = (this.liveTranscript || "").trim();
          if (hadListening && finalQ && !this.isThinking) {
            this.liveTranscript = "";
            this.askQuestion(finalQ);
          }
        };

        this.recognition = rec;
      } catch (_) {
        this.recognition = null;
      }
    }

    _syncListeningUI(customHint) {
      if (this.isListening) {
        this.voiceBarEl.classList.add("is-listening");
        this.micBtnEl.classList.add("is-listening");
        this.micIconEl.textContent = "⏹️";
        this.micLabelEl.textContent = "正在听你说话…";
        if (!this.liveTranscript) {
          this.liveTranscriptEl.textContent = "🎙️ 请直接说话，说完会自动回答哦…";
          this.liveTranscriptEl.classList.remove("has-text");
        }
      } else {
        this.voiceBarEl.classList.remove("is-listening");
        this.micBtnEl.classList.remove("is-listening");
        this.micIconEl.textContent = "🎙️";
        this.micLabelEl.textContent = "点我跟 AI 说话";
        this.sendVoiceBtnEl.style.display = "none";
        if (!this.liveTranscript) {
          this.liveTranscriptEl.textContent =
            customHint || "直接说话提问，或点击上方问题气泡 ✨";
          this.liveTranscriptEl.classList.remove("has-text");
        }
      }
    }

    startListening() {
      this.onStopOtherAudio();
      if (window.DoubaoTTS) {
        window.DoubaoTTS._ensureAudioContext();
        window.DoubaoTTS.stop();
      }
      if (!this.recognition) {
        this.textInputEl.focus();
        this._syncListeningUI("当前浏览器可直接用下方输入框或键盘麦克风提问哦！");
        return;
      }
      try {
        this.liveTranscript = "";
        this.recognition.start();
      } catch (_) {
        this._syncListeningUI();
      }
    }

    stopListening(opts) {
      const shouldSubmit = opts && opts.submitIfText;
      const pendingText = (this.liveTranscript || "").trim();
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
      if (!shouldSubmit) {
        this.liveTranscript = "";
      }
      if (this.recognition && this.isListening) {
        try {
          this.recognition.stop();
        } catch (_) {}
      }
      this.isListening = false;
      this._syncListeningUI();
      if (shouldSubmit && pendingText && !this.isThinking) {
        this.liveTranscript = "";
        this.askQuestion(pendingText);
      }
    }

    _syncLangModeUI() {
      const isEn = this.chatLang === "en";
      if (this.langToggleBtnEl) {
        this.langToggleBtnEl.classList.toggle("on", isEn);
        this.langToggleBtnEl.textContent = isEn ? "🇬🇧 English ON" : "🇬🇧 切英文对话";
      }
      if (this.textInputEl) {
        this.textInputEl.placeholder = isEn
          ? "Ask in English! e.g. Is it venom or poison?"
          : "也可以在这里打字或用键盘语音输入问题…";
      }
      if (!this.isListening && this.micLabelEl) {
        this.micLabelEl.textContent = isEn ? "Speak English" : "点我跟 AI 说话";
      }
    }

    _renderQuickChips(card) {
      let questions = [];
      const ce = card && card.id && window.CURIOSITY_ENGLISH_DATA ? window.CURIOSITY_ENGLISH_DATA[card.id] : null;
      if (this.chatLang === "en") {
        if (card && card.name) {
          const enName = (ce && ce.enName) || card.name;
          questions = [
            `🧪 Does ${enName} use venom or poison?`,
            `✨ Tell me a fun fact about ${enName} in easy English!`,
            `🔤 Teach me 3 science words for ${enName}!`,
            `🛡️ How can I stay safe around ${enName}?`,
            `🎯 Give me a fun English quiz about ${enName}!`
          ];
        } else {
          questions = [
            `🐸 Why is the Poison Dart Frog so bright yellow?`,
            `⚖️ What is the difference between venom and poison?`,
            `🐙 Tell me about the Blue-Ringed Octopus in easy English!`,
            `🍫 Why can't dogs eat dark chocolate?`
          ];
        }
      } else if (card && card.name) {
        questions = [
          `🎬 ${card.name}在真实大自然里平时是怎么生活和防身的？`,
          `🧬 为什么${card.name}自己的毒素不会把自己毒倒呀？`,
          `🇬🇧 教我3个和${card.name}有关的英语单词，再用英语考考我！`,
          `💊 科学家能把${card.name}的秘密武器变成救人的药吗？`,
          `🛡️ 如果在野外遇到${card.name}，怎么科学保护自己？`
        ];
      } else {
        questions = [
          `🐸 箭毒蛙身上的毒是从哪儿借来的？`,
          `🐙 蓝环章鱼受惊时身上的蓝圈圈是怎么亮起来的？`,
          `🍫 为什么小朋友能吃巧克力，小狗却不能吃？`,
          `🇬🇧 教我5个最酷的海洋毒物英语单词并考考我！`
        ];
      }

      this.quickChipsEl.innerHTML = questions
        .map(
          (q) =>
            `<button type="button" class="ai-quick-chip" data-q="${q.replace(/^[^\s]+\s/, "")}">${q}</button>`
        )
        .join("");

      this.quickChipsEl.querySelectorAll(".ai-quick-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.DoubaoTTS) window.DoubaoTTS._ensureAudioContext();
          if (window.SFX) window.SFX.pop();
          this.stopListening({ submitIfText: false });
          this.askQuestion(btn.getAttribute("data-q"));
        });
      });
    }

    open(card, options) {
      const opts = options || {};
      this.onStopOtherAudio();
      if (window.DoubaoTTS) {
        window.DoubaoTTS._ensureAudioContext();
        window.DoubaoTTS.stop();
      }

      const prevCardId = this.activeCard ? this.activeCard.id : null;
      this.activeCard = card || null;
      const nextCardId = this.activeCard ? this.activeCard.id : null;

      if (prevCardId !== nextCardId) {
        this.history = [];
        this.turnContainerEl.innerHTML = "";
        this.welcomeBoxEl.style.display = "block";
      }

      if (this.activeCard && this.activeCard.name) {
        const bi = window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[this.activeCard.id];
        this.contextEmojiEl.textContent = this.activeCard.emoji || "🧪";
        this.contextTitleEl.innerHTML = `正在聊：${this.ruby(this.activeCard.name)}`;
        this.contextSubEl.textContent = bi
          ? `🇬🇧 ${bi.en} · ${bi.zh}`
          : `秘密武器：${this.activeCard.molecule}`;
      } else {
        this.contextEmojiEl.textContent = "🧪";
        this.contextTitleEl.textContent = "奇妙毒物百科 · 随时互动";
        this.contextSubEl.textContent = "随时跟 AI 说话提问 · 边听故事边学英文";
      }

      this._syncLangModeUI();
      this._renderQuickChips(this.activeCard);
      this.isOpen = true;
      this.backdropEl.classList.add("open");

      if (opts.autoListen && this.recognition) {
        setTimeout(() => {
          if (this.isOpen && !this.isThinking) {
            this.startListening();
          }
        }, 120);
      } else {
        this._syncListeningUI();
      }
    }

    close() {
      this.isOpen = false;
      this.reqSeq++;
      this.stopListening({ submitIfText: false });
      if (window.DoubaoTTS) window.DoubaoTTS.stop();
      this.backdropEl.classList.remove("open");
    }

    async askQuestion(rawQuestion) {
      const question = String(rawQuestion || "").trim();
      if (!question) return;

      this.onStopOtherAudio();
      if (window.DoubaoTTS) {
        window.DoubaoTTS._ensureAudioContext();
        window.DoubaoTTS.stop();
      }

      const mySeq = ++this.reqSeq;
      this.isThinking = true;
      this.welcomeBoxEl.style.display = "none";

      // 创建本轮对话 DOM
      const turnEl = document.createElement("div");
      turnEl.className = "ai-turn-card";
      turnEl.innerHTML = `
        <div class="ai-user-bubble">
          <span class="ai-user-tag">👧 我问：</span>
          <span>${this.ruby(question)}</span>
        </div>
        <div class="ai-reply-bubble tts-reading-scope">
          <div class="ai-reply-status">
            <div class="tts-live-bar loading">
              <span class="tts-spinner" aria-hidden="true"></span>
              <span>🧠 正在思考你的问题…</span>
            </div>
          </div>
          <div class="tts-clauses-body ai-reply-body"></div>
          <div class="ai-reply-actions" style="display:none;">
            <button type="button" class="mini-btn ai-replay-btn">🔊 给我讲解</button>
          </div>
        </div>
      `;
      this.turnContainerEl.appendChild(turnEl);
      this.chatStageEl.scrollTop = this.chatStageEl.scrollHeight;

      const replyScopeEl = turnEl.querySelector(".ai-reply-bubble");
      const statusMountEl = turnEl.querySelector(".ai-reply-status");
      const replyBodyEl = turnEl.querySelector(".ai-reply-body");
      const actionsRowEl = turnEl.querySelector(".ai-reply-actions");
      const replayBtnEl = turnEl.querySelector(".ai-replay-btn");

      let cardPayload = null;
      if (this.activeCard && this.activeCard.id) {
        const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[this.activeCard.id]) || {};
        cardPayload = {
          id: this.activeCard.id,
          name: this.activeCard.name,
          molecule: this.activeCard.molecule,
          summary: this.activeCard.summary,
          biochemDeep: this.activeCard.biochemDeep || "",
          en: bi.en || "",
          zh: bi.zh || ""
        };
      }

      const outboundQuestion =
        this.chatLang === "en"
          ? `[Please answer in friendly, simple English suitable for an 8-year-old learner (2-4 short sentences), then add one tiny Chinese translation line at the end.] ${question}`
          : question;

      const renderFinalReply = (replyText, preferEnglishVoice) => {
        const reply = String(replyText || "").trim();
        this.history.push({ role: "user", content: question });
        this.history.push({ role: "assistant", content: reply });

        statusMountEl.innerHTML = "";
        replyBodyEl.innerHTML = window.DoubaoTTS
          ? window.DoubaoTTS.renderClausesHTML(reply, this.ruby)
          : this.ruby(reply);
        actionsRowEl.style.display = "flex";
        this.chatStageEl.scrollTop = this.chatStageEl.scrollHeight;

        const playReplyAudio = () => {
          if (!window.DoubaoTTS) return;
          if (preferEnglishVoice && window.DoubaoTTS.speakEnglish) {
            const enOnly = reply.split("\n")[0];
            window.DoubaoTTS.speakEnglish(enOnly, { repeat: 1 });
            return;
          }
          window.DoubaoTTS.speak(null, {
            toggleIfPlaying: true,
            scopeEl: replyScopeEl,
            triggerBtn: replayBtnEl,
            statusMountEl,
            defaultBtnHTML: "🔊 给我讲解"
          });
        };

        replayBtnEl.addEventListener("click", () => playReplyAudio());
        replyBodyEl.addEventListener("click", () => playReplyAudio());

        if (window.DoubaoTTS && window.DoubaoTTS.enabled) {
          if (preferEnglishVoice && window.DoubaoTTS.speakEnglish) {
            const enOnly = reply.split("\n")[0];
            window.DoubaoTTS.speakEnglish(enOnly, { repeat: 1, playTapSfx: false });
          } else {
            window.DoubaoTTS.speak(null, {
              scopeEl: replyScopeEl,
              triggerBtn: replayBtnEl,
              statusMountEl,
              defaultBtnHTML: "🔊 给我讲解",
              playTapSfx: false
            });
          }
        }
      };

      try {
        const res = await fetch("./api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: outboundQuestion,
            card: cardPayload,
            history: this.history.slice(-4)
          })
        });
        const data = await res.json();
        if (mySeq !== this.reqSeq) return;

        if (!res.ok || !data || !data.ok || !data.reply) {
          throw new Error((data && data.error) || `http_${res.status}`);
        }

        renderFinalReply(data.reply, this.chatLang === "en");
      } catch (_) {
        if (mySeq !== this.reqSeq) return;
        const fallback = this._buildLocalFallbackReply(question, this.activeCard);
        renderFinalReply(fallback, this.chatLang === "en");
      } finally {
        if (mySeq === this.reqSeq) {
          this.isThinking = false;
        }
      }
    }

    _buildLocalFallbackReply(question, card) {
      const qLow = String(question || "").toLowerCase();
      let target = card;
      if (!target && Array.isArray(window.CATALOG_DATA)) {
        target =
          window.CATALOG_DATA.find(
            (x) =>
              question.includes(x.name) ||
              (window.CURIOSITY_ENGLISH_DATA &&
                window.CURIOSITY_ENGLISH_DATA[x.id] &&
                window.CURIOSITY_ENGLISH_DATA[x.id].enName &&
                qLow.includes(window.CURIOSITY_ENGLISH_DATA[x.id].enName.toLowerCase()))
          ) || null;
      }
      const ce = target && window.CURIOSITY_ENGLISH_DATA ? window.CURIOSITY_ENGLISH_DATA[target.id] : null;
      const bi = target && window.BILINGUAL_NOTES ? window.BILINGUAL_NOTES[target.id] : null;

      if (this.chatLang === "en") {
        if (target && ce) {
          const stratLine =
            target.strategy === "venom"
              ? `${ce.enName} uses VENOM — it bites, stings, or injects toxin!`
              : target.strategy === "poison"
              ? `${ce.enName} carries POISON — it protects itself if touched or eaten!`
              : `${ce.enName} is a mineral or chemical toxin.`;
          const words = (ce.vocab || []).map((v) => `${v.w} (${v.zh})`).join(", ");
          const sceneLine = (ce.enScene && ce.enScene.en) || (bi && bi.en) || "";
          if (qLow.includes("word") || qLow.includes("teach") || qLow.includes("vocab")) {
            return `Great question! Here are 3 cool science words for ${ce.enName}: ${words}. ${sceneLine}\n（中文提示：${target.name}的三大核心英语词：${words}）`;
          }
          if (qLow.includes("quiz")) {
            return `Mini English Quiz! Is ${ce.enName} VENOM or POISON? Hint: ${sceneLine}\n（中文小考：猜猜 ${target.name} 是主动注射的 Venom 还是被动防御的 Poison？）`;
          }
          return `${stratLine} ${sceneLine} Key words: ${words}.\n（中文提示：${target.summary}）`;
        }
        if (qLow.includes("venom") || qLow.includes("poison")) {
          return `Easy rule! If it bites or stings you, it is VENOM. If you touch or eat it, it is POISON!\n（中文提示：主动咬或扎人的是 Venom 毒液，吃进或摸到中毒的是 Poison 毒物！）`;
        }
        if (qLow.includes("chocolate") || qLow.includes("dog")) {
          return `Dark chocolate has theobromine. Human livers break it down fast, but dogs break it down very slowly, so chocolate is toxic for dogs!\n（中文提示：狗狗肝脏分解可可碱太慢，所以千万别喂狗狗吃巧克力！）`;
        }
        return `Awesome science question! Open any of the 99 cards and ask me in English about venom, poison, or science words!\n（中文提示：打开任意一张 99 百科卡，随时用英文问我毒物秘密或科学单词哦！）`;
      }

      if (target) {
        const enLine = (ce && ce.enScene && ce.enScene.en) || (bi && bi.en) || "";
        const words = ce && ce.vocab ? ce.vocab.map((v) => `${v.w}(${v.zh})`).join("、") : "";
        if (question.includes("英语") || question.includes("单词") || question.includes("英文")) {
          return `太棒啦！${target.name}的英文名字是 ${ce ? ce.enName : ""}！三个必学词是：${words}。快跟我读这句：${enLine}`;
        }
        if (question.includes("药") && target.biochemDeep) {
          return `关于${target.name}的深度科学秘密：${target.biochemDeep} ${enLine ? `顺便学一句英文：${enLine}` : ""}`;
        }
        return `${target.name}的秘密武器是【${target.molecule}】！${target.summary}${ce && ce.lifeStory ? ` 生活中的例子：${ce.lifeStory}` : ""}${enLine ? ` 英文金句：${enLine}` : ""}`;
      }
      return `本地离线小百科来解答啦！记住三大口诀：①主动注射叫 Venom，吃摸防御叫 Poison；②剂量决定毒与药（The dose makes the poison!）；③快打开任意一张 99 百科闪卡问我专属问题吧！`;
    }
  }

  window.InteractiveAICompanion = InteractiveAICompanion;
})();
