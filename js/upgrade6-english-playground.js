// ============================================================================
// 升级6：🇬🇧 毒物英语游乐场 (English Interactive Playground v7.0)
// 包含四大深度互动英文玩法（覆盖全书 99 卡 · 251 核心科学词 · 396 句地道英文）：
//   1. 🧩 字母积木拼词屋 (Word Builder — 轻松/挑战双模式 + 例句填空 + 键盘/触控双支持)
//   2. 🃏 双语翻翻乐配对 (Bilingual Memory Match — 物种真身↔英文名 / 科学单词↔中文图)
//   3. 🚂 英文造句小火车 (Sentence Train — 396 句地道科普英文词块拼句)
//   4. 📚 我的 251 科学英语词典 (Collectible Wordbook — 掌握进度、按章筛选、点读、一键拼写)
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

  // 轻量级彩色纸屑庆祝特效 (DOM + CSS, iPad 流畅 0 卡顿)
  function celebrate(originEl) {
    try {
      const colors = ["#2dd4bf", "#38bdf8", "#fbbf24", "#fb7185", "#c084fc", "#4ade80", "#fde047"];
      const layer = document.createElement("div");
      layer.className = "duwu-confetti-layer";
      let cx = window.innerWidth * 0.5;
      let cy = window.innerHeight * 0.38;
      if (originEl && typeof originEl.getBoundingClientRect === "function") {
        const r = originEl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          cx = r.left + r.width * 0.5;
          cy = Math.max(80, Math.min(window.innerHeight - 120, r.top + r.height * 0.35));
        }
      }
      for (let i = 0; i < 24; i++) {
        const piece = document.createElement("span");
        piece.className = "duwu-confetti-piece";
        const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.3;
        const dist = 65 + Math.random() * 145;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 45;
        const rot = Math.round((Math.random() - 0.5) * 540);
        piece.style.left = `${cx}px`;
        piece.style.top = `${cy}px`;
        piece.style.background = colors[i % colors.length];
        piece.style.setProperty("--dx", `${dx.toFixed(1)}px`);
        piece.style.setProperty("--dy", `${dy.toFixed(1)}px`);
        piece.style.setProperty("--rot", `${rot}deg`);
        piece.style.animationDelay = `${(Math.random() * 0.08).toFixed(2)}s`;
        layer.appendChild(piece);
      }
      document.body.appendChild(layer);
      setTimeout(() => {
        if (layer.parentNode) layer.parentNode.removeChild(layer);
      }, 1150);
    } catch (_) {}
  }

  window.PlaygroundFX = { celebrate };

  // 构建全书核心英语词库（v8.0 优先接入 680+ KET/PET + Kids-AWL 核心词汇！）
  function buildMasterVocabList() {
    const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
    const catList = window.CATALOG_DATA || [];
    const catById = new Map(catList.map((c) => [c.id, c]));
    const seen = new Map();

    // 1. Primary: 680+ KET / PET + Kids-AWL Core Vocabulary
    if (Array.isArray(window.CORE_VOCAB_DATA) && window.CORE_VOCAB_DATA.length > 0) {
      const themeIconEmoji = {
        action: "⚡", science: "🔬", defense: "🛡️", nature: "🌿", medicine: "💓", thinking: "🔍"
      };
      for (const cv of window.CORE_VOCAB_DATA) {
        if (!cv || !cv.w) continue;
        const key = String(cv.w).trim().toLowerCase();
        if (!/^[a-z]+$/.test(key)) continue;
        const primaryCardId = (Array.isArray(cv.cards) && cv.cards[0]) || "ch0-01";
        const cardItem = catById.get(primaryCardId) || catList[0] || {};
        const ce = ceMap[primaryCardId] || {};
        if (!seen.has(key)) {
          seen.set(key, {
            key,
            w: cv.w.trim(),
            zh: cv.zh || "",
            ipa: cv.ipa || "",
            pos: cv.pos || "",
            enDef: cv.enDef || "",
            theme: cv.theme || "science",
            level: cv.level || "KET",
            icon: themeIconEmoji[cv.theme] || "🔤",
            ex: cv.ex || "",
            cardId: primaryCardId,
            cardName: cardItem.name || "",
            chapter: cardItem.chapter || "ch0",
            code: cardItem.code || "",
            enName: ce.enName || ""
          });
        }
      }
      return Array.from(seen.values());
    }

    for (const item of catList) {
      const ce = ceMap[item.id];
      if (!ce || !Array.isArray(ce.vocab)) continue;
      for (const v of ce.vocab) {
        if (!v || !v.w) continue;
        const key = String(v.w).trim().toLowerCase();
        if (!/^[a-z]+$/.test(key)) continue;
        if (!seen.has(key)) {
          seen.set(key, {
            key,
            w: v.w.trim(),
            zh: v.zh || "",
            icon: v.icon || item.emoji || "🔤",
            ex: v.ex || "",
            cardId: item.id,
            cardName: item.name,
            chapter: item.chapter,
            code: item.code,
            enName: ce.enName || ""
          });
        }
      }
    }
    return Array.from(seen.values());
  }

  // 构建全书 396 句地道短句库（适合 8 岁小朋友的 4~10 词造句池）
  function buildSentencePool() {
    const catList = window.CATALOG_DATA || [];
    const biMap = window.BILINGUAL_NOTES || {};
    const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
    const ciMap = window.CARD_INTERACTIONS || {};
    const out = [];
    const dedup = new Set();

    const tryAdd = (item, en, zh, kw, tag, keySuffix) => {
      const cleanEn = String(en || "").trim().replace(/\s+/g, " ");
      const cleanZh = String(zh || "").trim();
      if (!cleanEn || !cleanZh) return;
      const tokens = cleanEn.split(" ").filter(Boolean);
      if (tokens.length < 4 || tokens.length > 10) return;
      const low = cleanEn.toLowerCase();
      if (dedup.has(low)) return;
      dedup.add(low);
      out.push({
        sentKey: `${item.id}_${keySuffix}`,
        cardId: item.id,
        cardName: item.name,
        chapter: item.chapter,
        code: item.code,
        emoji: item.emoji,
        en: cleanEn,
        zh: cleanZh,
        kw: Array.isArray(kw) ? kw : [],
        tokens,
        tag
      });
    };

    for (const item of catList) {
      const bi = biMap[item.id];
      if (bi) tryAdd(item, bi.en, bi.zh, bi.kw, "🌟 经典句", "bi");
      const ce = ceMap[item.id];
      if (ce && ce.enScene) tryAdd(item, ce.enScene.en, ce.enScene.zh, ce.enScene.kw, "🎬 实况句", "sc");
      const ci = ciMap[item.id];
      if (ci && ci.exp1 && ci.exp1.bi) tryAdd(item, ci.exp1.bi.en, ci.exp1.bi.zh, ci.exp1.bi.kw, "🔬 实验句", "e1");
      if (ci && ci.exp2 && ci.exp2.bi) tryAdd(item, ci.exp2.bi.en, ci.exp2.bi.zh, ci.exp2.bi.kw, "🛡️ 揭秘句", "e2");
    }
    return out;
  }

  function buildWordRegex(targetWord) {
    const raw = String(targetWord || "").trim().toLowerCase();
    const escW = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const forms = [escW(raw) + "(?:s|es|ed|ing)?"];
    if (raw.endsWith("y") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "(?:ies|ied)");
    if (raw.endsWith("f") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "ves");
    if (raw.endsWith("fe") && raw.length > 3) forms.push(escW(raw.slice(0, -2)) + "ves");
    if (raw.endsWith("e") && raw.length > 2) forms.push(escW(raw.slice(0, -1)) + "(?:ed|ing)");
    return new RegExp(`\\b(?:${forms.join("|")})\\b`, "i");
  }

  function blankOutWord(sentence, targetWord) {
    if (!sentence) return "";
    const w = String(targetWord || "").trim();
    if (!w) return esc(sentence);
    const re = buildWordRegex(w);
    if (re.test(sentence)) {
      return esc(sentence).replace(re, `<span class="wb-blank-pill">______</span>`);
    }
    return esc(sentence);
  }

  function highlightWordInSentence(sentence, targetWord) {
    if (!sentence) return "";
    const w = String(targetWord || "").trim();
    if (!w) return esc(sentence);
    return esc(sentence).replace(buildWordRegex(w), (m) => `<span class="en-key-word">${m}</span>`);
  }

  function tokenizeAlpha(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z'\s-]/g, " ")
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function matchSpokenTokens(targetWords, spokenTranscript) {
    const spokenSet = new Set(tokenizeAlpha(spokenTranscript));
    const spokenArr = Array.from(spokenSet);
    const matched = [];
    for (let i = 0; i < targetWords.length; i++) {
      const clean = targetWords[i].toLowerCase().replace(/[^a-z]/g, "");
      if (!clean) {
        matched.push(true);
        continue;
      }
      let hit = spokenSet.has(clean);
      if (!hit && clean.length >= 4) {
        hit = spokenArr.some(
          (sw) =>
            sw.startsWith(clean.slice(0, Math.max(3, clean.length - 1))) ||
            clean.startsWith(sw.slice(0, Math.max(3, sw.length - 1)))
        );
      }
      matched.push(hit);
    }
    return matched;
  }

  // ============================================================================
  // 高难混淆干扰项引擎 (Smart Orthographic / Phonetic / Semantic Distractor Engine)
  // 让每个英语单词游戏的选项都“长相像、读音近、同主题”，杜绝靠首字母/Emoji蒙对！
  // ============================================================================
  function levenshtein(a, b) {
    const sa = String(a || "").toLowerCase();
    const sb = String(b || "").toLowerCase();
    const m = sa.length;
    const n = sb.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          sa[i - 1] === sb[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function vocabConfusionScore(a, b) {
    const wa = String(a.key || a.w || "").toLowerCase();
    const wb = String(b.key || b.w || "").toLowerCase();
    if (!wa || !wb || wa === wb) return -1;
    let sc = 0;
    if (wa[0] === wb[0]) sc += 36;
    if (wa.slice(0, 2) === wb.slice(0, 2)) sc += 32;
    if (wa.length >= 3 && wb.length >= 3 && wa.slice(0, 3) === wb.slice(0, 3)) sc += 24;
    if (wa.slice(-2) === wb.slice(-2)) sc += 22;
    else if (wa.slice(-1) === wb.slice(-1)) sc += 10;
    const lenDiff = Math.abs(wa.length - wb.length);
    sc += Math.max(0, 16 - lenDiff * 5);
    const dist = levenshtein(wa, wb);
    const maxLen = Math.max(wa.length, wb.length);
    sc += Math.round((1 - dist / Math.max(1, maxLen)) * 48);
    if (a.chapter && b.chapter && a.chapter === b.chapter) sc += 8;
    return sc;
  }

  function pickConfusableVocab(target, fullPool, count) {
    const tKey = String((target && (target.key || target.w)) || "").toLowerCase();
    const seen = new Set([tKey]);
    const scored = [];
    for (const item of fullPool || []) {
      const k = String((item && (item.key || item.w)) || "").toLowerCase();
      if (!k || seen.has(k)) continue;
      seen.add(k);
      scored.push({ item, score: vocabConfusionScore(target, item) });
    }
    scored.sort((x, y) => y.score - x.score);
    // 前 2 个必定锁定最强形近/音近词，其余从前 (count + 5) 最像窗口里随机抽取兼顾新鲜感
    const locked = scored.slice(0, Math.min(2, count)).map((x) => x.item);
    const restNeed = Math.max(0, count - locked.length);
    const windowPool = scored.slice(locked.length, locked.length + Math.max(restNeed + 5, 8)).map((x) => x.item);
    return locked.concat(shuffle(windowPool).slice(0, restNeed));
  }

  const PHONICS_CONFUSERS = {
    a: "eou", e: "iay", i: "eyl", o: "au", u: "ao",
    b: "pdv", c: "ksz", d: "tb", f: "vp", g: "jkc",
    h: "nk", j: "gy", k: "cg", l: "ri", m: "nw",
    n: "mr", p: "bd", q: "kc", r: "ln", s: "czx",
    t: "df", v: "fw", w: "vm", x: "sz", y: "ie", z: "sc"
  };

  function pickConfusableLetters(word, count, includeDoubleTraps) {
    const letters = String(word || "").toLowerCase().replace(/[^a-z]/g, "").split("");
    const inWord = new Set(letters);
    const primary = [];
    const seenPri = new Set();
    for (const ch of shuffle(letters)) {
      const conf = PHONICS_CONFUSERS[ch] || "";
      for (const alt of conf.split("")) {
        if (!inWord.has(alt) && !seenPri.has(alt)) {
          seenPri.add(alt);
          primary.push(alt);
        }
      }
    }
    const picked = shuffle(primary).slice(0, count);
    // 魔鬼/进阶模式故意混入 1~2 个单词里已有字母的双写陷阱（如 venom 多一个 n 或 e）
    if (includeDoubleTraps && letters.length >= 4) {
      const trapCandidates = shuffle(letters.filter((c) => "aeiounrstlcmp".includes(c)));
      const trapCount = count >= 5 ? 2 : 1;
      for (let i = 0; i < trapCount && trapCandidates[i]; i++) {
        if (picked.length >= count) {
          picked[picked.length - 1 - i] = trapCandidates[i];
        } else {
          picked.push(trapCandidates[i]);
        }
      }
    }
    const fallback = shuffle("aeiourstlncpmbdgfhvwyk".split("").filter((c) => !inWord.has(c)));
    for (const f of fallback) {
      if (picked.length >= count) break;
      if (!picked.includes(f)) picked.push(f);
    }
    return picked.slice(0, count);
  }

  const SENTENCE_DECOY_PAIRS = {
    is: ["are", "was"],
    are: ["is", "were"],
    was: ["were", "is"],
    can: ["cannot", "will", "does"],
    cannot: ["can", "never", "will"],
    do: ["does", "did"],
    does: ["do", "is"],
    has: ["have", "had"],
    have: ["has", "had"],
    in: ["on", "at", "under"],
    on: ["in", "at", "from"],
    from: ["into", "with", "under"],
    with: ["without", "from", "into"],
    its: ["their", "our", "my"],
    it: ["they", "she", "we"],
    they: ["it", "we", "he"],
    a: ["the", "an", "this"],
    the: ["a", "this", "some"],
    poison: ["venom", "medicine", "sugar"],
    venom: ["poison", "water", "honey"],
    toxic: ["sweet", "safe", "soft"],
    bright: ["dark", "pale", "tiny"],
    tiny: ["huge", "heavy", "tall"],
    eat: ["bite", "touch", "smell"],
    bite: ["eat", "touch", "wash"],
    sting: ["bite", "eat", "hide"],
    never: ["always", "often", "only"],
    very: ["too", "almost", "never"],
    deadly: ["safe", "mild", "sweet"],
    skin: ["shell", "bone", "fur"],
    water: ["fire", "smoke", "oil"],
    heat: ["cold", "ice", "wind"]
  };

  function pickSentenceDecoyWords(tokens, count) {
    const existing = new Set(
      (tokens || []).map((t) => String(t).toLowerCase().replace(/[^a-z']/g, ""))
    );
    const candidates = [];
    const seen = new Set();
    for (const tok of tokens || []) {
      const clean = String(tok).toLowerCase().replace(/[^a-z']/g, "");
      const alts = SENTENCE_DECOY_PAIRS[clean];
      if (!alts) continue;
      for (const alt of alts) {
        if (!existing.has(alt) && !seen.has(alt)) {
          seen.add(alt);
          candidates.push(alt);
        }
      }
    }
    const general = shuffle(["never", "very", "always", "venom", "poison", "under", "without", "only", "still", "into", "their", "does", "were", "might"]);
    for (const g of general) {
      if (!existing.has(g) && !seen.has(g)) {
        seen.add(g);
        candidates.push(g);
      }
    }
    return shuffle(candidates.slice(0, Math.max(count + 4, 6))).slice(0, count);
  }

  function pickConfusableSpecies(target, pool, count) {
    const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
    const tCe = ceMap[target.id] || {};
    const tEn = String(tCe.enName || "").toLowerCase();
    const stopW = new Set(["the", "of", "and", "in", "a", "an", "sea", "red", "blue", "black", "white", "yellow", "green", "golden", "giant", "little", "common", "japanese"]);
    const tWords = new Set(
      tEn.split(/[\s-]+/).filter((w) => w.length >= 3 && !stopW.has(w))
    );

    const FAMILY_GROUPS = [
      /[蛇蝮蝰蟒]/,
      /[蛛蜘]/,
      /[蜂蚁]/,
      /[蛾蝶毛虫]/,
      /[蛙蟾螈]/,
      /[鱼鲀鲉魟鲨]/,
      /[菇蕈鹅膏茸伞菌]/,
      /[水母海葵珊瑚]/,
      /[螺贝章鱼]/,
      /[蝎蜈蚣蚰蜒]/,
      /[薯豆瓜果芋]/
    ];
    const tFamily = FAMILY_GROUPS.findIndex((re) => re.test(target.name || ""));

    const scored = (pool || [])
      .filter((x) => x.id !== target.id)
      .map((cand) => {
        const cCe = ceMap[cand.id] || {};
        const cEn = String(cCe.enName || "").toLowerCase();
        const cWords = cEn.split(/[\s-]+/).filter((w) => w.length >= 3);
        let sc = 0;
        if (cand.chapter === target.chapter) sc += 45;
        if (tFamily >= 0 && FAMILY_GROUPS[tFamily].test(cand.name || "")) sc += 52;
        if (cWords.some((w) => tWords.has(w))) sc += 56;
        if (tEn && cEn && tEn[0] === cEn[0]) sc += 20;
        if (cand.strategy === target.strategy) sc += 12;
        if (cand.mech === target.mech) sc += 10;
        sc += Math.max(0, 12 - Math.abs(tEn.length - cEn.length));
        return { item: cand, score: sc };
      })
      .sort((a, b) => b.score - a.score);

    const locked = scored.slice(0, Math.min(2, count)).map((x) => x.item);
    const restNeed = Math.max(0, count - locked.length);
    const win = scored.slice(locked.length, locked.length + Math.max(restNeed + 5, 7)).map((x) => x.item);
    return locked.concat(shuffle(win).slice(0, restNeed));
  }

  window.EnglishDistractorEngine = {
    levenshtein,
    vocabConfusionScore,
    pickConfusableVocab,
    pickConfusableLetters,
    pickSentenceDecoyWords,
    pickConfusableSpecies
  };

  class EnglishPlayground {
    constructor(mountEl, app) {
      this.mountEl = mountEl;
      this.app = app;
      this.subGame = "builder"; // 'builder' | 'memory' | 'train' | 'wordbook'
      this.chapter = "all";
      this.themeFilter = "all"; // v8.0: 'all' | 'wordbox' | 'action' | 'science' | 'defense' | 'nature' | 'medicine' | 'thinking'
      this.slowMode = false;

      this.allVocab = buildMasterVocabList();
      this.allSentences = buildSentencePool();

      // Word Builder state: 'easy' (0干扰) | 'normal' (+3音近形近干扰,默认) | 'devil' (+5强干扰+隐例句)
      this.wbDiff = "normal";
      this.wbShowExHint = false;
      this.wbStreak = 0;
      this.wbWord = null;
      this.wbTiles = []; // [{ id, ch, used }]
      this.wbSlots = []; // [null | { tileId, ch, isHint }]
      this.wbSolved = false;
      this.wbWrongIndices = new Set();

      // Memory Match state
      this.memMode = "species"; // 'species' | 'vocab'
      this.memConfuse = true; // 🔥 形近/同类易混模式（默认开启！）
      this.memPairsTarget = 6;
      this.memCards = [];
      this.memFlipped = [];
      this.memLocked = false;
      this.memMoves = 0;
      this.memMatchedCount = 0;
      this.memCombo = 0;
      this.memWon = false;

      // Sentence Train state
      this.trDecoyOn = true; // 🔥 默认混入 +2 节干扰词车厢
      this.trDecoyCount = 0;
      this.trStreak = 0;
      this.trSent = null;
      this.trPool = []; // [{ id, word, used, isDecoy }]
      this.trTrack = []; // [{ id, word }]
      this.trSolved = false;
      this.trWrongIdx = -1;

      // Wordbook state
      this.dictFilter = "all"; // 'all' | 'mastered' | 'todo'
      this.dictSearch = "";

      // Bubble Pop Arcade state (Game 4)
      this.bpMode = "listen"; // 'listen' | 'meaning'
      this.bpCount = 6; // 6泡泡 | 8泡泡(魔鬼挑战)
      this.bpStreak = 0;
      this.bpTarget = null;
      this.bpBubbles = []; // [{ id, vocab, popped, wrong, bg, border, delay, dur }]
      this.bpSolved = false;
      this.bpShowHint = false;
      this.bpFeedback = "";
      this._bpNextTimer = null;

      // Speak & Shine Stage state (Game 5)
      this.spMode = "species"; // 'species' | 'sentence'
      this.spStreak = 0;
      this.spItem = null; // { cardId, cardName, code, emoji, text, zh, pron, tag }
      this.spListening = false;
      this.spTranscript = "";
      this.spMatched = [];
      this.spDone = false;
      this.spStatusMsg = "";
      this.spRecognition = null;
      this.spRecorder = null;
      this.spRecChunks = [];
      this.spRecUrl = null;
      this.spIsRecording = false;

      this._bindGlobalKeyboard();
    }

    init() {
      if (!this.mountEl) return;
      this.renderShell();
      this.pickNextBuilderWord();
      this.renderSubBody();
    }

    _getMasteredSet() {
      const s = this.app.state;
      if (!Array.isArray(s.masteredWords)) s.masteredWords = [];
      return new Set(s.masteredWords);
    }

    _markWordMastered(wordKey) {
      const key = String(wordKey || "").toLowerCase();
      if (!key) return false;
      if (window.WordBox && typeof window.WordBox.recordCorrect === "function") {
        window.WordBox.recordCorrect(key);
      }
      const s = this.app.state;
      if (!Array.isArray(s.masteredWords)) s.masteredWords = [];
      const isNew = !s.masteredWords.includes(key);
      if (isNew) {
        s.masteredWords.push(key);
        this.app.saveState();
      }
      this._syncMasteredCounter();
      return isNew;
    }

    _speakEn(text, opts) {
      if (!this.app.state.sound) return;
      const slow = window.DUWU_I18N ? window.DUWU_I18N.slowMode : this.slowMode;
      if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
        window.DoubaoTTS.enSlowMode = slow;
        window.DoubaoTTS.speakEnglish(text, { slow, ...(opts || {}) });
      } else {
        this.app.speak(text);
      }
    }

    _speakWordFull(v, opts) {
      if (!this.app.state.sound || !v) return;
      const slow = window.DUWU_I18N ? window.DUWU_I18N.slowMode : this.slowMode;
      if (window.DoubaoTTS && window.DoubaoTTS.speakBilingualWord) {
        window.DoubaoTTS.enSlowMode = slow;
        window.DoubaoTTS.speakBilingualWord(v.w, v.zh, v.ex, { slow, ...(opts || {}) });
      } else {
        this.app.speak(`${v.w}! ${v.w}! ${v.zh}`);
      }
    }

    _syncMasteredCounter() {
      const el = document.getElementById("enPgMasteredBadge");
      if (el) {
        const cnt = this._getMasteredSet().size;
        el.textContent = `🏆 ${cnt}/${this.allVocab.length}`;
      }
    }

    _getFilteredVocab() {
      let base = this.allVocab;
      if (this.themeFilter === "wordbox" && window.WordBox) {
        const boxSet = new Set(window.WordBox.getAllBoxItems().map((x) => x.w));
        const inBox = base.filter((v) => boxSet.has(v.key));
        if (inBox.length >= 4) base = inBox;
      } else if (this.themeFilter && this.themeFilter !== "all" && this.themeFilter !== "wordbox") {
        const byTheme = base.filter((v) => v.theme === this.themeFilter);
        if (byTheme.length >= 4) base = byTheme;
      }
      if (this.chapter === "all") return base;
      const list = base.filter((v) => v.chapter === this.chapter);
      return list.length > 0 ? list : base;
    }

    // v8.0: Mount any of the 6 upgraded games cleanly inside Word Adventure Island (#waiGameStage)
    mountEmbeddedGame(containerEl, gameId, themeFilter) {
      if (!containerEl) return;
      this.allVocab = buildMasterVocabList();
      this.themeFilter = themeFilter || "all";
      this.chapter = "all";
      const mapId = gameId === "bubble" ? "bubbles" : gameId;
      this._stopSpeakCapture();
      if (this._bpNextTimer) {
        clearTimeout(this._bpNextTimer);
        this._bpNextTimer = null;
      }
      this.subGame = mapId;
      containerEl.innerHTML = `<div id="enPgSubBody"></div>`;
      if (this.subGame === "builder") this.pickNextBuilderWord();
      if (this.subGame === "memory") this.setupMemoryBoard();
      if (this.subGame === "train") this.pickNextTrainSentence();
      if (this.subGame === "bubbles") this.setupBubbleRound(false);
      if (this.subGame === "speak") this.pickNextSpeakItem();
      this.renderSubBody();
      if (this.subGame === "bubbles" && this.bpMode === "listen" && this.bpTarget) {
        setTimeout(() => this._speakEn(this.bpTarget.w, { repeat: 2, playTapSfx: false }), 180);
      }
    }

    _getFilteredSentences() {
      if (this.chapter === "all") return this.allSentences;
      const list = this.allSentences.filter((s) => s.chapter === this.chapter);
      return list.length > 0 ? list : this.allSentences;
    }

    renderShell() {
      const masteredCnt = this._getMasteredSet().size;
      const chapters = window.CHAPTERS || [];
      this.mountEl.innerHTML = `
        <div class="en-pg-shell">
          <!-- 顶部游乐场模式栏 -->
          <div class="en-pg-topbar">
            <div class="en-pg-tabs">
              <button type="button" class="magic-pill ${this.subGame === "builder" ? "active" : ""}" data-ensub="builder">🧩 1.拼词屋</button>
              <button type="button" class="magic-pill ${this.subGame === "memory" ? "active" : ""}" data-ensub="memory">🃏 2.翻翻乐</button>
              <button type="button" class="magic-pill ${this.subGame === "train" ? "active" : ""}" data-ensub="train">🚂 3.造句火车</button>
              <button type="button" class="magic-pill ${this.subGame === "bubbles" ? "active" : ""}" data-ensub="bubbles">🎈 4.戳泡泡</button>
              <button type="button" class="magic-pill ${this.subGame === "speak" ? "active" : ""}" data-ensub="speak">🎙️ 5.开口舞台</button>
              <button type="button" class="magic-pill ${this.subGame === "wordbook" ? "active" : ""}" data-ensub="wordbook">📚 6.科学词典</button>
            </div>
            <div class="en-pg-controls">
              <button type="button" class="mini-btn ${this.slowMode ? "on" : ""}" id="btnEnPgSlowMode" title="切换英语朗读语速（慢速清晰适合听清每个音节）">
                ${this.slowMode ? "🐢 慢速清晰" : "🐇 常速朗读"}
              </button>
              <span class="en-pg-mastered-pill" id="enPgMasteredBadge">🏆 已掌握 ${masteredCnt}/${this.allVocab.length} 词</span>
            </div>
          </div>

          <!-- 按原书章节专练条 -->
          <div class="en-pg-chapter-row" id="enPgChapterRow">
            ${chapters
              .map(
                (c) => `
              <button type="button" class="en-ch-chip ${this.chapter === c.id ? "active" : ""}" data-ench="${c.id}">
                ${c.icon} ${c.id === "all" ? "全书 99 卡" : c.short.replace(" · ", " ").replace(/篇$/, "")}
              </button>
            `
              )
              .join("")}
          </div>

          <!-- 子游戏主舞台 -->
          <div id="enPgSubBody"></div>
        </div>
      `;

      this.mountEl.querySelectorAll("[data-ensub]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this._stopSpeakCapture();
          if (this._bpNextTimer) {
            clearTimeout(this._bpNextTimer);
            this._bpNextTimer = null;
          }
          this.subGame = btn.getAttribute("data-ensub");
          this.mountEl.querySelectorAll("[data-ensub]").forEach((b) => b.classList.toggle("active", b === btn));
          if (this.subGame === "builder" && !this.wbWord) this.pickNextBuilderWord();
          if (this.subGame === "memory" && !this.memCards.length) this.setupMemoryBoard();
          if (this.subGame === "train" && !this.trSent) this.pickNextTrainSentence();
          if (this.subGame === "bubbles" && !this.bpTarget) this.setupBubbleRound(false);
          if (this.subGame === "speak" && !this.spItem) this.pickNextSpeakItem();
          this.renderSubBody();
          if (this.subGame === "bubbles" && this.bpMode === "listen" && this.bpTarget) {
            setTimeout(() => this._speakEn(this.bpTarget.w, { repeat: 2, playTapSfx: false }), 180);
          }
        });
      });

      const btnSlow = document.getElementById("btnEnPgSlowMode");
      if (btnSlow) {
        btnSlow.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.slowMode = !this.slowMode;
          if (window.DoubaoTTS) window.DoubaoTTS.enSlowMode = this.slowMode;
          btnSlow.classList.toggle("on", this.slowMode);
          btnSlow.textContent = this.slowMode ? "🐢 慢速清晰" : "🐇 常速朗读";
        });
      }

      this.mountEl.querySelectorAll("[data-ench]").forEach((chip) => {
        chip.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this._stopSpeakCapture();
          this.chapter = chip.getAttribute("data-ench");
          this.mountEl.querySelectorAll("[data-ench]").forEach((x) => x.classList.toggle("active", x === chip));
          if (this.subGame === "builder") this.pickNextBuilderWord();
          if (this.subGame === "memory") this.setupMemoryBoard();
          if (this.subGame === "train") this.pickNextTrainSentence();
          if (this.subGame === "bubbles") this.setupBubbleRound(true);
          if (this.subGame === "speak") this.pickNextSpeakItem();
          this.renderSubBody();
        });
      });
    }

    renderSubBody() {
      const body = document.getElementById("enPgSubBody");
      if (!body) return;
      if (this.subGame === "builder") this.renderWordBuilder(body);
      else if (this.subGame === "memory") this.renderMemoryMatch(body);
      else if (this.subGame === "train") this.renderSentenceTrain(body);
      else if (this.subGame === "bubbles") this.renderBubblePop(body);
      else if (this.subGame === "speak") this.renderSpeakStage(body);
      else this.renderWordbook(body);
    }

    // 外部（如词典）一键跳转拼写某个词
    jumpToSpellWord(wordKey) {
      const found = this.allVocab.find((v) => v.key === String(wordKey || "").toLowerCase());
      if (!found) return;
      this.subGame = "builder";
      this.mountEl.querySelectorAll("[data-ensub]").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-ensub") === "builder")
      );
      this.loadBuilderWord(found);
      this.renderSubBody();
    }

    // ========================================================================
    // 游戏 1：🧩 字母积木拼词屋 (Word Builder)
    // ========================================================================
    pickNextBuilderWord() {
      const pool = this._getFilteredVocab();
      const mastered = this._getMasteredSet();
      const unmastered = pool.filter((v) => !mastered.has(v.key) && (!this.wbWord || v.key !== this.wbWord.key));
      const candidates = unmastered.length > 0 ? unmastered : pool.filter((v) => !this.wbWord || v.key !== this.wbWord.key);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : pool[0];
      if (chosen) this.loadBuilderWord(chosen);
    }

    loadBuilderWord(vocabItem) {
      this.wbWord = vocabItem;
      this.wbSolved = false;
      this.wbShowExHint = false;
      this.wbWrongIndices = new Set();
      const letters = vocabItem.key.split("");
      let tileChars = letters.slice();
      if (this.wbDiff === "normal") {
        tileChars = tileChars.concat(pickConfusableLetters(vocabItem.key, 3, true));
      } else if (this.wbDiff === "devil") {
        tileChars = tileChars.concat(pickConfusableLetters(vocabItem.key, 5, true));
      }
      let shuffled = shuffle(tileChars);
      // 尽量避免恰好原顺序排列
      if (letters.length >= 3 && shuffled.slice(0, letters.length).join("") === vocabItem.key) {
        shuffled = shuffle(tileChars);
      }
      this.wbTiles = shuffled.map((ch, idx) => ({ id: idx, ch, used: false }));
      this.wbSlots = letters.map(() => null);
    }

    _wbPlaceTile(tileId) {
      if (this.wbSolved) return;
      const tile = this.wbTiles.find((t) => t.id === tileId && !t.used);
      if (!tile) return;
      const emptyIdx = this.wbSlots.findIndex((s) => s === null);
      if (emptyIdx === -1) return;
      if (window.SFX) window.SFX.pop();
      tile.used = true;
      this.wbSlots[emptyIdx] = { tileId: tile.id, ch: tile.ch, isHint: false };
      this.wbWrongIndices.clear();
      this._wbCheckCompletion();
      const body = document.getElementById("enPgSubBody");
      if (body && this.subGame === "builder") this.renderWordBuilder(body);
    }

    _wbRemoveSlot(slotIdx) {
      if (this.wbSolved) return;
      const slot = this.wbSlots[slotIdx];
      if (!slot || slot.isHint) return;
      if (window.SFX) window.SFX.pop();
      const tile = this.wbTiles.find((t) => t.id === slot.tileId);
      if (tile) tile.used = false;
      this.wbSlots[slotIdx] = null;
      this.wbWrongIndices.clear();
      const body = document.getElementById("enPgSubBody");
      if (body && this.subGame === "builder") this.renderWordBuilder(body);
    }

    _wbHintOneLetter() {
      if (this.wbSolved || !this.wbWord) return;
      const target = this.wbWord.key;
      // 找第一个为空或字母不对的格子
      let idx = -1;
      for (let i = 0; i < target.length; i++) {
        if (!this.wbSlots[i] || this.wbSlots[i].ch !== target[i]) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      // 如果这个格子有错字母，先退回
      if (this.wbSlots[idx]) {
        const oldTile = this.wbTiles.find((t) => t.id === this.wbSlots[idx].tileId);
        if (oldTile) oldTile.used = false;
        this.wbSlots[idx] = null;
      }
      const needCh = target[idx];
      // 优先找未使用的匹配积木；否则从后面填错的格子里借回
      let tile = this.wbTiles.find((t) => !t.used && t.ch === needCh);
      if (!tile) {
        for (let j = idx + 1; j < this.wbSlots.length; j++) {
          if (this.wbSlots[j] && !this.wbSlots[j].isHint && this.wbSlots[j].ch === needCh) {
            tile = this.wbTiles.find((t) => t.id === this.wbSlots[j].tileId);
            this.wbSlots[j] = null;
            if (tile) tile.used = false;
            break;
          }
        }
      }
      if (!tile) return;
      if (window.SFX) window.SFX.pop();
      tile.used = true;
      this.wbSlots[idx] = { tileId: tile.id, ch: tile.ch, isHint: true };
      this.wbWrongIndices.clear();
      this._wbCheckCompletion();
      const body = document.getElementById("enPgSubBody");
      if (body && this.subGame === "builder") this.renderWordBuilder(body);
    }

    _wbCheckCompletion() {
      if (!this.wbWord || this.wbSlots.some((s) => s === null)) return;
      const attempt = this.wbSlots.map((s) => s.ch).join("");
      if (attempt === this.wbWord.key) {
        this.wbSolved = true;
        this.wbStreak += 1;
        this.wbWrongIndices.clear();
        if (window.SFX) window.SFX.chime();
        const isFirst = this._markWordMastered(this.wbWord.key);
        this.app.addStars(isFirst ? 2 : 1);
        if (this.app.trackMission) this.app.trackMission("words", 1);
        setTimeout(() => {
          const stageCard = this.mountEl.querySelector(".wb-arena-card");
          celebrate(stageCard);
          this._speakWordFull(this.wbWord, { includeZh: false, playTapSfx: false });
        }, 120);
      } else {
        this.wbWrongIndices.clear();
        for (let i = 0; i < this.wbWord.key.length; i++) {
          if (this.wbSlots[i] && this.wbSlots[i].ch !== this.wbWord.key[i]) {
            this.wbWrongIndices.add(i);
          }
        }
        if (window.SFX) window.SFX.bonk();
      }
    }

    renderWordBuilder(mount) {
      const v = this.wbWord;
      if (!v) return;
      const en = window.isEn ? window.isEn() : true;
      const photo = this.app.getPhoto(v.cardId);
      const isMastered = this._getMasteredSet().has(v.key);
      const hasWrong = this.wbWrongIndices.size > 0;
      const svgIcon = (v.theme && window.CORE_SVG_ICONS && window.CORE_SVG_ICONS[v.theme]) || "";

      mount.innerHTML = `
        <div class="wb-arena-card">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="scene-pill ${this.wbDiff === "easy" ? "active" : ""}" data-wbdiff="easy">${en ? "🌱 Easy (Exact Letters)" : "🌱 无干扰入门"}</button>
              <button type="button" class="scene-pill ${this.wbDiff === "normal" ? "active" : ""}" data-wbdiff="normal">${en ? "⚡ Standard (+3 Decoys)" : "⚡ 音近干扰 (+3字母)"}</button>
              <button type="button" class="scene-pill ${this.wbDiff === "devil" ? "active" : ""}" data-wbdiff="devil">${en ? "🔥 Master (+5 Decoys)" : "🔥 魔鬼烧脑 (+5干扰)"}</button>
            </div>
            <div class="live-en-streak-pill">🔥 ${en ? `Streak: ${this.wbStreak}` : `拼词连胜：${this.wbStreak} 词`}</div>
          </div>

          <div class="wb-prompt-grid">
            <!-- 左侧视觉线索卡 -->
            <div class="wb-clue-panel">
              <div class="wb-species-mini" id="btnWbOpenCard" title="${en ? "Open full 3D encyclopedia card" : "点击打开它的完整 3D 档案卡"}">
                ${photo ? `<img src="${esc(photo)}" alt="" class="wb-species-thumb" />` : `<span style="font-size:2.2rem;">${v.icon}</span>`}
                <div>
                  <div style="font-weight:900;font-size:0.92rem;">${en ? esc(v.enName || v.cardName) : this.app.ruby(v.cardName)}</div>
                  <div style="font-size:0.75rem;color:var(--c-teal-text);font-weight:800;">📖 ${en ? "Open Fact Card →" : `${esc(v.code)} · 点我看原卡`}</div>
                </div>
              </div>

              <div class="wb-meaning-hero">
                <span class="wb-meaning-emoji">${svgIcon || v.icon}</span>
                <div>
                  <div class="wb-meaning-zh">${esc(v.zh)} ${v.level ? `<span class="wb-lvl-tag lvl-${esc(v.level).toLowerCase()}">${esc(v.level)}</span>` : ""} ${isMastered ? `<span class="wb-mastered-tag">${en ? "✅ Mastered" : "✅ 已收进词典"}</span>` : ""}</div>
                  ${v.enDef ? `<div style="font-size:0.84rem;color:var(--text-sub);font-weight:700;margin-top:3px;">💡 ${esc(v.enDef)}</div>` : ""}
                  <div class="wb-meaning-hint">
                    ${en
                      ? `${v.key.length} letters${this.wbDiff === "devil" ? " · +5 tricky decoys!" : this.wbDiff === "normal" ? " · +3 decoy letters!" : " · Tap tiles to spell!"}`
                      : `共 ${v.key.length} 个字母${this.wbDiff === "devil" ? " · 含 5 个混淆/双写陷阱！" : this.wbDiff === "normal" ? " · 含 3 个音近干扰字母！" : " · 点右侧积木拼出来！"}`}
                  </div>
                </div>
              </div>

              ${
                v.ex
                  ? this.wbDiff === "devil" && !this.wbSolved && !this.wbShowExHint
                    ? `<div class="wb-example-box" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                         <span style="font-size:0.82rem;font-weight:800;color:var(--text-sub);">${en ? "🔥 Master mode hides the sentence — listen and spell!" : "🔥 魔鬼模式已隐藏例句，先听读音盲拼吧！"}</span>
                         <button type="button" class="mini-btn" id="btnWbRevealEx" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">${en ? "💡 Peek Sentence" : "💡 偷看例句"}</button>
                       </div>`
                    : `<div class="wb-example-box">
                         <div style="font-size:0.74rem;font-weight:900;color:var(--c-warn-text);margin-bottom:4px;">${en ? "📝 Sentence Clue:" : "📝 例句线索："}</div>
                         <div class="wb-example-text">${this.wbSolved ? highlightWordInSentence(v.ex, v.key) : blankOutWord(v.ex, v.key)}</div>
                       </div>`
                  : ""
              }

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                <button type="button" class="big-action-btn" id="btnWbSpeakWord" style="padding:9px 16px;min-height:42px;font-size:0.9rem;">
                  ${en ? "🔊 Hear Word" : "🔊 听单词发音"}
                </button>
                ${
                  v.ex
                    ? `<button type="button" class="mini-btn on" id="btnWbSpeakEx">${en ? "🗣️ Hear Sentence" : "🗣️ 听整句提示"}</button>`
                    : ""
                }
              </div>
            </div>

            <!-- 右侧拼词积木台 -->
            <div class="wb-board-panel">
              <div class="wb-slots-row ${this.wbSolved ? "solved" : ""} ${hasWrong ? "shake-row" : ""}">
                ${this.wbSlots
                  .map((s, idx) => {
                    const isWrong = this.wbWrongIndices.has(idx);
                    const isRightCheck = hasWrong && s && !isWrong;
                    const cls = this.wbSolved
                      ? "slot-solved"
                      : isWrong
                      ? "slot-wrong"
                      : isRightCheck
                      ? "slot-right"
                      : s && s.isHint
                      ? "slot-hint"
                      : s
                      ? "slot-filled"
                      : "slot-empty";
                    return `
                      <button type="button" class="wb-letter-slot ${cls}" data-sidx="${idx}" title="${s && !s.isHint ? (en ? "Tap to remove letter" : "点我退回这个字母") : ""}">
                        ${s ? esc(s.ch.toUpperCase()) : ""}
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              <div class="wb-tiles-tray">
                ${this.wbTiles
                  .map(
                    (t) => `
                  <button type="button" class="wb-letter-tile ${t.used ? "used" : ""}" data-tid="${t.id}" ${t.used ? "disabled" : ""}>
                    ${esc(t.ch.toUpperCase())}
                  </button>
                `
                  )
                  .join("")}
              </div>

              <div class="wb-tools-row">
                ${
                  !this.wbSolved
                    ? `
                  <button type="button" class="mini-btn on" id="btnWbHint">${en ? "💡 Letter Hint" : "💡 提示一个字母"}</button>
                  <button type="button" class="mini-btn" id="btnWbClear">${en ? "🔄 Clear" : "🔄 清空重拼"}</button>
                  <button type="button" class="mini-btn" id="btnWbSkip">${en ? "⏭️ Next Word" : "⏭️ 换一个词"}</button>
                `
                    : `
                  <div class="wb-win-banner">
                    <div>
                      <div style="font-weight:900;font-size:1.05rem;color:var(--c-ok-text);">
                        🎉 ${en ? `Awesome! <strong>${esc(v.w)}</strong> = ${esc(v.zh)}!` : `拼词成功！<strong>${esc(v.w)}</strong> = ${esc(v.zh)}！`}
                      </div>
                      <div style="font-size:0.82rem;color:var(--text-sub);margin-top:2px;">${en ? "Added to Core Wordbook progress ⭐" : "已收进核心词库掌握进度 ⭐"}</div>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                      <button type="button" class="mini-btn on" id="btnWbReplayWin">🔊 再读一遍</button>
                      <button type="button" class="big-action-btn" id="btnWbNext" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">下一个词 ➜</button>
                    </div>
                  </div>
                `
                }
              </div>

              ${
                hasWrong
                  ? `<div style="margin-top:8px;font-size:0.86rem;font-weight:800;color:var(--c-warn-text);">💡 绿色字母位置对啦！点一下橙色格子退回字母再试试～</div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      const bOpen = document.getElementById("btnWbOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(v.cardId));

      mount.querySelectorAll("[data-wbdiff]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const next = btn.getAttribute("data-wbdiff");
          if (next === this.wbDiff) return;
          if (window.SFX) window.SFX.pop();
          this.wbDiff = next;
          this.loadBuilderWord(this.wbWord);
          this.renderSubBody();
        });
      });

      const bRevealEx = document.getElementById("btnWbRevealEx");
      if (bRevealEx) {
        bRevealEx.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.wbShowExHint = true;
          this.renderSubBody();
        });
      }

      const bSpeakW = document.getElementById("btnWbSpeakWord");
      if (bSpeakW) bSpeakW.addEventListener("click", () => this._speakEn(v.w, { repeat: 2 }));

      const bSpeakEx = document.getElementById("btnWbSpeakEx");
      if (bSpeakEx) bSpeakEx.addEventListener("click", () => this._speakEn(v.ex, { repeat: 1 }));

      mount.querySelectorAll(".wb-letter-tile").forEach((tb) => {
        tb.addEventListener("click", () => this._wbPlaceTile(parseInt(tb.getAttribute("data-tid"), 10)));
      });
      mount.querySelectorAll(".wb-letter-slot").forEach((sb) => {
        sb.addEventListener("click", () => this._wbRemoveSlot(parseInt(sb.getAttribute("data-sidx"), 10)));
      });

      const bHint = document.getElementById("btnWbHint");
      if (bHint) bHint.addEventListener("click", () => this._wbHintOneLetter());

      const bClear = document.getElementById("btnWbClear");
      if (bClear) {
        bClear.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.loadBuilderWord(this.wbWord);
          this.renderSubBody();
        });
      }

      const bSkip = document.getElementById("btnWbSkip");
      if (bSkip) {
        bSkip.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.pickNextBuilderWord();
          this.renderSubBody();
        });
      }

      const bReplay = document.getElementById("btnWbReplayWin");
      if (bReplay) bReplay.addEventListener("click", () => this._speakWordFull(v));

      const bNext = document.getElementById("btnWbNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.pickNextBuilderWord();
          this.renderSubBody();
        });
      }
    }

    _bindGlobalKeyboard() {
      document.addEventListener("keydown", (e) => {
        if (this.app.state.stage !== "english" || this.subGame !== "builder") return;
        const tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        const modalOpen = document.querySelector(".card-modal-backdrop.open, .ai-companion-backdrop.open");
        if (modalOpen) return;

        if (this.wbSolved) {
          if (e.key === "Enter") {
            e.preventDefault();
            this.pickNextBuilderWord();
            this.renderSubBody();
          }
          return;
        }
        if (e.key === "Backspace") {
          for (let i = this.wbSlots.length - 1; i >= 0; i--) {
            if (this.wbSlots[i] && !this.wbSlots[i].isHint) {
              e.preventDefault();
              this._wbRemoveSlot(i);
              break;
            }
          }
          return;
        }
        if (/^[a-zA-Z]$/.test(e.key)) {
          const ch = e.key.toLowerCase();
          const tile = this.wbTiles.find((t) => !t.used && t.ch === ch);
          if (tile) {
            e.preventDefault();
            this._wbPlaceTile(tile.id);
          }
        }
      });
    }

    // ========================================================================
    // 游戏 2：🃏 双语翻翻乐配对 (Bilingual Memory Match)
    // ========================================================================
    setupMemoryBoard() {
      this.memFlipped = [];
      this.memLocked = false;
      this.memMoves = 0;
      this.memMatchedCount = 0;
      this.memCombo = 0;
      this.memWon = false;

      const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
      const cards = [];

      if (this.memMode === "species") {
        let pool = (window.CATALOG_DATA || []).filter(
          (x) =>
            (this.chapter === "all" ? x.chapter !== "ch0" : x.chapter === this.chapter) &&
            ceMap[x.id] &&
            ceMap[x.id].enName &&
            this.app.getPhoto(x.id)
        );
        if (pool.length < 4) {
          pool = (window.CATALOG_DATA || []).filter(
            (x) => x.chapter !== "ch0" && ceMap[x.id] && ceMap[x.id].enName && this.app.getPhoto(x.id)
          );
        }
        const need = Math.min(this.memPairsTarget, pool.length);
        let picked = [];
        if (this.memConfuse && pool.length > need) {
          const anchor = pool[Math.floor(Math.random() * pool.length)];
          picked = [anchor, ...pickConfusableSpecies(anchor, pool, need - 1)];
        } else {
          picked = shuffle(pool).slice(0, need);
        }
        picked.forEach((item) => {
          const ce = ceMap[item.id];
          cards.push({
            uid: `${item.id}_pic`,
            pairId: item.id,
            kind: "pic",
            photo: this.app.getPhoto(item.id),
            zhLabel: item.name,
            emoji: item.emoji,
            speakText: null,
            matched: false,
            flipped: false
          });
          cards.push({
            uid: `${item.id}_en`,
            pairId: item.id,
            kind: "en",
            enLabel: ce.enName,
            pron: ce.enPron || "",
            speakText: ce.enName,
            matched: false,
            flipped: false
          });
        });
      } else {
        let pool = this._getFilteredVocab();
        if (pool.length < 4) pool = this.allVocab;
        const need = Math.min(this.memPairsTarget, pool.length);
        let picked = [];
        if (this.memConfuse && this.allVocab.length > need) {
          const anchor = pool[Math.floor(Math.random() * pool.length)];
          picked = [anchor, ...pickConfusableVocab(anchor, this.allVocab, need - 1)];
        } else {
          picked = shuffle(pool).slice(0, need);
        }
        picked.forEach((v) => {
          cards.push({
            uid: `${v.key}_zh`,
            pairId: v.key,
            kind: "zh",
            zhLabel: v.zh,
            emoji: v.icon,
            cardId: v.cardId,
            speakText: null,
            matched: false,
            flipped: false
          });
          cards.push({
            uid: `${v.key}_en`,
            pairId: v.key,
            kind: "en",
            enLabel: v.w,
            wordKey: v.key,
            speakText: v.w,
            matched: false,
            flipped: false
          });
        });
      }

      this.memCards = shuffle(cards);
    }

    _syncMemoryCardDOM(idx) {
      const btn = this.mountEl.querySelector(`.mem-card[data-midx="${idx}"]`);
      const c = this.memCards[idx];
      if (!btn || !c) return;
      const showFront = c.flipped || c.matched;
      btn.classList.toggle("is-flipped", showFront);
      btn.classList.toggle("is-matched", c.matched);
      if (c.matched) {
        const front = btn.querySelector(".mem-card-front");
        if (front && !front.querySelector(".mem-match-check")) {
          const chk = document.createElement("span");
          chk.className = "mem-match-check";
          chk.textContent = "✓";
          front.appendChild(chk);
        }
      }
    }

    _syncMemoryHudDOM() {
      const totalPairs = Math.floor(this.memCards.length / 2);
      const mEl = document.getElementById("memMatchedStat");
      const mvEl = document.getElementById("memMovesStat");
      if (mEl) mEl.textContent = `✅ 配对 ${this.memMatchedCount}/${totalPairs}`;
      if (mvEl) mvEl.textContent = `👣 翻牌 ${this.memMoves} 步`;
    }

    _flipMemoryCard(idx) {
      if (this.memLocked || this.memWon) return;
      const card = this.memCards[idx];
      if (!card || card.flipped || card.matched) return;

      card.flipped = true;
      this.memFlipped.push(idx);
      this._syncMemoryCardDOM(idx);
      if (card.speakText) {
        this._speakEn(card.speakText, { repeat: 1 });
      } else if (window.SFX) {
        window.SFX.pop();
      }

      if (this.memFlipped.length === 2) {
        this.memMoves += 1;
        this.memLocked = true;
        this._syncMemoryHudDOM();
        const [i1, i2] = this.memFlipped;
        const c1 = this.memCards[i1];
        const c2 = this.memCards[i2];

        if (c1.pairId === c2.pairId) {
          setTimeout(() => {
            c1.matched = true;
            c2.matched = true;
            this.memMatchedCount += 1;
            this.memCombo += 1;
            this.memFlipped = [];
            this.memLocked = false;
            this._syncMemoryCardDOM(i1);
            this._syncMemoryCardDOM(i2);
            this._syncMemoryHudDOM();
            if (window.SFX) window.SFX.chime();
            if (this.memMode === "vocab") {
              this._markWordMastered(c1.pairId);
            }
            const totalPairs = this.memCards.length / 2;
            if (this.memMatchedCount >= totalPairs) {
              this.memWon = true;
              const s = this.app.state;
              s.memoryWins = (s.memoryWins || 0) + 1;
              this.app.addStars(totalPairs >= 8 ? 6 : 4);
              if (this.app.trackMission) this.app.trackMission("words", 2);
              const gridEl = this.mountEl.querySelector(".mem-board-grid");
              celebrate(gridEl);
              const b = document.getElementById("enPgSubBody");
              if (b && this.subGame === "memory") this.renderMemoryMatch(b);
            }
          }, 360);
        } else {
          setTimeout(() => {
            c1.flipped = false;
            c2.flipped = false;
            this.memCombo = 0;
            this.memFlipped = [];
            this.memLocked = false;
            this._syncMemoryCardDOM(i1);
            this._syncMemoryCardDOM(i2);
            if (window.SFX) window.SFX.bonk();
          }, 860);
        }
      }
    }

    renderMemoryMatch(mount) {
      const totalPairs = Math.floor(this.memCards.length / 2);
      mount.innerHTML = `
        <div class="mem-arena-card">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="scene-pill ${this.memMode === "species" ? "active" : ""}" data-mmode="species">📸 实拍物种 ↔ 英文名</button>
              <button type="button" class="scene-pill ${this.memMode === "vocab" ? "active" : ""}" data-mmode="vocab">🔤 科学单词 ↔ 中文</button>
              <button type="button" class="mini-btn ${this.memConfuse ? "on" : ""}" id="btnMemConfuse" title="同批牌专挑形近词或同章相近物种，考验真功夫！">
                ${this.memConfuse ? "🔥 形近/同类易混" : "🌱 随机轻松"}
              </button>
              <button type="button" class="mini-btn ${this.memPairsTarget === 6 ? "on" : ""}" data-msize="6">6对 (12张)</button>
              <button type="button" class="mini-btn ${this.memPairsTarget === 8 ? "on" : ""}" data-msize="8">8对 (16张)</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <span class="mini-btn" id="memMatchedStat" style="pointer-events:none;">✅ 配对 ${this.memMatchedCount}/${totalPairs}</span>
              <span class="mini-btn" id="memMovesStat" style="pointer-events:none;">👣 翻牌 ${this.memMoves} 步</span>
              <button type="button" class="mini-btn on" id="btnMemRestart">🔄 重新发牌</button>
            </div>
          </div>

          ${
            this.memWon
              ? `
            <div class="wb-win-banner" style="margin-bottom:14px;">
              <div>
                <div style="font-weight:900;font-size:1.12rem;color:var(--c-ok-text);">
                  🏆 太强啦！仅用 ${this.memMoves} 步全配对通关 (+${totalPairs >= 8 ? 6 : 4}⭐)！
                </div>
                <div style="font-size:0.84rem;color:var(--text-sub);margin-top:2px;">点任意一张英文牌还可以再听发音复习哦～</div>
              </div>
              <button type="button" class="big-action-btn" id="btnMemPlayAgain" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">🃏 再来一局！</button>
            </div>
          `
              : `<div style="font-size:0.86rem;color:var(--text-sub);font-weight:800;margin-bottom:12px;">
                   👆 翻开两张牌，把【英文卡片】和它对应的【物种实拍 / 中文含义】配成一对！翻开英文卡会自动朗读哦！
                 </div>`
          }

          <div class="mem-board-grid ${totalPairs >= 8 ? "grid-8" : "grid-6"}">
            ${this.memCards
              .map((c, idx) => {
                const showFront = c.flipped || c.matched;
                return `
                  <button type="button" class="mem-card ${showFront ? "is-flipped" : ""} ${c.matched ? "is-matched" : ""}" data-midx="${idx}">
                    <div class="mem-card-inner">
                      <div class="mem-card-back">
                        <span class="mem-back-icon">🧪</span>
                        <span class="mem-back-label">?</span>
                      </div>
                      <div class="mem-card-front ${c.kind === "en" ? "front-en" : "front-zh"}">
                        ${
                          c.kind === "pic"
                            ? `<img src="${esc(c.photo)}" alt="" class="mem-pic-img" />
                               <div class="mem-pic-caption">${this.app.ruby(c.zhLabel)}</div>`
                            : c.kind === "en"
                            ? `<span class="mem-en-flag">🇬🇧 🔊</span>
                               <div class="mem-en-text">${esc(c.enLabel)}</div>
                               ${c.pron ? `<div class="mem-en-pron">${esc(c.pron)}</div>` : ""}`
                            : `<div class="mem-zh-emoji">${c.emoji}</div>
                               <div class="mem-zh-text">${esc(c.zhLabel)}</div>`
                        }
                        ${c.matched ? `<span class="mem-match-check">✓</span>` : ""}
                      </div>
                    </div>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      `;

      mount.querySelectorAll("[data-mmode]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.memMode = b.getAttribute("data-mmode");
          this.setupMemoryBoard();
          this.renderSubBody();
        });
      });

      mount.querySelectorAll("[data-msize]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.memPairsTarget = parseInt(b.getAttribute("data-msize"), 10) || 6;
          this.setupMemoryBoard();
          this.renderSubBody();
        });
      });

      const bConfuse = document.getElementById("btnMemConfuse");
      if (bConfuse) {
        bConfuse.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.memConfuse = !this.memConfuse;
          this.setupMemoryBoard();
          this.renderSubBody();
        });
      }

      const bRestart = document.getElementById("btnMemRestart");
      if (bRestart) {
        bRestart.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.setupMemoryBoard();
          this.renderSubBody();
        });
      }

      const bAgain = document.getElementById("btnMemPlayAgain");
      if (bAgain) {
        bAgain.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.setupMemoryBoard();
          this.renderSubBody();
        });
      }

      mount.querySelectorAll(".mem-card").forEach((cardBtn) => {
        cardBtn.addEventListener("click", () => {
          const idx = parseInt(cardBtn.getAttribute("data-midx"), 10);
          const card = this.memCards[idx];
          if (card && card.matched && card.speakText) {
            this._speakEn(card.speakText, { repeat: 1 });
            return;
          }
          this._flipMemoryCard(idx);
        });
      });
    }

    // ========================================================================
    // 游戏 3：🚂 英文造句小火车 (Sentence Scramble Train)
    // ========================================================================
    pickNextTrainSentence() {
      const pool = this._getFilteredSentences();
      const s = this.app.state;
      if (!Array.isArray(s.sentencesBuilt)) s.sentencesBuilt = [];
      const doneSet = new Set(s.sentencesBuilt);
      const todo = pool.filter((x) => !doneSet.has(x.sentKey) && (!this.trSent || x.sentKey !== this.trSent.sentKey));
      const candidates = todo.length > 0 ? todo : pool.filter((x) => !this.trSent || x.sentKey !== this.trSent.sentKey);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : pool[0];
      if (chosen) this.loadTrainSentence(chosen);
    }

    loadTrainSentence(sentObj) {
      this.trSent = sentObj;
      this.trSolved = false;
      this.trWrongIdx = -1;
      this.trTrack = [];
      const realCars = sentObj.tokens.map((w, i) => ({ id: i, word: w, used: false, isDecoy: false }));
      let extraCars = [];
      if (this.trDecoyOn) {
        const decoys = pickSentenceDecoyWords(sentObj.tokens, 2);
        extraCars = decoys.map((dw, j) => ({
          id: sentObj.tokens.length + j,
          word: dw,
          used: false,
          isDecoy: true
        }));
      }
      this.trDecoyCount = extraCars.length;
      let shuf = shuffle(realCars.concat(extraCars));
      if (shuf.slice(0, sentObj.tokens.length).map((x) => x.word).join(" ") === sentObj.en) {
        shuf = shuffle(shuf);
      }
      this.trPool = shuf;
    }

    _trAddCar(carId) {
      if (this.trSolved) return;
      if (this.trTrack.length >= this.trSent.tokens.length) {
        if (window.SFX) window.SFX.bonk();
        return;
      }
      const car = this.trPool.find((c) => c.id === carId && !c.used);
      if (!car) return;
      if (window.SFX) window.SFX.pop();
      car.used = true;
      this.trTrack.push({ id: car.id, word: car.word });
      this.trWrongIdx = -1;
      this._trCheckSentence();
      const body = document.getElementById("enPgSubBody");
      if (body && this.subGame === "train") this.renderSentenceTrain(body);
    }

    _trRemoveCar(trackIdx) {
      if (this.trSolved) return;
      const removed = this.trTrack.splice(trackIdx, 1)[0];
      if (!removed) return;
      if (window.SFX) window.SFX.pop();
      const car = this.trPool.find((c) => c.id === removed.id);
      if (car) car.used = false;
      this.trWrongIdx = -1;
      const body = document.getElementById("enPgSubBody");
      if (body && this.subGame === "train") this.renderSentenceTrain(body);
    }

    _trHintNextWord() {
      if (this.trSolved || !this.trSent) return;
      const targetTokens = this.trSent.tokens;
      // 先把当前轨道里第一个不匹配及之后的车厢退回
      let goodLen = 0;
      while (goodLen < this.trTrack.length && this.trTrack[goodLen].word === targetTokens[goodLen]) {
        goodLen++;
      }
      while (this.trTrack.length > goodLen) {
        const popped = this.trTrack.pop();
        const c = this.trPool.find((x) => x.id === popped.id);
        if (c) c.used = false;
      }
      if (goodLen < targetTokens.length) {
        const nextWord = targetTokens[goodLen];
        const matchCar = this.trPool.find((c) => !c.used && !c.isDecoy && c.word === nextWord);
        if (matchCar) {
          this._trAddCar(matchCar.id);
        }
      }
    }

    _trCheckSentence() {
      if (!this.trSent || this.trTrack.length !== this.trSent.tokens.length) return;
      const built = this.trTrack.map((c) => c.word).join(" ");
      if (built === this.trSent.en) {
        this.trSolved = true;
        this.trWrongIdx = -1;
        this.trStreak += 1;
        if (window.SFX) window.SFX.chime();
        const s = this.app.state;
        if (!Array.isArray(s.sentencesBuilt)) s.sentencesBuilt = [];
        const isFirst = !s.sentencesBuilt.includes(this.trSent.sentKey);
        if (isFirst) {
          s.sentencesBuilt.push(this.trSent.sentKey);
          this.app.addStars(2);
        } else {
          this.app.addStars(1);
        }
        if (this.app.trackMission) this.app.trackMission("words", 1);
        setTimeout(() => {
          const card = this.mountEl.querySelector(".train-arena-card");
          celebrate(card);
          this._speakEn(this.trSent.en, { repeat: 2, playTapSfx: false });
        }, 120);
      } else {
        let wrong = 0;
        while (wrong < this.trTrack.length && this.trTrack[wrong].word === this.trSent.tokens[wrong]) {
          wrong++;
        }
        this.trWrongIdx = wrong;
        if (window.SFX) window.SFX.bonk();
      }
    }

    renderSentenceTrain(mount) {
      const st = this.trSent;
      if (!st) return;
      const photo = this.app.getPhoto(st.cardId);
      const builtTotal = (this.app.state.sentencesBuilt || []).length;

      mount.innerHTML = `
        <div class="train-arena-card">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="scene-pill ${!this.trDecoyOn ? "active" : ""}" data-trmode="classic">🌱 纯正词块</button>
              <button type="button" class="scene-pill ${this.trDecoyOn ? "active" : ""}" data-trmode="decoy">🔥 干扰词挑战 (+2假词)</button>
              <span class="mini-btn on" style="pointer-events:none;">${st.tag}</span>
              <span class="mini-btn" style="pointer-events:none;">🚂 已拼通 ${builtTotal} 句</span>
            </div>
            <div class="live-en-streak-pill">🔥 造句连胜：${this.trStreak} 句</div>
          </div>

          <div class="train-prompt-banner">
            <div class="wb-species-mini" id="btnTrOpenCard" title="点击打开完整档案卡">
              ${photo ? `<img src="${esc(photo)}" alt="" class="wb-species-thumb" />` : `<span style="font-size:2.2rem;">${st.emoji}</span>`}
              <div>
                <div style="font-weight:900;font-size:0.94rem;">${this.app.ruby(st.cardName)}</div>
                <div style="font-size:0.74rem;color:var(--c-teal-text);font-weight:800;">${esc(st.code)}</div>
              </div>
            </div>
            <div style="flex:1;min-width:220px;">
              <div style="font-size:0.78rem;color:var(--c-warn-text);font-weight:900;">
                ${
                  this.trDecoyCount > 0
                    ? `🎯 车库里混进了 ${this.trDecoyCount} 节【假词干扰车厢】，挑出正确的 ${st.tokens.length} 个词挂上火车：`
                    : `🎯 把下面散落的 ${st.tokens.length} 个英文词块按顺序挂上小火车：`
                }
              </div>
              <div class="train-zh-goal">${this.app.ruby(st.zh)}</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="big-action-btn" id="btnTrListen" style="padding:9px 16px;min-height:42px;font-size:0.9rem;">
                🔊 听英文原句
              </button>
              <button type="button" class="mini-btn on" id="btnTrListenSlow">🐢 慢速听</button>
            </div>
          </div>

          <!-- 火车轨道组装区 -->
          <div class="train-track-zone ${this.trSolved ? "solved" : ""}">
            <span class="train-engine">🚂</span>
            ${
              this.trTrack.length === 0
                ? `<span class="train-placeholder">👇 点下方英文词块，按顺序一节节挂上小火车！</span>`
                : this.trTrack
                    .map((car, idx) => {
                      const cls = this.trSolved
                        ? "car-solved"
                        : this.trWrongIdx >= 0
                        ? idx < this.trWrongIdx
                          ? "car-right"
                          : idx === this.trWrongIdx
                          ? "car-wrong"
                          : ""
                        : "";
                      return `
                        <button type="button" class="train-word-car on-track ${cls}" data-tidx="${idx}" title="点我拆下这节车厢">
                          ${esc(car.word)}
                        </button>
                      `;
                    })
                    .join("")
            }
          </div>

          ${
            this.trWrongIdx >= 0
              ? `<div style="margin-top:8px;font-size:0.86rem;font-weight:800;color:var(--c-warn-text);">💡 绿色车厢顺序对啦！点掉橙色车厢重新排序，或点【💡 提示下一个词】哦！</div>`
              : ""
          }

          <!-- 词块车库 -->
          <div class="train-depot-zone">
            ${this.trPool
              .map(
                (car) => `
              <button type="button" class="train-word-car in-depot ${car.used ? "used" : ""}" data-cid="${car.id}" ${car.used ? "disabled" : ""}>
                ${esc(car.word)}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="wb-tools-row" style="margin-top:14px;">
            ${
              !this.trSolved
                ? `
              <button type="button" class="mini-btn on" id="btnTrHint">💡 提示下一个词</button>
              <button type="button" class="mini-btn" id="btnTrReset">🔄 清空车厢</button>
              <button type="button" class="mini-btn" id="btnTrSkip">⏭️ 换一句</button>
            `
                : `
              <div class="wb-win-banner">
                <div>
                  <div style="font-weight:900;font-size:1.05rem;color:var(--c-ok-text);">
                    🎉 嘟嘟——发车成功 (+2⭐)！
                  </div>
                  <div class="train-win-en">${esc(st.en)}</div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button type="button" class="mini-btn on" id="btnTrReplay">🔊 再听两遍</button>
                  <button type="button" class="big-action-btn" id="btnTrNext" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">下一列火车 ➜</button>
                </div>
              </div>
            `
            }
          </div>
        </div>
      `;

      mount.querySelectorAll("[data-trmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const wantDecoy = btn.getAttribute("data-trmode") === "decoy";
          if (wantDecoy === this.trDecoyOn) return;
          if (window.SFX) window.SFX.pop();
          this.trDecoyOn = wantDecoy;
          this.loadTrainSentence(this.trSent);
          this.renderSubBody();
        });
      });

      const bOpen = document.getElementById("btnTrOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(st.cardId));

      const bListen = document.getElementById("btnTrListen");
      if (bListen) bListen.addEventListener("click", () => this._speakEn(st.en, { slow: false, repeat: 1 }));
      const bListenSlow = document.getElementById("btnTrListenSlow");
      if (bListenSlow) bListenSlow.addEventListener("click", () => this._speakEn(st.en, { slow: true, repeat: 1 }));

      mount.querySelectorAll(".train-word-car.in-depot").forEach((b) => {
        b.addEventListener("click", () => this._trAddCar(parseInt(b.getAttribute("data-cid"), 10)));
      });
      mount.querySelectorAll(".train-word-car.on-track").forEach((b) => {
        b.addEventListener("click", () => this._trRemoveCar(parseInt(b.getAttribute("data-tidx"), 10)));
      });

      const bHint = document.getElementById("btnTrHint");
      if (bHint) bHint.addEventListener("click", () => this._trHintNextWord());
      const bReset = document.getElementById("btnTrReset");
      if (bReset) {
        bReset.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.loadTrainSentence(this.trSent);
          this.renderSubBody();
        });
      }
      const bSkip = document.getElementById("btnTrSkip");
      if (bSkip) {
        bSkip.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.pickNextTrainSentence();
          this.renderSubBody();
        });
      }
      const bReplay = document.getElementById("btnTrReplay");
      if (bReplay) bReplay.addEventListener("click", () => this._speakEn(st.en, { repeat: 2 }));
      const bNext = document.getElementById("btnTrNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.pickNextTrainSentence();
          this.renderSubBody();
        });
      }
    }

    // ========================================================================
    // 游戏 4：🎈 听音戳泡泡 (Listen & Pop Word Bubbles Arcade)
    // ========================================================================
    setupBubbleRound(autoPlay) {
      if (this._bpNextTimer) {
        clearTimeout(this._bpNextTimer);
        this._bpNextTimer = null;
      }
      const pool = this._getFilteredVocab();
      const basePool = pool.length >= 6 ? pool : this.allVocab;
      const mastered = this._getMasteredSet();
      const fresh = basePool.filter((v) => !mastered.has(v.key) && (!this.bpTarget || v.key !== this.bpTarget.key));
      const candidates = fresh.length > 0 ? fresh : basePool.filter((v) => !this.bpTarget || v.key !== this.bpTarget.key);
      const target = candidates[Math.floor(Math.random() * candidates.length)] || basePool[0];
      if (!target) return;

      // 从全书 251 词里挑最“长相像、读音近”的形近词当干扰项（绝不再随机出送分题！）
      const distractors = pickConfusableVocab(target, this.allVocab, (this.bpCount || 6) - 1);
      const palette = [
        "linear-gradient(145deg, rgba(45,212,191,0.38), rgba(56,189,248,0.28))",
        "linear-gradient(145deg, rgba(251,191,36,0.38), rgba(249,115,22,0.26))",
        "linear-gradient(145deg, rgba(192,132,252,0.38), rgba(99,102,241,0.26))",
        "linear-gradient(145deg, rgba(251,113,133,0.38), rgba(244,63,94,0.26))",
        "linear-gradient(145deg, rgba(74,222,128,0.38), rgba(16,185,129,0.26))",
        "linear-gradient(145deg, rgba(96,165,250,0.38), rgba(129,140,248,0.26))",
        "linear-gradient(145deg, rgba(244,114,182,0.38), rgba(192,132,252,0.26))",
        "linear-gradient(145deg, rgba(52,211,153,0.38), rgba(34,211,238,0.26))"
      ];
      const borders = ["#2dd4bf", "#fbbf24", "#c084fc", "#fb7185", "#4ade80", "#60a5fa", "#f472b6", "#34d399"];

      this.bpTarget = target;
      this.bpSolved = false;
      this.bpShowHint = false;
      this.bpFeedback = "";
      this.bpBubbles = shuffle([target, ...distractors]).map((v, idx) => ({
        id: idx,
        vocab: v,
        popped: false,
        wrong: false,
        bg: palette[idx % palette.length],
        border: borders[idx % borders.length],
        delay: (idx * 0.28).toFixed(2),
        dur: (3.2 + (idx % 3) * 0.55).toFixed(2)
      }));

      if (autoPlay && this.bpMode === "listen") {
        setTimeout(() => {
          if (this.subGame === "bubbles" && this.bpTarget && this.bpTarget.key === target.key) {
            this._speakEn(target.w, { repeat: 2, playTapSfx: false });
          }
        }, 160);
      }
    }

    _popBubble(bid, btnEl) {
      if (this.bpSolved) return;
      const b = this.bpBubbles.find((x) => x.id === bid);
      if (!b || b.popped) return;
      if (b.vocab.key === this.bpTarget.key) {
        b.popped = true;
        this.bpSolved = true;
        this.bpStreak += 1;
        if (window.SFX) window.SFX.chime();
        const isFirst = this._markWordMastered(b.vocab.key);
        const s = this.app.state;
        s.bubblePops = (s.bubblePops || 0) + 1;
        this.app.addStars(isFirst ? 2 : 1);
        if (this.app.trackMission) this.app.trackMission("words", 1);
        if (btnEl) {
          btnEl.classList.add("is-popped");
          celebrate(btnEl);
        }
        this.bpFeedback = `
          <div class="wb-win-banner">
            <div>
              <div style="font-weight:900;font-size:1.05rem;color:var(--c-ok-text);">
                💥 戳破正确泡泡 (+${isFirst ? 2 : 1}⭐)！<strong>${esc(b.vocab.w)}</strong> = ${b.vocab.icon} ${esc(b.vocab.zh)}
              </div>
              ${b.vocab.ex ? `<div style="font-size:0.86rem;color:var(--text-sub);margin-top:3px;">🗣️ ${esc(b.vocab.ex)}</div>` : ""}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="mini-btn" id="btnBpOpenCard">📖 看原卡</button>
              <button type="button" class="big-action-btn" id="btnBpNext" style="padding:8px 18px;min-height:40px;font-size:0.9rem;">下一波泡泡 ➜</button>
            </div>
          </div>
        `;
        setTimeout(() => {
          const body = document.getElementById("enPgSubBody");
          if (body && this.subGame === "bubbles") this.renderBubblePop(body);
          this._speakWordFull(b.vocab, { includeZh: false, playTapSfx: false });
        }, 260);
      } else {
        b.wrong = true;
        this.bpStreak = 0;
        if (window.SFX) window.SFX.bonk();
        this._speakEn(b.vocab.w, { repeat: 1, playTapSfx: false });
        this.bpFeedback = `
          <div style="padding:9px 13px;border-radius:14px;background:rgba(251,191,36,0.14);border:1.5px solid rgba(251,191,36,0.5);font-weight:800;font-size:0.9rem;color:var(--c-warn-text);">
            🫧 刚才那个泡泡是 <strong>${esc(b.vocab.w)}</strong>（${b.vocab.icon} ${esc(b.vocab.zh)}）哦！再听一遍，找找目标泡泡吧！
          </div>
        `;
        const body = document.getElementById("enPgSubBody");
        if (body && this.subGame === "bubbles") this.renderBubblePop(body);
      }
    }

    renderBubblePop(mount) {
      const target = this.bpTarget;
      if (!target) {
        this.setupBubbleRound(false);
        if (!this.bpTarget) return;
      }
      const t = this.bpTarget;
      const photo = this.app.getPhoto(t.cardId);
      const totalPops = this.app.state.bubblePops || 0;

      mount.innerHTML = `
        <div class="wb-arena-card bubble-arena-card">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="scene-pill ${this.bpMode === "listen" ? "active" : ""}" data-bpmode="listen">🔊 听英文戳泡泡</button>
              <button type="button" class="scene-pill ${this.bpMode === "meaning" ? "active" : ""}" data-bpmode="meaning">👀 看中文戳英文</button>
              <button type="button" class="mini-btn ${this.bpCount === 6 ? "on" : ""}" data-bpcount="6">⚡ 6形近词</button>
              <button type="button" class="mini-btn ${this.bpCount === 8 ? "on" : ""}" data-bpcount="8">🔥 8泡泡魔鬼</button>
              <span class="mini-btn" style="pointer-events:none;">🎈 累计戳破 ${totalPops} 个</span>
            </div>
            <div class="live-en-streak-pill">🔥 戳泡泡连击：${this.bpStreak}</div>
          </div>

          <div class="bubble-prompt-bar">
            <div class="wb-species-mini" id="btnBpSpeciesCard" title="点击打开它的完整 3D 档案">
              ${photo ? `<img src="${esc(photo)}" alt="" class="wb-species-thumb" />` : `<span style="font-size:2.2rem;">${t.icon}</span>`}
              <div>
                <div style="font-weight:900;font-size:0.9rem;">${this.app.ruby(t.cardName)}</div>
                <div style="font-size:0.74rem;color:var(--c-teal-text);font-weight:800;">${esc(t.code)}</div>
              </div>
            </div>
            <div style="flex:1;min-width:210px;">
              ${
                this.bpMode === "listen"
                  ? `<div style="font-size:0.82rem;color:var(--c-warn-text);font-weight:900;">🎧 听力大挑战：听读音，戳破对应的英文泡泡！</div>
                     ${
                       this.bpShowHint || this.bpSolved
                         ? `<div style="font-size:1.08rem;font-weight:900;margin-top:3px;">中文提示：${t.icon} ${esc(t.zh)}</div>`
                         : `<div style="margin-top:5px;"><button type="button" class="mini-btn" id="btnBpShowHint" style="padding:4px 11px;min-height:30px;font-size:0.78rem;">💡 偷看中文提示</button></div>`
                     }`
                  : `<div style="font-size:0.82rem;color:var(--c-warn-text);font-weight:900;">🎯 下面哪个泡泡代表这个科学词？快戳破它！</div>
                     <div style="font-size:1.35rem;font-weight:900;margin-top:2px;">${t.icon} ${esc(t.zh)}</div>`
              }
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="big-action-btn" id="btnBpPlayWord" style="padding:9px 16px;min-height:42px;font-size:0.9rem;">🔊 听单词</button>
              ${t.ex ? `<button type="button" class="mini-btn on" id="btnBpPlayEx">🐢 慢速听例句</button>` : ""}
              <button type="button" class="mini-btn" id="btnBpSkip">⏭️ 换一波</button>
            </div>
          </div>

          <div class="bubble-sky-stage ${this.bpBubbles.length >= 8 ? "bubbles-8" : ""}">
            ${this.bpBubbles
              .map((b) => {
                const revealIcon = b.wrong || b.popped || this.bpSolved;
                return `
              <button
                type="button"
                class="word-bubble-btn ${b.popped ? "is-popped" : ""} ${b.wrong ? "is-wrong" : ""}"
                data-bid="${b.id}"
                style="--b-bg:${b.bg};--b-border:${b.border};--bf-delay:${b.delay}s;--bf-dur:${b.dur}s;"
                ${b.popped ? "disabled" : ""}
              >
                <span class="bubble-shine"></span>
                ${revealIcon ? `<span class="bubble-emoji">${b.vocab.icon || "🫧"}</span>` : `<span class="bubble-dot-badge">🫧</span>`}
                <span class="bubble-word">${esc(b.vocab.w)}</span>
                ${b.wrong || this.bpSolved ? `<span class="bubble-sub-zh">${esc(b.vocab.zh)}</span>` : ""}
              </button>
            `;
              })
              .join("")}
          </div>

          <div style="margin-top:12px;">${this.bpFeedback}</div>
        </div>
      `;

      mount.querySelectorAll("[data-bpmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.bpMode = btn.getAttribute("data-bpmode");
          this.setupBubbleRound(true);
          this.renderSubBody();
        });
      });

      mount.querySelectorAll("[data-bpcount]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nextCnt = parseInt(btn.getAttribute("data-bpcount"), 10) || 6;
          if (nextCnt === this.bpCount) return;
          if (window.SFX) window.SFX.pop();
          this.bpCount = nextCnt;
          this.setupBubbleRound(true);
          this.renderSubBody();
        });
      });

      const bSpec = document.getElementById("btnBpSpeciesCard");
      if (bSpec) bSpec.addEventListener("click", () => this.app.openSuperCard(t.cardId));
      const bShowHint = document.getElementById("btnBpShowHint");
      if (bShowHint) {
        bShowHint.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.bpShowHint = true;
          this.renderSubBody();
        });
      }
      const bPlayW = document.getElementById("btnBpPlayWord");
      if (bPlayW) bPlayW.addEventListener("click", () => this._speakEn(t.w, { repeat: 2 }));
      const bPlayEx = document.getElementById("btnBpPlayEx");
      if (bPlayEx) bPlayEx.addEventListener("click", () => this._speakEn(t.ex, { slow: true, repeat: 1 }));
      const bSkip = document.getElementById("btnBpSkip");
      if (bSkip) {
        bSkip.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.setupBubbleRound(true);
          this.renderSubBody();
        });
      }

      mount.querySelectorAll(".word-bubble-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const bid = parseInt(btn.getAttribute("data-bid"), 10);
          this._popBubble(bid, btn);
        });
      });

      const bOpen = document.getElementById("btnBpOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(t.cardId));
      const bNext = document.getElementById("btnBpNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.setupBubbleRound(true);
          this.renderSubBody();
        });
      }
    }

    // ========================================================================
    // 游戏 5：🎙️ 英语开口小舞台 (Speak & Shine English Speaking Stage)
    // ========================================================================
    _stopSpeakCapture() {
      if (this.spRecognition) {
        try { this.spRecognition.stop(); } catch (_) {}
        this.spRecognition = null;
      }
      this.spListening = false;
      if (this.spRecorder && this.spIsRecording) {
        try { this.spRecorder.stop(); } catch (_) {}
      }
      this.spIsRecording = false;
    }

    pickNextSpeakItem(specificCardId) {
      this._stopSpeakCapture();
      if (this.spRecUrl) {
        try { URL.revokeObjectURL(this.spRecUrl); } catch (_) {}
        this.spRecUrl = null;
      }
      this.spTranscript = "";
      this.spMatched = [];
      this.spDone = false;
      this.spStatusMsg = "";

      const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
      if (this.spMode === "species") {
        let pool = (window.CATALOG_DATA || []).filter(
          (x) => (this.chapter === "all" || x.chapter === this.chapter) && ceMap[x.id] && ceMap[x.id].enName
        );
        if (!pool.length) pool = (window.CATALOG_DATA || []).filter((x) => ceMap[x.id] && ceMap[x.id].enName);
        let picked = specificCardId ? pool.find((x) => x.id === specificCardId) : null;
        if (!picked) {
          const others = pool.filter((x) => !this.spItem || x.id !== this.spItem.cardId);
          picked = (others.length ? others : pool)[Math.floor(Math.random() * (others.length ? others.length : pool.length))];
        }
        if (!picked) return;
        const ce = ceMap[picked.id];
        this.spItem = {
          cardId: picked.id,
          cardName: picked.name,
          code: picked.code,
          emoji: picked.emoji,
          text: ce.enName,
          zh: picked.name,
          pron: ce.enPron || "",
          tag: "📸 物种英文名"
        };
      } else {
        const pool = this._getFilteredSentences();
        let picked = specificCardId ? pool.find((s) => s.cardId === specificCardId) : null;
        if (!picked) {
          const others = pool.filter((s) => !this.spItem || s.text !== this.spItem.text);
          picked = (others.length ? others : pool)[Math.floor(Math.random() * (others.length ? others.length : pool.length))];
        }
        if (!picked) return;
        this.spItem = {
          cardId: picked.cardId,
          cardName: picked.cardName,
          code: picked.code,
          emoji: picked.emoji,
          text: picked.en,
          zh: picked.zh,
          pron: "",
          tag: picked.tag || "💬 科普金句"
        };
      }
    }

    jumpToSpeakCard(cardId) {
      this.subGame = "speak";
      this.spMode = "species";
      this.mountEl.querySelectorAll("[data-ensub]").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-ensub") === "speak")
      );
      this.pickNextSpeakItem(cardId);
      this.renderSubBody();
    }

    _awardSpeakSuccess(msg) {
      if (!this.spDone) {
        this.spDone = true;
        this.spStreak += 1;
        const s = this.app.state;
        s.speakStageCount = (s.speakStageCount || 0) + 1;
        this.app.addStars(2);
        if (this.app.trackMission) this.app.trackMission("words", 1);
      }
      this.spStatusMsg = msg;
      if (window.SFX) window.SFX.chime();
      const card = this.mountEl.querySelector(".speak-stage-card");
      celebrate(card);
    }

    _startSpeakMic() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this.spStatusMsg = "📱 当前浏览器不支持实时打分，点旁边【🎙️ 录音听自己】读完回放同样超棒！";
        this.renderSubBody();
        return;
      }
      if (this.spListening) {
        this._stopSpeakCapture();
        this.renderSubBody();
        return;
      }
      if (window.DoubaoTTS) window.DoubaoTTS.stop();
      try {
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 3;
        this.spRecognition = rec;
        this.spListening = true;
        this.spTranscript = "";
        this.spStatusMsg = "🎙️ 正在认真听你的英语发音，请大声读出来吧…";
        this.renderSubBody();

        const words = this.spItem.text.split(/\s+/).filter(Boolean);
        rec.onresult = (ev) => {
          let bestTranscript = "";
          let bestMatched = words.map(() => false);
          let bestScore = -1;
          for (let r = 0; r < ev.results.length; r++) {
            const res = ev.results[r];
            for (let a = 0; a < res.length; a++) {
              const t = res[a].transcript || "";
              const m = matchSpokenTokens(words, t);
              const score = m.filter(Boolean).length;
              if (score > bestScore) {
                bestScore = score;
                bestMatched = m;
                bestTranscript = t;
              }
            }
          }
          this.spTranscript = bestTranscript;
          this.spMatched = bestMatched;
          const pct = Math.round((bestScore / Math.max(1, words.length)) * 100);
          if (pct >= 65) {
            this._stopSpeakCapture();
            this._awardSpeakSuccess(`🌟 发音太地道啦！匹配度 ${pct}% (+2⭐)！`);
          }
          this.renderSubBody();
        };

        rec.onerror = (ev) => {
          this.spListening = false;
          this.spRecognition = null;
          this.spStatusMsg =
            ev && ev.error === "not-allowed"
              ? "🔒 浏览器还没开启麦克风权限，也可以先听示范大声跟读后点【✅ 我大声读完啦】！"
              : "🎙️ 刚才声音有点轻，再靠近一点大声读一次吧！";
          this.renderSubBody();
        };

        rec.onend = () => {
          const wasListening = this.spListening;
          this.spListening = false;
          this.spRecognition = null;
          if (wasListening && !this.spDone) {
            const hitCnt = this.spMatched.filter(Boolean).length;
            const pct = Math.round((hitCnt / Math.max(1, words.length)) * 100);
            if (pct >= 60) {
              this._awardSpeakSuccess(`👏 读得非常清楚！匹配度 ${pct}% (+2⭐)！`);
            } else if (this.spTranscript) {
              this.spStatusMsg = `👍 听到了 “${this.spTranscript}”，绿色的词很标准！点【🐢 慢速听】再挑战一次把黄色词也点亮！`;
            } else {
              this.spStatusMsg = "🎙️ 没听到声音，点按钮再大声读一遍，或者用【🎙️ 录音听自己】自测！";
            }
            this.renderSubBody();
          }
        };

        rec.start();
      } catch (_) {
        this.spListening = false;
        this.spStatusMsg = "📱 请尝试点【🎙️ 录音听自己】或跟读后点【✅ 我大声读完啦】！";
        this.renderSubBody();
      }
    }

    async _toggleSpeakRecorder() {
      if (this.spIsRecording && this.spRecorder) {
        try { this.spRecorder.stop(); } catch (_) {}
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
        this.spStatusMsg = "📱 当前环境不支持网页录音，可以大声跟读两遍后直接点【✅ 我大声读完啦】摘星！";
        this.renderSubBody();
        return;
      }
      if (window.DoubaoTTS) window.DoubaoTTS.stop();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.spRecChunks = [];
        const recorder = new MediaRecorder(stream);
        this.spRecorder = recorder;
        this.spIsRecording = true;
        this.spStatusMsg = "🔴 正在录下你的英文朗读，读完点【⏹️ 停止录音】听回放对比！";
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) this.spRecChunks.push(e.data);
        };
        recorder.onstop = () => {
          this.spIsRecording = false;
          stream.getTracks().forEach((tr) => tr.stop());
          if (this.spRecChunks.length > 0) {
            if (this.spRecUrl) try { URL.revokeObjectURL(this.spRecUrl); } catch (_) {}
            const blob = new Blob(this.spRecChunks, { type: recorder.mimeType || "audio/webm" });
            this.spRecUrl = URL.createObjectURL(blob);
            this._awardSpeakSuccess("🎧 录音完成 (+2⭐)！快点回放听听自己超棒的英文发音吧！");
          }
          this.renderSubBody();
        };
        recorder.start();
        this.renderSubBody();
      } catch (_) {
        this.spIsRecording = false;
        this.spStatusMsg = "🔒 麦克风未授权，先点【🔊 听示范】大声跟读两遍，再点【✅ 我大声读完啦】吧！";
        this.renderSubBody();
      }
    }

    renderSpeakStage(mount) {
      if (!this.spItem) this.pickNextSpeakItem();
      const it = this.spItem;
      if (!it) return;
      const photo = this.app.getPhoto(it.cardId);
      const words = it.text.split(/\s+/).filter(Boolean);
      const totalSpoke = this.app.state.speakStageCount || 0;
      const hasSR = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

      mount.innerHTML = `
        <div class="wb-arena-card speak-stage-card">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <button type="button" class="scene-pill ${this.spMode === "species" ? "active" : ""}" data-spmode="species">📸 看图说英文名 (99卡)</button>
              <button type="button" class="scene-pill ${this.spMode === "sentence" ? "active" : ""}" data-spmode="sentence">💬 毒物金句开口读 (370句)</button>
              <span class="mini-btn" style="pointer-events:none;">🎙️ 累计开口 ${totalSpoke} 次</span>
            </div>
            <div class="live-en-streak-pill">🔥 朗读连胜：${this.spStreak}</div>
          </div>

          <div class="speak-hero-grid">
            <div class="speak-photo-card" id="btnSpOpenCard" title="点击打开它的完整 3D 档案">
              ${photo ? `<img src="${esc(photo)}" alt="${esc(it.cardName)}" class="speak-photo-img" />` : `<div style="font-size:4.2rem;padding:28px;">${it.emoji}</div>`}
              <div class="speak-photo-caption">
                <span>${it.emoji} ${this.app.ruby(it.cardName)}</span>
                <span style="font-size:0.74rem;color:var(--c-teal-text);">${esc(it.code)}</span>
              </div>
            </div>

            <div class="speak-teleprompter-box">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
                <span class="mini-btn on" style="pointer-events:none;">${it.tag}</span>
                ${it.pron ? `<span class="speak-pron-pill">${esc(it.pron)}</span>` : ""}
              </div>

              <!-- 逐词点读 + 实时绿灯点亮词块 -->
              <div class="speak-words-flow">
                ${words
                  .map((w, idx) => {
                    const cls = this.spDone
                      ? "word-hit"
                      : this.spMatched.length > idx
                      ? this.spMatched[idx]
                        ? "word-hit"
                        : "word-miss"
                      : "";
                    return `<button type="button" class="speak-word-chip ${cls}" data-spword="${esc(w.replace(/[^a-zA-Z'-]/g, ""))}" title="点我单独听这个词发音">${esc(w)}</button>`;
                  })
                  .join("")}
              </div>

              <div class="speak-zh-line">🇨🇳 ${this.app.ruby(it.zh)}</div>

              <div class="speak-action-row">
                <button type="button" class="mini-btn on" id="btnSpDemo">🔊 听示范</button>
                <button type="button" class="mini-btn" id="btnSpDemoSlow">🐢 慢速细听</button>
                ${
                  hasSR
                    ? `<button type="button" class="big-action-btn ${this.spListening ? "is-live-mic" : ""}" id="btnSpMic" style="padding:9px 18px;min-height:44px;font-size:0.94rem;">
                         ${this.spListening ? "⏹️ 正在听你读…" : "🎙️ 开口语音打分"}
                       </button>`
                    : ""
                }
                <button type="button" class="mini-btn ${this.spIsRecording ? "on" : ""}" id="btnSpRec">
                  ${this.spIsRecording ? "⏹️ 停止录音" : "🎧 录音听自己"}
                </button>
                ${
                  !this.spDone
                    ? `<button type="button" class="mini-btn" id="btnSpManualOk">✅ 我已大声读出来！</button>`
                    : ""
                }
              </div>

              ${
                this.spRecUrl
                  ? `<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                       <span style="font-size:0.84rem;font-weight:900;color:var(--c-teal-text);">🎧 你的英文录音：</span>
                       <audio controls src="${this.spRecUrl}" style="height:34px;max-width:260px;"></audio>
                     </div>`
                  : ""
              }

              ${
                this.spStatusMsg
                  ? `<div class="speak-status-banner ${this.spDone ? "is-win" : ""}">${esc(this.spStatusMsg)}</div>`
                  : `<div class="speak-tip-note">💡 小技巧：点上面任意单个英文词都能单独听发音！先点【🔊 听示范】，再大声读出来点亮全部绿色词块吧！</div>`
              }

              <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
                <button type="button" class="big-action-btn" id="btnSpNext" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">
                  ${this.spDone ? "太棒了！下一题 ➜" : "⏭️ 换一题练习"}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      mount.querySelectorAll("[data-spmode]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.spMode = b.getAttribute("data-spmode");
          this.pickNextSpeakItem();
          this.renderSubBody();
        });
      });

      const bOpen = document.getElementById("btnSpOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(it.cardId));

      mount.querySelectorAll("[data-spword]").forEach((wb) => {
        wb.addEventListener("click", () => {
          const w = wb.getAttribute("data-spword");
          if (w) this._speakEn(w, { repeat: 1 });
        });
      });

      const bDemo = document.getElementById("btnSpDemo");
      if (bDemo) bDemo.addEventListener("click", () => this._speakEn(it.text, { slow: false, repeat: 1 }));
      const bSlow = document.getElementById("btnSpDemoSlow");
      if (bSlow) bSlow.addEventListener("click", () => this._speakEn(it.text, { slow: true, repeat: 1 }));
      const bMic = document.getElementById("btnSpMic");
      if (bMic) bMic.addEventListener("click", () => this._startSpeakMic());
      const bRec = document.getElementById("btnSpRec");
      if (bRec) bRec.addEventListener("click", () => this._toggleSpeakRecorder());
      const bManual = document.getElementById("btnSpManualOk");
      if (bManual) {
        bManual.addEventListener("click", () => {
          this._awardSpeakSuccess("🌟 勇敢开口大声读，英文越说越流利 (+2⭐)！");
          this.renderSubBody();
        });
      }
      const bNext = document.getElementById("btnSpNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.pickNextSpeakItem();
          this.renderSubBody();
        });
      }
    }

    // ========================================================================
    // 游戏 6：📚 我的 251 科学英语词典 (Collectible Wordbook)
    // ========================================================================
    renderWordbook(mount) {
      const mastered = this._getMasteredSet();
      const baseList = this._getFilteredVocab();
      const q = this.dictSearch.trim().toLowerCase();
      const list = baseList.filter((v) => {
        if (this.dictFilter === "mastered" && !mastered.has(v.key)) return false;
        if (this.dictFilter === "todo" && mastered.has(v.key)) return false;
        if (q) {
          const hay = `${v.w} ${v.zh} ${v.cardName} ${v.enName} ${v.ex}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      const masteredInScope = baseList.filter((v) => mastered.has(v.key)).length;

      mount.innerHTML = `
        <div class="wb-arena-card">
          <div class="wb-header-row" style="margin-bottom:14px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${this.dictFilter === "all" ? "active" : ""}" data-dfilt="all">🌟 全部 (${baseList.length})</button>
              <button type="button" class="scene-pill ${this.dictFilter === "mastered" ? "active" : ""}" data-dfilt="mastered">✅ 已掌握 (${masteredInScope})</button>
              <button type="button" class="scene-pill ${this.dictFilter === "todo" ? "active" : ""}" data-dfilt="todo">🔒 待解锁 (${baseList.length - masteredInScope})</button>
            </div>
            <input type="search" id="enWordbookSearch" class="quick-search" value="${esc(this.dictSearch)}" placeholder="🔍 搜单词、中文或物种（如 cell、frog）" style="min-width:220px;" />
          </div>

          ${
            list.length === 0
              ? `<div style="text-align:center;padding:34px 16px;color:var(--text-sub);font-weight:800;">
                   ${this.dictFilter === "mastered" ? "🌟 去【🧩 字母积木拼词屋】或卡片里的【拼词闯关】，拼出第一个单词点亮词典吧！" : "🔍 没有找到匹配的单词，换个词搜搜看～"}
                 </div>`
              : `<div class="wordbook-grid">
                   ${list
                     .map((v) => {
                       const ok = mastered.has(v.key);
                       return `
                         <div class="wordbook-card ${ok ? "is-mastered" : ""}" data-wkey="${esc(v.key)}">
                           <div class="wordbook-card-top">
                             <span class="wordbook-icon">${v.icon}</span>
                             <div style="flex:1;min-width:0;">
                               <div class="wordbook-en">${esc(v.w)} ${ok ? `<span class="wordbook-check">✓</span>` : ""}</div>
                               <div class="wordbook-zh">${esc(v.zh)} · <span style="color:var(--c-teal-text);">${esc(v.cardName)}</span></div>
                             </div>
                             <button type="button" class="wordbook-horn-btn" data-speak-w="${esc(v.key)}" title="点我听发音与例句">🔊</button>
                           </div>
                           ${v.ex ? `<div class="wordbook-ex">${esc(v.ex)}</div>` : ""}
                           <div class="wordbook-actions">
                             <button type="button" class="wordbook-mini-act" data-spell-w="${esc(v.key)}">🧩 拼一拼</button>
                             <button type="button" class="wordbook-mini-act" data-speak-card="${esc(v.cardId)}">🎙️ 开口读</button>
                             <button type="button" class="wordbook-mini-act" data-card-w="${esc(v.cardId)}">📖 看原卡</button>
                           </div>
                         </div>
                       `;
                     })
                     .join("")}
                 </div>`
          }
        </div>
      `;

      mount.querySelectorAll("[data-dfilt]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.dictFilter = b.getAttribute("data-dfilt");
          this.renderSubBody();
        });
      });

      const searchEl = document.getElementById("enWordbookSearch");
      if (searchEl) {
        searchEl.addEventListener("input", (e) => {
          this.dictSearch = e.target.value;
          this.renderWordbook(mount);
          const restored = document.getElementById("enWordbookSearch");
          if (restored) {
            restored.focus();
            restored.setSelectionRange(restored.value.length, restored.value.length);
          }
        });
      }

      const byKey = new Map(this.allVocab.map((v) => [v.key, v]));
      mount.querySelectorAll("[data-speak-w]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const v = byKey.get(btn.getAttribute("data-speak-w"));
          if (v) this._speakWordFull(v);
        });
      });
      mount.querySelectorAll(".wordbook-card").forEach((card) => {
        card.addEventListener("click", () => {
          const v = byKey.get(card.getAttribute("data-wkey"));
          if (v) this._speakWordFull(v);
        });
      });
      mount.querySelectorAll("[data-spell-w]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.SFX) window.SFX.pop();
          this.jumpToSpellWord(btn.getAttribute("data-spell-w"));
        });
      });
      mount.querySelectorAll("[data-speak-card]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.SFX) window.SFX.pop();
          this.jumpToSpeakCard(btn.getAttribute("data-speak-card"));
        });
      });
      mount.querySelectorAll("[data-card-w]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.SFX) window.SFX.pop();
          this.app.openSuperCard(btn.getAttribute("data-card-w"));
        });
      });
    }
  }

  window.EnglishPlaygroundModule = {
    EnglishPlayground,
    buildMasterVocabList,
    buildSentencePool
  };
})();
