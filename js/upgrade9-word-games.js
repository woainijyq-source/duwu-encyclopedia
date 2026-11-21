// ============================================================================
// Duwu Science Playground v8.0 — Word Adventure Island & 4 New Core Vocab Games
//   1. 🐉 Word Boss Battle (6 Kurzgesagt Element Bosses × 6 Core Vocab Worlds)
//   2. 🧪 Story Cloze Lab (Illustrated 99-Card Story Fill-in-the-Blank)
//   3. 🧰 My Word Box Flip Duel (3D Spaced-Review Flashcards & Quiz, 3 hits -> Mastered!)
//   4. 🔗 Word Family & Pair Link (Synonyms / Antonyms / Word Families Matcher)
// Coordinates seamlessly with the 6 upgraded games in upgrade6-english-playground.js!
// ============================================================================

(function () {
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function burstConfetti(originEl) {
    try {
      const colors = ["#14b8a6", "#38bdf8", "#f59e0b", "#fb7185", "#8b5cf6", "#22c55e", "#facc15"];
      const layer = document.createElement("div");
      layer.className = "duwu-confetti-layer";
      let cx = window.innerWidth * 0.5;
      let cy = window.innerHeight * 0.35;
      if (originEl && originEl.getBoundingClientRect) {
        const r = originEl.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2;
      }
      for (let i = 0; i < 24; i++) {
        const p = document.createElement("span");
        p.className = "duwu-confetti-piece";
        const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
        const dist = 55 + Math.random() * 130;
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        p.style.setProperty("--dy", `${Math.sin(angle) * dist - 55}px`);
        p.style.setProperty("--rot", `${Math.round(Math.random() * 540 - 270)}deg`);
        layer.appendChild(p);
      }
      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 1100);
    } catch (_) {}
  }

  const THEME_WORLDS = [
    {
      id: "action",
      en: "Action & Change",
      zh: "动作与变化",
      img: "assets/art/theme_action.jpg",
      bossImg: "assets/art/boss_acid.jpg",
      bossNameEn: "Enzyme Slime Golem",
      bossNameZh: "化学酶史莱姆王",
      color: "#f59e0b",
      descEn: "Power verbs that move, react & transform!",
      descZh: "高频核心动词：变化、反应与传递"
    },
    {
      id: "science",
      en: "Science & Mechanism",
      zh: "科学机制",
      img: "assets/art/theme_science.jpg",
      bossImg: "assets/art/boss_crystal.jpg",
      bossNameEn: "Prismatic Crystal Dragon",
      bossNameZh: "棱晶矿物巨龙",
      color: "#06b6d4",
      descEn: "Molecules, atoms, energy & lab concepts!",
      descZh: "分子、能量与实验科学核心词"
    },
    {
      id: "defense",
      en: "Danger & Defense",
      zh: "危险与防御",
      img: "assets/art/theme_defense.jpg",
      bossImg: "assets/art/boss_venom.jpg",
      bossNameEn: "Neon Viper King",
      bossNameZh: "霓虹眼镜蛇王",
      color: "#f43f5e",
      descEn: "Venom, camouflage, shields & survival!",
      descZh: "毒液、伪装、预警与防御核心词"
    },
    {
      id: "nature",
      en: "Nature & Habitat",
      zh: "自然生态",
      img: "assets/art/theme_nature.jpg",
      bossImg: "assets/art/boss_spore.jpg",
      bossNameEn: "Glowing Toadstool Titan",
      bossNameZh: "荧光毒菌泰坦",
      color: "#10b981",
      descEn: "Rainforests, coral reefs, predators & prey!",
      descZh: "雨林、珊瑚礁与食物链生态词"
    },
    {
      id: "medicine",
      en: "Body & Medicine",
      zh: "身体与医学",
      img: "assets/art/theme_medicine.jpg",
      bossImg: "assets/art/boss_abyss.jpg",
      bossNameEn: "Blue-Ring Kraken",
      bossNameZh: "蓝环深海章鱼王",
      color: "#ec4899",
      descEn: "Nerves, cells, antidotes & healing power!",
      descZh: "神经、细胞、解药与医学健康词"
    },
    {
      id: "thinking",
      en: "Thinking & Describing",
      zh: "推理与描述",
      img: "assets/art/theme_thinking.jpg",
      bossImg: "assets/art/boss_shadow.jpg",
      bossNameEn: "Camouflage Phantom Moth",
      bossNameZh: "迷彩幽灵大蛾",
      color: "#8b5cf6",
      descEn: "Observe clues, compare & prove science facts!",
      descZh: "观察、推理、比较与描述学术词"
    }
  ];

  const PARTNERS = [
    { id: "ch1-09", nameEn: "Golden Dart Frog", nameZh: "黄金箭毒蛙", img: "assets/art/mascot_happy.jpg", powerEn: "Alkaloid Spark" },
    { id: "ch6-05", nameEn: "Blue-Ring Octopus", nameZh: "蓝环章鱼", img: "assets/photos/ch6-05.jpg", powerEn: "TTX Wave" },
    { id: "ch1-06", nameEn: "King Cobra", nameZh: "眼镜王蛇", img: "assets/photos/ch1-06.jpg", powerEn: "Venom Strike" },
    { id: "ch1-01", nameEn: "Platypus", nameZh: "鸭嘴兽", img: "assets/photos/ch1-01.jpg", powerEn: "Spur Splash" }
  ];

  window.CORE_THEME_WORLDS = THEME_WORLDS;

  class WordAdventureHub {
    constructor() {
      this.app = null;
      this.mount = null;
      this.activeTheme = "all"; // "all" | "wordbox" | one of 6 theme ids
      this.activeGame = "boss"; // boss | cloze | flipduel | pairlink | builder | memory | train | bubble | speak | wordbook

      // Boss Battle State
      this.bossState = {
        worldIdx: 0,
        partnerIdx: 0,
        bossHp: 100,
        maxBossHp: 100,
        playerHp: 3,
        shields: 2,
        combo: 0,
        shieldUsed: false,
        currentQ: null,
        locked: false,
        feedback: "",
        victory: false,
        defeat: false
      };

      // Story Cloze Lab State
      this.clozeState = {
        quests: [],
        idx: 0,
        filled: {},       // blankIdx -> word
        activeBlank: 0,
        solved: false,
        wrongChip: ""
      };

      // My Word Box Flip Duel State
      this.duelState = {
        mode: "flash",    // "flash" | "quiz" | "listen"
        deck: [],
        idx: 0,
        flipped: false,
        quizQ: null,
        locked: false,
        sessionCorrect: 0,
        usingStarterDeck: false
      };

      // Word Family & Pair Link State
      this.linkState = {
        mode: "syn",      // "syn" | "ant" | "fam"
        pairs: [],
        leftOrder: [],
        rightOrder: [],
        selLeft: null,
        matchedIds: new Set(),
        wrongFlash: null,
        score: 0,
        combo: 0
      };
    }

    init(app) {
      this.app = app;
      this.mount = document.getElementById("englishPlaygroundMount");
      if (!this.mount) return;
      this._buildClozeQuests();
      this.render();

      window.addEventListener("duwu:langchange", () => {
        if (this.mount) this.render();
      });
      window.addEventListener("duwu:wordboxchange", () => {
        this._refreshMiniStats();
      });
    }

    isEn() {
      return window.isEn ? window.isEn() : true;
    }

    getCorePool(themeOverride) {
      const all = Array.isArray(window.CORE_VOCAB_DATA) ? window.CORE_VOCAB_DATA : [];
      const th = themeOverride || this.activeTheme;
      if (th === "wordbox" && window.WordBox) {
        const boxWords = window.WordBox.getAllBoxItems();
        if (boxWords.length >= 4) {
          const coreMap = window.FlipReader ? window.FlipReader.getCoreMap() : {};
          return boxWords.map((b) => coreMap[b.w] || {
            w: b.w,
            ipa: b.ipa || "",
            pos: b.pos || "",
            zh: b.zh || "",
            enDef: b.enDef || `Means "${b.zh}" in Chinese.`,
            theme: b.theme || "thinking",
            level: b.level || "KET",
            ex: b.ex || "",
            cards: b.sourceCard ? [b.sourceCard] : [],
            syn: [],
            ant: [],
            fam: []
          });
        }
      }
      if (th && th !== "all" && th !== "wordbox") {
        const filtered = all.filter((w) => w.theme === th);
        if (filtered.length >= 4) return filtered;
      }
      return all;
    }

    openGame(gameId, opts) {
      if (opts && opts.theme) this.activeTheme = opts.theme;
      this.activeGame = gameId || "boss";
      if (this.activeGame === "boss") this._startBossFight(this.bossState.worldIdx);
      else if (this.activeGame === "cloze") this._loadClozeQuest(this.clozeState.idx);
      else if (this.activeGame === "flipduel") this._initFlipDuel();
      else if (this.activeGame === "pairlink") this._startPairRound();
      this.render();
      const stageEl = this.mount && this.mount.querySelector("#waiGameStage");
      if (stageEl) stageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    _refreshMiniStats() {
      if (!this.mount) return;
      const totalCore = (window.CORE_VOCAB_DATA || []).length;
      const masteredCore = window.WordBox ? window.WordBox.getMasteredCoreCount() : 0;
      const boxLearning = window.WordBox ? window.WordBox.getLearningItems().length : 0;
      const elM = this.mount.querySelector("#waiMasteredCount");
      const elB = this.mount.querySelector("#waiBoxLearningCount");
      if (elM) elM.textContent = `${masteredCore} / ${totalCore}`;
      if (elB) elB.textContent = String(boxLearning);
    }

    render() {
      if (!this.mount) return;
      const en = this.isEn();
      const totalCore = (window.CORE_VOCAB_DATA || []).length;
      const masteredCore = window.WordBox ? window.WordBox.getMasteredCoreCount() : 0;
      const boxLearning = window.WordBox ? window.WordBox.getLearningItems().length : 0;
      const pct = totalCore > 0 ? Math.round((masteredCore / totalCore) * 100) : 0;

      const games = [
        { id: "boss", icon: "🐉", en: "Word Boss Battle", zh: "怪兽大作战", badge: "NEW" },
        { id: "cloze", icon: "🧪", en: "Story Cloze Lab", zh: "图文语境填空", badge: "NEW" },
        { id: "flipduel", icon: "🧰", en: "Word Box Flip Duel", zh: "生词宝盒闯关", badge: boxLearning > 0 ? `${boxLearning}` : "NEW" },
        { id: "pairlink", icon: "🔗", en: "Word Family Link", zh: "近反义词连连看", badge: "NEW" },
        { id: "wordbook", icon: "📚", en: "680 Core Wordbook", zh: "680 核心词典", badge: `${totalCore}` },
        { id: "builder", icon: "🧩", en: "Word Builder", zh: "积木拼词屋" },
        { id: "memory", icon: "🃏", en: "3D Flip Match", zh: "3D 翻翻乐" },
        { id: "train", icon: "🚂", en: "Sentence Train", zh: "造句小火车" },
        { id: "bubble", icon: "🎈", en: "Bubble Pop", zh: "听音戳泡泡" },
        { id: "speak", icon: "🎙️", en: "Speaking Stage", zh: "开口小舞台" }
      ];

      this.mount.innerHTML = `
        <div class="wai-shell">
          <!-- Illustrated Hero Banner -->
          <div class="wai-hero">
            <img src="assets/art/adventure_island.jpg" alt="Word Adventure Island" class="wai-hero-bg" />
            <div class="wai-hero-overlay">
              <div class="wai-hero-left">
                <img src="assets/art/mascot_happy.jpg" alt="Professor Dart" class="wai-hero-mascot" />
                <div>
                  <div class="wai-hero-kicker">🏝️ ${en ? "CAMBRIDGE KET / PET + KIDS-AWL CORE VOCAB" : "剑桥 KET / PET + 少儿学术核心词汇探险岛"}</div>
                  <h1 class="wai-hero-title">${en ? "Word Adventure Island" : "毒物百科 · 核心词探险岛"}</h1>
                  <p class="wai-hero-sub">${
                    en
                      ? "Explore 6 science worlds, battle Element Bosses, and master essential English core words!"
                      : "探索 6 大核心词冒险世界、挑战毒物元素 Boss，边玩边掌握 680+ 核心重要词汇！"
                  }</p>
                </div>
              </div>
              <div class="wai-hero-stats">
                <div class="wai-stat-card">
                  <span class="wai-stat-label">🌟 ${en ? "Core Mastered" : "核心词已掌握"}</span>
                  <span class="wai-stat-val" id="waiMasteredCount">${masteredCore} / ${totalCore}</span>
                  <div class="wai-mini-bar"><div style="width:${pct}%"></div></div>
                </div>
                <button type="button" class="wai-stat-card wai-box-shortcut" id="waiOpenBoxBtn">
                  <span class="wai-stat-label">🧰 ${en ? "My Word Box" : "我的生词宝盒"}</span>
                  <span class="wai-stat-val" id="waiBoxLearningCount">${boxLearning}</span>
                  <span class="wai-stat-hint">${en ? "Tap to review →" : "点此复习生词 →"}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 6 Illustrated Core Vocab Theme Worlds -->
          <div class="wai-worlds-header">
            <div class="wai-section-title">🗺️ ${en ? "Choose a Core Word World (Filters All Games!)" : "选择核心词主题世界（联动所有游戏词库）"}</div>
            <div class="wai-world-quick-pills">
              <button type="button" class="scene-pill ${this.activeTheme === "all" ? "active" : ""}" data-waitheme="all">🌈 ${en ? `All ${totalCore} Core Words` : `全部 ${totalCore} 核心词`}</button>
              <button type="button" class="scene-pill ${this.activeTheme === "wordbox" ? "active" : ""}" data-waitheme="wordbox">🧰 ${en ? `My Word Box (${boxLearning})` : `我的生词宝盒 (${boxLearning})`}</button>
            </div>
          </div>

          <div class="wai-worlds-grid">
            ${THEME_WORLDS.map((w, idx) => {
              const st = window.WordBox ? window.WordBox.getThemeStats(w.id) : { total: 0, mastered: 0 };
              const wpct = st.total > 0 ? Math.round((st.mastered / st.total) * 100) : 0;
              const isSel = this.activeTheme === w.id;
              return `
                <button type="button" class="wai-world-card ${isSel ? "active" : ""}" data-waitheme="${w.id}" data-worldidx="${idx}" style="--world-c:${w.color}">
                  <img src="${w.img}" alt="${esc(w.en)}" class="wai-world-img" loading="lazy" />
                  <div class="wai-world-body">
                    <div class="wai-world-title-row">
                      <span class="wai-world-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[w.id]) || ""}</span>
                      <span class="wai-world-name">${en ? w.en : w.zh}</span>
                    </div>
                    <div class="wai-world-desc">${en ? w.descEn : w.descZh}</div>
                    <div class="wai-world-prog">
                      <div class="wai-world-bar"><div style="width:${wpct}%"></div></div>
                      <span>${st.mastered}/${st.total}</span>
                    </div>
                  </div>
                </button>
              `;
            }).join("")}
          </div>

          <!-- 10 Games Selector Dock -->
          <div class="wai-games-dock">
            ${games.map((g) => `
              <button type="button" class="wai-game-tab ${this.activeGame === g.id ? "active" : ""}" data-waigame="${g.id}">
                <span class="wai-game-tab-icon">${g.icon}</span>
                <span class="wai-game-tab-label">${en ? g.en : g.zh}</span>
                ${g.badge ? `<span class="wai-game-tab-badge">${esc(g.badge)}</span>` : ""}
              </button>
            `).join("")}
          </div>

          <!-- Active Game Stage -->
          <div id="waiGameStage" class="wai-game-stage"></div>
        </div>
      `;

      // Bind hero & world events
      this.mount.querySelector("#waiOpenBoxBtn").addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        if (window.WordBox) window.WordBox.openDrawer("learning");
      });

      this.mount.querySelectorAll("[data-waitheme]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.activeTheme = btn.getAttribute("data-waitheme");
          const wIdx = btn.getAttribute("data-worldidx");
          if (wIdx !== null && wIdx !== "") {
            this.bossState.worldIdx = Number(wIdx) || 0;
          }
          if (this.activeGame === "boss") this._startBossFight(this.bossState.worldIdx);
          else if (this.activeGame === "cloze") { this._buildClozeQuests(); this._loadClozeQuest(0); }
          else if (this.activeGame === "pairlink") this._startPairRound();
          this.render();
        });
      });

      this.mount.querySelectorAll("[data-waigame]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.openGame(btn.getAttribute("data-waigame"));
        });
      });

      this._renderActiveGame();
    }

    _renderActiveGame() {
      const stage = this.mount && this.mount.querySelector("#waiGameStage");
      if (!stage) return;

      if (this.activeGame === "boss") {
        if (!this.bossState.currentQ && !this.bossState.victory && !this.bossState.defeat) {
          this._startBossFight(this.bossState.worldIdx);
        }
        this._renderBossBattle(stage);
      } else if (this.activeGame === "cloze") {
        if (!this.clozeState.quests.length) this._buildClozeQuests();
        this._renderClozeLab(stage);
      } else if (this.activeGame === "flipduel") {
        if (!this.duelState.deck.length) this._initFlipDuel();
        this._renderFlipDuel(stage);
      } else if (this.activeGame === "pairlink") {
        if (!this.linkState.pairs.length) this._startPairRound();
        this._renderPairLink(stage);
      } else if (this.activeGame === "wordbook") {
        this._renderCoreWordbook(stage);
      } else {
        // Delegate builder / memory / train / bubble / speak to upgraded EnglishPlayground!
        if (window.EnglishPlayground && typeof window.EnglishPlayground.mountEmbeddedGame === "function") {
          window.EnglishPlayground.mountEmbeddedGame(stage, this.activeGame, this.activeTheme);
        } else {
          stage.innerHTML = `<div class="wai-card-box">Loading game...</div>`;
        }
      }
    }

    // ========================================================================
    // GAME 1: 🐉 WORD BOSS BATTLE
    // ========================================================================
    _startBossFight(worldIdx) {
      const wIdx = Math.max(0, Math.min(THEME_WORLDS.length - 1, worldIdx || 0));
      this.bossState = {
        ...this.bossState,
        worldIdx: wIdx,
        bossHp: 100,
        maxBossHp: 100,
        playerHp: 3,
        shields: 2,
        combo: 0,
        shieldUsed: false,
        locked: false,
        feedback: "",
        victory: false,
        defeat: false
      };
      this._nextBossQuestion();
    }

    _nextBossQuestion() {
      const world = THEME_WORLDS[this.bossState.worldIdx];
      const pool = this.activeTheme === "wordbox" ? this.getCorePool("wordbox") : this.getCorePool(world.id);
      if (pool.length < 4) return;
      const picked = shuffle(pool).slice(0, 4);
      const target = picked[0];
      const options = shuffle(picked);
      const qModes = ["def", "audio", "example"];
      const qMode = qModes[Math.floor(Math.random() * qModes.length)];
      this.bossState.currentQ = { target, options, qMode };
      this.bossState.shieldUsed = false;
      this.bossState.locked = false;
      this.bossState.feedback = "";
    }

    _renderBossBattle(stage) {
      const en = this.isEn();
      const st = this.bossState;
      const world = THEME_WORLDS[st.worldIdx];
      const partner = PARTNERS[st.partnerIdx];

      const bossSelectHTML = `
        <div class="boss-picker-row">
          <div class="boss-picker-group">
            <span class="boss-picker-lbl">🐉 ${en ? "Choose Boss:" : "选择挑战 Boss："}</span>
            ${THEME_WORLDS.map((w, i) => `
              <button type="button" class="boss-mini-chip ${i === st.worldIdx ? "active" : ""}" data-bossidx="${i}">
                <img src="${w.bossImg}" alt="${esc(w.bossNameEn)}" />
                <span>${en ? w.bossNameEn.split(" ")[0] : w.zh}</span>
              </button>
            `).join("")}
          </div>
          <div class="boss-picker-group">
            <span class="boss-picker-lbl">🤝 ${en ? "Partner:" : "出战拍档："}</span>
            ${PARTNERS.map((p, i) => `
              <button type="button" class="boss-mini-chip ${i === st.partnerIdx ? "active" : ""}" data-partneridx="${i}">
                <img src="${p.img}" alt="${esc(p.nameEn)}" />
              </button>
            `).join("")}
          </div>
        </div>
      `;

      if (st.victory || st.defeat) {
        stage.innerHTML = `
          <div class="wai-card-box boss-arena">
            ${bossSelectHTML}
            <div class="boss-end-screen">
              <img src="${st.victory ? "assets/art/mascot_cheer.jpg" : "assets/art/mascot_thinking.jpg"}" alt="Professor Dart" class="boss-end-mascot" />
              <h2>${
                st.victory
                  ? (en ? `🎉 VICTORY! You defeated ${world.bossNameEn}!` : `🎉 大获全胜！你击败了 ${world.bossNameZh}！`)
                  : (en ? `💪 Almost there! Try ${world.bossNameEn} again!` : `💪 差一点点！再挑战一次 ${world.bossNameZh} 吧！`)
              }</h2>
              <p>${
                st.victory
                  ? (en ? `Amazing core vocabulary mastery! +5 ⭐ Stars earned!` : `你的核心词威力太强啦！奖励 +5 ⭐ 星星！`)
                  : (en ? `Use the 🛡️ Shield hint whenever a word looks tricky!` : `遇到难词可以点 🛡️ 护盾偷看中文提示哦！`)
              }</p>
              <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
                <button type="button" class="big-action-btn" id="btnBossRematch">⚔️ ${en ? "Battle Again!" : "再战一局"}</button>
                <button type="button" class="mini-btn" id="btnBossNextWorld" style="padding:10px 18px;font-size:0.95rem;">➡️ ${en ? "Next Element Boss" : "挑战下一只 Boss"}</button>
              </div>
            </div>
          </div>
        `;
        this._bindBossSelectors(stage);
        stage.querySelector("#btnBossRematch").addEventListener("click", () => {
          this._startBossFight(st.worldIdx);
          this._renderBossBattle(stage);
        });
        stage.querySelector("#btnBossNextWorld").addEventListener("click", () => {
          this._startBossFight((st.worldIdx + 1) % THEME_WORLDS.length);
          this._renderBossBattle(stage);
        });
        return;
      }

      const q = st.currentQ;
      const target = q.target;
      const blankedEx = target.ex
        ? target.ex.replace(new RegExp(`\\b${target.w}[a-z]*\\b`, "i"), "______")
        : "";

      let clueHTML = "";
      if (q.qMode === "audio") {
        clueHTML = `
          <div class="boss-clue-tag">🎧 ${en ? "LISTEN & STRIKE!" : "听音选词放大招！"}</div>
          <button type="button" class="big-action-btn boss-listen-btn" id="btnBossListen">🔊 ${en ? "Play Secret Word" : "点击听目标核心词"}</button>
          <div class="boss-clue-sub">${en ? "Clue:" : "提示："} ${esc(target.enDef)}</div>
        `;
      } else if (q.qMode === "example" && blankedEx.includes("______")) {
        clueHTML = `
          <div class="boss-clue-tag">🧪 ${en ? "COMPLETE THE SCIENCE ATTACK!" : "补全科学句子释放大招！"}</div>
          <div class="boss-clue-main">"${esc(blankedEx)}"</div>
          <div class="boss-clue-sub">💡 ${esc(target.enDef)}</div>
        `;
      } else {
        clueHTML = `
          <div class="boss-clue-tag">💡 ${en ? "WHICH CORE WORD MEANS THIS?" : "哪个核心词符合这条英文释义？"}</div>
          <div class="boss-clue-main">${esc(target.enDef)}</div>
          <div class="boss-clue-sub">${target.pos ? `<span class="fw-detail-pos">${esc(target.pos)}</span>` : ""} <span class="wb-lvl-tag lvl-${esc(target.level || "KET").toLowerCase()}">${esc(target.level || "KET")}</span></div>
        `;
      }

      stage.innerHTML = `
        <div class="wai-card-box boss-arena">
          ${bossSelectHTML}

          <div class="boss-battlefield" style="--world-c:${world.color}">
            <div class="boss-combatant player-side">
              <img src="${partner.img}" alt="${esc(partner.nameEn)}" class="boss-avatar partner-avatar" />
              <div class="boss-name">${en ? partner.nameEn : partner.nameZh}</div>
              <div class="boss-hearts">${"❤️".repeat(st.playerHp)}${"🖤".repeat(Math.max(0, 3 - st.playerHp))}</div>
              ${st.combo >= 2 ? `<div class="boss-combo-badge">🔥 COMBO ×${st.combo}</div>` : ""}
            </div>

            <div class="boss-vs-center">
              <div class="boss-vs-pill">VS</div>
              <button type="button" class="mini-btn boss-shield-btn" id="btnBossShield" ${st.shields <= 0 || st.shieldUsed ? "disabled" : ""}>
                🛡️ ${en ? `Chinese Hint (${st.shields})` : `中文护盾 (${st.shields})`}
              </button>
              <button type="button" class="mini-btn" id="btnBossAudioHint">🔊 ${en ? "Hear Word" : "听读音"}</button>
            </div>

            <div class="boss-combatant boss-side" id="bossPortraitBox">
              <img src="${world.bossImg}" alt="${esc(world.bossNameEn)}" class="boss-avatar monster-avatar" />
              <div class="boss-name">${en ? world.bossNameEn : world.bossNameZh}</div>
              <div class="boss-hp-track">
                <div class="boss-hp-fill" style="width:${st.bossHp}%"></div>
              </div>
              <div class="boss-hp-txt">HP ${st.bossHp} / ${st.maxBossHp}</div>
            </div>
          </div>

          <div class="boss-clue-box">
            ${clueHTML}
            ${st.shieldUsed ? `<div class="boss-shield-reveal">🛡️ ${en ? "Chinese Meaning:" : "护盾中文提示："} <b>${esc(target.zh)}</b> (${esc(target.ipa || "")})</div>` : ""}
          </div>

          <div class="boss-options-grid">
            ${q.options.map((opt) => `
              <button type="button" class="boss-opt-btn" data-bossopt="${esc(opt.w)}">
                <span class="boss-opt-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[opt.theme]) || ""}</span>
                <span class="boss-opt-word">${esc(opt.w)}</span>
                <span class="boss-opt-ipa">${esc(opt.ipa || "")}</span>
              </button>
            `).join("")}
          </div>

          ${st.feedback ? `<div class="boss-feedback-bar">${st.feedback}</div>` : ""}
        </div>
      `;

      this._bindBossSelectors(stage);

      const sayTarget = () => {
        if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(target.w);
      };
      const listenBtn = stage.querySelector("#btnBossListen");
      if (listenBtn) listenBtn.addEventListener("click", sayTarget);
      const audioHintBtn = stage.querySelector("#btnBossAudioHint");
      if (audioHintBtn) audioHintBtn.addEventListener("click", sayTarget);

      if (q.qMode === "audio" && !st.feedback) {
        setTimeout(sayTarget, 120);
      }

      const shieldBtn = stage.querySelector("#btnBossShield");
      if (shieldBtn) {
        shieldBtn.addEventListener("click", () => {
          if (st.shields <= 0 || st.shieldUsed || st.locked) return;
          st.shields--;
          st.shieldUsed = true;
          if (window.SFX) window.SFX.pop();
          this._renderBossBattle(stage);
        });
      }

      stage.querySelectorAll("[data-bossopt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (st.locked) return;
          st.locked = true;
          const chosen = btn.getAttribute("data-bossopt");
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(chosen);

          if (chosen === target.w) {
            btn.classList.add("is-right");
            st.combo++;
            const dmg = st.combo >= 3 ? 25 : 20;
            st.bossHp = Math.max(0, st.bossHp - dmg);
            const bossBox = stage.querySelector("#bossPortraitBox");
            if (bossBox) bossBox.classList.add("boss-hit-shake");
            if (window.SFX && window.SFX.chime) window.SFX.chime();
            burstConfetti(btn);

            const res = window.WordBox ? window.WordBox.recordCorrect(target.w) : {};
            const masterNote = res.justMastered
              ? (en ? " 🌟 MASTERED!" : " 🌟 已点亮掌握！")
              : "";
            st.feedback = en
              ? `💥 ${partner.powerEn}! -${dmg} HP! <b>${esc(target.w)}</b> = ${esc(target.zh)}${masterNote}`
              : `💥 ${partner.nameZh} 命中 -${dmg} HP！<b>${esc(target.w)}</b> = ${esc(target.zh)}${masterNote}`;

            if (st.bossHp <= 0) {
              st.victory = true;
              if (this.app && typeof this.app.addStars === "function") this.app.addStars(5, "Boss Battle Win");
              setTimeout(() => this._renderBossBattle(stage), 750);
            } else {
              setTimeout(() => {
                this._nextBossQuestion();
                this._renderBossBattle(stage);
              }, 950);
            }
          } else {
            btn.classList.add("is-wrong");
            const rightBtn = stage.querySelector(`[data-bossopt="${CSS.escape(target.w)}"]`);
            if (rightBtn) rightBtn.classList.add("is-right");
            st.combo = 0;
            st.playerHp = Math.max(0, st.playerHp - 1);
            if (window.SFX && window.SFX.bonk) window.SFX.bonk();
            if (window.WordBox) window.WordBox.recordTap(target, (target.cards && target.cards[0]) || "");
            st.feedback = en
              ? `⚡ Oops! The answer was <b>${esc(target.w)}</b> (${esc(target.zh)}) — saved to your Word Box!`
              : `⚡ 差一点！正确答案是 <b>${esc(target.w)}</b>（${esc(target.zh)}）——已自动存入生词宝盒！`;

            if (st.playerHp <= 0) {
              st.defeat = true;
              setTimeout(() => this._renderBossBattle(stage), 1100);
            } else {
              setTimeout(() => {
                this._nextBossQuestion();
                this._renderBossBattle(stage);
              }, 1350);
            }
          }
          const fb = stage.querySelector(".boss-feedback-bar");
          if (fb) fb.innerHTML = st.feedback;
        });
      });
    }

    _bindBossSelectors(stage) {
      stage.querySelectorAll("[data-bossidx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this._startBossFight(Number(btn.getAttribute("data-bossidx")));
          this._renderBossBattle(stage);
        });
      });
      stage.querySelectorAll("[data-partneridx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.bossState.partnerIdx = Number(btn.getAttribute("data-partneridx"));
          this._renderBossBattle(stage);
        });
      });
    }

    // ========================================================================
    // GAME 2: 🧪 STORY CLOZE LAB (Illustrated 99-Card Core Word Fill-in-Blank)
    // ========================================================================
    _buildClozeQuests() {
      const enCards = (window.ENGLISH_ENCYCLOPEDIA && window.ENGLISH_ENCYCLOPEDIA.cards) || {};
      const coreMap = window.FlipReader ? window.FlipReader.getCoreMap() : {};
      const thFilter = this.activeTheme;
      const quests = [];

      Object.entries(enCards).forEach(([cardId, data]) => {
        const text = data.lifeStory || data.summary || "";
        if (!text || text.length < 40) return;

        // Find distinct core words present verbatim in text
        const tokens = text.match(/\b[A-Za-z]{4,}\b/g) || [];
        const matched = [];
        const seen = new Set();
        for (const tok of tokens) {
          const low = tok.toLowerCase();
          const entry = coreMap[low];
          if (!entry || seen.has(low)) continue;
          if (thFilter !== "all" && thFilter !== "wordbox" && entry.theme !== thFilter) continue;
          seen.add(low);
          matched.push({ token: tok, entry });
          if (matched.length >= 2) break;
        }
        // Fallback: accept any theme core word if filtered theme didn't hit 2
        if (matched.length < 2) {
          for (const tok of tokens) {
            const low = tok.toLowerCase();
            const entry = coreMap[low];
            if (!entry || seen.has(low)) continue;
            seen.add(low);
            matched.push({ token: tok, entry });
            if (matched.length >= 2) break;
          }
        }
        if (matched.length >= 2) {
          const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[cardId]) || {};
          quests.push({
            cardId,
            enName: data.enName || ce.enName || cardId,
            title: data.lifeTitle || data.enName || cardId,
            illu: ce.illuSrc || `assets/illustrations/${cardId}.jpg`,
            text,
            blanks: matched.slice(0, 2)
          });
        }
      });

      this.clozeState.quests = shuffle(quests);
      this.clozeState.idx = 0;
      this._loadClozeQuest(0);
    }

    _loadClozeQuest(idx) {
      if (!this.clozeState.quests.length) return;
      const safeIdx = ((idx % this.clozeState.quests.length) + this.clozeState.quests.length) % this.clozeState.quests.length;
      this.clozeState.idx = safeIdx;
      this.clozeState.filled = {};
      this.clozeState.activeBlank = 0;
      this.clozeState.solved = false;
      this.clozeState.wrongChip = "";

      const q = this.clozeState.quests[safeIdx];
      const ansSet = new Set(q.blanks.map((b) => b.entry.w));
      const pool = this.getCorePool(q.blanks[0].entry.theme).filter((w) => !ansSet.has(w.w));
      const distractors = shuffle(pool).slice(0, 3);
      this.clozeState.chips = shuffle([
        ...q.blanks.map((b) => ({ w: b.token, lemma: b.entry.w, zh: b.entry.zh, theme: b.entry.theme, isAns: true })),
        ...distractors.map((d) => ({ w: d.w, lemma: d.w, zh: d.zh, theme: d.theme, isAns: false }))
      ]);
    }

    _renderClozeLab(stage) {
      const en = this.isEn();
      const cs = this.clozeState;
      const q = cs.quests[cs.idx];
      if (!q) {
        stage.innerHTML = `<div class="wai-card-box">${en ? "Loading illustrated story quests..." : "正在准备插画故事题库..."}</div>`;
        return;
      }

      // Build story HTML with interactive blanks
      let storyHtml = esc(q.text);
      q.blanks.forEach((b, bIdx) => {
        const filledWord = cs.filled[bIdx];
        const isActive = !cs.solved && cs.activeBlank === bIdx;
        const blankBtn = `<button type="button" class="cloze-blank-slot ${filledWord ? "is-filled" : ""} ${isActive ? "is-active" : ""} ${cs.solved ? "is-solved" : ""}" data-blankidx="${bIdx}">${
          filledWord ? esc(filledWord) : `${bIdx + 1}. ___ (${esc(b.entry.zh)})`
        }</button>`;
        storyHtml = storyHtml.replace(new RegExp(`\\b${b.token}\\b`), blankBtn);
      });

      const usedWords = new Set(Object.values(cs.filled));

      stage.innerHTML = `
        <div class="wai-card-box cloze-lab-card">
          <div class="cloze-lab-top">
            <div>
              <div class="wai-hero-kicker">🧪 ${en ? `ILLUSTRATED STORY LAB · QUEST ${cs.idx + 1} / ${cs.quests.length}` : `图文语境填空实验室 · 第 ${cs.idx + 1} / ${cs.quests.length} 关`}</div>
              <h3 class="cloze-lab-title">${esc(q.enName)} — ${esc(q.title)}</h3>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="mini-btn" id="btnClozeRead">🔊 ${en ? "Listen Story" : "听英文故事"}</button>
              <button type="button" class="mini-btn" id="btnClozeOpenCard">📖 ${en ? "Open Card" : "看原卡"}</button>
              <button type="button" class="mini-btn" id="btnClozeSkip">🔀 ${en ? "Next Story" : "换一关"}</button>
            </div>
          </div>

          <div class="cloze-lab-grid">
            <div class="cloze-illu-frame ${cs.solved ? "is-glowing" : ""}">
              <img src="${esc(q.illu)}" alt="${esc(q.enName)}" class="cloze-illu-img" />
              ${cs.solved ? `<div class="cloze-solved-ribbon">✨ ${en ? "LAB REACTION COMPLETE! +3 ⭐" : "实验故事复原成功！+3 ⭐"}</div>` : ""}
            </div>

            <div class="cloze-story-panel">
              <div class="cloze-story-text">${storyHtml}</div>

              <div class="cloze-chips-label">
                ${cs.solved
                  ? `🎉 ${en ? "Awesome! Tap any word below to hear it again or jump to the next story!" : "太棒啦！全部核心词精准归位！"}`
                  : `👇 ${en ? `Tap the core word chip for Blank #${cs.activeBlank + 1}:` : `点击下方核心词积木填入第 ${cs.activeBlank + 1} 个空：`}`
                }
              </div>

              <div class="cloze-chips-row">
                ${cs.chips.map((c) => `
                  <button type="button" class="cloze-word-chip ${usedWords.has(c.w) ? "is-used" : ""} ${cs.wrongChip === c.w ? "is-wrong" : ""}" data-clozechip="${esc(c.w)}" data-clozelemma="${esc(c.lemma)}" ${cs.solved || usedWords.has(c.w) ? "disabled" : ""}>
                    <span class="cloze-chip-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[c.theme]) || ""}</span>
                    <span>${esc(c.w)}</span>
                  </button>
                `).join("")}
              </div>

              ${cs.solved ? `
                <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
                  <button type="button" class="big-action-btn" id="btnClozeNextWin">➡️ ${en ? "Next Illustrated Story!" : "下一篇插画故事！"}</button>
                </div>
              ` : ""}
            </div>
          </div>
        </div>
      `;

      stage.querySelector("#btnClozeRead").addEventListener("click", () => {
        if (window.DoubaoTTS) window.DoubaoTTS.speakEnglish(q.text);
      });
      stage.querySelector("#btnClozeOpenCard").addEventListener("click", () => {
        if (this.app && typeof this.app.openSuperCard === "function") this.app.openSuperCard(q.cardId);
      });
      stage.querySelector("#btnClozeSkip").addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        this._loadClozeQuest(cs.idx + 1);
        this._renderClozeLab(stage);
      });
      const nextWin = stage.querySelector("#btnClozeNextWin");
      if (nextWin) {
        nextWin.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this._loadClozeQuest(cs.idx + 1);
          this._renderClozeLab(stage);
        });
      }

      stage.querySelectorAll("[data-blankidx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (cs.solved) return;
          cs.activeBlank = Number(btn.getAttribute("data-blankidx"));
          this._renderClozeLab(stage);
        });
      });

      stage.querySelectorAll("[data-clozechip]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (cs.solved) return;
          const w = btn.getAttribute("data-clozechip");
          const lemma = btn.getAttribute("data-clozelemma");
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(w);

          const expected = q.blanks[cs.activeBlank];
          if (expected && lemma.toLowerCase() === expected.entry.w.toLowerCase()) {
            cs.filled[cs.activeBlank] = expected.token;
            cs.wrongChip = "";
            if (window.SFX) window.SFX.chime();
            if (window.WordBox) window.WordBox.recordCorrect(expected.entry.w);

            // Advance to next unfilled blank or win!
            const nextEmpty = q.blanks.findIndex((_, i) => !cs.filled[i]);
            if (nextEmpty === -1) {
              cs.solved = true;
              if (window.SFX && window.SFX.chime) window.SFX.chime();
              burstConfetti(btn);
              if (this.app && typeof this.app.addStars === "function") this.app.addStars(3, "Story Cloze Lab");
              setTimeout(() => {
                if (window.DoubaoTTS) window.DoubaoTTS.speakEnglish(q.text);
              }, 450);
            } else {
              cs.activeBlank = nextEmpty;
            }
          } else {
            cs.wrongChip = w;
            if (window.SFX && window.SFX.bonk) window.SFX.bonk();
          }
          this._renderClozeLab(stage);
        });
      });
    }

    // ========================================================================
    // GAME 3: 🧰 MY WORD BOX FLIP DUEL (Spaced Review: 3 Hits -> Mastered!)
    // ========================================================================
    _initFlipDuel() {
      const learning = window.WordBox ? window.WordBox.getLearningItems() : [];
      const coreMap = window.FlipReader ? window.FlipReader.getCoreMap() : {};
      let deck = [];
      let usingStarter = false;

      if (learning.length > 0) {
        deck = learning.map((b) => {
          const c = coreMap[b.w];
          return c ? { ...c, correct: b.correct || 0, mastered: b.mastered } : {
            w: b.w, ipa: b.ipa || "", pos: b.pos || "", zh: b.zh || "",
            enDef: b.enDef || "", ex: b.ex || "", theme: b.theme || "thinking",
            level: b.level || "KET", syn: [], ant: [], fam: [],
            correct: b.correct || 0, mastered: Boolean(b.mastered)
          };
        });
      } else {
        usingStarter = true;
        const starterPool = shuffle(this.getCorePool("all")).slice(0, 12);
        deck = starterPool.map((c) => {
          const p = window.WordBox ? window.WordBox.getCoreProgress(c.w) : { correct: 0, mastered: false };
          return { ...c, correct: p.correct, mastered: p.mastered };
        });
      }

      this.duelState.deck = deck;
      this.duelState.idx = 0;
      this.duelState.flipped = false;
      this.duelState.locked = false;
      this.duelState.usingStarterDeck = usingStarter;
      this._buildDuelQuizQ();
    }

    _buildDuelQuizQ() {
      const ds = this.duelState;
      if (!ds.deck.length) return;
      const target = ds.deck[ds.idx % ds.deck.length];
      const allCore = Array.isArray(window.CORE_VOCAB_DATA) ? window.CORE_VOCAB_DATA : [];
      const distractors = shuffle(allCore.filter((w) => w.w !== target.w)).slice(0, 3);
      ds.quizQ = { target, options: shuffle([target, ...distractors]) };
      ds.locked = false;
    }

    _renderFlipDuel(stage) {
      const en = this.isEn();
      const ds = this.duelState;
      if (!ds.deck.length) this._initFlipDuel();
      const item = ds.deck[ds.idx % ds.deck.length];
      if (!item) return;

      const prog = window.WordBox ? window.WordBox.getCoreProgress(item.w) : { correct: 0, mastered: false };
      const stars = Math.min(3, prog.correct);
      const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);

      const headerHTML = `
        <div class="duel-top-bar">
          <div class="duel-mascot-tip">
            <img src="${ds.usingStarterDeck ? "assets/art/mascot_happy.jpg" : "assets/art/mascot_reading.jpg"}" alt="Professor Dart" />
            <div>
              <div class="duel-title">🧰 ${en ? "My Word Box Flip Duel" : "我的生词宝盒 · 闪卡闯关"}</div>
              <div class="duel-sub">${
                ds.usingStarterDeck
                  ? (en ? "Your Word Box is empty right now, so Professor Dart prepared 12 essential starter core words! Tap words while reading any card to add your own!" : "生词宝盒目前为空，小博士为你精选了 12 个核心启航词！阅读 99 张卡片时点翻的生词都会自动出现在这里哦！")
                  : (en ? `Reviewing your ${ds.deck.length} collected words! Get each word right 3 times to unlock 🌟 Mastered!` : `正在专属特训你收集的 ${ds.deck.length} 个生词！每个词答对 3 次自动毕业点亮 🌟！`)
              }</div>
            </div>
          </div>
          <div class="duel-mode-pills">
            <button type="button" class="scene-pill ${ds.mode === "flash" ? "active" : ""}" data-dmode="flash">🃏 ${en ? "3D Flashcards" : "3D 翻翻卡"}</button>
            <button type="button" class="scene-pill ${ds.mode === "quiz" ? "active" : ""}" data-dmode="quiz">⚡ ${en ? "Meaning Quiz" : "词义闪电战"}</button>
            <button type="button" class="scene-pill ${ds.mode === "listen" ? "active" : ""}" data-dmode="listen">🎧 ${en ? "Listen & Pick" : "听音捉词"}</button>
          </div>
        </div>
      `;

      let bodyHTML = "";
      if (ds.mode === "flash") {
        bodyHTML = `
          <div class="duel-flash-wrap">
            <div class="duel-progress-pill">${en ? "Card" : "第"} ${(ds.idx % ds.deck.length) + 1} / ${ds.deck.length} · ${en ? "Mastery" : "掌握度"}: <span class="duel-stars">${starStr}</span></div>

            <div class="duel-3d-stage ${ds.flipped ? "is-flipped" : ""}" id="duel3DCard" role="button" tabindex="0">
              <div class="duel-3d-inner">
                <div class="duel-3d-face duel-3d-front">
                  <div class="duel-front-top">
                    <span class="duel-front-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[item.theme || "thinking"]) || ""}</span>
                    ${item.level ? `<span class="wb-lvl-tag lvl-${esc(item.level).toLowerCase()}">${esc(item.level)}</span>` : ""}
                  </div>
                  <div class="duel-big-word">${esc(item.w)}</div>
                  <div class="duel-ipa">${esc(item.ipa || "")} ${item.pos ? `· ${esc(item.pos)}` : ""}</div>
                  ${item.ex ? `<div class="duel-ex-hint">"${esc(item.ex)}"</div>` : ""}
                  <div class="duel-tap-cue">👆 ${en ? "Tap card to flip for Chinese & meaning!" : "点一下翻转查看中文释义！"}</div>
                </div>
                <div class="duel-3d-face duel-3d-back">
                  <div class="duel-back-word">${esc(item.w)}</div>
                  <div class="duel-big-zh">${esc(item.zh)}</div>
                  ${item.enDef ? `<div class="duel-back-def">💡 ${esc(item.enDef)}</div>` : ""}
                  ${item.ex ? `<div class="duel-back-ex">📖 ${esc(item.ex)}</div>` : ""}
                </div>
              </div>
            </div>

            <div class="duel-flash-actions">
              <button type="button" class="mini-btn" id="btnDuelSayNormal">🔊 ${en ? "Normal" : "常速"}</button>
              <button type="button" class="mini-btn" id="btnDuelSaySlow">🐢 ${en ? "Slow" : "慢速"}</button>
              <button type="button" class="mini-btn duel-again-btn" id="btnDuelAgain">🔄 ${en ? "Practice Again" : "再练一次"}</button>
              <button type="button" class="big-action-btn duel-know-btn" id="btnDuelKnow">✅ ${en ? "I Know It! (+1 ★)" : "我记住啦！(+1 ★)"}</button>
            </div>
          </div>
        `;
      } else {
        const q = ds.quizQ;
        const isListen = ds.mode === "listen";
        bodyHTML = `
          <div class="duel-quiz-wrap">
            <div class="duel-progress-pill">${en ? "Round" : "第"} ${(ds.idx % ds.deck.length) + 1} / ${ds.deck.length} · ${en ? "Streak" : "本轮答对"}: <b>${ds.sessionCorrect}</b></div>
            <div class="duel-quiz-prompt">
              ${isListen ? `
                <button type="button" class="big-action-btn" id="btnDuelPlayAudio">🔊 ${en ? "Listen to the Word!" : "点击听英语发音！"}</button>
                <div class="duel-quiz-sub">${en ? "Choose the exact word you hear!" : "选出你听到的正确单词！"}</div>
              ` : `
                <div class="duel-quiz-zh">${esc(q.target.zh)}</div>
                ${q.target.enDef ? `<div class="duel-quiz-sub">💡 ${esc(q.target.enDef)}</div>` : ""}
              `}
            </div>
            <div class="boss-options-grid">
              ${q.options.map((opt) => `
                <button type="button" class="boss-opt-btn" data-duelopt="${esc(opt.w)}">
                  <span class="boss-opt-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[opt.theme || "thinking"]) || ""}</span>
                  <span class="boss-opt-word">${esc(opt.w)}</span>
                  <span class="boss-opt-ipa">${esc(opt.ipa || "")}</span>
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }

      stage.innerHTML = `<div class="wai-card-box duel-shell">${headerHTML}${bodyHTML}</div>`;

      stage.querySelectorAll("[data-dmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          ds.mode = btn.getAttribute("data-dmode");
          ds.flipped = false;
          this._buildDuelQuizQ();
          this._renderFlipDuel(stage);
        });
      });

      if (ds.mode === "flash") {
        const card3d = stage.querySelector("#duel3DCard");
        card3d.addEventListener("click", () => {
          ds.flipped = !ds.flipped;
          card3d.classList.toggle("is-flipped", ds.flipped);
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(item.w);
        });
        stage.querySelector("#btnDuelSayNormal").addEventListener("click", () => {
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(item.w, { slow: false });
        });
        stage.querySelector("#btnDuelSaySlow").addEventListener("click", () => {
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(item.w, { slow: true });
        });
        stage.querySelector("#btnDuelAgain").addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          ds.idx = (ds.idx + 1) % ds.deck.length;
          ds.flipped = false;
          this._renderFlipDuel(stage);
        });
        stage.querySelector("#btnDuelKnow").addEventListener("click", (e) => {
          const res = window.WordBox ? window.WordBox.recordCorrect(item.w) : {};
          if (window.SFX) res.justMastered ? window.SFX.win() : window.SFX.chime();
          if (res.justMastered) {
            burstConfetti(e.currentTarget);
            if (this.app && typeof this.app.addStars === "function") this.app.addStars(2, "Word Mastered");
          }
          ds.sessionCorrect++;
          ds.idx = (ds.idx + 1) % ds.deck.length;
          ds.flipped = false;
          this._renderFlipDuel(stage);
        });
      } else {
        const q = ds.quizQ;
        const playBtn = stage.querySelector("#btnDuelPlayAudio");
        if (playBtn) {
          playBtn.addEventListener("click", () => {
            if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(q.target.w);
          });
          setTimeout(() => {
            if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(q.target.w);
          }, 120);
        }
        stage.querySelectorAll("[data-duelopt]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (ds.locked) return;
            ds.locked = true;
            const chosen = btn.getAttribute("data-duelopt");
            if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(chosen);
            if (chosen === q.target.w) {
              btn.classList.add("is-right");
              ds.sessionCorrect++;
              const res = window.WordBox ? window.WordBox.recordCorrect(q.target.w) : {};
              if (window.SFX && window.SFX.chime) window.SFX.chime();
              burstConfetti(btn);
              if (res.justMastered && this.app) this.app.addStars(2, "Word Mastered");
            } else {
              btn.classList.add("is-wrong");
              const r = stage.querySelector(`[data-duelopt="${CSS.escape(q.target.w)}"]`);
              if (r) r.classList.add("is-right");
              if (window.SFX && window.SFX.bonk) window.SFX.bonk();
            }
            setTimeout(() => {
              ds.idx = (ds.idx + 1) % ds.deck.length;
              this._buildDuelQuizQ();
              this._renderFlipDuel(stage);
            }, 900);
          });
        });
      }
    }

    // ========================================================================
    // GAME 4: 🔗 WORD FAMILY & PAIR LINK (Synonyms / Antonyms / Word Families)
    // ========================================================================
    _startPairRound() {
      const mode = this.linkState.mode;
      const pool = this.getCorePool();
      const candidates = [];
      const usedWords = new Set();

      for (const item of shuffle(pool)) {
        const list = mode === "syn" ? item.syn : mode === "ant" ? item.ant : item.fam;
        if (!Array.isArray(list) || !list.length) continue;
        const partner = String(list[0] || "").trim();
        if (!partner || partner.toLowerCase() === item.w.toLowerCase()) continue;
        if (usedWords.has(item.w.toLowerCase()) || usedWords.has(partner.toLowerCase())) continue;
        usedWords.add(item.w.toLowerCase());
        usedWords.add(partner.toLowerCase());
        candidates.push({
          id: item.w,
          left: item.w,
          right: partner,
          zh: item.zh,
          theme: item.theme
        });
        if (candidates.length >= 6) break;
      }

      // If filtered theme had fewer than 6 pairs, top up from all core words
      if (candidates.length < 6) {
        const all = Array.isArray(window.CORE_VOCAB_DATA) ? window.CORE_VOCAB_DATA : [];
        for (const item of shuffle(all)) {
          const list = mode === "syn" ? item.syn : mode === "ant" ? item.ant : item.fam;
          if (!Array.isArray(list) || !list.length) continue;
          const partner = String(list[0] || "").trim();
          if (!partner || partner.toLowerCase() === item.w.toLowerCase()) continue;
          if (usedWords.has(item.w.toLowerCase()) || usedWords.has(partner.toLowerCase())) continue;
          usedWords.add(item.w.toLowerCase());
          usedWords.add(partner.toLowerCase());
          candidates.push({ id: item.w, left: item.w, right: partner, zh: item.zh, theme: item.theme });
          if (candidates.length >= 6) break;
        }
      }

      this.linkState.pairs = candidates;
      this.linkState.leftOrder = shuffle(candidates);
      this.linkState.rightOrder = shuffle(candidates);
      this.linkState.selLeft = null;
      this.linkState.matchedIds = new Set();
      this.linkState.wrongFlash = null;
    }

    _renderPairLink(stage) {
      const en = this.isEn();
      const ls = this.linkState;
      const done = ls.pairs.length > 0 && ls.matchedIds.size >= ls.pairs.length;

      const modeInfo = {
        syn: { en: "≈ Match Synonyms (Same Meaning)", zh: "≈ 近义词连连看（意思相近）" },
        ant: { en: "↔ Match Antonyms (Opposites!)", zh: "↔ 反义词大对决（意思相反）" },
        fam: { en: "🌱 Match Word Families (Same Root!)", zh: "🌱 词族变身连连看（同根好兄弟）" }
      };

      stage.innerHTML = `
        <div class="wai-card-box pair-link-card">
          <div class="pair-link-top">
            <div>
              <div class="wai-hero-kicker">🔗 ${en ? "BUILD YOUR CORE WORD NETWORK!" : "织出你的核心英语词汇网络！"}</div>
              <h3 class="cloze-lab-title">${en ? modeInfo[ls.mode].en : modeInfo[ls.mode].zh}</h3>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${ls.mode === "syn" ? "active" : ""}" data-lmode="syn">≈ ${en ? "Synonyms" : "近义词"}</button>
              <button type="button" class="scene-pill ${ls.mode === "ant" ? "active" : ""}" data-lmode="ant">↔ ${en ? "Antonyms" : "反义词"}</button>
              <button type="button" class="scene-pill ${ls.mode === "fam" ? "active" : ""}" data-lmode="fam">🌱 ${en ? "Word Families" : "词族变形"}</button>
              <button type="button" class="mini-btn" id="btnPairNew">🔀 ${en ? "New Board" : "换一局"}</button>
            </div>
          </div>

          <div class="pair-link-hud">
            <span>✅ ${en ? "Matched" : "已配对"}: <b>${ls.matchedIds.size} / ${ls.pairs.length}</b></span>
            <span>🔥 ${en ? "Combo" : "连击"}: <b>×${ls.combo}</b></span>
            <span>⭐ ${en ? "Score" : "得分"}: <b>${ls.score}</b></span>
          </div>

          ${done ? `
            <div class="pair-win-banner">
              <img src="assets/art/mascot_cheer.jpg" alt="Professor Dart" />
              <div>
                <h3>🎉 ${en ? "Board Cleared! +3 ⭐ Stars!" : "全盘通关！奖励 +3 ⭐ 星星！"}</h3>
                <p>${en ? "Your vocabulary web is getting super strong!" : "你的核心词汇关系网越来越牢固啦！"}</p>
              </div>
              <button type="button" class="big-action-btn" id="btnPairNextRound">🚀 ${en ? "Play Next Board!" : "再来一盘！"}</button>
            </div>
          ` : `
            <div class="pair-columns">
              <div class="pair-col">
                <div class="pair-col-head">1️⃣ ${en ? "Core Word" : "核心词"}</div>
                ${ls.leftOrder.map((p) => {
                  const matched = ls.matchedIds.has(p.id);
                  const selected = ls.selLeft === p.id;
                  return `
                    <button type="button" class="pair-tile left-tile ${matched ? "is-matched" : ""} ${selected ? "is-selected" : ""}" data-pleft="${esc(p.id)}" ${matched ? "disabled" : ""}>
                      <span class="pair-tile-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[p.theme]) || ""}</span>
                      <span class="pair-tile-word">${esc(p.left)}</span>
                      <span class="pair-tile-zh">${esc(p.zh)}</span>
                    </button>
                  `;
                }).join("")}
              </div>

              <div class="pair-col">
                <div class="pair-col-head">2️⃣ ${ls.mode === "syn" ? (en ? "Synonym" : "近义伙伴") : ls.mode === "ant" ? (en ? "Opposite" : "反义对手") : (en ? "Word Family" : "同族变形")}</div>
                ${ls.rightOrder.map((p) => {
                  const matched = ls.matchedIds.has(p.id);
                  const wrong = ls.wrongFlash === p.id;
                  return `
                    <button type="button" class="pair-tile right-tile ${matched ? "is-matched" : ""} ${wrong ? "is-wrong" : ""}" data-pright="${esc(p.id)}" data-prightword="${esc(p.right)}" ${matched ? "disabled" : ""}>
                      <span class="pair-tile-word">${esc(p.right)}</span>
                      ${matched ? `<span class="pair-tile-zh">✓ ${esc(p.left)}</span>` : ""}
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          `}
        </div>
      `;

      stage.querySelectorAll("[data-lmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          ls.mode = btn.getAttribute("data-lmode");
          this._startPairRound();
          this._renderPairLink(stage);
        });
      });

      const newBtn = stage.querySelector("#btnPairNew");
      if (newBtn) newBtn.addEventListener("click", () => { this._startPairRound(); this._renderPairLink(stage); });
      const nextBtn = stage.querySelector("#btnPairNextRound");
      if (nextBtn) nextBtn.addEventListener("click", () => { this._startPairRound(); this._renderPairLink(stage); });

      stage.querySelectorAll("[data-pleft]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-pleft");
          ls.selLeft = id;
          ls.wrongFlash = null;
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(id);
          this._renderPairLink(stage);
        });
      });

      stage.querySelectorAll("[data-pright]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const rid = btn.getAttribute("data-pright");
          const rword = btn.getAttribute("data-prightword");
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(rword);
          if (!ls.selLeft) return;
          if (ls.selLeft === rid) {
            ls.matchedIds.add(rid);
            ls.selLeft = null;
            ls.combo++;
            ls.score += 10 * ls.combo;
            if (window.SFX) window.SFX.chime();
            if (window.WordBox) window.WordBox.recordCorrect(rid);
            if (ls.matchedIds.size >= ls.pairs.length) {
              if (window.SFX && window.SFX.chime) window.SFX.chime();
              burstConfetti(btn);
              if (this.app && typeof this.app.addStars === "function") this.app.addStars(3, "Pair Link Win");
            }
          } else {
            ls.combo = 0;
            ls.wrongFlash = rid;
            if (window.SFX && window.SFX.bonk) window.SFX.bonk();
          }
          this._renderPairLink(stage);
        });
      });
    }

    // ========================================================================
    // GAME 5: 📚 ILLUSTRATED 680 CORE WORDBOOK (KET / PET / Kids-AWL)
    // ========================================================================
    _renderCoreWordbook(stage) {
      const en = this.isEn();
      const levelFilter = this._wbLevel || "all";
      const statusFilter = this._wbStatus || "all";
      const query = (this._wbQuery || "").trim().toLowerCase();

      let pool = this.getCorePool();
      if (levelFilter !== "all") pool = pool.filter((w) => w.level === levelFilter);
      if (statusFilter === "mastered") pool = pool.filter((w) => window.WordBox && window.WordBox.getCoreProgress(w.w).mastered);
      else if (statusFilter === "unmastered") pool = pool.filter((w) => !window.WordBox || !window.WordBox.getCoreProgress(w.w).mastered);
      if (query) {
        pool = pool.filter((w) =>
          w.w.toLowerCase().includes(query) ||
          (w.zh && w.zh.includes(query)) ||
          (w.enDef && w.enDef.toLowerCase().includes(query))
        );
      }

      const shown = pool.slice(0, 120);

      stage.innerHTML = `
        <div class="wai-card-box core-wb-shell">
          <div class="core-wb-controls">
            <input type="search" id="coreWbSearch" class="quick-search" value="${esc(this._wbQuery || "")}" placeholder="🔍 ${en ? "Search 680+ core words (English or Chinese)..." : "搜 680+ 核心词（中英文皆可）..."}" />
            <div class="core-wb-pills">
              ${["all", "KET", "PET", "AWL"].map((lv) => `
                <button type="button" class="scene-pill ${levelFilter === lv ? "active" : ""}" data-wblvl="${lv}">${lv === "all" ? (en ? "All Levels" : "全级别") : lv}</button>
              `).join("")}
              <button type="button" class="scene-pill ${statusFilter === "all" ? "active" : ""}" data-wbstat="all">${en ? "All" : "全部"}</button>
              <button type="button" class="scene-pill ${statusFilter === "mastered" ? "active" : ""}" data-wbstat="mastered">🌟 ${en ? "Mastered" : "已掌握"}</button>
              <button type="button" class="scene-pill ${statusFilter === "unmastered" ? "active" : ""}" data-wbstat="unmastered">📖 ${en ? "To Learn" : "待学习"}</button>
            </div>
          </div>

          <div class="core-wb-count">${en ? `Showing ${shown.length} of ${pool.length} matching core words` : `显示 ${shown.length} / ${pool.length} 个匹配核心词`}</div>

          <div class="core-wb-grid">
            ${shown.map((w) => {
              const prog = window.WordBox ? window.WordBox.getCoreProgress(w.w) : { correct: 0, mastered: false, inBox: false };
              const stars = Math.min(3, prog.correct);
              const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
              const cardId = (w.cards && w.cards[0]) || "";
              return `
                <div class="core-wb-card ${prog.mastered ? "is-mastered" : ""}">
                  <div class="core-wb-head">
                    <span class="core-wb-svg">${(window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[w.theme]) || ""}</span>
                    <div class="core-wb-word-col">
                      <div class="core-wb-word-row">
                        <span class="core-wb-word">${esc(w.w)}</span>
                        <span class="wb-lvl-tag lvl-${esc(w.level || "KET").toLowerCase()}">${esc(w.level || "KET")}</span>
                      </div>
                      <div class="core-wb-ipa">${esc(w.ipa || "")} · ${esc(w.pos || "")}</div>
                    </div>
                    <button type="button" class="mini-btn core-wb-say" data-say="${esc(w.w)}" title="Listen">🔊</button>
                  </div>
                  <div class="core-wb-zh">${esc(w.zh)}</div>
                  <div class="core-wb-def">${esc(w.enDef || "")}</div>
                  ${w.ex ? `<div class="core-wb-ex">"${esc(w.ex)}"</div>` : ""}
                  <div class="core-wb-foot">
                    <span class="core-wb-stars">${starStr}</span>
                    <div style="display:flex;gap:6px;">
                      <button type="button" class="mini-btn core-wb-boxbtn" data-addbox="${esc(w.w)}">${prog.inBox ? "🧰✓" : "+🧰"}</button>
                      ${cardId ? `<button type="button" class="mini-btn core-wb-cardbtn" data-opencard="${esc(cardId)}">📖</button>` : ""}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      const inp = stage.querySelector("#coreWbSearch");
      inp.addEventListener("input", () => {
        this._wbQuery = inp.value;
        this._renderCoreWordbook(stage);
      });
      stage.querySelectorAll("[data-wblvl]").forEach((b) => {
        b.addEventListener("click", () => {
          this._wbLevel = b.getAttribute("data-wblvl");
          this._renderCoreWordbook(stage);
        });
      });
      stage.querySelectorAll("[data-wbstat]").forEach((b) => {
        b.addEventListener("click", () => {
          this._wbStatus = b.getAttribute("data-wbstat");
          this._renderCoreWordbook(stage);
        });
      });
      stage.querySelectorAll("[data-say]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(b.getAttribute("data-say"));
        });
      });
      stage.querySelectorAll("[data-addbox]").forEach((b) => {
        b.addEventListener("click", () => {
          const w = b.getAttribute("data-addbox");
          const info = window.FlipReader && window.FlipReader.lookup(w);
          if (info && window.WordBox) {
            window.WordBox.recordTap(info, (info.cards && info.cards[0]) || "");
            if (window.SFX) window.SFX.pop();
            this._renderCoreWordbook(stage);
          }
        });
      });
      stage.querySelectorAll("[data-opencard]").forEach((b) => {
        b.addEventListener("click", () => {
          if (this.app && typeof this.app.openSuperCard === "function") {
            this.app.openSuperCard(b.getAttribute("data-opencard"));
          }
        });
      });
    }
  }

  window.WordAdventureGames = new WordAdventureHub();
})();
