// ============================================================================
// Duwu Science Playground v8.0 — Global Bilingual Engine (EN Default / ZH Toggle)
// Handles:
//   1. Default Full-English immersive mode ("en") + 1-click toggle to original ("zh")
//   2. Default Warm Bright Storybook theme ("light") + 1-click toggle to ("dark")
//   3. Global English speech speed toggle (0.75x Slow / 1.0x Normal)
//   4. Static DOM i18n synchronization + dynamic event bus ("duwu:langchange")
// ============================================================================

(function () {
  const LANG_KEY = "duwu_lang_v8";
  const SPEED_KEY = "duwu_en_speed_v8";
  const THEME_MIGRATED_KEY = "duwu_theme_v8_defaulted";

  const UI_STRINGS = {
    // Document & Top Bar
    docTitle: {
      en: "Toxic Science Wonderpark · Full-English Encyclopedia & Core Vocab Playground",
      zh: "奇妙毒物科学游乐园 · 99实景短片·英语拼词造句翻翻乐·Venom分类·安全大冒险"
    },
    logoTitle: { en: "Toxic Wonderpark", zh: "奇妙毒物游乐园" },
    tabWorld: { en: "🗺️ World & 99 Cards", zh: "🗺️ 生态 & 99卡" },
    tabBiolab: { en: "🔬 BioLab & Pets", zh: "🔬 分子 & 养成" },
    tabPharmacy: { en: "💊 Venom to Meds", zh: "💊 化毒为药" },
    tabDetective: { en: "🃏 Battles & Quests", zh: "🃏 对战 & 闯关" },
    tabEnglish: { en: "🏝️ Word Island", zh: "🇬🇧 单词探险岛" },
    btnIntro: { en: "🎬 Intro", zh: "🎬 介绍" },
    passportTag: { en: "🏅Passport", zh: "🏅护照" },
    wordBoxBtn: { en: "🧰 Word Box", zh: "🧰 生词宝盒" },
    btnSoundOn: { en: "🔊 Sound", zh: "🔊 音效" },
    btnSoundOff: { en: "🔇 Muted", zh: "🔇 静音" },
    btnSpeedSlow: { en: "🐢 Slow", zh: "🐢 慢速" },
    btnSpeedNorm: { en: "🐇 Normal", zh: "🐇 常速" },
    btnPinyin: { en: "🔤 Pinyin", zh: "🔤 拼音" },
    btnThemeToDark: { en: "🌙 Night", zh: "🌙 夜光" },
    btnThemeToLight: { en: "☀️ Bright", zh: "☀️ 绘本" },
    btnLangSwitchToZh: { en: "🇬🇧 EN ⇄ 中文", zh: "🇨🇳 中文 ⇄ EN" },

    // Stage 1: World & 99 Cards
    panoramaHint: {
      en: "👆 Tap glowing creatures in the habitat to open 3D molecules, picture-book stories & tap-to-flip words!",
      zh: "👆 点画里的发光生物与奇石，转 3D 分子 + 录小馆长配音！"
    },
    filterAll: { en: "🌟 All 99 Cards", zh: "🌟 全部 99 张实拍卡" },
    filterRealVid: { en: "🎥 Real Clips", zh: "🎥 真实实况短片" },
    filterVoiced: { en: "🎙️ My Voice", zh: "🎙️ 小馆长已配音" },
    filterNeuro: { en: "⚡ Nerve Blocker", zh: "⚡ 锁死神经" },
    filterBlood: { en: "🩸 Blood Attacker", zh: "🩸 攻击血液" },
    filterCell: { en: "🏭 Cell Stopper", zh: "🏭 停摆细胞" },
    filterMed: { en: "💊 Becomes Medicine", zh: "💊 能变救命药" },
    searchPlaceholder: {
      en: "🔍 Search English or Chinese (e.g., Cobra, frog, 河鲀)",
      zh: "🔍 搜中英文名（如：河鲀、Cobra、frog）"
    },

    // Stage 2: BioLab
    bioSubCell: { en: "⚡ 1. Living Cell Dropper", zh: "⚡ 1. 活体细胞滴管" },
    bioSubSurgery: { en: "🔑 2. Molecule Lock & Scissors", zh: "🔑 2. 3D分子插锁孔 & 剪基团" },
    bioSubEco: { en: "🐸 3. Food-Chain Poison Tank", zh: "🐸 3. 食物链借毒养成缸" },
    bioSubTummy: { en: "🍫 4. Human vs Dog Tummy Lab", zh: "🍫 4. 人狗吃黑巧 & 蘑菇配酒" },
    hudMonitorTitle: { en: "Cell Vital Monitor", zh: "细胞生命监测仪" },
    hudHealthy: { en: "75 BPM · Healthy & Full of Energy!", zh: "75 BPM · 健康活力满满！" },
    cellToastInit: {
      en: "👇 Tap any toxin dropper below (or drag it onto the cell) to see what happens to the ion gates and gears!",
      zh: "👇 点下方任意毒物试剂瓶（或拖到细胞上），看看城门和齿轮会发生什么！"
    },
    surgA: { en: "🔑 Level A: TTX Key & Lock", zh: "🔑 关卡A：河鲀毒素插锁孔" },
    surgB: { en: "✂️ Level B: Aconitine Scissors", zh: "✂️ 关卡B：乌头碱剪双基团脱毒" },
    surgC: { en: "🍲 Level C: 100°C Boiling Duel", zh: "🍲 关卡C：100°C 四季豆 vs 白鹅膏" },
    btnFlipKey: { en: "🔄 Flip Key Direction", zh: "🔄 翻转钥匙方向" },
    btnBoilPot: { en: "🔥 Boil to 100°C!", zh: "🔥 点火煮沸到 100°C！" },
    btnResetLevel: { en: "🔄 Reset Level", zh: "🔄 重置本关" },
    surgToastInit: {
      en: "🔑 Drag the Tetrodotoxin molecule on the left into the cell's sodium channel lock on the right!",
      zh: "🔑 试试把左边的『河鲀毒素』拖进右边的细胞城门锁孔！"
    },
    ecoFrog: { en: "🐸 Raise Dart Frog", zh: "🐸 养黄金箭毒蛙" },
    ecoPuffer: { en: "🐡 Raise Pufferfish", zh: "🐡 养红鳍东方鲀" },
    ecoSnake: { en: "🐍 Raise Keelback Snake", zh: "🐍 养虎斑颈槽蛇" },
    ecoArchive: { en: "📖 Open Fact Card", zh: "📖 看它的原书档案" },
    ecoReset: { en: "🔄 New Baby Pet", zh: "🔄 换一只新宝宝" },
    ecoMeterDefault: { en: "✨ Skin Alkaloid Toxin Level", zh: "✨ 皮肤生物碱毒衣浓度" },
    ecoToastInit: {
      en: "🐣 A newly hatched dart frog has ZERO poison! Feed it different foods to discover its secret!",
      zh: "🐣 刚孵化的箭毒蛙宝宝其实一点毒都没有！快喂它不同食物试试看！"
    },
    ecoFeedSafe: { en: "🪰 Feed Safe Fruit Flies", zh: "🪰 喂普通果蝇（无毒）" },
    ecoFeedToxic: { en: "🐜 Feed Toxic Rainforest Ants!", zh: "🐜 喂雨林毒蚂蚁/甲虫！" },
    ecoPredator: { en: "🐍 Send Hungry Snake to Test!", zh: "🐍 放捕食小蛇来试探！" },
    tummyFeedChoco: { en: "🍫 Feed 1 Piece of Dark Chocolate!", zh: "🍫 一起喂 1 块黑巧克力！" },
    tummySwitchMush: { en: "🍄 Switch to: Ink Cap Mushroom + Alcohol", zh: "🍄 切换到：墨汁鬼伞蘑菇 + 啤酒实验" },
    tummyReset: { en: "🔄 Clear Tummies", zh: "🔄 清空小肚子" },

    // Stage 4: Battles & Knowledge Quests
    detGame1: { en: "🃏 1. 99-Card Bio Battle", zh: "🃏 游戏1：大百科 99 王牌生化对战" },
    detGame2Prefix: { en: "👀 2. Spot the Toxins", zh: "👀 游戏2：四大场景找毒物" },
    detGame3: { en: "📸 3. Photo Flash Quiz", zh: "📸 游戏3：看真身照片 · 抢答目录" },
    detGame4: { en: "🎬 4. Live Video & Cloze", zh: "🎬🇬🇧 游戏4：实况侦探 & 英语填空" },
    detGame5: { en: "⚖️ 5. Venom vs Poison Lab", zh: "⚖️ 游戏5：Venom vs Poison 分类实验室" },
    detGame6: { en: "🛡️ 6. Safety Adventure (16)", zh: "🛡️ 游戏6：生活安全大冒险 (16关)" },
    detGame7: { en: "🕵️ 7. 3-Step Mystery Cases", zh: "🕵️ 游戏7：神秘毒物三步破案" },
    detGame8: { en: "⚡ 8. Science Myth Judge (24)", zh: "⚡ 游戏8：真假科学大法官 (24关)" },
    btnHuntHint: { en: "💡 Magnifier Hint", zh: "💡 放大镜提示" },
    btnHuntReset: { en: "🔄 Replay Scene", zh: "🔄 重玩本关" },
    huntToastInit: {
      en: "🕵️‍♀️ Hidden toxic creatures are hiding in this picture! Tap them all with your finger!",
      zh: "🕵️‍♀️ 图里藏着《致命毒物大百科》里的危险家伙！快用手指把它们全点出来！"
    },

    // Super Card Modal
    viewPhoto: { en: "📸 Real Photo", zh: "📸 高清真身" },
    viewRealVid: { en: "🎥 Live Clip", zh: "🎥 实景短片" },
    viewActionVid: { en: "🎬 Story Clip", zh: "🎬 配音剧场" },
    viewMol3d: { en: "🧬 3D Molecule", zh: "🧬 3D分子" },
    btnSpeakCard: { en: "🔊 Read Aloud", zh: "🔊 给我讲解" },
    btnSpeakAI: { en: "🎙️ AI Voice", zh: "🎙️ AI真声" },
    btnAskAI: { en: "🎤 Ask Frog AI", zh: "🎤 随时互动" },
    introModalTitle: { en: "🎬 Toxic Science Wonderpark Intro Video", zh: "🎬 《奇妙毒物科学游乐园》项目介绍视频" }
  };

  let currentLang = "en";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh" || saved === "en") currentLang = saved;
  } catch (_) {}

  let slowMode = false;
  try {
    slowMode = localStorage.getItem(SPEED_KEY) === "slow";
  } catch (_) {}

  // Ensure Warm Bright Storybook theme becomes default on v8 upgrade (while still allowing manual dark toggle)
  function ensureDefaultStorybookTheme() {
    const SAVE_KEY = "biotoxin_visual_playground_v3";
    try {
      if (!localStorage.getItem(THEME_MIGRATED_KEY)) {
        localStorage.setItem(THEME_MIGRATED_KEY, "1");
        const raw = localStorage.getItem(SAVE_KEY);
        let parsed = {};
        if (raw) {
          try { parsed = JSON.parse(raw) || {}; } catch (_) {}
        }
        parsed.theme = "light";
        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
      }
      const rawNow = localStorage.getItem(SAVE_KEY);
      let theme = "light";
      if (rawNow) {
        try {
          const p = JSON.parse(rawNow);
          if (p && (p.theme === "dark" || p.theme === "light")) theme = p.theme;
        } catch (_) {}
      }
      if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
    } catch (_) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }
  ensureDefaultStorybookTheme();

  function isEn() {
    return currentLang === "en";
  }

  function t(key, fallback) {
    const entry = UI_STRINGS[key];
    if (!entry) return fallback || key;
    return entry[currentLang] || entry.en || fallback || key;
  }

  function pick(enVal, zhVal) {
    return currentLang === "en" ? (enVal !== undefined && enVal !== null && enVal !== "" ? enVal : zhVal) : (zhVal !== undefined && zhVal !== null && zhVal !== "" ? zhVal : enVal);
  }

  function getCardEn(cardId) {
    const map = window.ENGLISH_ENCYCLOPEDIA && window.ENGLISH_ENCYCLOPEDIA.cards;
    return (map && map[cardId]) || null;
  }

  function getStagesEn() {
    return (window.ENGLISH_ENCYCLOPEDIA && window.ENGLISH_ENCYCLOPEDIA.stages) || {};
  }

  function applyStaticDOM() {
    document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
    document.documentElement.setAttribute("data-lang", currentLang);
    document.title = t("docTitle");

    const setText = (sel, key) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = t(key);
    };

    setText("#logoTitleText", "logoTitle");
    setText('.stage-tab[data-stage="world"]', "tabWorld");
    setText('.stage-tab[data-stage="biolab"]', "tabBiolab");
    setText('.stage-tab[data-stage="pharmacy"]', "tabPharmacy");
    setText('.stage-tab[data-stage="detective"]', "tabDetective");
    setText('.stage-tab[data-stage="english"]', "tabEnglish");
    setText("#btnIntroVideo", "btnIntro");
    setText(".passport-chip-tag", "passportTag");
    setText("#btnPinyin", "btnPinyin");

    const btnPinyin = document.getElementById("btnPinyin");
    if (btnPinyin) btnPinyin.style.display = currentLang === "en" ? "none" : "";

    const btnLang = document.getElementById("btnLangToggle");
    if (btnLang) {
      btnLang.textContent = currentLang === "en" ? "🇬🇧 EN ⇄ 中文" : "🇨🇳 中文 ⇄ EN";
      btnLang.classList.toggle("on", currentLang === "en");
    }

    const btnSpeed = document.getElementById("btnEnSpeed");
    if (btnSpeed) {
      btnSpeed.textContent = slowMode ? t("btnSpeedSlow") : t("btnSpeedNorm");
      btnSpeed.classList.toggle("on", slowMode);
    }

    const wbLabel = document.getElementById("wordBoxBtnLabel");
    if (wbLabel) wbLabel.textContent = t("wordBoxBtn");

    setText(".panorama-overlay-hint", "panoramaHint");
    setText('.magic-pill[data-mfilter="all"]', "filterAll");
    setText("#pillRealVidFilter", "filterRealVid");
    setText('.magic-pill[data-mfilter="neuro"]', "filterNeuro");
    setText('.magic-pill[data-mfilter="blood"]', "filterBlood");
    setText('.magic-pill[data-mfilter="cell"]', "filterCell");
    setText('.magic-pill[data-mfilter="med"]', "filterMed");

    const search = document.getElementById("dexSearch");
    if (search) search.placeholder = t("searchPlaceholder");

    // Stage 2
    setText('.biolab-sub-btn[data-sub="cell"]', "bioSubCell");
    setText('.biolab-sub-btn[data-sub="molsurgery"]', "bioSubSurgery");
    setText('.biolab-sub-btn[data-sub="ecosystem"]', "bioSubEco");
    setText('.biolab-sub-btn[data-sub="tummy"]', "bioSubTummy");
    setText("#hudMonitorTitle", "hudMonitorTitle");
    setText('.surgery-mode-btn[data-smode="ttx_lock"]', "surgA");
    setText('.surgery-mode-btn[data-smode="aconitine_surgery"]', "surgB");
    setText('.surgery-mode-btn[data-smode="boil_duel"]', "surgC");
    setText("#btnFlipTTXKey", "btnFlipKey");
    setText("#btnToggleBoilPot", "btnBoilPot");
    setText("#btnResetSurgery", "btnResetLevel");
    setText('#ecoSpeciesTabs [data-esp="frog"]', "ecoFrog");
    setText('#ecoSpeciesTabs [data-esp="puffer"]', "ecoPuffer");
    setText('#ecoSpeciesTabs [data-esp="snake"]', "ecoSnake");
    setText("#btnOpenEcoArchive", "ecoArchive");
    setText("#btnResetEco", "ecoReset");
    setText("#btnEcoSafeFood", "ecoFeedSafe");
    setText("#btnEcoToxicFood", "ecoFeedToxic");
    setText("#btnEcoPredator", "ecoPredator");
    setText("#btnFeedChoco", "tummyFeedChoco");
    setText("#btnSwitchMushroomMode", "tummySwitchMush");
    setText("#btnResetTummy", "tummyReset");

    // Stage 4
    setText('.det-sub-btn[data-dsub="battler"]', "detGame1");
    setText('.det-sub-btn[data-dsub="flashpk"]', "detGame3");
    setText('.det-sub-btn[data-dsub="liveen"]', "detGame4");
    setText('.det-sub-btn[data-dsub="classify"]', "detGame5");
    setText('.det-sub-btn[data-dsub="safety"]', "detGame6");
    setText('.det-sub-btn[data-dsub="mystery"]', "detGame7");
    setText('.det-sub-btn[data-dsub="myths"]', "detGame8");
    setText("#btnHuntHint", "btnHuntHint");
    setText("#btnHuntReset", "btnHuntReset");

    // Super modal
    setText('.view-pill[data-vmode="photo"]', "viewPhoto");
    setText("#btnSwitchRealVideo", "viewRealVid");
    setText("#btnSwitchActionVideo", "viewActionVid");
    setText("#btnSwitch3DMol", "viewMol3d");
    setText("#btnSpeakCard", "btnSpeakCard");
    setText("#btnSpeakCardAI", "btnSpeakAI");
    setText("#btnAskCardAI", "btnAskAI");
    setText("#introModalTitle", "introModalTitle");

    const btnTheme = document.getElementById("btnTheme");
    if (btnTheme) {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      btnTheme.textContent = isLight ? t("btnThemeToDark") : t("btnThemeToLight");
    }

    const btnSound = document.getElementById("btnSound");
    if (btnSound) {
      const on = btnSound.classList.contains("on");
      btnSound.textContent = on ? t("btnSoundOn") : t("btnSoundOff");
    }

    const cellToast = document.getElementById("cellSpeechToast");
    if (cellToast && !cellToast.dataset.dirty) {
      cellToast.innerHTML = window.FlipReader && isEn() ? window.FlipReader.render(t("cellToastInit")) : t("cellToastInit");
    }
    const surgToast = document.getElementById("surgeryToast");
    if (surgToast && !surgToast.dataset.dirty) {
      surgToast.innerHTML = window.FlipReader && isEn() ? window.FlipReader.render(t("surgToastInit")) : t("surgToastInit");
    }
    const ecoToast = document.getElementById("ecoToast");
    if (ecoToast && !ecoToast.dataset.dirty) {
      ecoToast.innerHTML = window.FlipReader && isEn() ? window.FlipReader.render(t("ecoToastInit")) : t("ecoToastInit");
    }
    const huntToast = document.getElementById("huntToast");
    if (huntToast && !huntToast.dataset.dirty) {
      huntToast.innerHTML = window.FlipReader && isEn() ? window.FlipReader.render(t("huntToastInit")) : t("huntToastInit");
    }
  }

  function setLang(lang) {
    const next = lang === "zh" ? "zh" : "en";
    if (next === currentLang) {
      applyStaticDOM();
      return;
    }
    currentLang = next;
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (_) {}
    applyStaticDOM();
    if (window.DoubaoTTS && typeof window.DoubaoTTS.stop === "function") {
      window.DoubaoTTS.stop();
    }
    window.dispatchEvent(new CustomEvent("duwu:langchange", { detail: { lang: currentLang } }));
  }

  function toggleLang() {
    setLang(currentLang === "en" ? "zh" : "en");
  }

  function setSlowMode(flag) {
    slowMode = Boolean(flag);
    try {
      localStorage.setItem(SPEED_KEY, slowMode ? "slow" : "normal");
    } catch (_) {}
    if (window.DoubaoTTS && typeof window.DoubaoTTS.setEnglishSlowMode === "function") {
      window.DoubaoTTS.setEnglishSlowMode(slowMode);
    }
    applyStaticDOM();
    window.dispatchEvent(new CustomEvent("duwu:speedchange", { detail: { slow: slowMode } }));
  }

  function toggleSlowMode() {
    setSlowMode(!slowMode);
  }

  window.DUWU_I18N = {
    get lang() { return currentLang; },
    get slowMode() { return slowMode; },
    isEn,
    t,
    pick,
    getCardEn,
    getStagesEn,
    setLang,
    toggleLang,
    setSlowMode,
    toggleSlowMode,
    applyStaticDOM
  };
  window.isEn = isEn;
  window.duwuT = t;
  window.duwuPick = pick;

  document.addEventListener("DOMContentLoaded", () => {
    if (window.DoubaoTTS && typeof window.DoubaoTTS.setEnglishSlowMode === "function") {
      window.DoubaoTTS.setEnglishSlowMode(slowMode);
    }
    const btnLang = document.getElementById("btnLangToggle");
    if (btnLang) {
      btnLang.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        toggleLang();
      });
    }
    const btnSpeed = document.getElementById("btnEnSpeed");
    if (btnSpeed) {
      btnSpeed.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        toggleSlowMode();
      });
    }
    applyStaticDOM();
  });
})();
