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

  // 全景生态插画地图上的 12 个精准坐标热点
  const PANORAMA_PINS = [
    { id: "ch1-09", x: 12.5, y: 66, label: "箭毒蛙" },
    { id: "ch1-03", x: 19.5, y: 27, label: "黑头林鵙鹟" },
    { id: "ch3-01", x: 27.0, y: 49, label: "乌头" },
    { id: "ch3-17", x: 39.2, y: 22, label: "夹竹桃" },
    { id: "ch4-01", x: 40.5, y: 74, label: "马铃薯" },
    { id: "ch5-07", x: 47.2, y: 87, label: "发光月夜蕈" },
    { id: "ch5-01", x: 60.0, y: 78, label: "白鹅膏" },
    { id: "ch6-12", x: 66.2, y: 57, label: "夜海葵" },
    { id: "ch6-07", x: 78.8, y: 72, label: "地纹芋螺" },
    { id: "ch6-08", x: 82.5, y: 52, label: "蓝环章鱼" },
    { id: "ch7-01", x: 94.0, y: 75, label: "辰砂" },
    { id: "ch7-02", x: 96.2, y: 39, label: "雌黄" }
  ];

  // 细胞游乐场底部 6 个大图标试剂瓶
  const CELL_REAGENTS = [
    { id: "ttx", name: "河鲀毒素", sub: "软木塞堵城门", photoId: "ch6-01", emoji: "🐡" },
    { id: "frog", name: "箭毒蛙/乌头", sub: "木楔撑开城门", photoId: "ch1-09", emoji: "🐸" },
    { id: "cobra", name: "眼镜王蛇毒", sub: "三指蛋白抢座", photoId: "ch1-06", emoji: "👑" },
    { id: "amanitin", name: "白鹅膏铁锁", sub: "锁死细胞工厂", photoId: "ch5-01", emoji: "🍄" },
    { id: "pepsin", name: "胃蛋白酶剪刀", sub: "试试能剪碎谁？", photoId: null, emoji: "✂️" },
    { id: "clean", name: "清水冲洗复原", sub: "恢复健康细胞", photoId: null, emoji: "🚿" }
  ];

  // 急诊室视觉化药丸合成关卡
  const CLINIC_PATIENTS = [
    {
      id: "p1", avatar: "👴", name: "高血压爷爷", monitorIcon: "🩸",
      badStat: "血压 195 mmHg · 血管紧绷警报！",
      goodStat: "血压 118 mmHg · 血管舒张轻松啦！😄",
      needText: "快找【一咬猎物就让血压骤降】的毒蛇原液！",
      rightId: "ch1-05",
      choices: ["ch1-05", "ch5-01", "ch7-01"],
      drugName: "💊 卡托普利降压片",
      winSpeech: "太棒啦！科学家模仿蝮蛇毒肽造出了降压神药『卡托普利』，爷爷的血管一下子放松啦！"
    },
    {
      id: "p2", avatar: "🤕", name: "剧痛折磨叔叔", monitorIcon: "⚡",
      badStat: "疼痛指数 10级 · 普通止痛药失效！",
      goodStat: "疼痛指数 0级 · 安稳睡着不上瘾！😌",
      needText: "快找海底会射鱼叉的【美丽花纹海螺】微肽！",
      rightId: "ch6-07",
      choices: ["ch6-13", "ch6-07", "ch4-01"],
      drugName: "💉 齐考诺肽止痛针",
      winSpeech: "研发成功！第6章『地纹芋螺』的微肽能精准关掉痛觉钙通道，止痛威力是吗啡的1000倍还不成瘾！"
    },
    {
      id: "p3", avatar: "🧒", name: "脑部手术导航", monitorIcon: "🔦",
      badStat: "屏幕一片模糊 · 看不清坏细胞边界！",
      goodStat: "坏细胞发亮啦 · 医生精准保护大脑！✨",
      needText: "快找沙漠里金黄色、能自动贴住肿瘤的【蝎子】！",
      rightId: "ch2-05",
      choices: ["ch2-05", "ch2-01", "ch2-10"],
      drugName: "🔦 蝎毒肿瘤荧光画笔",
      winSpeech: "太神奇啦！『以色列金蝎』的氯毒素装上小灯后，能让肿瘤细胞自己发光给外科医生指路！"
    },
    {
      id: "p4", avatar: "👵", name: "心跳无力奶奶", monitorIcon: "🫀",
      badStat: "心跳微弱无力 · 泵不动血液啦！",
      goodStat: "心跳咚咚有力 · 奶奶气色红润！❤️",
      needText: "快找像一串串紫粉风铃一样的【强心名花】！",
      rightId: "ch3-06",
      choices: ["ch3-05", "ch3-06", "ch3-03"],
      drugName: "❤️ 地高辛微克强心片",
      winSpeech: "精准控量大师！剧毒『毛地黄』缩小到0.1毫克级，就变成了守护心脏两百年的经典良药！"
    },
    {
      id: "p5", avatar: "🦶", name: "痛风脚肿伯伯", monitorIcon: "🔥",
      badStat: "白细胞顺着微管铁轨冲去关节打群架！",
      goodStat: "关节消肿不疼啦 · 还能种无籽西瓜！🍉",
      needText: "快找秋天开花、会【拆掉微管铁轨】的植物球茎！",
      rightId: "ch3-11",
      choices: ["ch3-11", "ch3-18", "ch4-06"],
      drugName: "💊 秋水仙碱消炎片",
      winSpeech: "答对啦！『秋水仙碱』既能拆掉微管阻止白细胞去关节发炎，又能帮农民伯伯培育无籽大西瓜！"
    }
  ];

  const state = {
    stage: "world",
    magicFilter: "all",
    chFilter: "all",
    search: "",
    pinyin: true,
    sound: true,
    theme: "dark",

    litCards: [],
    foundHunt: [], // 25 处跨场景 key 列表
    curedIds: [],
    surgeryWon: [],
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
  let voiceStudio = null;
  let aiCompanion = null;
  let currentOpenCard = null;
  let unsubscribeModalTts = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY) || "{}";
      const s = JSON.parse(raw);
      state.litCards = s.litCards || [];
      // 兼容旧版找茬 key (potato -> p_potato)
      state.foundHunt = (s.foundHunt || []).map((k) => (k.includes("_") ? k : `p_${k}`));
      state.curedIds = s.curedIds || [];
      state.surgeryWon = s.surgeryWon || [];
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
        stars: state.stars,
        theme: state.theme
      }));
    } catch (_) {}
    const el = document.getElementById("starCounter");
    if (el) el.textContent = `⭐ ${state.stars}`;
  }

  function addStars(n) {
    state.stars += n;
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
    document.getElementById("starCounter").textContent = `⭐ ${state.stars}`;

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
      btnSound.textContent = state.sound ? "🔊 音效" : "🔇 静音";
    });

    const btnPinyin = document.getElementById("btnPinyin");
    btnPinyin.addEventListener("click", () => {
      state.pinyin = !state.pinyin;
      document.body.classList.toggle("hide-pinyin", !state.pinyin);
      btnPinyin.classList.toggle("on", state.pinyin);
    });

    const btnTheme = document.getElementById("btnTheme");
    const syncThemeTxt = () => { btnTheme.textContent = state.theme === "light" ? "🌙 夜光" : "☀️ 亮色"; };
    syncThemeTxt();
    btnTheme.addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      if (state.theme === "light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
      syncThemeTxt();
      saveState();
    });
  }

  function switchStage(st) {
    state.stage = st;
    document.querySelectorAll(".stage-tab").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-stage") === st);
    });
    document.querySelectorAll(".stage-view").forEach((v) => {
      v.classList.toggle("active", v.id === `stage-${st}`);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==========================================================================
  // 升级4：初始化小馆长配音间（本地 IndexedDB + 家庭云端同步）
  // ==========================================================================
  function initVoiceStudio() {
    if (!window.CuratorVoiceModule) return;
    voiceStudio = new window.CuratorVoiceModule.CuratorVoiceStudio((count) => {
      const pill = document.getElementById("pillVoicedFilter");
      if (pill) pill.textContent = `🎙️ 小馆长已配音 (${count}/99)`;
      renderPhotoDex();
    });
    voiceStudio.init();
  }

  // ==========================================================================
  // 第 1 站：全景寻宝地图 + 99 张高清实拍3D闪卡墙
  // ==========================================================================
  function initWorldStage() {
    const pinWrap = document.getElementById("panoramaPins");
    pinWrap.innerHTML = PANORAMA_PINS.map((p, idx) => {
      const ph = getPhoto(p.id);
      const item = window.CATALOG_DATA.find((x) => x.id === p.id);
      return `
        <button class="map-pin" data-id="${p.id}" style="left:${p.x}%;top:${p.y}%;animation-delay:${idx * 0.22}s;" title="${p.label}">
          ${ph ? `<img src="${ph}" alt="${p.label}" loading="lazy" />` : `<span>${item ? item.emoji : "✨"}</span>`}
          <span class="map-pin-label">${ruby(p.label)}</span>
        </button>
      `;
    }).join("");

    pinWrap.querySelectorAll(".map-pin").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        openSuperCard(btn.getAttribute("data-id"));
      });
    });

    document.querySelectorAll("#magicFilterBar .magic-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        window.SFX.pop();
        state.magicFilter = pill.getAttribute("data-mfilter");
        document.querySelectorAll("#magicFilterBar .magic-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        renderPhotoDex();
      });
    });

    const chStrip = document.getElementById("chapterStrip");
    chStrip.innerHTML = window.CHAPTERS.map((c) => `
      <button class="ch-chip ${c.id === "all" ? "active" : ""}" data-ch="${c.id}">
        ${c.icon} ${c.short}
      </button>
    `).join("");

    chStrip.querySelectorAll(".ch-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        window.SFX.pop();
        state.chFilter = chip.getAttribute("data-ch");
        chStrip.querySelectorAll(".ch-chip").forEach((x) => x.classList.remove("active"));
        chip.classList.add("active");
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
      if (state.magicFilter === "voiced" && !(voiceStudio && voiceStudio.hasVoice(item.id))) return false;
      if (state.magicFilter === "neuro" && item.mech !== "neuro") return false;
      if (state.magicFilter === "blood" && item.mech !== "blood") return false;
      if (state.magicFilter === "cell" && item.mech !== "cell") return false;
      if (state.magicFilter === "med" && !medIds.has(item.id)) return false;
      if (state.search) {
        const hay = `${item.name} ${item.code} ${item.molecule}`.toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });

    if (list.length === 0 && state.magicFilter === "voiced") {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:36px 20px;background:var(--bg-panel);border-radius:24px;border:2px dashed var(--c-amber);">
          <div style="font-size:3rem;">🎙️👑</div>
          <h3 style="margin:8px 0;">小馆长还没有录第一条专属解说哦！</h3>
          <div style="color:var(--text-sub);font-weight:700;">点开任意一张生物闪卡，按下【🎙️ 按下开始录音】，就能点亮专属金勋章啦！</div>
        </div>
      `;
      return;
    }

    const mechBadgeLabel = {
      neuro: { txt: "⚡神经", bg: "#38bdf8" },
      blood: { txt: "🩸血液", bg: "#fb7185" },
      cell: { txt: "🏭细胞", bg: "#c084fc" },
      enzyme: { txt: "🔥锁酶", bg: "#fbbf24" },
      physical: { txt: "🛡️刺针", bg: "#4ade80" },
      concept: { txt: "⚖️法则", bg: "#f472b6" }
    };

    grid.innerHTML = list.map((item) => {
      const photo = getPhoto(item.id);
      const mb = mechBadgeLabel[item.mech] || mechBadgeLabel.concept;
      const lit = state.litCards.includes(item.id);
      const voiced = voiceStudio && voiceStudio.hasVoice(item.id);
      const shortCode = item.code.replace("第", "").replace("章 · 档案", "-").replace("序-0", "序");

      return `
        <div class="dex-card ${lit ? "lit" : ""}" data-id="${item.id}">
          <div class="dex-thumb-wrap">
            ${
              photo
                ? `<img class="dex-thumb" src="${photo}" alt="${item.name}" loading="lazy" />`
                : `<div class="dex-fallback-art">${item.emoji}</div>`
            }
            <span class="dex-num-badge">${shortCode} ${lit ? "⭐" : ""}</span>
            <span class="dex-3d-badge">🧬 3D分子</span>
            ${voiced ? `<span class="dex-voice-badge">🎙️ 已配音</span>` : ""}
            <span class="dex-mech-dot" style="background:${mb.bg};">${mb.txt}</span>
          </div>
          <div class="dex-info">
            <h3 class="dex-title">${ruby(item.name)}</h3>
            <span style="font-size:1.2rem;">${item.strategy === "venom" ? "🗡️" : item.strategy === "poison" ? "🛡️" : "💎"}</span>
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

    const photo = getPhoto(id);
    const molData = getMol3DData(id);

    const imgEl = document.getElementById("modalPhotoImg");
    const canvas3d = document.getElementById("mol3dCanvas");
    const btn3d = document.getElementById("btnSwitch3DMol");

    imgEl.src = photo || "assets/scenes/panorama.jpg";
    imgEl.style.display = "block";
    canvas3d.style.display = "none";

    document.querySelectorAll("#modalViewSwitch .view-pill").forEach((p) => {
      p.classList.toggle("active", p.getAttribute("data-vmode") === "photo");
    });

    if (molData) {
      btn3d.style.display = "inline-block";
      if (!molViewer) {
        molViewer = new window.PlaygroundEngines.Molecule3DViewer(canvas3d);
      }
      molViewer.setMolecule(molData);
    } else {
      btn3d.style.display = "none";
    }

    document.getElementById("modalCodeBadge").textContent = `📖 ${item.code}`;

    // 挂载小馆长专属配音录音间
    if (voiceStudio) {
      voiceStudio.mountWidget(document.getElementById("modalCuratorVoiceMount"), item, () => {
        addStars(3);
      });
    }

    const heatDestroyedIds = new Set([
      "ch1-01", "ch1-02", "ch1-04", "ch1-05", "ch1-06", "ch1-07", "ch1-08",
      "ch1-10", "ch1-11", "ch2-01", "ch2-02", "ch2-03", "ch3-18",
      "ch4-02", "ch6-03", "ch6-04", "ch6-05", "ch6-10", "ch6-12",
      "ch6-13", "ch6-14", "ch6-15", "ch6-16", "ch6-17"
    ]);
    const fireDangerIds = new Set(["ch7-01", "ch7-02", "ch7-03", "ch7-05", "ch7-06"]);
    const isProteinVenom = item.strategy === "venom" && item.id !== "ch6-08";

    const radar = item.radar || (item.mech === "neuro" ? [92, 25, 30, 60, 80] : item.mech === "blood" ? [30, 92, 60, 50, 78] : [35, 35, 90, 65, 68]);

    const spokenMol = cleanMol(item.molecule);
    const bilingual = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[item.id]) || null;
    const rightBox = document.getElementById("modalRightInteractive");
    rightBox.innerHTML = `
      <div id="modalCardSpeechScope" class="tts-reading-scope">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-right:38px;">
          <span style="font-size:2.2rem;">${item.emoji}</span>
          <div style="flex:1;min-width:180px;">
            <h2 id="modalTitleSeg" class="tts-seg tts-header-seg" data-tts-seg="${item.name}。" style="margin:0;font-size:1.6rem;font-weight:900;">${ruby(item.name)}</h2>
            <div id="modalWeaponSeg" class="tts-seg tts-header-seg" data-tts-seg="它的秘密武器是${spokenMol}。" style="color:var(--c-teal);font-weight:800;font-size:0.9rem;margin-top:2px;">🧪 武器：${ruby(item.molecule)}</div>
          </div>
        </div>

        <div class="kid-voice-bubble tts-interactive-bubble" id="modalMainBubble" title="点击开始或停止讲解">
          <div id="modalTtsStatusMount"></div>
          <div class="tts-clauses-body">💬 ${renderClauses(item.summary, bilingual)}</div>
        </div>
      </div>

      <div class="mini-test-row">
        <button class="toy-test-btn" id="btnTestBoil">
          <div style="font-size:2rem;">🍲🔥</div>
          <div style="font-weight:900;margin-top:4px;">丢进 100°C 沸水锅！</div>
          <div style="font-size:0.76rem;color:var(--text-muted);">点我看能不能煮烂它</div>
        </button>
        <button class="toy-test-btn" id="btnTestAcid">
          <div style="font-size:2rem;">✂️🧪</div>
          <div style="font-weight:900;margin-top:4px;">丢进胃蛋白酶剪刀！</div>
          <div style="font-size:0.76rem;color:var(--text-muted);">点我看是大蛋白还是小分子</div>
        </button>
      </div>

      <div id="toyTestResultBox" style="min-height:54px;"></div>

      <div style="background:var(--bg-inset);border-radius:16px;padding:12px 14px;margin-top:8px;">
        ${renderPowerBar("⚡ 神经锁定力", radar[0], "#38bdf8")}
        ${renderPowerBar("🩸 血液破坏力", radar[1], "#fb7185")}
        ${renderPowerBar("🏭 细胞攻击力", radar[2], "#c084fc")}
        ${renderPowerBar("💊 变身良药潜力", radar[4], "#4ade80")}
      </div>

      ${
        item.biochemDeep
          ? `<details style="margin-top:10px;background:var(--bg-inset);padding:10px 14px;border-radius:14px;cursor:pointer;">
               <summary style="font-weight:800;font-size:0.88rem;color:var(--c-amber);">🔎 爸爸妈妈伴读锦囊（点击展开深层原理）</summary>
               <div id="modalDeepSpeechScope" class="tts-reading-scope" style="margin-top:8px;">
                 <div id="deepTtsStatusMount"></div>
                 <div class="tts-clauses-body" style="font-size:0.92rem;color:var(--text-sub);line-height:1.72;">${renderClauses(item.biochemDeep)}</div>
               </div>
               <button class="mini-btn" id="btnSpeakDeep" style="margin-top:10px;font-size:0.82rem;padding:6px 14px;">🔊 给我讲解</button>
             </details>`
          : ""
      }
    `;

    document.getElementById("superCardModal").classList.add("open");

    const btnDeep = document.getElementById("btnSpeakDeep");
    if (btnDeep && item.biochemDeep) {
      btnDeep.addEventListener("click", (e) => {
        e.stopPropagation();
        if (voiceStudio) voiceStudio.stopPlayback();
        speak(null, {
          toggleIfPlaying: true,
          scopeEl: document.getElementById("modalDeepSpeechScope"),
          triggerBtn: btnDeep,
          statusMountEl: document.getElementById("deepTtsStatusMount"),
          defaultBtnHTML: "🔊 给我讲解"
        });
      });
    }

    document.getElementById("btnTestBoil").addEventListener("click", () => {
      const box = document.getElementById("toyTestResultBox");
      if (fireDangerIds.has(item.id)) {
        window.SFX.bonk();
        const msg = "千万别烧！矿物一遇高温灼烧，反而会跑出剧毒的汞蒸气或砒霜烟雾！";
        const biTest = { en: "Never put this rock in a fire!", zh: "千万别把这块矿石放进火里烧！", kw: ["rock", "fire"], pos: "end" };
        box.innerHTML = `<div class="kid-voice-bubble tts-reading-scope" style="border-color:#fb7185;background:rgba(251,113,133,0.18);"><div class="tts-toy-status"></div><div class="tts-clauses-body">🚨 ${renderClauses(msg, biTest)}</div></div>`;
        speak(null, { scopeEl: box, statusMountEl: box.querySelector(".tts-toy-status"), playTapSfx: false });
      } else if (heatDestroyedIds.has(item.id)) {
        window.SFX.sizzle();
        const msg = "咕嘟咕嘟散架啦！它是怕热的大分子蛋白质，100°C彻底煮透就会变性失活！（如四季豆焖熟就超安全！）";
        const biTest = { en: "High heat breaks the big protein!", zh: "高温能把大蛋白煮散架！", kw: ["heat", "breaks", "protein"], pos: "mid" };
        box.innerHTML = `<div class="kid-voice-bubble tts-reading-scope" style="border-color:#4ade80;background:rgba(74,222,128,0.18);"><div class="tts-toy-status"></div><div class="tts-clauses-body">🫧✅ ${renderClauses(msg, biTest)}</div></div>`;
        speak(null, { scopeEl: box, statusMountEl: box.querySelector(".tts-toy-status"), playTapSfx: false });
      } else {
        window.SFX.bonk();
        const msg = "沸水完全煮不烂！它的分子结构锁得像小铁笼一样结实，普通做饭温度根本拆不动它！";
        const biTest = { en: "Boiling water cannot break it!", zh: "沸水也煮不烂它！", kw: ["Boiling", "water", "break"], pos: "mid" };
        box.innerHTML = `<div class="kid-voice-bubble tts-reading-scope" style="border-color:#fbbf24;background:rgba(251,191,36,0.18);"><div class="tts-toy-status"></div><div class="tts-clauses-body">🫧☠️ ${renderClauses(msg, biTest)}</div></div>`;
        speak(null, { scopeEl: box, statusMountEl: box.querySelector(".tts-toy-status"), playTapSfx: false });
      }
    });

    document.getElementById("btnTestAcid").addEventListener("click", () => {
      const box = document.getElementById("toyTestResultBox");
      if (isProteinVenom) {
        window.SFX.chime();
        const msg = "咔嚓剪碎啦！它是主动注射型蛋白毒液，必须靠毒牙或毒刺扎进血管才厉害；遇到胃蛋白酶会被剪成小段！（但嘴里有小伤口仍危险，绝不能尝哦！）";
        const biTest = { en: "Stomach enzymes cut it into pieces!", zh: "胃里的酶剪刀能把它剪成小段！", kw: ["Stomach", "enzymes", "pieces"], pos: "mid" };
        box.innerHTML = `<div class="kid-voice-bubble tts-reading-scope" style="border-color:#4ade80;background:rgba(74,222,128,0.18);"><div class="tts-toy-status"></div><div class="tts-clauses-body">✂️✨ ${renderClauses(msg, biTest)}</div></div>`;
        speak(null, { scopeEl: box, statusMountEl: box.querySelector(".tts-toy-status"), playTapSfx: false });
      } else {
        window.SFX.bonk();
        const msg = "剪刀崩牙啦！它是小分子生物碱、糖苷或矿物，不是普通蛋白质，不怕胃酸剪刀，误食进肚子就会直接钻进血液！";
        const biTest = { en: "It is too small for the scissors!", zh: "它个头太小，蛋白酶剪刀剪不动！", kw: ["small", "scissors"], pos: "mid" };
        box.innerHTML = `<div class="kid-voice-bubble tts-reading-scope" style="border-color:#fb7185;background:rgba(251,113,133,0.18);"><div class="tts-toy-status"></div><div class="tts-clauses-body">💥🛡️ ${renderClauses(msg, biTest)}</div></div>`;
        speak(null, { scopeEl: box, statusMountEl: box.querySelector(".tts-toy-status"), playTapSfx: false });
      }
    });

    const btnSpeakCard = document.getElementById("btnSpeakCard");
    btnSpeakCard.classList.remove("is-loading", "is-playing");
    btnSpeakCard.innerHTML = "🔊 给我讲解";

    const btnAskCardAI = document.getElementById("btnAskCardAI");
    if (btnAskCardAI) {
      btnAskCardAI.onclick = () => {
        if (window.SFX) window.SFX.pop();
        if (aiCompanion) {
          aiCompanion.open(item, { autoListen: true });
        }
      };
    }

    const triggerMainCardSpeech = () => {
      if (voiceStudio) voiceStudio.stopPlayback();
      speak(null, {
        toggleIfPlaying: true,
        scopeEl: document.getElementById("modalCardSpeechScope"),
        triggerBtn: btnSpeakCard,
        statusMountEl: document.getElementById("modalTtsStatusMount"),
        defaultBtnHTML: "🔊 给我讲解"
      });
    };

    btnSpeakCard.onclick = triggerMainCardSpeech;
    const mainBubbleEl = document.getElementById("modalMainBubble");
    if (mainBubbleEl) {
      mainBubbleEl.onclick = triggerMainCardSpeech;
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

    // 打开卡片瞬间后台预加载并解码本卡内置语音，点「🔊 给我讲解」0毫秒直接出声音！
    if (window.DoubaoTTS && window.DoubaoTTS.preloadScope) {
      window.DoubaoTTS.preloadScope(document.getElementById("modalCardSpeechScope"));
      if (bilingual) {
        window.DoubaoTTS.preloadText(`${bilingual.en} ${bilingual.en} ${bilingual.zh}`);
      }
    }
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

  function initSuperModalEvents() {
    document.querySelectorAll("#modalViewSwitch .view-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        window.SFX.pop();
        const vmode = pill.getAttribute("data-vmode");
        document.querySelectorAll("#modalViewSwitch .view-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        document.getElementById("modalPhotoImg").style.display = vmode === "photo" ? "block" : "none";
        document.getElementById("mol3dCanvas").style.display = vmode === "mol3d" ? "block" : "none";
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
      if (voiceStudio) {
        voiceStudio.stopActiveRecording();
        voiceStudio.stopPlayback();
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

    const tray = document.getElementById("reagentTray");
    tray.innerHTML = CELL_REAGENTS.map((r) => {
      const ph = r.photoId ? getPhoto(r.photoId) : null;
      return `
        <div class="reagent-card" draggable="true" data-rid="${r.id}">
          ${
            ph
              ? `<img class="reagent-avatar" src="${ph}" alt="${r.name}" />`
              : `<div class="reagent-avatar">${r.emoji}</div>`
          }
          <div>
            <div style="font-weight:900;font-size:0.95rem;">${r.emoji} ${ruby(r.name)}</div>
            <div style="font-size:0.76rem;color:var(--text-muted);font-weight:700;">${r.sub}</div>
          </div>
        </div>
      `;
    }).join("");

    const triggerReagent = (rid, cardEl) => {
      tray.querySelectorAll(".reagent-card").forEach((c) => c.classList.remove("active"));
      if (cardEl && rid !== "pepsin" && rid !== "clean") cardEl.classList.add("active");
      cellPlayground.applyReagent(rid);
      addStars(1);
    };

    tray.querySelectorAll(".reagent-card").forEach((card) => {
      const rid = card.getAttribute("data-rid");
      card.addEventListener("click", () => triggerReagent(rid, card));
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", rid);
      });
    });

    const dropZone = document.getElementById("cellDropZone");
    dropZone.addEventListener("dragover", (e) => e.preventDefault());
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      const rid = e.dataTransfer.getData("text/plain");
      if (rid) {
        const card = tray.querySelector(`[data-rid="${rid}"]`);
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

      stage.innerHTML = `
        <div class="critter-box">
          <div class="critter-face">${n === 0 ? "🧒" : "😋"}</div>
          <h3 style="margin:0;font-size:1.3rem;">人类小朋友（已吃 ${n} 块🍫）</h3>
          <div class="enzyme-fan-row">
            <span class="spin-fast">🌀</span>
            <span>肝脏 CYP 快酶风扇：呼呼飞速分解！</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${humanPct}%;background:#4ade80;"></div>
          </div>
          <div style="font-weight:800;color:#4ade80;">
            ${n === 0 ? "准备开吃！" : "✅ 可可碱很快被酶拆掉排出，开心又安全！"}
          </div>
        </div>

        <div class="critter-box" style="border-color:${dogSick ? "#fb7185" : "var(--border-light)"};">
          <div class="critter-face">${n === 0 ? "🐶" : n <= 2 ? "😟" : "😵‍💫"}</div>
          <h3 style="margin:0;font-size:1.3rem;">贪吃小修狗（已吃 ${n} 块🍫）</h3>
          <div class="enzyme-fan-row">
            <span class="spin-slow">🐌</span>
            <span>狗狗慢吞吞酶：要花 18 小时才拆一半！</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${dogPct}%;background:${dogSick ? "#fb7185" : "#fbbf24"};"></div>
          </div>
          <div style="font-weight:800;color:${dogSick ? "#fb7185" : "#fbbf24"};">
            ${n === 0 ? "眼巴巴看着巧克力…" : dogSick ? "🚨 肚子可可碱爆仓中毒啦！所以绝对不能喂狗狗吃巧克力！" : "⚠️ 分解太慢啦，已经开始在血液里堵车了！"}
          </div>
        </div>
      `;
    } else {
      const beer = state.drankBeer;
      stage.innerHTML = `
        <div class="critter-box">
          <div class="critter-face">🍄🧒🧃</div>
          <h3 style="margin:0;font-size:1.3rem;">只喝墨汁鬼伞汤 + 橙汁</h3>
          <div class="enzyme-fan-row">
            <span class="spin-locked">🔒</span>
            <span>2号解酒酶虽被鬼伞素绑住，但没喝酒！</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:12%;background:#4ade80;"></div>
          </div>
          <div style="font-weight:800;color:#4ade80;">✅ 没有乙醇进来，一点乙醛都没有，平安无事！</div>
        </div>

        <div class="critter-box" style="border-color:${beer ? "#fb7185" : "var(--border-light)"};">
          <div class="critter-face">${beer ? "🥵🚨" : "🍄🧔"}</div>
          <h3 style="margin:0;font-size:1.3rem;">喝了墨汁鬼伞汤 ${beer ? "+ 🍺 一口啤酒！" : "（还没喝酒）"}</h3>
          <div class="enzyme-fan-row">
            <span class="spin-locked">🔒</span>
            <span>2号解酒酶（乙醛脱氢酶）被鬼伞素锁死！</span>
          </div>
          <div class="tummy-bar-track">
            <div class="tummy-bar-fill" style="width:${beer ? 96 : 15}%;background:${beer ? "#fb7185" : "#4ade80"};"></div>
          </div>
          <div style="font-weight:800;color:${beer ? "#fb7185" : "var(--text-sub)"};">
            ${beer ? "🚨 有毒『乙醛』在血管里大堵车！满脸通红心跳加速！（吃头孢也不能喝酒就是这个原理！）" : "👆 快点上方『喝一口啤酒试试』按钮看看会发生什么！"}
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
    const tabs = document.getElementById("clinicPatientTabs");
    tabs.innerHTML = CLINIC_PATIENTS.map((p, idx) => {
      const cured = state.curedIds.includes(p.id);
      return `
        <button class="patient-pill ${idx === state.clinicIdx ? "active" : ""} ${cured ? "cured" : ""}" data-idx="${idx}">
          <span style="font-size:2rem;">${p.avatar}</span>
          <div>
            <div>${p.name}</div>
            <div style="font-size:0.76rem;color:${cured ? "#4ade80" : "var(--text-muted)"};">${cured ? "✅ 已康复出院" : "🚑 等待新药"}</div>
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

    stage.innerHTML = `
      <div class="patient-monitor-screen" style="border-color:${cured ? "#4ade80" : "#fb7185"};">
        <div style="font-size:4.2rem;">${cured ? "🥳" : p.avatar}</div>
        <div style="flex:1;min-width:220px;">
          <div style="font-size:0.84rem;color:var(--text-muted);font-weight:800;">急诊病床监测屏</div>
          <div style="font-size:1.25rem;font-weight:900;color:${cured ? "#4ade80" : "#fb7185"};margin:4px 0;">
            ${p.monitorIcon} ${cured ? p.goodStat : p.badStat}
          </div>
          <div style="font-weight:700;font-size:0.95rem;">${cured ? `立功新药：${p.drugName}` : p.needText}</div>
        </div>
      </div>

      <div style="font-weight:900;margin-bottom:8px;">🧪 第1步：点选正确的《大百科》灵感生物放进合成仪：</div>
      <div class="bottle-shelf">
        ${p.choices.map((cid) => {
          const arch = window.CATALOG_DATA.find((x) => x.id === cid);
          const ph = getPhoto(cid);
          const cls = (cured && cid === p.rightId) || state.pickedBottle === cid
            ? (cid === p.rightId ? "picked-right" : "picked-wrong")
            : "";
          return `
            <button class="venom-bottle ${cls}" data-cid="${cid}">
              ${ph ? `<img src="${ph}" alt="${arch.name}" />` : `<div style="font-size:2.5rem;">${arch.emoji}</div>`}
              <div>${ruby(arch.name)}</div>
              <div style="font-size:0.74rem;color:var(--text-muted);">${arch.code}</div>
            </button>
          `;
        }).join("")}
      </div>

      <div id="clinicStep2Area">
        ${
          cured
            ? `<div class="kid-voice-bubble tts-reading-scope" id="clinicWinBubble" style="border-color:#4ade80;"><div id="clinicTtsStatus"></div><div class="tts-clauses-body">🎉 ${renderClauses(p.winSpeech)}</div></div>`
            : state.pickedBottle === p.rightId
              ? renderDoseDialHTML(p)
              : state.pickedBottle
                ? `<div class="kid-voice-bubble" style="border-color:#fb7185;">🤔 这瓶毒物的分子靶点不对症哦，换旁边一瓶试试看！</div>`
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
          hint.innerHTML = "✅ <span style='color:#4ade80'>进入黄金微克治疗窗！快发射救命胶囊！</span>";
          fireBtn.disabled = false;
          fireBtn.style.opacity = "1";
        } else if (v < 28) {
          hint.textContent = "❄️ 剂量太少啦，药效还不够哦（往中间绿区拉！）";
          fireBtn.disabled = true;
          fireBtn.style.opacity = "0.45";
        } else {
          hint.innerHTML = "☠️ <span style='color:#fb7185'>剂量太高变回毒药啦！快往左调小一点！</span>";
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
        speak(p.winSpeech, {
          scopeEl: document.getElementById("clinicWinBubble"),
          statusMountEl: document.getElementById("clinicTtsStatus"),
          playTapSfx: false
        });
      });
    }
  }

  function renderDoseDialHTML(p) {
    return `
      <div style="background:var(--bg-inset);border-radius:18px;padding:16px;margin-top:12px;border:2px solid var(--c-teal);">
        <div style="font-weight:900;margin-bottom:8px;">🎛️ 第2步：转动『帕拉塞尔苏斯剂量旋钮』，把毒液调进中间绿色救命区！</div>
        <input type="range" id="pharmacyDoseSlider" min="0" max="100" value="10" style="width:100%;height:14px;border-radius:99px;appearance:none;background:linear-gradient(90deg,#38bdf8 0%,#38bdf8 27%,#4ade80 28%,#4ade80 62%,#fb7185 63%,#fb7185 100%);cursor:pointer;" />
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:10px;">
          <div id="dialZoneHint" style="font-weight:800;">👉 拖动上方彩色滑条到【绿色黄金段】！</div>
          <button class="big-action-btn" id="btnFireCapsule" disabled style="opacity:0.45;">
            ${p.drugName} · 发射救人！🚀
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
        if (dsub === "flashpk" && !state.pkAnswer) nextFlashcardPK();
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

    const totalTargets = scenes.reduce((acc, s) => acc + s.targets.length, 0);
    const totalFound = scenes.reduce(
      (acc, s) => acc + s.targets.filter((t) => state.foundHunt.includes(t.key)).length,
      0
    );

    const mainTab = document.getElementById("btnDetHuntTab");
    if (mainTab) mainTab.textContent = `👀 游戏2：四大场景找毒物（${totalFound}/${totalTargets}）`;

    // 渲染 4 大绘本关卡切换条
    const sceneBar = document.getElementById("huntSceneTabs");
    sceneBar.innerHTML = scenes.map((sc, idx) => {
      const doneCnt = sc.targets.filter((t) => state.foundHunt.includes(t.key)).length;
      const isComplete = doneCnt === sc.targets.length;
      return `
        <button class="scene-pill ${idx === state.huntSceneIdx ? "active" : ""} ${isComplete ? "completed" : ""}" data-sidx="${idx}">
          ${sc.tabLabel} (${doneCnt}/${sc.targets.length}) ${isComplete ? "👑" : ""}
        </button>
      `;
    }).join("");

    sceneBar.querySelectorAll(".scene-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.SFX.pop();
        state.huntSceneIdx = parseInt(btn.getAttribute("data-sidx"), 10);
        const cur = scenes[state.huntSceneIdx];
        document.getElementById("huntToast").textContent = cur.intro;
        renderHuntScene();
      });
    });

    const curScene = scenes[state.huntSceneIdx];
    const imgEl = document.getElementById("huntSceneImg");
    if (imgEl.getAttribute("src") !== curScene.img) {
      imgEl.setAttribute("src", curScene.img);
      imgEl.setAttribute("alt", curScene.title);
    }

    const layer = document.getElementById("huntHotspotsLayer");
    layer.innerHTML = curScene.targets.map((t) => {
      const isFound = state.foundHunt.includes(t.key);
      return `
        <div class="hunt-target ${isFound ? "found" : ""}" data-key="${t.key}"
             style="left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%;">
          <span class="hunt-found-badge">✓ ${t.badge}</span>
        </div>
      `;
    }).join("");

    layer.querySelectorAll(".hunt-target").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = el.getAttribute("data-key");
        const target = curScene.targets.find((x) => x.key === key);
        const wasAlreadyFound = state.foundHunt.includes(key);
        if (!wasAlreadyFound) {
          state.foundHunt.push(key);
          addStars(2);
          window.SFX.chime();
        } else {
          // 再次点击已找到的圈圈，直接打开它的 3D 分子档案卡！
          window.SFX.pop();
          openSuperCard(target.archiveId);
          return;
        }
        renderHuntScene();
        const sceneDone = curScene.targets.every((t) => state.foundHunt.includes(t.key));
        const msg = sceneDone
          ? `👑 本关 ${curScene.targets.length} 处全找齐啦！（再点一次绿色圈圈还能看它的 3D 分子闪卡哦！）`
          : target.tip;
        const huntToastEl = document.getElementById("huntToast");
        huntToastEl.innerHTML = renderClauses(msg);
        speak(target.tip, { scopeEl: huntToastEl, playTapSfx: false });
      });
    });
  }

  // 看真身照片 · 抢答大百科目录 PK
  function nextFlashcardPK() {
    const pool = window.CATALOG_DATA.filter((x) => x.chapter !== "ch0" && getPhoto(x.id));
    const ans = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter((x) => x.id !== ans.id).sort(() => Math.random() - 0.5).slice(0, 3);
    state.pkAnswer = ans;
    state.pkChoices = [ans, ...others].sort(() => Math.random() - 0.5);
    renderFlashcardPK();
  }

  function renderFlashcardPK() {
    const ans = state.pkAnswer;
    const arena = document.getElementById("flashcardArena");
    arena.innerHTML = `
      <div>
        <div class="mystery-photo-frame">
          <img src="${getPhoto(ans.id)}" alt="猜猜我是谁" />
          <div style="position:absolute;top:12px;left:12px;background:rgba(15,23,42,0.85);color:#fbbf24;padding:6px 14px;border-radius:99px;font-weight:900;">
            🔥 连对纪录：${state.pkStreak}
          </div>
          <div style="position:absolute;bottom:12px;left:12px;background:rgba(15,23,42,0.85);color:#fff;padding:6px 14px;border-radius:99px;font-weight:800;font-size:0.88rem;">
            提示：它在原书【${ans.code}】！
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin:0 0 14px;font-size:1.35rem;">📸 看真身认毒物：照片里是谁？</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${state.pkChoices.map((c) => `
            <button class="venom-bottle pk-choice-btn" data-id="${c.id}" style="padding:16px 12px;font-size:1.08rem;">
              <div style="font-size:1.7rem;margin-bottom:4px;">${c.emoji}</div>
              <div>${ruby(c.name)}</div>
              <div style="font-size:0.76rem;color:var(--text-muted);margin-top:4px;">${c.code}</div>
            </button>
          `).join("")}
        </div>
        <div id="pkFeedback" style="margin-top:14px;min-height:48px;"></div>
      </div>
    `;

    arena.querySelectorAll(".pk-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const picked = btn.getAttribute("data-id");
        const fb = document.getElementById("pkFeedback");
        if (picked === ans.id) {
          btn.classList.add("picked-right");
          state.pkStreak++;
          addStars(2);
          window.SFX.chime();
          fb.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(74,222,128,0.18);border:2px solid #4ade80;padding:10px 16px;border-radius:16px;font-weight:800;">
              <span>🎉 秒答正确！正是 ${ruby(ans.name)}！</span>
              <button class="big-action-btn" id="btnNextPK" style="padding:8px 16px;min-height:38px;font-size:0.9rem;">下一张 ➜</button>
            </div>
          `;
          document.getElementById("btnNextPK").addEventListener("click", nextFlashcardPK);
        } else {
          btn.classList.add("picked-wrong");
          state.pkStreak = 0;
          window.SFX.bonk();
          fb.innerHTML = `<div style="color:#fb7185;font-weight:800;padding:8px;">🙈 哎呀猜错啦！瞄一眼左下角的章节号【${ans.code}】再选！</div>`;
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
    registerPWA();
  });
})();
