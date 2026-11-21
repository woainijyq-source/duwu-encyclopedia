// ============================================================================
// 《奇妙毒物科学游乐园》纯视觉交互主控逻辑 (v3 全量五大进阶版)
// 零大段文字墙 · 99高清实拍 · 全书99卡3D分子 · 借毒生态缸 · 分子拆弹台 · 王牌对战 · 小馆长配音间 · 4大找茬
// ============================================================================

(function () {
  const SAVE_KEY = "biotoxin_visual_playground_v3";
  const LEGACY_SAVE_KEY = "biotoxin_visual_playground_v2";

  // 全书 99 档案 -> 25 套真实 PubChem / 晶体 / 多肽 3D 球棍模型全覆盖映射表！
  const ARCHIVE_MOL3D = {
    // 序章
    "ch0-01": "theobromine", "ch0-02": "ttx", "ch0-03": "aconitine", "ch0-04": "captopril",
    // 第1章 动物篇
    "ch1-01": "peptide_helix", "ch1-02": "peptide_helix", "ch1-03": "batrachotoxin",
    "ch1-04": "digitoxigenin", "ch1-05": "captopril", "ch1-06": "peptide_helix",
    "ch1-07": "peptide_helix", "ch1-08": "peptide_helix", "ch1-09": "batrachotoxin",
    "ch1-10": "peptide_helix", "ch1-11": "peptide_helix", "ch1-12": "peptide_helix",
    "ch1-13": "histamine",
    // 第2章 昆虫篇
    "ch2-01": "histamine", "ch2-02": "peptide_helix", "ch2-03": "histamine",
    "ch2-04": "histamine", "ch2-05": "peptide_helix", "ch2-06": "histamine",
    "ch2-07": "histamine", "ch2-08": "peptide_helix", "ch2-09": "peptide_helix",
    "ch2-10": "cantharidin",
    // 第3章 植物篇
    "ch3-01": "aconitine", "ch3-02": "cantharidin", "ch3-03": "cicutoxin",
    "ch3-04": "nicotine", "ch3-05": "peptide_helix", "ch3-06": "digitoxigenin",
    "ch3-07": "atropine", "ch3-08": "atropine", "ch3-09": "lycorine",
    "ch3-10": "lycorine", "ch3-11": "colchicine", "ch3-12": "cycasin",
    "ch3-13": "lycorine", "ch3-14": "aconitine", "ch3-15": "digitoxigenin",
    "ch3-16": "psilocybin", "ch3-17": "digitoxigenin", "ch3-18": "peptide_helix",
    "ch3-19": "cucurbitacin", "ch3-20": "peptide_helix",
    // 第4章 蔬菜篇
    "ch4-01": "solanidine", "ch4-02": "peptide_helix", "ch4-03": "cucurbitacin",
    "ch4-04": "cucurbitacin", "ch4-05": "digitoxigenin", "ch4-06": "mpn",
    // 第5章 蘑菇篇
    "ch5-01": "amanitin", "ch5-02": "coprine", "ch5-03": "cantharidin",
    "ch5-04": "psilocybin", "ch5-05": "psilocybin", "ch5-06": "psilocybin",
    "ch5-07": "cantharidin", "ch5-08": "muscarine", "ch5-09": "cucurbitacin",
    "ch5-10": "muscarine", "ch5-11": "amanitin", "ch5-12": "cucurbitacin",
    "ch5-13": "coprine", "ch5-14": "coprine",
    // 第6章 水中生物篇
    "ch6-01": "ttx", "ch6-02": "ttx", "ch6-03": "peptide_helix",
    "ch6-04": "peptide_helix", "ch6-05": "peptide_helix", "ch6-06": "solanidine",
    "ch6-07": "peptide_helix", "ch6-08": "ttx", "ch6-09": "ttx",
    "ch6-10": "peptide_helix", "ch6-11": "histamine", "ch6-12": "peptide_helix",
    "ch6-13": "peptide_helix", "ch6-14": "peptide_helix", "ch6-15": "peptide_helix",
    "ch6-16": "solanidine", "ch6-17": "peptide_helix", "ch6-18": "muscarine",
    // 第7章 矿物篇
    "ch7-01": "cinnabar", "ch7-02": "arsenic_cage", "ch7-03": "arsenic_cage",
    "ch7-04": "cicutoxin", "ch7-05": "cinnabar", "ch7-06": "arsenic_cage",
    "ch7-07": "psilocybin", "ch7-08": "cinnabar",
    // 第8章 化学篇
    "ch8-01": "nicotine", "ch8-02": "cycasin", "ch8-03": "permethrin",
    "ch8-04": "permethrin", "ch8-05": "arsenic_cage", "ch8-06": "cicutoxin"
  };

  // 全景生态插画地图上的 12 个精准坐标热点（中英双语）
  const PANORAMA_PINS = [
    { id: "ch1-09", x: 12.5, y: 66, label: "箭毒蛙", en: "Dart Frog" },
    { id: "ch1-03", x: 19.5, y: 27, label: "黑头林鵙鹟", en: "Poison Bird" },
    { id: "ch3-01", x: 27.0, y: 49, label: "乌头", en: "Monkshood" },
    { id: "ch3-17", x: 39.2, y: 22, label: "夹竹桃", en: "Oleander" },
    { id: "ch4-01", x: 40.5, y: 74, label: "马铃薯", en: "Green Potato" },
    { id: "ch5-07", x: 47.2, y: 87, label: "发光月夜蕈", en: "Glowing Shroom" },
    { id: "ch5-01", x: 60.0, y: 78, label: "白鹅膏", en: "Destroying Angel" },
    { id: "ch6-12", x: 66.2, y: 57, label: "夜海葵", en: "Sea Anemone" },
    { id: "ch6-07", x: 78.8, y: 72, label: "地纹芋螺", en: "Cone Snail" },
    { id: "ch6-08", x: 82.5, y: 52, label: "蓝环章鱼", en: "Blue-Ringed Octopus" },
    { id: "ch7-01", x: 94.0, y: 75, label: "辰砂", en: "Cinnabar" },
    { id: "ch7-02", x: 96.2, y: 39, label: "雌黄", en: "Orpiment" }
  ];

  // 细胞游乐场底部 6 个大图标试剂瓶（中英双语）
  const CELL_REAGENTS = [
    { id: "ttx", name: "河鲀毒素", enName: "TTX Toxin", sub: "软木塞堵城门", enSub: "Plugs sodium gate", photoId: "ch6-01", emoji: "🐡" },
    { id: "frog", name: "箭毒蛙/乌头", enName: "Dart Frog Toxin", sub: "木楔撑开城门", enSub: "Wedges gate open", photoId: "ch1-09", emoji: "🐸" },
    { id: "cobra", name: "眼镜王蛇毒", enName: "Cobra Venom", sub: "三指蛋白抢座", enSub: "Blocks nerve seat", photoId: "ch1-06", emoji: "👑" },
    { id: "amanitin", name: "白鹅膏铁锁", enName: "Amanitin Lock", sub: "锁死细胞工厂", enSub: "Stops protein factory", photoId: "ch5-01", emoji: "🍄" },
    { id: "pepsin", name: "胃蛋白酶剪刀", enName: "Stomach Scissors", sub: "试试能剪碎谁？", enSub: "Cuts protein venom", photoId: null, emoji: "✂️" },
    { id: "clean", name: "清水冲洗复原", enName: "Pure Water Flush", sub: "恢复健康细胞", enSub: "Reset healthy cell", photoId: null, emoji: "🚿" }
  ];

  // 急诊室视觉化药丸合成关卡（中英双语）
  const CLINIC_PATIENTS = [
    {
      id: "p1", avatar: "👴", name: "高血压爷爷", enName: "Grandpa High-BP", monitorIcon: "🩸",
      badStat: "血压 195 mmHg · 血管紧绷警报！", enBadStat: "Blood Pressure 195 mmHg · Tight Vessel Alert!",
      goodStat: "血压 118 mmHg · 血管舒张轻松啦！😄", enGoodStat: "Blood Pressure 118 mmHg · Relaxed & Safe! 😄",
      needText: "快找【一咬猎物就让血压骤降】的毒蛇原液！", enNeedText: "Find the snake venom that makes blood pressure drop rapidly!",
      rightId: "ch1-05",
      choices: ["ch1-05", "ch5-01", "ch7-01"],
      drugName: "💊 卡托普利降压片", enDrugName: "💊 Captopril BP Pill",
      winSpeech: "太棒啦！科学家模仿蝮蛇毒肽造出了降压神药『卡托普利』，爷爷的血管一下子放松啦！",
      enWinSpeech: "Brilliant! Scientists copied viper venom peptides to create Captopril medicine. Grandpa's blood vessels relaxed right away!"
    },
    {
      id: "p2", avatar: "🤕", name: "剧痛折磨叔叔", enName: "Uncle Severe-Pain", monitorIcon: "⚡",
      badStat: "疼痛指数 10级 · 普通止痛药失效！", enBadStat: "Pain Level 10/10 · Normal painkillers fail!",
      goodStat: "疼痛指数 0级 · 安稳睡着不上瘾！😌", enGoodStat: "Pain Level 0/10 · Peaceful sleep, non-addictive! 😌",
      needText: "快找海底会射鱼叉的【美丽花纹海螺】微肽！", enNeedText: "Find the ocean harpoon hunter with a patterned shell!",
      rightId: "ch6-07",
      choices: ["ch6-13", "ch6-07", "ch4-01"],
      drugName: "💉 齐考诺肽止痛针", enDrugName: "💉 Ziconotide Relief",
      winSpeech: "研发成功！第6章『地纹芋螺』的微肽能精准关掉痛觉钙通道，止痛威力是吗啡的1000倍还不成瘾！",
      enWinSpeech: "Success! Cone Snail venom peptides precisely block pain signals, working 1,000 times stronger than morphine without addiction!"
    },
    {
      id: "p3", avatar: "🧒", name: "脑部手术导航", enName: "Brain Surgery Guide", monitorIcon: "🔦",
      badStat: "屏幕一片模糊 · 看不清坏细胞边界！", enBadStat: "Blurry scan · Hard to detect bad tumor cells!",
      goodStat: "坏细胞发亮啦 · 医生精准保护大脑！✨", enGoodStat: "Tumor cells glow bright · Brain stays protected! ✨",
      needText: "快找沙漠里金黄色、能自动贴住肿瘤的【蝎子】！", enNeedText: "Find the golden desert scorpion whose toxin sticks to tumor cells!",
      rightId: "ch2-05",
      choices: ["ch2-05", "ch2-01", "ch2-10"],
      drugName: "🔦 蝎毒肿瘤荧光画笔", enDrugName: "🔦 Scorpion Tumor Paint",
      winSpeech: "太神奇啦！『以色列金蝎』的氯毒素装上小灯后，能让肿瘤细胞自己发光给外科医生指路！",
      enWinSpeech: "Amazing! Deathstalker Scorpion chlorotoxin carries a glowing tag that lights up cancer cells so doctors can protect healthy brain tissue!"
    },
    {
      id: "p4", avatar: "👵", name: "心跳无力奶奶", enName: "Grandma Weak-Heart", monitorIcon: "🫀",
      badStat: "心跳微弱无力 · 泵不动血液啦！", enBadStat: "Weak heartbeat · Struggling to pump blood!",
      goodStat: "心跳咚咚有力 · 奶奶气色红润！❤️", enGoodStat: "Strong steady heartbeat · Grandma feels great! ❤️",
      needText: "快找像一串串紫粉风铃一样的【强心名花】！", enNeedText: "Find the purple bell-shaped flower that strengthens weak hearts!",
      rightId: "ch3-06",
      choices: ["ch3-05", "ch3-06", "ch3-03"],
      drugName: "❤️ 地高辛微克强心片", enDrugName: "❤️ Digoxin Micro-Pill",
      winSpeech: "精准控量大师！剧毒『毛地黄』缩小到0.1毫克级，就变成了守护心脏两百年的经典良药！",
      enWinSpeech: "Master of precision dose! At a tiny 0.1-milligram dose, deadly Foxglove becomes Digoxin — a heart medicine used for over 200 years!"
    },
    {
      id: "p5", avatar: "🦶", name: "痛风脚肿伯伯", enName: "Uncle Swollen-Joint", monitorIcon: "🔥",
      badStat: "白细胞顺着微管铁轨冲去关节打群架！", enBadStat: "White blood cells are racing into the joint causing severe swelling!",
      goodStat: "关节消肿不疼啦 · 还能种无籽西瓜！🍉", enGoodStat: "Swelling vanished · Bonus: creates seedless watermelons! 🍉",
      needText: "快找秋天开花、会【拆掉微管铁轨】的植物球茎！", enNeedText: "Find the autumn flower bulb that pauses cell division tracks!",
      rightId: "ch3-11",
      choices: ["ch3-11", "ch3-18", "ch4-06"],
      drugName: "💊 秋水仙碱消炎片", enDrugName: "💊 Colchicine Relief",
      winSpeech: "答对啦！『秋水仙碱』既能拆掉微管阻止白细胞去关节发炎，又能帮农民伯伯培育无籽大西瓜！",
      enWinSpeech: "Spot on! Autumn Crocus colchicine stops painful joint swelling and even helps farmers grow sweet seedless watermelons!"
    }
  ];

  const state = {
    stage: "world",
    magicFilter: "all",
    chFilter: "all",
    search: "",
    pinyin: true,
    sound: true,
    theme: "light",

    litCards: [],
    foundHunt: [], // 25 处跨场景 key 列表
    curedIds: [],
    surgeryWon: [],
    cardQuizWon: [],
    unlockedCuriosities: [],
    wonSpotChallenges: [],
    wonEnShadowing: [],
    masteredWords: [],
    wonCardSpelling: [],
    sentencesBuilt: [],
    memoryWins: 0,
    bubblePops: 0,
    speakStageCount: 0,
    sortedCorrect: [],
    safetyWon: [],
    detectiveCasesWon: [],
    mythWon: [],
    dailyProgress: null,
    pkMode: "zh", // 'zh' | 'en'
    pkStreak: 0,
    stars: 0,

    // Biolab 子标签
    biolabSub: "cell",
    surgeryMode: "ttx_lock",
    ecoSpecies: "frog",

    // Tummy duel
    tummyMode: "choco",
    chocoPieces: 0,
    drankBeer: false,

    // Clinic
    clinicIdx: 0,
    pickedBottle: null,

    // Detective & 4-Scene Hunt
    detSub: "battler",
    huntSceneIdx: 0,
    pkAnswer: null,
    pkChoices: []
  };

  let molViewer = null;
  let cellPlayground = null;
  let molSurgery = null;
  let ecoSandbox = null;
  let cardBattler = null;
  let liveEnArena = null;
  let englishPlayground = null;
  let toxClassifyLab = null;
  let safetyArena = null;
  let mysteryArena = null;
  let mythArena = null;
  let passportModal = null;
  let voiceStudio = null;
  let aiCompanion = null;
  let currentOpenCard = null;
  let unsubscribeModalTts = null;
  const sessionOpenedCards = new Set();

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY) || "{}";
      const s = JSON.parse(raw);
      state.litCards = s.litCards || [];
      // 兼容旧版找茬 key (potato -> p_potato)
      state.foundHunt = (s.foundHunt || []).map((k) => (k.includes("_") ? k : `p_${k}`));
      state.curedIds = s.curedIds || [];
      state.surgeryWon = s.surgeryWon || [];
      state.cardQuizWon = s.cardQuizWon || [];
      state.unlockedCuriosities = s.unlockedCuriosities || [];
      state.wonSpotChallenges = s.wonSpotChallenges || [];
      state.wonEnShadowing = s.wonEnShadowing || [];
      state.masteredWords = s.masteredWords || [];
      state.wonCardSpelling = s.wonCardSpelling || [];
      state.sentencesBuilt = s.sentencesBuilt || [];
      state.memoryWins = s.memoryWins || 0;
      state.bubblePops = s.bubblePops || 0;
      state.speakStageCount = s.speakStageCount || 0;
      state.sortedCorrect = s.sortedCorrect || [];
      state.safetyWon = s.safetyWon || [];
      state.detectiveCasesWon = s.detectiveCasesWon || [];
      state.mythWon = s.mythWon || [];
      state.dailyProgress = s.dailyProgress || null;
      state.stars = s.stars || 0;
      if (s.theme) state.theme = s.theme;
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        litCards: state.litCards,
        foundHunt: state.foundHunt,
        curedIds: state.curedIds,
        surgeryWon: state.surgeryWon,
        cardQuizWon: state.cardQuizWon,
        unlockedCuriosities: state.unlockedCuriosities,
        wonSpotChallenges: state.wonSpotChallenges,
        wonEnShadowing: state.wonEnShadowing,
        masteredWords: state.masteredWords,
        wonCardSpelling: state.wonCardSpelling,
        sentencesBuilt: state.sentencesBuilt,
        memoryWins: state.memoryWins,
        bubblePops: state.bubblePops,
        speakStageCount: state.speakStageCount,
        sortedCorrect: state.sortedCorrect,
        safetyWon: state.safetyWon,
        detectiveCasesWon: state.detectiveCasesWon,
        mythWon: state.mythWon,
        dailyProgress: state.dailyProgress,
        stars: state.stars,
        theme: state.theme
      }));
    } catch (_) {}
    if (passportModal) {
      passportModal.syncTopBadge();
    } else {
      const el = document.getElementById("starCounter");
      const en = window.isEn ? window.isEn() : true;
      if (el) el.innerHTML = `⭐ ${state.stars} <span class="passport-chip-tag">${en ? "🏅Passport" : "🏅护照"}</span>`;
    }
  }

  function addStars(n) {
    state.stars += n;
    saveState();
  }

  function trackMission(field, delta) {
    if (!window.KnowledgeGamesModule || !window.KnowledgeGamesModule.ensureDailyState) return;
    const dp = window.KnowledgeGamesModule.ensureDailyState(state);
    dp[field] = (dp[field] || 0) + (delta || 1);
    saveState();
  }

  function ruby(str) {
    if (!str) return "";
    let res = "";
    for (const ch of str) {
      const py = window.PINYIN_DICT[ch];
      res += py ? `<ruby>${ch}<rt>${py}</rt></ruby>` : ch;
    }
    return res;
  }

  function renderClauses(str, bilingualObj) {
    if (window.DoubaoTTS && window.DoubaoTTS.renderClausesHTML) {
      return window.DoubaoTTS.renderClausesHTML(str, ruby, bilingualObj);
    }
    return ruby(str);
  }

  function cleanMol(str) {
    if (window.DoubaoTTS && window.DoubaoTTS.cleanMolecule) {
      return window.DoubaoTTS.cleanMolecule(str);
    }
    return str;
  }

  function speak(text, opts) {
    if (!state.sound) return;
    const actionVid = document.getElementById("modalActionVideo");
    if (actionVid && !actionVid.paused) {
      actionVid.pause();
    }
    if (window.DoubaoTTS) {
      window.DoubaoTTS.speak(text, opts);
      return;
    }
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.98;
    u.pitch = 1.08;
    window.speechSynthesis.speak(u);
  }

  function getPhoto(id) {
    return (window.ARCHIVE_PHOTOS && window.ARCHIVE_PHOTOS[id]) || null;
  }

  function getMol3DData(id) {
    const key = ARCHIVE_MOL3D[id] || "ttx";
    return (window.MOLECULES_3D && window.MOLECULES_3D[key]) || null;
  }

  // ==========================================================================
  // 顶部导航与工具开关
  // ==========================================================================
  function initTopBar() {
    if (state.theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    const starBtn = document.getElementById("starCounter");
    if (starBtn) {
      const en = window.isEn ? window.isEn() : true;
      starBtn.innerHTML = `⭐ ${state.stars} <span class="passport-chip-tag">${en ? "🏅Passport" : "🏅护照"}</span>`;
      starBtn.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        if (passportModal) passportModal.open();
      });
    }

    document.querySelectorAll(".stage-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        switchStage(btn.getAttribute("data-stage"));
      });
    });

    const btnSound = document.getElementById("btnSound");
    btnSound.addEventListener("click", () => {
      state.sound = !state.sound;
      window.SFX.enabled = state.sound;
      if (window.DoubaoTTS) {
        window.DoubaoTTS.enabled = state.sound;
        if (!state.sound) window.DoubaoTTS.stop();
      }
      if (!state.sound && "speechSynthesis" in window) window.speechSynthesis.cancel();
      btnSound.classList.toggle("on", state.sound);
      const en = window.isEn ? window.isEn() : true;
      btnSound.textContent = state.sound ? (en ? "🔊 Sound" : "🔊 音效") : (en ? "🔇 Muted" : "🔇 静音");
    });

    const btnPinyin = document.getElementById("btnPinyin");
    btnPinyin.addEventListener("click", () => {
      state.pinyin = !state.pinyin;
      document.body.classList.toggle("hide-pinyin", !state.pinyin);
      btnPinyin.classList.toggle("on", state.pinyin);
    });

    const btnTheme = document.getElementById("btnTheme");
    const syncThemeTxt = () => {
      const en = window.isEn ? window.isEn() : true;
      btnTheme.textContent = state.theme === "light"
        ? (en ? "🌙 Night" : "🌙 夜光")
        : (en ? "☀️ Bright" : "☀️ 绘本");
    };
    syncThemeTxt();
    btnTheme.addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      if (state.theme === "light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
      syncThemeTxt();
      saveState();
    });

    const btnIntroVideo = document.getElementById("btnIntroVideo");
    const introModal = document.getElementById("introVideoModal");
    const introPlayer = document.getElementById("introVideoPlayer");
    const btnCloseIntro = document.getElementById("btnCloseIntroVideo");
    if (btnIntroVideo && introModal && introPlayer) {
      const closeIntro = () => {
        try { introPlayer.pause(); } catch (_) {}
        introModal.classList.remove("open");
      };
      btnIntroVideo.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        if (window.DoubaoTTS) window.DoubaoTTS.stop();
        if (voiceStudio) voiceStudio.stopPlayback();
        introModal.classList.add("open");
        try {
          introPlayer.currentTime = 0;
          introPlayer.play();
        } catch (_) {}
      });
      if (btnCloseIntro) btnCloseIntro.addEventListener("click", closeIntro);
      introModal.addEventListener("click", (e) => {
        if (e.target === introModal) closeIntro();
      });
    }
  }

  function switchStage(st) {
    state.stage = st;
    if (st !== "detective" && liveEnArena) {
      liveEnArena.stopMedia();
    }
    document.querySelectorAll(".stage-tab").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-stage") === st);
    });
    document.querySelectorAll(".stage-view").forEach((v) => {
      v.classList.toggle("active", v.id === `stage-${st}`);
    });
    if (st === "english") {
      if (window.WordAdventureGames && typeof window.WordAdventureGames.render === "function") {
        window.WordAdventureGames.render();
      } else if (englishPlayground) {
        if (!englishPlayground.wbWord) englishPlayground.init();
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==========================================================================
  // 升级4：初始化小馆长配音间（本地 IndexedDB + 家庭云端同步）
  // ==========================================================================
  function initVoiceStudio() {
    if (!window.CuratorVoiceModule) return;
    voiceStudio = new window.CuratorVoiceModule.CuratorVoiceStudio((count) => {
      const pill = document.getElementById("pillVoicedFilter");
      const en = window.isEn ? window.isEn() : true;
      if (pill) pill.textContent = en ? `🎙️ My Voice (${count}/99)` : `🎙️ 小馆长已配音 (${count}/99)`;
      renderPhotoDex();
    });
    voiceStudio.init();
  }

  function renderWorldHeadersAndPins() {
    const en = window.isEn ? window.isEn() : true;
    const stagesEn = window.DUWU_I18N ? window.DUWU_I18N.getStagesEn() : {};
    const chEnMap = stagesEn.CHAPTERS || {};

    const pinWrap = document.getElementById("panoramaPins");
    if (pinWrap) {
      pinWrap.innerHTML = PANORAMA_PINS.map((p, idx) => {
        const ph = getPhoto(p.id);
        const item = window.CATALOG_DATA.find((x) => x.id === p.id);
        const lbl = en ? p.en : ruby(p.label);
        return `
          <button class="map-pin" data-id="${p.id}" style="left:${p.x}%;top:${p.y}%;animation-delay:${idx * 0.22}s;" title="${en ? p.en : p.label}">
            ${ph ? `<img src="${ph}" alt="${en ? p.en : p.label}" loading="lazy" />` : `<span>${item ? item.emoji : "✨"}</span>`}
            <span class="map-pin-label">${lbl}</span>
          </button>
        `;
      }).join("");
      pinWrap.querySelectorAll(".map-pin").forEach((btn) => {
        btn.addEventListener("click", () => {
          window.SFX.pop();
          openSuperCard(btn.getAttribute("data-id"));
        });
      });
    }

    const chStrip = document.getElementById("chapterStrip");
    if (chStrip) {
      chStrip.innerHTML = window.CHAPTERS.map((c) => {
        const label = en && chEnMap[c.id] ? chEnMap[c.id].short : c.short;
        return `
          <button class="ch-chip ${c.id === state.chFilter ? "active" : ""}" data-ch="${c.id}">
            ${c.icon} ${label}
          </button>
        `;
      }).join("");
      chStrip.querySelectorAll(".ch-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          window.SFX.pop();
          state.chFilter = chip.getAttribute("data-ch");
          chStrip.querySelectorAll(".ch-chip").forEach((x) => x.classList.remove("active"));
          chip.classList.add("active");
          renderPhotoDex();
        });
      });
    }

    const rvPill = document.getElementById("pillRealVidFilter");
    if (rvPill && window.REAL_VIDEOS) {
      const camCnt = Object.values(window.REAL_VIDEOS).filter((v) => v && v.kind !== "realistic_scene").length;
      if (camCnt > 0) rvPill.textContent = en ? `🎥 Real Nature Clips (${camCnt})` : `🎥 野外真实实拍 (${camCnt})`;
    }
    const vPill = document.getElementById("pillVoicedFilter");
    if (vPill) {
      const cnt = voiceStudio && voiceStudio.getVoicedArchiveCount ? voiceStudio.getVoicedArchiveCount() : 0;
      vPill.textContent = en ? `🎙️ My Voice (${cnt}/99)` : `🎙️ 小馆长已配音 (${cnt}/99)`;
    }
  }

  // ==========================================================================
  // 第 1 站：全景寻宝地图 + 99 张高清实拍3D闪卡墙
  // ==========================================================================
  function initWorldStage() {
    renderWorldHeadersAndPins();

    document.querySelectorAll("#magicFilterBar .magic-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        window.SFX.pop();
        state.magicFilter = pill.getAttribute("data-mfilter");
        document.querySelectorAll("#magicFilterBar .magic-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        renderPhotoDex();
      });
    });

    document.getElementById("dexSearch").addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderPhotoDex();
    });

    renderPhotoDex();
  }

  function renderPhotoDex() {
    const grid = document.getElementById("photoDexGrid");
    if (!grid) return;
    const medIds = new Set(["ch0-04", "ch1-01", "ch1-05", "ch1-06", "ch2-02", "ch2-05", "ch2-10", "ch3-06", "ch3-07", "ch3-10", "ch3-11", "ch6-01", "ch6-07", "ch7-02"]);

    const list = window.CATALOG_DATA.filter((item) => {
      if (state.chFilter !== "all" && item.chapter !== state.chFilter) return false;
      if (state.magicFilter === "realvid") {
        const rv = window.REAL_VIDEOS && window.REAL_VIDEOS[item.id];
        if (!rv || rv.kind === "realistic_scene") return false;
      }
      if (state.magicFilter === "voiced" && !(voiceStudio && voiceStudio.hasVoice(item.id))) return false;
      if (state.magicFilter === "neuro" && item.mech !== "neuro") return false;
      if (state.magicFilter === "blood" && item.mech !== "blood") return false;
      if (state.magicFilter === "cell" && item.mech !== "cell") return false;
      if (state.magicFilter === "med" && !medIds.has(item.id)) return false;
      if (state.search) {
        const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || {};
        const vocabStr = Array.isArray(ce.vocab) ? ce.vocab.map((v) => `${v.w} ${v.zh}`).join(" ") : "";
        const hay = `${item.name} ${item.code} ${item.molecule} ${ce.enName || ""} ${vocabStr}`.toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });

    const en = window.isEn ? window.isEn() : true;
    const enCardsMap = (window.ENGLISH_ENCYCLOPEDIA && window.ENGLISH_ENCYCLOPEDIA.cards) || {};

    if (list.length === 0 && state.magicFilter === "voiced") {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:36px 20px;background:var(--bg-panel);border-radius:24px;border:2px dashed var(--c-amber);">
          <div style="font-size:3rem;">🎙️👑</div>
          <h3 style="margin:8px 0;">${en ? "No curator voice recordings yet!" : "小馆长还没有录第一条专属解说哦！"}</h3>
          <div style="color:var(--text-sub);font-weight:700;">${en ? "Open any card and hold the microphone button to record your own voice commentary!" : "点开任意一张生物闪卡，按住【🎙️ 按住说话配音】不放，松开就能点亮专属金勋章（每种毒物还能录多条哦）！"}</div>
        </div>
      `;
      return;
    }

    const mechBadgeLabel = {
      neuro: { txt: en ? "⚡Nerve" : "⚡神经", bg: "#0ea5e9" },
      blood: { txt: en ? "🩸Blood" : "🩸血液", bg: "#f43f5e" },
      cell: { txt: en ? "🏭Cell" : "🏭细胞", bg: "#a855f7" },
      enzyme: { txt: en ? "🔥Enzyme" : "🔥锁酶", bg: "#f59e0b" },
      physical: { txt: en ? "🛡️Sting" : "🛡️刺针", bg: "#10b981" },
      concept: { txt: en ? "⚖️Rule" : "⚖️法则", bg: "#ec4899" }
    };

    grid.innerHTML = list.map((item) => {
      const photo = getPhoto(item.id);
      const mb = mechBadgeLabel[item.mech] || mechBadgeLabel.concept;
      const lit = state.litCards.includes(item.id);
      const voiceCount = voiceStudio && voiceStudio.getVoiceCount ? voiceStudio.getVoiceCount(item.id) : (voiceStudio && voiceStudio.hasVoice(item.id) ? 1 : 0);
      const voiced = voiceCount > 0;
      const rvObj = (window.REAL_VIDEOS && window.REAL_VIDEOS[item.id]) || null;
      const isCameraVid = Boolean(rvObj && rvObj.kind !== "realistic_scene");
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || null;
      const enCard = enCardsMap[item.id] || null;
      const enTitle = (enCard && enCard.enName) || (ce && ce.enName) || item.name;
      const shortCode = en
        ? item.id.replace("ch0-", "P").replace("ch", "Ch").toUpperCase()
        : item.code.replace("第", "").replace("章 · 档案", "-").replace("序-0", "序");

      return `
        <div class="dex-card ${lit ? "lit" : ""}" data-id="${item.id}">
          <div class="dex-thumb-wrap">
            ${
              photo
                ? `<img class="dex-thumb" src="${photo}" alt="${en ? enTitle : item.name}" loading="lazy" />`
                : `<div class="dex-fallback-art">${item.emoji}</div>`
            }
            <span class="dex-num-badge">${shortCode} ${lit ? "⭐" : ""}</span>
            ${
              isCameraVid
                ? `<span class="dex-3d-badge" style="background:linear-gradient(135deg,rgba(16,185,129,0.92),rgba(14,165,233,0.92));color:#fff;">${en ? "🎥 Real Clip · 3D" : "🎥 真实实拍 · 配音剧场"}</span>`
                : `<span class="dex-3d-badge" style="background:linear-gradient(135deg,rgba(14,165,233,0.92),rgba(99,102,241,0.92));color:#fff;">${en ? "🎨 Art Clip · 3D" : "🎨 写实短片 · 配音剧场"}</span>`
            }
            ${voiced ? `<span class="dex-voice-badge">${en ? "🎙️ Voiced" : "🎙️ 已配音"}${voiceCount > 1 ? ` ×${voiceCount}` : ""}</span>` : ""}
            <span class="dex-mech-dot" style="background:${mb.bg};">${mb.txt}</span>
          </div>
          <div class="dex-info">
            <div style="min-width:0;">
              ${
                en
                  ? `<h3 class="dex-title dex-title-en">${enTitle}</h3>
                     <div class="dex-sub-en">${(enCard && enCard.lifeSceneTag) || (ce && ce.enPron) || ""}</div>`
                  : `<h3 class="dex-title">${ruby(item.name)}</h3>
                     ${ce && ce.enName ? `<div style="font-size:0.73rem;color:var(--c-teal-text);font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">🇬🇧 ${ce.enName}</div>` : ""}`
              }
            </div>
            <span style="font-size:1.2rem;flex-shrink:0;">${item.strategy === "venom" ? "🗡️" : item.strategy === "poison" ? "🛡️" : "💎"}</span>
          </div>
        </div>
      `;
    }).join("");

    grid.querySelectorAll(".dex-card").forEach((card) => {
      card.addEventListener("click", () => {
        window.SFX.pop();
        openSuperCard(card.getAttribute("data-id"));
      });
    });
  }

  // ==========================================================================
  // 超级视觉闪卡弹窗（实拍大图 + 全书99卡 360° 3D分子 + 小馆长录音间 + 沸水锅/胃酸剪刀！）
  // ==========================================================================
  function openSuperCard(id) {
    const item = window.CATALOG_DATA.find((x) => x.id === id);
    if (!item) return;

    currentOpenCard = item;
    if (window.DoubaoTTS) window.DoubaoTTS.stop();

    if (!state.litCards.includes(id)) {
      state.litCards.push(id);
      addStars(1);
      renderPhotoDex();
    }
    if (!sessionOpenedCards.has(id)) {
      sessionOpenedCards.add(id);
      trackMission("cards", 1);
    }

    const photo = getPhoto(id);
    const molData = getMol3DData(id);
    const realVid = (window.REAL_VIDEOS && window.REAL_VIDEOS[id]) || null;

    const imgEl = document.getElementById("modalPhotoImg");
    const realVideoEl = document.getElementById("modalRealVideo");
    const videoEl = document.getElementById("modalActionVideo");
    const canvas3d = document.getElementById("mol3dCanvas");
    const btnRealVid = document.getElementById("btnSwitchRealVideo");
    const btn3d = document.getElementById("btnSwitch3DMol");
    const switchWrap = document.getElementById("modalViewSwitch");

    imgEl.src = photo || "assets/scenes/panorama.jpg";
    if (realVideoEl) {
      realVideoEl.pause();
      realVideoEl.src = realVid ? realVid.src : "";
      realVideoEl.style.display = "none";
    }
    const en = window.isEn ? window.isEn() : true;
    const enCard = window.DUWU_I18N ? window.DUWU_I18N.getCardEn(id) : null;
    const ceCard = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[id]) || {};
    const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt, { cardId: id }) : txt);

    if (btnRealVid) {
      btnRealVid.style.display = realVid ? "inline-block" : "none";
      btnRealVid.textContent = en
        ? (realVid && realVid.kind === "realistic_scene" ? "🎨 Art Clip" : "🎥 Real Clip")
        : (realVid && realVid.kind === "realistic_scene" ? "🎨 写实短片" : "🎥 真实实拍");
    }
    if (switchWrap) {
      switchWrap.classList.toggle("four-modes", Boolean(realVid));
    }
    if (videoEl) {
      videoEl.pause();
      videoEl.src = `assets/videos/${id}.mp4`;
      videoEl.style.display = "none";
    }

    if (molData) {
      btn3d.style.display = "inline-block";
      if (!molViewer) {
        molViewer = new window.PlaygroundEngines.Molecule3DViewer(canvas3d);
      }
      molViewer.setMolecule(molData);
    } else {
      btn3d.style.display = "none";
    }

    // 若小朋友当前正在【🎥 真实实况短片】滤镜下浏览，点开卡片自动直接播放真实实况短片！
    const initialMode = state.magicFilter === "realvid" && realVid ? "realvideo" : "photo";
    setModalViewMode(initialMode);

    document.getElementById("modalCodeBadge").textContent = `📖 ${en && enCard ? enCard.code : item.code}`;

    // 挂载小馆长专属配音录音间
    if (voiceStudio) {
      voiceStudio.mountWidget(document.getElementById("modalCuratorVoiceMount"), item, () => {
        addStars(3);
      });
    }

    const radar = item.radar || (item.mech === "neuro" ? [92, 25, 30, 60, 80] : item.mech === "blood" ? [30, 92, 60, 50, 78] : [35, 35, 90, 65, 68]);

    const spokenMol = cleanMol(item.molecule);
    const bilingual = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[item.id]) || null;
    const cardInter = (window.CARD_INTERACTIONS && window.CARD_INTERACTIONS[item.id]) || null;
    const rawExp1 = cardInter && cardInter.exp1
      ? cardInter.exp1
      : { icon: "🔬🧪", title: `测试${item.name}特性`, sub: "点我观察它的分子反应", tone: "teal", sfx: "chime", badge: "🔬✨", msg: item.summary, bi: bilingual };
    const rawExp2 = cardInter && cardInter.exp2
      ? cardInter.exp2
      : { icon: "🛡️💡", title: "安全防护与科学揭秘", sub: "点我解锁关键知识", tone: "amber", sfx: "sizzle", badge: "🛡️✨", msg: item.biochemDeep || item.summary, bi: bilingual };
    const exp1 = en && enCard && enCard.exp1
      ? { ...rawExp1, title: enCard.exp1.title, sub: enCard.exp1.sub, msg: enCard.exp1.msg }
      : rawExp1;
    const exp2 = en && enCard && enCard.exp2
      ? { ...rawExp2, title: enCard.exp2.title, sub: enCard.exp2.sub, msg: enCard.exp2.msg }
      : rawExp2;
    const rawQuiz = cardInter && cardInter.quiz ? cardInter.quiz : null;
    const quiz = en && enCard && enCard.quiz ? enCard.quiz : rawQuiz;
    const quizAlreadyWon = state.cardQuizWon.includes(item.id);
    const teleportInfo = getCardPlaygroundTeleport(item);

    const cardTitleEn = (enCard && enCard.enName) || ceCard.enName || item.name;
    const cardMolEn = (enCard && enCard.molecule) || item.molecule;
    const cardSummaryEn = (enCard && enCard.summary) || item.summary;
    const cardDeepEn = (enCard && enCard.biochemDeep) || item.biochemDeep || "";
    const cardTipEn = (enCard && enCard.parentTip) || item.parentTip || "";

    const rightBox = document.getElementById("modalRightInteractive");
    rightBox.innerHTML = `
      ${en ? `
        <div class="dart-reading-tip-bar">
          <img src="assets/art/mascot_reading.jpg" alt="Professor Dart" class="dart-mini-pic" />
          <span><b>Bold</b> words are key KET/PET core words — <b>tap ANY word</b> to hear it &amp; flip to Chinese!</span>
        </div>
      ` : ""}

      <div id="modalCardSpeechScope" class="tts-reading-scope">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-right:38px;">
          <span style="font-size:2.2rem;">${item.emoji}</span>
          <div style="flex:1;min-width:180px;">
            ${en
              ? `<h2 id="modalTitleSeg" class="tts-seg tts-header-seg" data-tts-seg="${cardTitleEn}." style="margin:0;font-size:1.62rem;font-weight:900;">${flip(cardTitleEn)}</h2>
                 ${ceCard.enPron ? `<div style="font-size:0.82rem;color:var(--text-muted);font-weight:700;">${ceCard.enPron}</div>` : ""}
                 <div id="modalWeaponSeg" class="tts-seg tts-header-seg" data-tts-seg="Its secret chemical weapon is ${cardMolEn}." style="color:var(--c-teal-text);font-weight:800;font-size:0.92rem;margin-top:3px;">🧪 Weapon: ${flip(cardMolEn)}</div>`
              : `<h2 id="modalTitleSeg" class="tts-seg tts-header-seg" data-tts-seg="${item.name}。" style="margin:0;font-size:1.6rem;font-weight:900;">${ruby(item.name)}</h2>
                 <div id="modalWeaponSeg" class="tts-seg tts-header-seg" data-tts-seg="它的秘密武器是${spokenMol}。" style="color:var(--c-teal);font-weight:800;font-size:0.9rem;margin-top:2px;">🧪 武器：${ruby(item.molecule)}</div>`
            }
          </div>
        </div>

        <div class="kid-voice-bubble tts-interactive-bubble ${en ? "en-story-bubble" : ""}" id="modalMainBubble" title="${en ? "Tap words to flip to Chinese; use Read Aloud button to listen" : "点击开始或停止讲解"}">
          <div id="modalTtsStatusMount"></div>
          <div class="tts-clauses-body">💬 ${en ? flip(cardSummaryEn) : renderClauses(item.summary, bilingual)}</div>
        </div>
      </div>

      <!-- v6.0/v8.0：🏠 生活中的真实实例 · 写实插画伴读区 -->
      <div id="modalLifeExampleMount"></div>

      <div class="mini-test-row ${quiz ? "three-cols" : ""}">
        <button type="button" class="toy-test-btn" id="btnCardExp1">
          <div style="font-size:1.75rem;line-height:1.1;">${exp1.icon}</div>
          <div style="font-weight:900;font-size:0.86rem;margin-top:4px;line-height:1.25;">${en ? exp1.title : ruby(exp1.title)}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;line-height:1.2;">${exp1.sub}</div>
        </button>
        <button type="button" class="toy-test-btn" id="btnCardExp2">
          <div style="font-size:1.75rem;line-height:1.1;">${exp2.icon}</div>
          <div style="font-weight:900;font-size:0.86rem;margin-top:4px;line-height:1.25;">${en ? exp2.title : ruby(exp2.title)}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;line-height:1.2;">${exp2.sub}</div>
        </button>
        ${
          quiz
            ? `<button type="button" class="toy-test-btn quiz-entry-btn ${quizAlreadyWon ? "won" : ""}" id="btnCardQuiz">
                 <div style="font-size:1.75rem;line-height:1.1;">🎯🏆</div>
                 <div style="font-weight:900;font-size:0.86rem;margin-top:4px;line-height:1.25;">${en ? "Science Quiz" : ruby("考考小馆长")}</div>
                 <div style="font-size:0.72rem;color:${quizAlreadyWon ? "var(--c-ok-text)" : "var(--c-warn-text)"};margin-top:2px;font-weight:800;" id="cardQuizSubText">
                   ${quizAlreadyWon ? (en ? "✅ Cleared!" : "✅ 已闯关成功！") : (en ? "Mini Quest (+2⭐)" : "互动闯关 (+2⭐)")}
                 </div>
               </button>`
            : ""
        }
      </div>

      <div id="toyTestResultBox" style="min-height:54px;"></div>

      <!-- v5.0/v8.0：好奇宝宝「十万个为什么」深度语音讲解 + 🇬🇧 核心词课堂 -->
      <div id="modalCuriosityAndEnglishMount"></div>

      ${
        teleportInfo
          ? `<button type="button" class="card-teleport-btn" id="btnCardTeleport">
               <span>🚀</span>
               <span>${en ? teleportInfo.enLabel : ruby(teleportInfo.label)}</span>
             </button>`
          : ""
      }

      <div style="background:var(--bg-inset);border-radius:16px;padding:12px 14px;margin-top:8px;">
        ${renderPowerBar(en ? "⚡ Nerve Lock" : "⚡ 神经锁定力", radar[0], "#0ea5e9")}
        ${renderPowerBar(en ? "🩸 Blood Power" : "🩸 血液破坏力", radar[1], "#f43f5e")}
        ${renderPowerBar(en ? "🏭 Cell Impact" : "🏭 细胞攻击力", radar[2], "#a855f7")}
        ${renderPowerBar(en ? "💊 Medicine Use" : "💊 变身良药潜力", radar[4], "#10b981")}
      </div>

      ${
        cardDeepEn || item.biochemDeep
          ? `<details style="margin-top:10px;background:var(--bg-inset);padding:10px 14px;border-radius:14px;cursor:pointer;">
               <summary style="font-weight:800;font-size:0.88rem;color:var(--c-warn-text);">${en ? "🔎 Deep Science & Explorer Note (Tap to Expand)" : "🔎 爸爸妈妈伴读锦囊（点击展开深层原理）"}</summary>
               <div id="modalDeepSpeechScope" class="tts-reading-scope" style="margin-top:8px;">
                 <div id="deepTtsStatusMount"></div>
                 <div class="tts-clauses-body" style="font-size:0.95rem;color:var(--text-sub);line-height:1.85;">${en ? flip(cardDeepEn) : renderClauses(item.biochemDeep)}</div>
                 ${en && cardTipEn ? `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-light);font-size:0.9rem;color:var(--c-teal-text);font-weight:700;">💡 ${flip(cardTipEn)}</div>` : ""}
               </div>
               <button class="mini-btn" id="btnSpeakDeep" style="margin-top:10px;font-size:0.82rem;padding:6px 14px;">🔊 ${en ? "Read Deep Science" : "给我讲解"}</button>
             </details>`
          : ""
      }
    `;

    document.getElementById("superCardModal").classList.add("open");

    const btnDeep = document.getElementById("btnSpeakDeep");
    if (btnDeep && (cardDeepEn || item.biochemDeep)) {
      btnDeep.addEventListener("click", (e) => {
        e.stopPropagation();
        if (voiceStudio) voiceStudio.stopPlayback();
        if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
          window.DoubaoTTS.speakEnglishNarration(cardDeepEn, {
            toggleIfPlaying: true,
            triggerBtn: btnDeep,
            statusMountEl: document.getElementById("deepTtsStatusMount"),
            defaultBtnHTML: "🔊 Read Deep Science"
          });
        } else {
          speak(null, {
            toggleIfPlaying: true,
            scopeEl: document.getElementById("modalDeepSpeechScope"),
            triggerBtn: btnDeep,
            statusMountEl: document.getElementById("deepTtsStatusMount"),
            defaultBtnHTML: "🔊 给我讲解"
          });
        }
      });
    }

    const toneStyleMap = {
      green: { border: "#4ade80", bg: "rgba(74, 222, 128, 0.18)" },
      rose: { border: "#fb7185", bg: "rgba(251, 113, 133, 0.18)" },
      amber: { border: "#fbbf24", bg: "rgba(251, 191, 36, 0.18)" },
      teal: { border: "#2dd4bf", bg: "rgba(45, 212, 191, 0.18)" },
      purple: { border: "#c084fc", bg: "rgba(192, 132, 252, 0.18)" }
    };

    const setActiveToyBtn = (activeBtn) => {
      rightBox.querySelectorAll(".toy-test-btn").forEach((b) => b.classList.toggle("active", b === activeBtn));
    };

    const bindBilingualClickInBox = (boxEl) => {
      const biEl = boxEl.querySelector(".tts-bilingual-clause");
      if (biEl) {
        biEl.addEventListener("click", (e) => {
          if (window.DoubaoTTS && window.DoubaoTTS.state !== "idle") return;
          e.stopPropagation();
          if (voiceStudio) voiceStudio.stopPlayback();
          const segText = biEl.getAttribute("data-tts-seg") || "";
          speak(segText, {
            toggleIfPlaying: true,
            segments: [{ el: biEl, text: segText }],
            scopeEl: boxEl,
            statusMountEl: boxEl.querySelector(".tts-toy-status")
          });
        });
      }
    };

    const runCardExp = (expObj, btnEl) => {
      setActiveToyBtn(btnEl);
      if (voiceStudio) voiceStudio.stopPlayback();
      const sfxName = expObj.sfx || "chime";
      if (window.SFX && typeof window.SFX[sfxName] === "function") {
        window.SFX[sfxName]();
      }
      const st = toneStyleMap[expObj.tone] || toneStyleMap.teal;
      const box = document.getElementById("toyTestResultBox");
      box.innerHTML = `
        <div class="kid-voice-bubble tts-reading-scope" style="border-color:${st.border};background:${st.bg};cursor:pointer;" title="${en ? "Tap words to flip; tap empty space to hear aloud" : "点击开始或停止语音讲解"}">
          <div class="tts-toy-status"></div>
          <div class="tts-clauses-body">${expObj.badge || "🔬✨"} ${en ? flip(expObj.msg) : renderClauses(expObj.msg, expObj.bi)}</div>
        </div>
      `;
      if (!en) bindBilingualClickInBox(box);
      const scopeBubble = box.querySelector(".kid-voice-bubble");
      if (scopeBubble) {
        scopeBubble.addEventListener("click", (e) => {
          if (e.target.closest(".fw-card")) return;
          if (voiceStudio) voiceStudio.stopPlayback();
          if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
            window.DoubaoTTS.speakEnglishNarration(expObj.msg, { toggleIfPlaying: true, statusMountEl: box.querySelector(".tts-toy-status") });
          } else {
            speak(null, {
              toggleIfPlaying: true,
              scopeEl: scopeBubble,
              statusMountEl: box.querySelector(".tts-toy-status")
            });
          }
        });
      }
      if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
        window.DoubaoTTS.speakEnglishNarration(expObj.msg, { playTapSfx: false, statusMountEl: box.querySelector(".tts-toy-status") });
      } else {
        speak(null, {
          scopeEl: scopeBubble || box,
          statusMountEl: box.querySelector(".tts-toy-status"),
          playTapSfx: false
        });
      }
    };

    const btnExp1 = document.getElementById("btnCardExp1");
    const btnExp2 = document.getElementById("btnCardExp2");
    const btnQuiz = document.getElementById("btnCardQuiz");
    const btnTeleport = document.getElementById("btnCardTeleport");

    if (btnExp1) btnExp1.addEventListener("click", () => runCardExp(exp1, btnExp1));
    if (btnExp2) btnExp2.addEventListener("click", () => runCardExp(exp2, btnExp2));

    if (btnQuiz && quiz) {
      btnQuiz.addEventListener("click", () => {
        setActiveToyBtn(btnQuiz);
        if (voiceStudio) voiceStudio.stopPlayback();
        if (window.SFX) window.SFX.pop();

        const box = document.getElementById("toyTestResultBox");
        const numTail = parseInt(item.id.slice(-2), 10) || 1;
        const swapOrder = numTail % 2 === 0;
        const opt1Text = swapOrder ? quiz.b : quiz.a;
        const opt2Text = swapOrder ? quiz.a : quiz.b;
        const opt1IsRight = swapOrder ? quiz.ans === "b" : quiz.ans === "a";
        const opt2IsRight = !opt1IsRight;

        box.innerHTML = `
          <div class="card-quiz-box">
            <div class="card-quiz-question tts-reading-scope" id="cardQuizQuestionScope" title="${en ? "Tap words to flip" : "点击朗读题目"}">
              <div class="tts-toy-status"></div>
              <div class="tts-clauses-body">${en ? flip(quiz.q) : renderClauses(quiz.q)}</div>
            </div>
            <div class="card-quiz-options">
              <button type="button" class="card-quiz-opt-btn" data-right="${opt1IsRight ? "1" : "0"}">
                🅰️ ${en ? opt1Text : ruby(opt1Text)}
              </button>
              <button type="button" class="card-quiz-opt-btn" data-right="${opt2IsRight ? "1" : "0"}">
                🅱️ ${en ? opt2Text : ruby(opt2Text)}
              </button>
            </div>
            <div id="cardQuizFeedback" style="margin-top:8px;"></div>
          </div>
        `;

        const qScope = document.getElementById("cardQuizQuestionScope");
        if (qScope) {
          qScope.addEventListener("click", (e) => {
            if (e.target.closest(".fw-card")) return;
            if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
              window.DoubaoTTS.speakEnglishNarration(quiz.q, { toggleIfPlaying: true });
            } else {
              speak(null, {
                toggleIfPlaying: true,
                scopeEl: qScope,
                statusMountEl: qScope.querySelector(".tts-toy-status")
              });
            }
          });
        }

        box.querySelectorAll(".card-quiz-opt-btn").forEach((optBtn) => {
          optBtn.addEventListener("click", () => {
            const isRight = optBtn.getAttribute("data-right") === "1";
            const fbBox = document.getElementById("cardQuizFeedback");
            if (!fbBox) return;

            if (isRight) {
              box.querySelectorAll(".card-quiz-opt-btn").forEach((b) => b.classList.remove("picked-wrong"));
              optBtn.classList.add("picked-right");
              if (window.SFX) window.SFX.chime();

              const firstTimeWin = !state.cardQuizWon.includes(item.id);
              if (firstTimeWin) {
                state.cardQuizWon.push(item.id);
                addStars(2);
                trackMission("knowledge", 1);
                btnQuiz.classList.add("won");
                const subTxt = document.getElementById("cardQuizSubText");
                if (subTxt) {
                  subTxt.style.color = "var(--c-ok-text)";
                  subTxt.textContent = en ? "✅ Cleared (+2⭐)!" : "✅ 已闯关成功 (+2⭐)！";
                }
              }

              fbBox.innerHTML = `
                <div class="kid-voice-bubble tts-reading-scope" style="border-color:#4ade80;background:rgba(74,222,128,0.18);margin-top:6px;">
                  <div class="tts-toy-status"></div>
                  <div class="tts-clauses-body">🎉⭐ ${en ? flip(quiz.explain) : renderClauses(quiz.explain)}</div>
                </div>
              `;
              const explainScope = fbBox.querySelector(".kid-voice-bubble");
              if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
                window.DoubaoTTS.speakEnglishNarration(quiz.explain, { playTapSfx: false });
              } else {
                speak(null, {
                  scopeEl: explainScope || fbBox,
                  statusMountEl: fbBox.querySelector(".tts-toy-status"),
                  playTapSfx: false
                });
              }
            } else {
              optBtn.classList.remove("picked-wrong");
              void optBtn.offsetWidth;
              optBtn.classList.add("picked-wrong");
              if (window.SFX) window.SFX.bonk();
              fbBox.innerHTML = `
                <div style="font-size:0.85rem;font-weight:800;color:var(--c-warn-text);padding:6px 4px;">
                  ${en ? "💡 Almost! Think carefully and try the other choice!" : "💡 哎呀差一点点！再仔细想想，点另一个选项试试看吧～"}
                </div>
              `;
            }
          });
        });
      });
    }

    if (btnTeleport && teleportInfo) {
      btnTeleport.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        document.getElementById("btnCloseSuperModal").click();
        teleportInfo.action();
      });
    }

    const btnSpeakCard = document.getElementById("btnSpeakCard");
    btnSpeakCard.classList.remove("is-loading", "is-playing");
    btnSpeakCard.innerHTML = en ? "🔊 Read Aloud" : "🔊 给我讲解";

    const btnSpeakCardAI = document.getElementById("btnSpeakCardAI");
    if (btnSpeakCardAI) {
      btnSpeakCardAI.style.display = en ? "inline-flex" : "none";
      btnSpeakCardAI.classList.remove("is-loading", "is-playing");
      btnSpeakCardAI.innerHTML = "🎙️ AI Voice";
    }

    const btnAskCardAI = document.getElementById("btnAskCardAI");
    if (btnAskCardAI) {
      btnAskCardAI.innerHTML = en ? "🎤 Ask Frog AI" : "🎤 随时互动";
      btnAskCardAI.onclick = () => {
        if (window.SFX) window.SFX.pop();
        if (aiCompanion) {
          aiCompanion.open(item, { autoListen: true });
        }
      };
    }

    const fullEnReadAloud = `${cardTitleEn}. Its secret chemical weapon is ${cardMolEn}. ${cardSummaryEn}`;

    const triggerMainCardSpeech = (useAI) => {
      if (voiceStudio) voiceStudio.stopPlayback();
      if (window.CuriosityEnglishModule) window.CuriosityEnglishModule.stopShadowing();
      const vEl = document.getElementById("modalActionVideo");
      if (vEl && !vEl.paused) vEl.pause();
      if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
        window.DoubaoTTS.speakEnglishNarration(fullEnReadAloud, {
          useAI: Boolean(useAI),
          toggleIfPlaying: true,
          scopeEl: document.getElementById("modalCardSpeechScope"),
          triggerBtn: useAI && btnSpeakCardAI ? btnSpeakCardAI : btnSpeakCard,
          statusMountEl: document.getElementById("modalTtsStatusMount"),
          defaultBtnHTML: useAI ? "🎙️ AI Voice" : "🔊 Read Aloud"
        });
      } else {
        speak(null, {
          toggleIfPlaying: true,
          scopeEl: document.getElementById("modalCardSpeechScope"),
          triggerBtn: btnSpeakCard,
          statusMountEl: document.getElementById("modalTtsStatusMount"),
          defaultBtnHTML: "🔊 给我讲解"
        });
      }
    };

    // 挂载 v5.0/v8.0 实况短片解说、十万个为什么与趣味英语小课堂（含拼词闯关）
    if (window.CuriosityEnglishModule && window.CuriosityEnglishModule.mountCardExtensions) {
      window.CuriosityEnglishModule.mountCardExtensions({
        item,
        ruby,
        speak,
        renderClauses,
        addStars,
        trackMission,
        state,
        saveState,
        stopVoiceStudio: () => {
          if (voiceStudio) voiceStudio.stopPlayback();
        },
        switchToRealVideo: (vOpts) => setModalViewMode("realvideo", vOpts),
        switchToStoryVideo: () => {
          setModalViewMode("video");
          const box = document.querySelector("#superCardModal .visual-showcase-box");
          if (box && typeof box.scrollIntoView === "function") {
            box.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    }

    btnSpeakCard.onclick = () => triggerMainCardSpeech(false);
    if (btnSpeakCardAI) btnSpeakCardAI.onclick = () => triggerMainCardSpeech(true);
    const mainBubbleEl = document.getElementById("modalMainBubble");
    if (mainBubbleEl) {
      mainBubbleEl.onclick = (e) => {
        if (e.target.closest(".fw-card")) return;
        if (!en) triggerMainCardSpeech(false);
      };
      // 支持单点双语胶囊单独跟读那句英文
      const biClauseEl = mainBubbleEl.querySelector(".tts-bilingual-clause");
      if (biClauseEl) {
        biClauseEl.addEventListener("click", (e) => {
          if (window.DoubaoTTS && window.DoubaoTTS.state !== "idle") return;
          e.stopPropagation();
          if (voiceStudio) voiceStudio.stopPlayback();
          const segText = biClauseEl.getAttribute("data-tts-seg") || "";
          speak(segText, {
            toggleIfPlaying: true,
            segments: [{ el: biClauseEl, text: segText }],
            scopeEl: document.getElementById("modalCardSpeechScope"),
            statusMountEl: document.getElementById("modalTtsStatusMount")
          });
        });
      }
    }

    // 打开卡片瞬间后台预加载并解码本卡内置真人语音，点击 0 毫秒直接出声！
    if (window.DoubaoTTS && window.DoubaoTTS.preloadText) {
      if (en && enCard) {
        window.DoubaoTTS.preloadText(fullEnReadAloud);
        if (enCard.lifeTitle && enCard.lifeStory) {
          window.DoubaoTTS.preloadText(`${enCard.lifeTitle}. ${enCard.lifeStory}`);
        }
        if (enCard.liveCommentary) {
          window.DoubaoTTS.preloadText(enCard.liveCommentary);
        }
      } else {
        window.DoubaoTTS.preloadScope(document.getElementById("modalCardSpeechScope"));
        if (bilingual) {
          window.DoubaoTTS.preloadText(`${bilingual.en} ${bilingual.en} ${bilingual.zh}`);
        }
        const ceExtra = window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id];
        if (ceExtra) {
          if (ceExtra.lifeTitle && ceExtra.lifeStory) {
            window.DoubaoTTS.preloadText(`${ceExtra.lifeTitle}。${ceExtra.lifeStory}`);
          }
          if (ceExtra.liveCommentary) {
            window.DoubaoTTS.preloadText(ceExtra.liveCommentary);
          }
        }
      }
    }
  }

  function getCardPlaygroundTeleport(item) {
    if (!item || !item.id) return null;
    const goBiolabSub = (sub) => {
      switchStage("biolab");
      const subBtn = document.querySelector(`.biolab-sub-btn[data-sub="${sub}"]`);
      if (subBtn) subBtn.click();
    };
    const goEco = (sp) => {
      goBiolabSub("ecosystem");
      const spBtn = document.querySelector(`#ecoSpeciesTabs [data-esp="${sp}"]`);
      if (spBtn) spBtn.click();
    };
    const goSurgery = (smode) => {
      goBiolabSub("molsurgery");
      const mBtn = document.querySelector(`.surgery-mode-btn[data-smode="${smode}"]`);
      if (mBtn) mBtn.click();
    };
    const goCellReagent = (rid) => {
      goBiolabSub("cell");
      const card = document.querySelector(`#reagentTray [data-rid="${rid}"]`);
      if (card) card.click();
    };
    const goClinicPatient = (pIdx) => {
      switchStage("pharmacy");
      state.clinicIdx = pIdx;
      state.pickedBottle = null;
      renderClinic();
    };

    const map = {
      "ch1-09": { label: "去【借毒养成缸】亲手喂箭毒蛙宝宝！", enLabel: "Raise a Poison Dart Frog in the Food-Chain Tank!", action: () => goEco("frog") },
      "ch6-01": { label: "去【借毒养成缸】喂养无毒河鲀宝宝！", enLabel: "Raise a Baby Pufferfish in the Food-Chain Tank!", action: () => goEco("puffer") },
      "ch1-04": { label: "去【借毒养成缸】喂虎斑颈槽蛇攒蟾蜍毒！", enLabel: "Feed the Keelback Snake in the Food-Chain Tank!", action: () => goEco("snake") },
      "ch6-02": { label: "去【3D分子手术台】把河鲀毒素插进锁孔！", enLabel: "Try the 3D TTX Molecule Key & Lock Surgery!", action: () => goSurgery("ttx_lock") },
      "ch6-08": { label: "去【3D分子手术台】把河鲀毒素插进锁孔！", enLabel: "Try the 3D TTX Molecule Key & Lock Surgery!", action: () => goSurgery("ttx_lock") },
      "ch6-09": { label: "去【3D分子手术台】把河鲀毒素插进锁孔！", enLabel: "Try the 3D TTX Molecule Key & Lock Surgery!", action: () => goSurgery("ttx_lock") },
      "ch3-01": { label: "去【3D分子手术台】亲手剪掉乌头碱双基团！", enLabel: "Cut Aconitine's Toxic Groups with Molecular Scissors!", action: () => goSurgery("aconitine_surgery") },
      "ch4-02": { label: "去【100°C沸水双锅台】煮熟四季豆解毒！", enLabel: "Try the 100°C Boiling Pot Detox Duel!", action: () => goSurgery("boil_duel") },
      "ch5-01": { label: "去【活体细胞游乐场】看鹅膏铁锁卡死细胞工厂！", enLabel: "Watch Amanitin Lock the Cell Factory in BioLab!", action: () => goCellReagent("amanitin") },
      "ch5-11": { label: "去【活体细胞游乐场】看鹅膏铁锁卡死细胞工厂！", enLabel: "Watch Amanitin Lock the Cell Factory in BioLab!", action: () => goCellReagent("amanitin") },
      "ch1-06": { label: "去【活体细胞游乐场】看三指蛋白抢占受体座位！", enLabel: "Watch Cobra Venom Block Nerve Seats in BioLab!", action: () => goCellReagent("cobra") },
      "ch6-17": { label: "去【活体细胞游乐场】看三指蛋白抢占受体座位！", enLabel: "Watch Venom Block Nerve Seats in BioLab!", action: () => goCellReagent("cobra") },
      "ch1-03": { label: "去【活体细胞游乐场】看树蛙毒素撑开钠通道城门！", enLabel: "Watch Frog Toxin Wedge Open Ion Gates in BioLab!", action: () => goCellReagent("frog") },
      "ch3-14": { label: "去【活体细胞游乐场】看毒素撑开钠通道城门！", enLabel: "Watch Toxin Wedge Open Ion Gates in BioLab!", action: () => goCellReagent("frog") },
      "ch5-14": {
        label: "去【代谢大比拼】做墨汁鬼伞配啤酒实验！",
        enLabel: "Try the Ink Cap Mushroom Enzyme Lab!",
        action: () => {
          goBiolabSub("tummy");
          if (state.tummyMode !== "mushroom") {
            const mBtn = document.getElementById("btnSwitchMushroomMode");
            if (mBtn) mBtn.click();
          }
        }
      },
      "ch1-05": { label: "去【化毒为药急诊室】用尖吻蝮蛇毒合成降压药！", enLabel: "Turn Viper Venom into Heart Medicine in the Clinic!", action: () => goClinicPatient(0) },
      "ch6-07": { label: "去【化毒为药急诊室】用芋螺毒素合成超级止痛针！", enLabel: "Turn Cone Snail Venom into Pain Relief Medicine!", action: () => goClinicPatient(1) },
      "ch2-05": { label: "去【化毒为药急诊室】点亮蝎毒肿瘤荧光画笔！", enLabel: "Use Scorpion Toxin Tumor Paint in the Clinic!", action: () => goClinicPatient(2) },
      "ch3-06": { label: "去【化毒为药急诊室】用毛地黄调配微克强心片！", enLabel: "Craft Micro-Dose Heart Medicine from Foxglove!", action: () => goClinicPatient(3) },
      "ch3-11": { label: "去【化毒为药急诊室】用秋水仙碱消炎 & 种无籽西瓜！", enLabel: "Turn Autumn Crocus Toxin into Medicine!", action: () => goClinicPatient(4) }
    };
    return map[item.id] || null;
  }

  function renderPowerBar(label, val, color) {
    return `
      <div style="display:flex;align-items:center;gap:10px;margin:5px 0;">
        <span style="width:112px;font-size:0.8rem;font-weight:800;">${label}</span>
        <div style="flex:1;height:10px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;">
          <div style="width:${val}%;height:100%;background:${color};border-radius:99px;"></div>
        </div>
      </div>
    `;
  }

  function setModalViewMode(vmode, opts) {
    const o = opts || {};
    document.querySelectorAll("#modalViewSwitch .view-pill").forEach((p) => {
      p.classList.toggle("active", p.getAttribute("data-vmode") === vmode);
    });

    const imgEl = document.getElementById("modalPhotoImg");
    const realVideoEl = document.getElementById("modalRealVideo");
    const videoEl = document.getElementById("modalActionVideo");
    const canvas3d = document.getElementById("mol3dCanvas");

    if (imgEl) imgEl.style.display = vmode === "photo" ? "block" : "none";
    if (realVideoEl) realVideoEl.style.display = vmode === "realvideo" ? "block" : "none";
    if (videoEl) videoEl.style.display = vmode === "video" ? "block" : "none";
    if (canvas3d) canvas3d.style.display = vmode === "mol3d" ? "block" : "none";

    if (realVideoEl) {
      if (vmode === "realvideo") {
        if (!o.muteForNarration) {
          if (voiceStudio) voiceStudio.stopPlayback();
          realVideoEl.muted = !state.sound;
        } else {
          realVideoEl.muted = true;
        }
        try {
          if (realVideoEl.paused) {
            realVideoEl.currentTime = 0;
            const p = realVideoEl.play();
            if (p && typeof p.catch === "function") {
              p.catch(() => {
                realVideoEl.muted = true;
                realVideoEl.play().catch(() => {});
              });
            }
          }
        } catch (_) {}
      } else {
        realVideoEl.pause();
      }
    }

    if (videoEl) {
      if (vmode === "video") {
        if (window.DoubaoTTS) window.DoubaoTTS.stop();
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        if (window.CuriosityEnglishModule) window.CuriosityEnglishModule.stopShadowing();
        if (voiceStudio) voiceStudio.stopPlayback();
        videoEl.muted = !state.sound;
        try {
          videoEl.currentTime = 0;
          const vp = videoEl.play();
          if (vp && typeof vp.catch === "function") {
            vp.catch(() => {
              videoEl.muted = true;
              videoEl.play().catch(() => {});
            });
          }
        } catch (_) {}
      } else {
        videoEl.pause();
      }
    }
  }

  function initSuperModalEvents() {
    document.querySelectorAll("#modalViewSwitch .view-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        window.SFX.pop();
        const vmode = pill.getAttribute("data-vmode");
        setModalViewMode(vmode);
      });
    });

    const close = () => {
      currentOpenCard = null;
      if (unsubscribeModalTts) {
        unsubscribeModalTts();
        unsubscribeModalTts = null;
      }
      if (window.DoubaoTTS) window.DoubaoTTS.stop();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (window.CuriosityEnglishModule) {
        window.CuriosityEnglishModule.stopShadowing();
      }
      if (voiceStudio) {
        voiceStudio.stopActiveRecording();
        voiceStudio.stopPlayback();
      }
      const realVideoEl = document.getElementById("modalRealVideo");
      if (realVideoEl) {
        realVideoEl.pause();
      }
      const videoEl = document.getElementById("modalActionVideo");
      if (videoEl) {
        videoEl.pause();
      }
      document.getElementById("superCardModal").classList.remove("open");
    };
    document.getElementById("btnCloseSuperModal").addEventListener("click", close);
    document.getElementById("superCardModal").addEventListener("click", (e) => {
      if (e.target.id === "superCardModal") close();
    });
  }

  // ==========================================================================
  // 第 2 站：细胞滴管 + 升级2分子手术台 + 升级1食物链借毒缸 + 人狗代谢比拼
  // ==========================================================================
  function initBioLabStage() {
    // 1. 活体细胞滴管
    const canvas = document.getElementById("cellPlayCanvas");
    cellPlayground = new window.PlaygroundEngines.LivingCellPlayground(canvas, (heartIcon, bpmText, speech) => {
      document.getElementById("hudHeartIcon").textContent = heartIcon;
      document.getElementById("hudBpmText").textContent = bpmText;
      const toastEl = document.getElementById("cellSpeechToast");
      toastEl.innerHTML = renderClauses(speech);
      speak(speech, { scopeEl: toastEl, playTapSfx: false });
    });

    document.querySelectorAll(".speech-toast").forEach((toastEl) => {
      toastEl.style.cursor = "pointer";
      toastEl.title = "点击给我讲解";
      toastEl.addEventListener("click", () => {
        const raw = toastEl.textContent;
        if (raw) {
          toastEl.innerHTML = renderClauses(raw);
          speak(raw, { toggleIfPlaying: true, scopeEl: toastEl });
        }
      });
    });

    const renderReagentTray = () => {
      const tray = document.getElementById("reagentTray");
      if (!tray) return;
      const en = window.isEn ? window.isEn() : true;
      tray.innerHTML = CELL_REAGENTS.map((r) => {
        const ph = r.photoId ? getPhoto(r.photoId) : null;
        return `
          <div class="reagent-card" draggable="true" data-rid="${r.id}">
            ${
              ph
                ? `<img class="reagent-avatar" src="${ph}" alt="${en ? r.enName : r.name}" />`
                : `<div class="reagent-avatar">${r.emoji}</div>`
            }
            <div>
              <div style="font-weight:900;font-size:0.95rem;">${r.emoji} ${en ? r.enName : ruby(r.name)}</div>
              <div style="font-size:0.76rem;color:var(--text-muted);font-weight:700;">${en ? r.enSub : r.sub}</div>
            </div>
          </div>
        `;
      }).join("");
      tray.querySelectorAll(".reagent-card").forEach((card) => {
        const rid = card.getAttribute("data-rid");
        card.addEventListener("click", () => triggerReagent(rid, card));
        card.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", rid);
        });
      });
    };

    const triggerReagent = (rid, cardEl) => {
      const tray = document.getElementById("reagentTray");
      if (tray) tray.querySelectorAll(".reagent-card").forEach((c) => c.classList.remove("active"));
      if (cardEl && rid !== "pepsin" && rid !== "clean") cardEl.classList.add("active");
      cellPlayground.applyReagent(rid);
      addStars(1);
    };

    renderReagentTray();
    window._duwuRenderReagentTray = renderReagentTray;

    const dropZone = document.getElementById("cellDropZone");
    dropZone.addEventListener("dragover", (e) => e.preventDefault());
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      const rid = e.dataTransfer.getData("text/plain");
      if (rid) {
        const tray = document.getElementById("reagentTray");
        const card = tray && tray.querySelector(`[data-rid="${rid}"]`);
        triggerReagent(rid, card);
      }
    });

    // 2. 升级2：3D 分子插锁孔 & 乌头碱剪基团手术台
    if (window.MolecularSurgeryModule) {
      const surgCanvas = document.getElementById("molSurgeryCanvas");
      molSurgery = new window.MolecularSurgeryModule.MolecularSurgeryWorkbench(
        surgCanvas,
        (msg) => {
          document.getElementById("surgeryToast").textContent = msg;
        },
        (pts, key) => {
          if (!state.surgeryWon.includes(key)) {
            state.surgeryWon.push(key);
            addStars(pts);
          }
        }
      );

      const syncSurgTools = (smode) => {
        document.getElementById("btnFlipTTXKey").style.display = smode === "ttx_lock" ? "inline-flex" : "none";
        const boilBtn = document.getElementById("btnToggleBoilPot");
        boilBtn.style.display = smode === "boil_duel" ? "inline-flex" : "none";
        boilBtn.textContent = "🔥 点火煮沸到 100°C！";
      };

      document.querySelectorAll(".surgery-mode-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          window.SFX.pop();
          const smode = btn.getAttribute("data-smode");
          state.surgeryMode = smode;
          document.querySelectorAll(".surgery-mode-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          syncSurgTools(smode);
          molSurgery.resetMode(smode);
        });
      });

      document.getElementById("btnFlipTTXKey").addEventListener("click", () => molSurgery.flipTTX());
      document.getElementById("btnToggleBoilPot").addEventListener("click", (e) => {
        molSurgery.toggleBoil();
        e.currentTarget.textContent = molSurgery.boiling ? "❄️ 关火降温复原" : "🔥 点火煮沸到 100°C！";
      });
      document.getElementById("btnResetSurgery").addEventListener("click", () => {
        window.SFX.pop();
        syncSurgTools(state.surgeryMode);
        molSurgery.resetMode(state.surgeryMode);
      });
    }

    // 3. 升级1：食物链借毒喂食养成生态缸
    if (window.EcosystemSandboxModule) {
      const { CRITTERS, EcosystemSandbox } = window.EcosystemSandboxModule;
      const ecoCanvas = document.getElementById("ecoSandboxCanvas");
      ecoSandbox = new EcosystemSandbox(ecoCanvas, (msg, toxPct) => {
        document.getElementById("ecoToast").textContent = msg;
        if (typeof toxPct === "number") {
          document.getElementById("ecoMeterFill").style.width = `${toxPct}%`;
          document.getElementById("ecoMeterPct").textContent = `${toxPct}%`;
        }
      });

      const syncEcoUI = (sp) => {
        const c = CRITTERS[sp];
        document.getElementById("ecoMeterLabel").textContent = c.meterLabel;
        document.getElementById("ecoMeterFill").style.width = "0%";
        document.getElementById("ecoMeterPct").textContent = "0%";
        document.getElementById("btnEcoSafeFood").textContent = c.safeFoodBtn;
        document.getElementById("btnEcoToxicFood").textContent = c.toxicFoodBtn;
        document.getElementById("btnEcoPredator").textContent = c.predatorBtn;
      };

      document.querySelectorAll("#ecoSpeciesTabs [data-esp]").forEach((btn) => {
        btn.addEventListener("click", () => {
          window.SFX.pop();
          const sp = btn.getAttribute("data-esp");
          state.ecoSpecies = sp;
          document.querySelectorAll("#ecoSpeciesTabs [data-esp]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          syncEcoUI(sp);
          ecoSandbox.setSpecies(sp);
        });
      });

      document.getElementById("btnEcoSafeFood").addEventListener("click", () => ecoSandbox.feed(false));
      document.getElementById("btnEcoToxicFood").addEventListener("click", () => {
        ecoSandbox.feed(true);
        addStars(1);
      });
      document.getElementById("btnEcoPredator").addEventListener("click", () => ecoSandbox.testPredator());
      document.getElementById("btnResetEco").addEventListener("click", () => {
        window.SFX.pop();
        syncEcoUI(state.ecoSpecies);
        ecoSandbox.setSpecies(state.ecoSpecies);
      });
      document.getElementById("btnOpenEcoArchive").addEventListener("click", () => {
        window.SFX.pop();
        openSuperCard(CRITTERS[state.ecoSpecies].archiveId);
      });
    }

    // 4. Biolab 4大子标签切换
    document.querySelectorAll(".biolab-sub-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        const sub = btn.getAttribute("data-sub");
        state.biolabSub = sub;
        document.querySelectorAll(".biolab-sub-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("biolabCellPanel").style.display = sub === "cell" ? "block" : "none";
        document.getElementById("biolabSurgeryPanel").style.display = sub === "molsurgery" ? "block" : "none";
        document.getElementById("biolabEcoPanel").style.display = sub === "ecosystem" ? "block" : "none";
        document.getElementById("biolabTummyPanel").style.display = sub === "tummy" ? "block" : "none";
        if (sub === "tummy") renderTummyDuel();
      });
    });

    // 肚子比拼按钮
    document.getElementById("btnFeedChoco").addEventListener("click", () => {
      if (state.tummyMode === "choco") {
        state.chocoPieces = Math.min(5, state.chocoPieces + 1);
        if (state.chocoPieces >= 3) window.SFX.bonk(); else window.SFX.pop();
      } else {
        state.drankBeer = !state.drankBeer;
        state.drankBeer ? window.SFX.bonk() : window.SFX.chime();
      }
      renderTummyDuel();
    });

    document.getElementById("btnSwitchMushroomMode").addEventListener("click", (e) => {
      window.SFX.pop();
      state.tummyMode = state.tummyMode === "choco" ? "mushroom" : "choco";
      state.chocoPieces = 0;
      state.drankBeer = false;
      e.target.textContent = state.tummyMode === "choco"
        ? "🍄 切换到：墨汁鬼伞蘑菇 + 啤酒实验"
        : "🍫 切换回：人类 vs 小狗吃黑巧克力";
      document.getElementById("btnFeedChoco").textContent = state.tummyMode === "choco"
        ? "🍫 一起喂 1 块黑巧克力！"
        : "🍺 点我：喝一口啤酒试试！";
      renderTummyDuel();
    });

    document.getElementById("btnResetTummy").addEventListener("click", () => {
      window.SFX.pop();
      state.chocoPieces = 0;
      state.drankBeer = false;
      renderTummyDuel();
    });
  }

  function renderTummyDuel() {
    const stage = document.getElementById("tummyDuelStage");
    if (state.tummyMode === "choco") {
      const n = state.chocoPieces;
      const humanPct = Math.min(100, n * 12);
      const dogPct = Math.min(100, n * 34);
      const dogSick = n >= 3;

      const en = window.isEn ? window.isEn() : true;
      const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : txt);
      stage.innerHTML = `
        <div class="critter-box">
          <div class="critter-face">${n === 0 ? "🧒" : "😋"}</div>
          <h3 style="margin:0;font-size:1.3rem;">${en ? `Human Kid (Ate ${n} 🍫)` : `人类小朋友（已吃 ${n} 块🍫）`}</h3>
          <div class="enzyme-fan-row">
            <span class="spin-fast">🌀</span>
            <span>${en ? flip("Fast liver CYP enzyme fan breaks down theobromine rapidly!") : "肝脏 CYP 快酶风扇：呼呼飞速分解！"}</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${humanPct}%;background:#4ade80;"></div>
          </div>
          <div style="font-weight:800;color:var(--c-ok-text);">
            ${en
              ? (n === 0 ? "Ready for a snack!" : flip("✅ Enzymes dissolve theobromine quickly — safe and happy!"))
              : (n === 0 ? "准备开吃！" : "✅ 可可碱很快被酶拆掉排出，开心又安全！")}
          </div>
        </div>

        <div class="critter-box" style="border-color:${dogSick ? "#fb7185" : "var(--border-light)"};">
          <div class="critter-face">${n === 0 ? "🐶" : n <= 2 ? "😟" : "😵‍💫"}</div>
          <h3 style="margin:0;font-size:1.3rem;">${en ? `Hungry Puppy (Ate ${n} 🍫)` : `贪吃小修狗（已吃 ${n} 块🍫）`}</h3>
          <div class="enzyme-fan-row">
            <span class="spin-slow">🐌</span>
            <span>${en ? flip("Slow dog enzymes take 18 hours to break down just half!") : "狗狗慢吞吞酶：要花 18 小时才拆一半！"}</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${dogPct}%;background:${dogSick ? "#fb7185" : "#fbbf24"};"></div>
          </div>
          <div style="font-weight:800;color:${dogSick ? "#f43f5e" : "#d97706"};">
            ${en
              ? (n === 0 ? "Staring at the chocolate..." : dogSick ? flip("🚨 Toxic buildup! Never feed chocolate to dogs!") : flip("⚠️ Digestion is too slow — toxin is accumulating in the blood!"))
              : (n === 0 ? "眼巴巴看着巧克力…" : dogSick ? "🚨 肚子可可碱爆仓中毒啦！所以绝对不能喂狗狗吃巧克力！" : "⚠️ 分解太慢啦，已经开始在血液里堵车了！")}
          </div>
        </div>
      `;
    } else {
      const beer = state.drankBeer;
      const en = window.isEn ? window.isEn() : true;
      const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : txt);
      stage.innerHTML = `
        <div class="critter-box">
          <div class="critter-face">🍄🧒🧃</div>
          <h3 style="margin:0;font-size:1.3rem;">${en ? "Ink Cap Soup + Orange Juice" : "只喝墨汁鬼伞汤 + 橙汁"}</h3>
          <div class="enzyme-fan-row">
            <span class="spin-locked">🔒</span>
            <span>${en ? flip("Enzyme #2 is blocked by coprine, but there is no alcohol!") : "2号解酒酶虽被鬼伞素绑住，但没喝酒！"}</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:12%;background:#4ade80;"></div>
          </div>
          <div style="font-weight:800;color:var(--c-ok-text);">${en ? flip("✅ Zero alcohol means zero toxic reaction — completely safe!") : "✅ 没有乙醇进来，一点乙醛都没有，平安无事！"}</div>
        </div>

        <div class="critter-box" style="border-color:${beer ? "#fb7185" : "var(--border-light)"};">
          <div class="critter-face">${beer ? "🥵🚨" : "🍄🧔"}</div>
          <h3 style="margin:0;font-size:1.3rem;">${en ? `Ink Cap Soup ${beer ? "+ 🍺 Sip of Beer!" : "(No Alcohol Yet)"}` : `喝了墨汁鬼伞汤 ${beer ? "+ 🍺 一口啤酒！" : "（还没喝酒）"}`}</h3>
          <div class="enzyme-fan-row">
            <span class="spin-locked">🔒</span>
            <span>${en ? flip("Alcohol-clearing enzyme is locked tight by coprine!") : "2号解酒酶（乙醛脱氢酶）被鬼伞素锁死！"}</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${beer ? 96 : 15}%;background:${beer ? "#fb7185" : "#4ade80"};"></div>
          </div>
          <div style="font-weight:800;color:${beer ? "#f43f5e" : "var(--text-sub)"};">
            ${en
              ? (beer ? flip("🚨 Toxic chemical jam in the blood! Severe red face and rapid heartbeat!") : "👆 Tap the button above to test adding a sip of beer!")
              : (beer ? "🚨 有毒『乙醛』在血管里大堵车！满脸通红心跳加速！（吃头孢也不能喝酒就是这个原理！）" : "👆 快点上方『喝一口啤酒试试』按钮看看会发生什么！")}
          </div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 第 3 站：化毒为药 · 分子炼金急诊室
  // ==========================================================================
  function initPharmacyStage() {
    renderClinic();
  }

  function renderClinic() {
    const en = window.isEn ? window.isEn() : true;
    const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : txt);
    const enCardsMap = (window.ENGLISH_ENCYCLOPEDIA && window.ENGLISH_ENCYCLOPEDIA.cards) || {};

    const tabs = document.getElementById("clinicPatientTabs");
    tabs.innerHTML = CLINIC_PATIENTS.map((p, idx) => {
      const cured = state.curedIds.includes(p.id);
      return `
        <button class="patient-pill ${idx === state.clinicIdx ? "active" : ""} ${cured ? "cured" : ""}" data-idx="${idx}">
          <span style="font-size:2rem;">${p.avatar}</span>
          <div>
            <div>${en ? p.enName : p.name}</div>
            <div style="font-size:0.76rem;color:${cured ? "var(--c-ok-text)" : "var(--text-muted)"};">${cured ? (en ? "✅ Cured!" : "✅ 已康复出院") : (en ? "🚑 Needs Remedy" : "🚑 等待新药")}</div>
          </div>
        </button>
      `;
    }).join("");

    tabs.querySelectorAll(".patient-pill").forEach((b) => {
      b.addEventListener("click", () => {
        window.SFX.pop();
        state.clinicIdx = parseInt(b.getAttribute("data-idx"), 10);
        state.pickedBottle = null;
        renderClinic();
      });
    });

    const p = CLINIC_PATIENTS[state.clinicIdx];
    const cured = state.curedIds.includes(p.id);
    const stage = document.getElementById("clinicStage");
    const winTxt = en ? p.enWinSpeech : p.winSpeech;

    stage.innerHTML = `
      <div class="patient-monitor-screen" style="border-color:${cured ? "#4ade80" : "#fb7185"};">
        <div style="font-size:4.2rem;">${cured ? "🥳" : p.avatar}</div>
        <div style="flex:1;min-width:220px;">
          <div style="font-size:0.84rem;color:var(--text-muted);font-weight:800;">${en ? "Emergency Clinic Monitor" : "急诊病床监测屏"}</div>
          <div style="font-size:1.25rem;font-weight:900;color:${cured ? "var(--c-ok-text)" : "var(--c-err-text)"};margin:4px 0;">
            ${p.monitorIcon} ${cured ? (en ? p.enGoodStat : p.goodStat) : (en ? p.enBadStat : p.badStat)}
          </div>
          <div style="font-weight:700;font-size:0.95rem;">${cured ? `${en ? "Life-Saving Remedy: " : "立功新药："}${en ? p.enDrugName : p.drugName}` : (en ? flip(p.enNeedText) : p.needText)}</div>
        </div>
      </div>

      <div style="font-weight:900;margin-bottom:8px;">${en ? "🧪 Step 1: Pick the right species toxin for the medicine synthesizer:" : "🧪 第1步：点选正确的《大百科》灵感生物放进合成仪："}</div>
      <div class="bottle-shelf">
        ${p.choices.map((cid) => {
          const arch = window.CATALOG_DATA.find((x) => x.id === cid);
          const ph = getPhoto(cid);
          const enCard = enCardsMap[cid];
          const cls = (cured && cid === p.rightId) || state.pickedBottle === cid
            ? (cid === p.rightId ? "picked-right" : "picked-wrong")
            : "";
          return `
            <button class="venom-bottle ${cls}" data-cid="${cid}">
              ${ph ? `<img src="${ph}" alt="${en && enCard ? enCard.enName : arch.name}" />` : `<div style="font-size:2.5rem;">${arch.emoji}</div>`}
              <div>${en && enCard ? enCard.enName : ruby(arch.name)}</div>
              <div style="font-size:0.74rem;color:var(--text-muted);">${en && enCard ? enCard.code : arch.code}</div>
            </button>
          `;
        }).join("")}
      </div>

      <div id="clinicStep2Area">
        ${
          cured
            ? `<div class="kid-voice-bubble tts-reading-scope" id="clinicWinBubble" style="border-color:#4ade80;"><div id="clinicTtsStatus"></div><div class="tts-clauses-body">🎉 ${en ? flip(winTxt) : renderClauses(winTxt)}</div></div>`
            : state.pickedBottle === p.rightId
              ? renderDoseDialHTML(p)
              : state.pickedBottle
                ? `<div class="kid-voice-bubble" style="border-color:#fb7185;">${en ? "🤔 That toxin hits the wrong target! Try another bottle beside it!" : "🤔 这瓶毒物的分子靶点不对症哦，换旁边一瓶试试看！"}</div>`
                : ""
        }
      </div>
    `;

    stage.querySelectorAll(".venom-bottle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cid = btn.getAttribute("data-cid");
        state.pickedBottle = cid;
        if (cid === p.rightId) window.SFX.pop(); else window.SFX.bonk();
        renderClinic();
      });
    });

    const dial = document.getElementById("pharmacyDoseSlider");
    if (dial) {
      dial.addEventListener("input", (e) => {
        const v = parseInt(e.target.value, 10);
        const hint = document.getElementById("dialZoneHint");
        const fireBtn = document.getElementById("btnFireCapsule");
        if (v >= 28 && v <= 62) {
          hint.innerHTML = en ? "✅ <span style='color:var(--c-ok-text)'>Golden micro-dose window! Launch the healing capsule!</span>" : "✅ <span style='color:var(--c-ok-text)'>进入黄金微克治疗窗！快发射救命胶囊！</span>";
          fireBtn.disabled = false;
          fireBtn.style.opacity = "1";
        } else if (v < 28) {
          hint.textContent = en ? "❄️ Dose is too small! Slide right into the green zone!" : "❄️ 剂量太少啦，药效还不够哦（往中间绿区拉！）";
          fireBtn.disabled = true;
          fireBtn.style.opacity = "0.45";
        } else {
          hint.innerHTML = en ? "☠️ <span style='color:var(--c-err-text)'>Dose too high — it turned toxic again! Slide left!</span>" : "☠️ <span style='color:var(--c-err-text)'>剂量太高变回毒药啦！快往左调小一点！</span>";
          fireBtn.disabled = true;
          fireBtn.style.opacity = "0.45";
        }
      });

      document.getElementById("btnFireCapsule").addEventListener("click", () => {
        window.SFX.chime();
        if (!state.curedIds.includes(p.id)) {
          state.curedIds.push(p.id);
          addStars(3);
        }
        renderClinic();
        if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
          window.DoubaoTTS.speakEnglishNarration(p.enWinSpeech, { playTapSfx: false });
        } else {
          speak(p.winSpeech, {
            scopeEl: document.getElementById("clinicWinBubble"),
            statusMountEl: document.getElementById("clinicTtsStatus"),
            playTapSfx: false
          });
        }
      });
    }
  }

  function renderDoseDialHTML(p) {
    const en = window.isEn ? window.isEn() : true;
    return `
      <div style="background:var(--bg-inset);border-radius:18px;padding:16px;margin-top:12px;border:2px solid var(--c-teal);">
        <div style="font-weight:900;margin-bottom:8px;">${en ? "🎛️ Step 2: Turn the Paracelsus Dose Dial into the green healing zone!" : "🎛️ 第2步：转动『帕拉塞尔苏斯剂量旋钮』，把毒液调进中间绿色救命区！"}</div>
        <input type="range" id="pharmacyDoseSlider" min="0" max="100" value="10" style="width:100%;height:14px;border-radius:99px;appearance:none;background:linear-gradient(90deg,#38bdf8 0%,#38bdf8 27%,#4ade80 28%,#4ade80 62%,#fb7185 63%,#fb7185 100%);cursor:pointer;" />
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:10px;">
          <div id="dialZoneHint" style="font-weight:800;">${en ? "👉 Slide into the GREEN golden window!" : "👉 拖动上方彩色滑条到【绿色黄金段】！"}</div>
          <button class="big-action-btn" id="btnFireCapsule" disabled style="opacity:0.45;">
            ${en ? `${p.enDrugName} · Launch Cure! 🚀` : `${p.drugName} · 发射救人！🚀`}
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 第 4 站：升级3 王牌生化对战 + 升级5 四大绘本场景找毒物(25处) + 实拍抢答 PK
  // ==========================================================================
  function initDetectiveStage() {
    // 初始化 99 王牌生化属性对战
    if (window.CardBattlerModule) {
      cardBattler = new window.CardBattlerModule.CardBattlerArena(
        document.getElementById("cardBattlerMount"),
        {
          ruby,
          getPhoto,
          speak,
          onWinStars: (n) => addStars(n),
          onOpenCard: (aid) => openSuperCard(aid)
        }
      );
    }

    // 初始化 v5.0/v7.0 实况观察侦探 & 毒物英语听力/填空大闯关
    if (window.CuriosityEnglishModule && window.CuriosityEnglishModule.LiveEnglishArena) {
      liveEnArena = new window.CuriosityEnglishModule.LiveEnglishArena(
        document.getElementById("liveEnArenaMount"),
        {
          ruby,
          getPhoto,
          speak,
          onWinStars: (n) => addStars(n),
          onOpenCard: (aid) => openSuperCard(aid),
          onTrackMission: (f, d) => trackMission(f, d),
          onMasterWord: (wordKey) => {
            const k = String(wordKey || "").trim().toLowerCase();
            if (k && !state.masteredWords.includes(k)) {
              state.masteredWords.push(k);
              saveState();
            }
          }
        }
      );
    }

    const sharedBridge = {
      state,
      saveState,
      addStars,
      trackMission,
      ruby,
      getPhoto,
      speak,
      openSuperCard,
      switchStage
    };

    // 初始化 v7.0 游戏 5（Venom vs Poison 分类实验室）、游戏 6（16关生活安全大冒险）、游戏 7（三步破案）、游戏 8（真假大法官）
    if (window.KnowledgeGamesModule) {
      if (window.KnowledgeGamesModule.ToxClassificationLab) {
        toxClassifyLab = new window.KnowledgeGamesModule.ToxClassificationLab(
          document.getElementById("toxClassifyMount"),
          sharedBridge
        );
      }
      if (window.KnowledgeGamesModule.SafetyAdventureArena) {
        safetyArena = new window.KnowledgeGamesModule.SafetyAdventureArena(
          document.getElementById("safetyArenaMount"),
          sharedBridge
        );
      }
      if (window.KnowledgeGamesModule.MysteryDetectiveArena) {
        mysteryArena = new window.KnowledgeGamesModule.MysteryDetectiveArena(
          document.getElementById("mysteryCaseMount"),
          sharedBridge
        );
      }
      if (window.KnowledgeGamesModule.ScienceMythBusterArena) {
        mythArena = new window.KnowledgeGamesModule.ScienceMythBusterArena(
          document.getElementById("mythBusterMount"),
          sharedBridge
        );
      }
    }

    document.querySelectorAll(".det-sub-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        const dsub = btn.getAttribute("data-dsub");
        state.detSub = dsub;
        document.querySelectorAll(".det-sub-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("detBattlerPanel").style.display = dsub === "battler" ? "block" : "none";
        document.getElementById("detHuntPanel").style.display = dsub === "hunt" ? "block" : "none";
        document.getElementById("huntToolbar").style.display = dsub === "hunt" ? "flex" : "none";
        document.getElementById("detFlashPanel").style.display = dsub === "flashpk" ? "block" : "none";
        const liveEnPanel = document.getElementById("detLiveEnPanel");
        if (liveEnPanel) liveEnPanel.style.display = dsub === "liveen" ? "block" : "none";
        const clsPanel = document.getElementById("detClassifyPanel");
        if (clsPanel) clsPanel.style.display = dsub === "classify" ? "block" : "none";
        const sfPanel = document.getElementById("detSafetyPanel");
        if (sfPanel) sfPanel.style.display = dsub === "safety" ? "block" : "none";
        const mysPanel = document.getElementById("detMysteryPanel");
        if (mysPanel) mysPanel.style.display = dsub === "mystery" ? "block" : "none";
        const mythPanel = document.getElementById("detMythPanel");
        if (mythPanel) mythPanel.style.display = dsub === "myths" ? "block" : "none";
        if (dsub === "flashpk" && !state.pkAnswer) nextFlashcardPK();
        if (dsub === "liveen" && liveEnArena) {
          if (!liveEnArena.currentAnswer) liveEnArena.init();
        } else if (liveEnArena) {
          liveEnArena.stopMedia();
        }
        if (dsub === "classify" && toxClassifyLab && !toxClassifyLab.currentItem) {
          toxClassifyLab.init();
        }
        if (dsub === "safety" && safetyArena) {
          safetyArena.init();
        }
        if (dsub === "mystery" && mysteryArena && !mysteryArena.caseTarget) {
          mysteryArena.init();
        }
        if (dsub === "myths" && mythArena) {
          mythArena.init();
        }
      });
    });

    renderHuntScene();

    document.getElementById("btnHuntHint").addEventListener("click", () => {
      window.SFX.pop();
      const unfound = document.querySelector(".hunt-target:not(.found)");
      if (unfound) {
        unfound.classList.add("hint-pulse");
        setTimeout(() => unfound.classList.remove("hint-pulse"), 2600);
      }
    });

    document.getElementById("btnHuntReset").addEventListener("click", () => {
      window.SFX.pop();
      const curScene = window.HUNT_SCENES[state.huntSceneIdx];
      const keysToClear = new Set(curScene.targets.map((t) => t.key));
      state.foundHunt = state.foundHunt.filter((k) => !keysToClear.has(k));
      saveState();
      renderHuntScene();
      document.getElementById("huntToast").textContent = curScene.intro;
    });
  }

  function renderHuntScene() {
    const scenes = window.HUNT_SCENES || [];
    if (!scenes.length) return;
    const en = window.isEn ? window.isEn() : true;
    const enHunts = (window.DUWU_I18N && window.DUWU_I18N.getStagesEn().HUNT_SCENES) || {};
    const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : txt);

    const totalTargets = scenes.reduce((acc, s) => acc + s.targets.length, 0);
    const totalFound = scenes.reduce(
      (acc, s) => acc + s.targets.filter((t) => state.foundHunt.includes(t.key)).length,
      0
    );

    const mainTab = document.getElementById("btnDetHuntTab");
    if (mainTab) mainTab.textContent = en ? `👀 2. Spot the Toxins (${totalFound}/${totalTargets})` : `👀 游戏2：四大场景找毒物（${totalFound}/${totalTargets}）`;

    // 渲染 4 大绘本关卡切换条
    const sceneBar = document.getElementById("huntSceneTabs");
    sceneBar.innerHTML = scenes.map((sc, idx) => {
      const doneCnt = sc.targets.filter((t) => state.foundHunt.includes(t.key)).length;
      const isComplete = doneCnt === sc.targets.length;
      const enSc = enHunts[sc.id] || {};
      return `
        <button class="scene-pill ${idx === state.huntSceneIdx ? "active" : ""} ${isComplete ? "completed" : ""}" data-sidx="${idx}">
          ${en && enSc.tabLabel ? enSc.tabLabel : sc.tabLabel} (${doneCnt}/${sc.targets.length}) ${isComplete ? "👑" : ""}
        </button>
      `;
    }).join("");

    sceneBar.querySelectorAll(".scene-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        state.huntSceneIdx = parseInt(btn.getAttribute("data-sidx"), 10);
        const cur = scenes[state.huntSceneIdx];
        const curEn = enHunts[cur.id] || {};
        const introTxt = en && curEn.intro ? curEn.intro : cur.intro;
        document.getElementById("huntToast").innerHTML = en ? flip(introTxt) : introTxt;
        renderHuntScene();
      });
    });

    const curScene = scenes[state.huntSceneIdx];
    const curEnSc = enHunts[curScene.id] || {};
    const imgEl = document.getElementById("huntSceneImg");
    if (imgEl.getAttribute("src") !== curScene.img) {
      imgEl.setAttribute("src", curScene.img);
      imgEl.setAttribute("alt", en && curEnSc.title ? curEnSc.title : curScene.title);
    }

    const layer = document.getElementById("huntHotspotsLayer");
    layer.innerHTML = curScene.targets.map((t) => {
      const isFound = state.foundHunt.includes(t.key);
      const enT = (curEnSc.targets && curEnSc.targets[t.key]) || {};
      const badge = en && enT.badge ? enT.badge : t.badge;
      return `
        <div class="hunt-target ${isFound ? "found" : ""}" data-key="${t.key}"
             style="left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%;">
          <span class="hunt-found-badge">✓ ${badge}</span>
        </div>
      `;
    }).join("");

    layer.querySelectorAll(".hunt-target").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = el.getAttribute("data-key");
        const target = curScene.targets.find((x) => x.key === key);
        const enT = (curEnSc.targets && curEnSc.targets[target.key]) || {};
        const wasAlreadyFound = state.foundHunt.includes(key);
        if (!wasAlreadyFound) {
          state.foundHunt.push(key);
          addStars(2);
          trackMission("knowledge", 1);
          window.SFX.chime();
        } else {
          window.SFX.pop();
          openSuperCard(target.archiveId);
          return;
        }
        renderHuntScene();
        const sceneDone = curScene.targets.every((t) => state.foundHunt.includes(t.key));
        const tipText = en && enT.tip ? enT.tip : target.tip;
        const msg = sceneDone
          ? (en ? `👑 All ${curScene.targets.length} hidden toxins spotted! Tap any green badge again to open its 3D fact card!` : `👑 本关 ${curScene.targets.length} 处全找齐啦！（再点一次绿色圈圈还能看它的 3D 分子闪卡哦！）`)
          : tipText;
        const huntToastEl = document.getElementById("huntToast");
        const tCe = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[target.archiveId]) || null;
        const enChipHtml =
          tCe && tCe.enName
            ? ` <button type="button" class="mini-btn on" id="btnHuntSpeakEn" style="margin-left:8px;padding:3px 10px;min-height:28px;font-size:0.78rem;vertical-align:middle;">🔊 ${tCe.enName}</button>`
            : "";
        huntToastEl.innerHTML = `${en ? flip(msg) : renderClauses(msg)}${enChipHtml}`;
        const btnHuntEn = document.getElementById("btnHuntSpeakEn");
        if (btnHuntEn && tCe && tCe.enName) {
          btnHuntEn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
              window.DoubaoTTS.speakEnglish(tCe.enName, { repeat: 2 });
            }
          });
        }
        if (en && window.DoubaoTTS && window.DoubaoTTS.speakEnglishNarration) {
          window.DoubaoTTS.speakEnglishNarration(tipText, { playTapSfx: false });
        } else {
          speak(target.tip, { scopeEl: huntToastEl, playTapSfx: false });
        }
      });
    });
  }

  // 看真身照片 · 抢答大百科目录 / 英文真名 PK
  function nextFlashcardPK() {
    const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
    const pool = window.CATALOG_DATA.filter((x) => x.chapter !== "ch0" && getPhoto(x.id) && (state.pkMode !== "en" || (ceMap[x.id] && ceMap[x.id].enName)));
    const ans = pool[Math.floor(Math.random() * pool.length)];
    let others = [];
    if (window.EnglishDistractorEngine && window.EnglishDistractorEngine.pickConfusableSpecies) {
      others = window.EnglishDistractorEngine.pickConfusableSpecies(ans, pool, 3);
    } else {
      others = pool.filter((x) => x.id !== ans.id).sort(() => Math.random() - 0.5).slice(0, 3);
    }
    state.pkAnswer = ans;
    state.pkChoices = [ans, ...others].sort(() => Math.random() - 0.5);
    state.pkShowZhHint = false;
    renderFlashcardPK();
  }

  function renderFlashcardPK() {
    const ans = state.pkAnswer;
    const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
    const ansCe = ceMap[ans.id] || {};
    const isEnPK = state.pkMode === "en";
    const arena = document.getElementById("flashcardArena");
    const chapterOnly = (ans.code || "").split(" · ")[0] || ans.code;
    arena.innerHTML = `
      <div>
        <div class="mystery-photo-frame">
          <img src="${getPhoto(ans.id)}" alt="猜猜我是谁" />
          <div id="pkStreakBadge" style="position:absolute;top:12px;left:12px;background:rgba(15,23,42,0.85);color:#fbbf24;padding:6px 14px;border-radius:99px;font-weight:900;">
            🔥 连对纪录：${state.pkStreak}
          </div>
          <div style="position:absolute;bottom:12px;left:12px;background:rgba(15,23,42,0.85);color:#fff;padding:6px 14px;border-radius:99px;font-weight:800;font-size:0.88rem;">
            ${isEnPK ? (state.pkShowZhHint ? `提示：中文叫【${ans.name}】 · ${chapterOnly}` : `提示：来自原书【${chapterOnly}】同家族易混选项！`) : `提示：它在原书【${ans.code}】！`}
          </div>
        </div>
      </div>

      <div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="scene-pill ${!isEnPK ? "active" : ""}" data-pkmode="zh">📖 模式A：抢答中文与目录</button>
            <button type="button" class="scene-pill ${isEnPK ? "active" : ""}" data-pkmode="en">🇬🇧 模式B：看图抢英文真名</button>
          </div>
          ${
            isEnPK && !state.pkShowZhHint
              ? `<button type="button" class="mini-btn" id="btnPkHintZh" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">💡 偷看中文名</button>`
              : ""
          }
        </div>
        <h3 style="margin:0 0 14px;font-size:1.3rem;">
          ${isEnPK ? "🇬🇧 看高清真身：辨别同家族英文真名！" : "📸 看真身认毒物：照片里是谁？"}
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${state.pkChoices.map((c, cIdx) => {
            const cCe = ceMap[c.id] || {};
            return `
            <button class="venom-bottle pk-choice-btn" data-id="${c.id}" style="padding:16px 12px;font-size:1.05rem;">
              ${
                isEnPK
                  ? `<div class="pk-letter-pill">${["A", "B", "C", "D"][cIdx] || "•"}</div>
                     <div style="font-weight:900;color:var(--c-teal-text);">${cCe.enName || c.name}</div>
                     <div style="font-size:0.75rem;color:var(--text-muted);margin-top:3px;">${cCe.enPron || ""}</div>`
                  : `<div style="font-size:1.65rem;margin-bottom:4px;">${c.emoji}</div>
                     <div>${ruby(c.name)}</div>
                     <div style="font-size:0.76rem;color:var(--text-muted);margin-top:4px;">${c.code}</div>`
              }
            </button>
          `;
          }).join("")}
        </div>
        <div id="pkFeedback" style="margin-top:14px;min-height:48px;"></div>
      </div>
    `;

    let pkAnswered = false;

    const btnPkHintZh = document.getElementById("btnPkHintZh");
    if (btnPkHintZh) {
      btnPkHintZh.addEventListener("click", () => {
        window.SFX.pop();
        state.pkShowZhHint = true;
        renderFlashcardPK();
      });
    }

    arena.querySelectorAll("[data-pkmode]").forEach((mb) => {
      mb.addEventListener("click", () => {
        window.SFX.pop();
        state.pkMode = mb.getAttribute("data-pkmode");
        nextFlashcardPK();
      });
    });

    arena.querySelectorAll(".pk-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (pkAnswered) return;
        const picked = btn.getAttribute("data-id");
        const fb = document.getElementById("pkFeedback");
        const streakBadge = document.getElementById("pkStreakBadge");
        if (picked === ans.id) {
          pkAnswered = true;
          btn.classList.add("picked-right");
          state.pkStreak++;
          if (streakBadge) streakBadge.textContent = `🔥 连对纪录：${state.pkStreak}`;
          addStars(2);
          trackMission(isEnPK ? "words" : "knowledge", 1);
          window.SFX.chime();
          if (window.PlaygroundFX) window.PlaygroundFX.celebrate(btn);
          if (ansCe.enName && window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(ansCe.enName, { repeat: isEnPK ? 2 : 1, playTapSfx: false });
          }
          fb.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:rgba(74,222,128,0.18);border:2px solid #4ade80;padding:10px 16px;border-radius:16px;font-weight:800;">
              <div>
                🎉 秒答正确！正是 ${ruby(ans.name)}！
                ${ansCe.enName ? `<button type="button" class="mini-btn on" id="btnPkSpeakEn" style="margin-left:6px;padding:3px 10px;min-height:28px;font-size:0.78rem;">🇬🇧 🔊 ${ansCe.enName}</button>` : ""}
              </div>
              <button class="big-action-btn" id="btnNextPK" style="padding:8px 16px;min-height:38px;font-size:0.9rem;">下一张 ➜</button>
            </div>
          `;
          const bSpk = document.getElementById("btnPkSpeakEn");
          if (bSpk && ansCe.enName) {
            bSpk.addEventListener("click", () => {
              if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
                window.DoubaoTTS.speakEnglish(ansCe.enName, { repeat: 2 });
              }
            });
          }
          document.getElementById("btnNextPK").addEventListener("click", nextFlashcardPK);
        } else {
          btn.classList.add("picked-wrong");
          state.pkStreak = 0;
          if (streakBadge) streakBadge.textContent = `🔥 连对纪录：0`;
          window.SFX.bonk();
          fb.innerHTML = `<div style="color:var(--c-err-text);font-weight:800;padding:8px;">🙈 哎呀猜错啦！瞄一眼左下角的提示再选！</div>`;
        }
      });
    });
  }

  function registerPWA() {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  // ==========================================================================
  // 初始化启动
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    initTopBar();
    initSuperModalEvents();
    initWorldStage();
    initVoiceStudio();
    if (window.InteractiveAICompanion) {
      aiCompanion = new window.InteractiveAICompanion({
        ruby,
        getCurrentCard: () => currentOpenCard,
        onStopOtherAudio: () => {
          if (voiceStudio) voiceStudio.stopPlayback();
        }
      });
    }
    initBioLabStage();
    initPharmacyStage();
    initDetectiveStage();

    // 初始化 v8.0 第 5 站（Word Adventure Island + 6 款升级游戏 + 4 款全新游戏）与探索护照
    const appBridge = {
      state,
      saveState,
      addStars,
      trackMission,
      ruby,
      getPhoto,
      speak,
      openSuperCard,
      switchStage
    };
    window.DUWU_APP = appBridge;

    if (window.EnglishPlaygroundModule && window.EnglishPlaygroundModule.EnglishPlayground) {
      englishPlayground = new window.EnglishPlaygroundModule.EnglishPlayground(
        document.getElementById("englishPlaygroundMount"),
        appBridge
      );
      window.EnglishPlayground = englishPlayground;
    }
    if (window.WordAdventureGames && typeof window.WordAdventureGames.init === "function") {
      window.WordAdventureGames.init(appBridge);
    }
    if (window.KnowledgeGamesModule && window.KnowledgeGamesModule.ExplorerPassportModal) {
      passportModal = new window.KnowledgeGamesModule.ExplorerPassportModal(appBridge);
      passportModal.syncTopBadge();
    }

    // Listen to global EN / ZH toggle and refresh all active dynamic surfaces seamlessly!
    window.addEventListener("duwu:langchange", () => {
      renderWorldHeadersAndPins();
      renderPhotoDex();
      if (window._duwuRenderReagentTray) window._duwuRenderReagentTray();
      renderTummyDuel();
      renderClinic();
      renderHuntScene();
      if (state.pkAnswer) renderFlashcardPK();
      if (currentOpenCard) openSuperCard(currentOpenCard.id);
      if (passportModal) passportModal.syncTopBadge();
    });

    // 全局 Escape 键优雅关闭当前最顶层弹窗
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (aiCompanion && aiCompanion.isOpen) {
        aiCompanion.close();
        return;
      }
      const pp = document.getElementById("passportModalBackdrop");
      if (pp && pp.classList.contains("open") && passportModal) {
        passportModal.close();
        return;
      }
      const iv = document.getElementById("introVideoModal");
      if (iv && iv.classList.contains("open")) {
        const b = document.getElementById("btnCloseIntroVideo");
        if (b) b.click();
        return;
      }
      const sc = document.getElementById("superCardModal");
      if (sc && sc.classList.contains("open")) {
        const b = document.getElementById("btnCloseSuperModal");
        if (b) b.click();
      }
    });

    registerPWA();
  });
})();
