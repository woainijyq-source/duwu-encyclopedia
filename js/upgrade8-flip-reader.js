// ============================================================================
// Duwu Science Playground v8.0 — Tap-to-Flip 3D Inline Word Engine & My Word Box
// Features:
//   1. Automatic Core Vocab (KET/PET + Kids-AWL) bolding across all English text
//   2. Every single English word is tappable -> 0ms en-US audio + 3D flip to Chinese
//   3. Auto-flip back to English after 3.5s (pauses when inspecting detail card)
//   4. Auto-collects tapped words into "My Word Box" (3 correct hits -> Mastered!)
//   5. Instant localStorage persistence + background cloud sync via ./api/progress
//   6. Custom colorful Kurzgesagt-style SVG category icons
// ============================================================================

(function () {
  const STORAGE_KEY = "duwu_wordbox_v8";
  const FLIP_BACK_MS = 3600;
  const MASTER_HITS = 3;

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --------------------------------------------------------------------------
  // Colorful Kurzgesagt-style SVG Category Icons (replaces plain monotonous emojis)
  // --------------------------------------------------------------------------
  const CORE_SVG_ICONS = {
    action: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gAct" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gAct)" opacity="0.18"/><path d="M22 6L11 22h8l-2 12 12-16h-8l1-12z" fill="url(#gAct)" stroke="#ea580c" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    science: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gSci" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gSci)" opacity="0.16"/><path d="M16 7h8v3l-1.5 1v6.2l6.8 11.3A3.5 3.5 0 0126.3 34H13.7a3.5 3.5 0 01-3-5.5L17.5 17.2V11L16 10V7z" fill="#e0f2fe" stroke="url(#gSci)" stroke-width="2" stroke-linejoin="round"/><path d="M13 27h14l1.8 3a2 2 0 01-1.7 3H12.9a2 2 0 01-1.7-3L13 27z" fill="url(#gSci)"/><circle cx="19" cy="23" r="1.8" fill="#06b6d4"/><circle cx="23" cy="20" r="1.3" fill="#6366f1"/></svg>`,
    defense: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gDef" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#f43f5e"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gDef)" opacity="0.16"/><path d="M20 6l11 4.5v8.8c0 7.1-4.6 12.6-11 15.2-6.4-2.6-11-8.1-11-15.2v-8.8L20 6z" fill="url(#gDef)" stroke="#be123c" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 12v14M14 18h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    nature: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gNat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gNat)" opacity="0.16"/><path d="M31 9C18 9 10 16 10 28c0 1.4.2 2.4.5 3 9.5 1 19.5-5 20.5-22z" fill="url(#gNat)" stroke="#047857" stroke-width="1.5"/><path d="M11 30c4-6 10-12 17-17" stroke="#ecfdf5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    medicine: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gMed" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#14b8a6"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gMed)" opacity="0.16"/><path d="M20 33s-11-7-11-15.2C9 12.8 12.6 9.5 16.5 9.5c2.2 0 3.5 1.3 3.5 2.5 0-1.2 1.3-2.5 3.5-2.5 3.9 0 7.5 3.3 7.5 8.3C31 26 20 33 20 33z" fill="#fb7185" stroke="#e11d48" stroke-width="1.5"/><path d="M20 15v9M15.5 19.5h9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    thinking: `<svg viewBox="0 0 40 40" class="core-svg-icon" aria-hidden="true"><defs><linearGradient id="gThk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#gThk)" opacity="0.16"/><circle cx="18" cy="18" r="8.5" fill="#ede9fe" stroke="url(#gThk)" stroke-width="2.6"/><path d="M24.5 24.5L32 32" stroke="url(#gThk)" stroke-width="3.6" stroke-linecap="round"/><circle cx="16" cy="15.5" r="2" fill="#8b5cf6"/></svg>`
  };
  window.CORE_SVG_ICONS = CORE_SVG_ICONS;

  // --------------------------------------------------------------------------
  // Irregular English forms for accurate morphological lemmatization
  // --------------------------------------------------------------------------
  const IRREGULAR_MAP = {
    am: "be", is: "be", are: "be", was: "be", were: "be", been: "be", being: "be",
    has: "have", had: "have", having: "have", does: "do", did: "do", done: "do",
    goes: "go", went: "go", gone: "go", ate: "eat", eaten: "eat",
    bit: "bite", bitten: "bite", biting: "bite",
    broke: "break", broken: "break", built: "build", burnt: "burn",
    came: "come", caught: "catch", chose: "choose", chosen: "choose",
    cut: "cut", dug: "dig", drank: "drink", drunk: "drink", drove: "drive", driven: "drive",
    fell: "fall", fallen: "fall", fed: "feed", felt: "feel", fought: "fight", found: "find",
    fled: "flee", flew: "fly", flown: "fly", forgot: "forget", forgotten: "forget",
    froze: "freeze", frozen: "freeze", gave: "give", given: "give", got: "get", gotten: "get",
    grew: "grow", grown: "grow", heard: "hear", held: "hold", hid: "hide", hidden: "hide",
    hit: "hit", hurt: "hurt", kept: "keep", knew: "know", known: "know",
    laid: "lay", led: "lead", left: "leave", let: "let", lit: "light", lost: "lose",
    made: "make", meant: "mean", met: "meet", paid: "pay", put: "put",
    ran: "run", read: "read", rose: "rise", risen: "rise", said: "say", saw: "see", seen: "see",
    sent: "send", set: "set", shook: "shake", shaken: "shake", shone: "shine", shot: "shoot",
    showed: "show", shown: "show", shut: "shut", sang: "sing", sank: "sink", sunk: "sink",
    sat: "sit", slept: "sleep", slid: "slide", spoke: "speak", spoken: "speak",
    spent: "spend", spun: "spin", split: "split", spread: "spread", stood: "stand",
    stole: "steal", stolen: "steal", stuck: "stick", stung: "sting", struck: "strike",
    swam: "swim", swum: "swim", swept: "sweep", swollen: "swell",
    taught: "teach", tore: "tear", torn: "tear", told: "tell", thought: "think",
    threw: "throw", thrown: "throw", took: "take", taken: "take",
    understood: "understand", woke: "wake", woken: "wake", wore: "wear", worn: "wear",
    won: "win", wrote: "write", written: "write",
    mice: "mouse", teeth: "tooth", feet: "foot", geese: "goose", children: "child",
    men: "man", women: "woman", people: "person", leaves: "leaf", halves: "half",
    knives: "knife", lives: "life", wolves: "wolf", shelves: "shelf",
    fungi: "fungus", larvae: "larva", algae: "algae", bacteria: "bacteria",
    better: "good", best: "good", worse: "bad", worst: "bad",
    more: "much", most: "much", less: "little", least: "little",
    further: "far", farther: "far",
    "don't": "do", "doesn't": "do", "didn't": "do", "can't": "can", "cannot": "can",
    "won't": "will", "isn't": "be", "aren't": "be", "wasn't": "be", "weren't": "be",
    "haven't": "have", "hasn't": "have", "it's": "it", "that's": "that", "there's": "there",
    "what's": "what", "who's": "who", "you're": "you", "they're": "they", "we're": "we",
    "i'm": "i", "you'll": "you", "they'll": "they", "we'll": "we", "you've": "you",
    "let's": "let"
  };

  let coreMapCache = null;
  let legacyMapCache = null;

  function getCoreMap() {
    if (coreMapCache) return coreMapCache;
    if (window.CORE_VOCAB_MAP) {
      coreMapCache = window.CORE_VOCAB_MAP;
      return coreMapCache;
    }
    if (Array.isArray(window.CORE_VOCAB_DATA)) {
      const m = Object.create(null);
      window.CORE_VOCAB_DATA.forEach((item) => {
        if (item && item.w) m[item.w.toLowerCase()] = item;
      });
      window.CORE_VOCAB_MAP = m;
      coreMapCache = m;
      return m;
    }
    return Object.create(null);
  }

  function getLegacyMap() {
    if (legacyMapCache) return legacyMapCache;
    const m = Object.create(null);
    if (window.CURIOSITY_ENGLISH_DATA) {
      Object.values(window.CURIOSITY_ENGLISH_DATA).forEach((entry) => {
        (entry.vocab || []).forEach((v) => {
          if (v && v.w && !m[v.w.toLowerCase()]) {
            m[v.w.toLowerCase()] = { w: v.w.toLowerCase(), zh: v.zh, ex: v.ex || "" };
          }
        });
      });
    }
    legacyMapCache = m;
    return m;
  }

  function candidateLemmas(rawLower) {
    const out = [rawLower];
    let w = rawLower;
    if (w.endsWith("'s") || w.endsWith("’s")) {
      w = w.slice(0, -2);
      out.push(w);
    }
    if (IRREGULAR_MAP[w]) out.push(IRREGULAR_MAP[w]);
    if (w.endsWith("ies") && w.length > 4) out.push(w.slice(0, -3) + "y");
    if (w.endsWith("ves") && w.length > 4) {
      out.push(w.slice(0, -3) + "f");
      out.push(w.slice(0, -3) + "fe");
    }
    if (w.endsWith("es") && w.length > 3) out.push(w.slice(0, -2));
    if (w.endsWith("s") && w.length > 2 && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) {
      out.push(w.slice(0, -1));
    }
    if (w.endsWith("ied") && w.length > 4) out.push(w.slice(0, -3) + "y");
    if (w.endsWith("ed") && w.length > 4) {
      out.push(w.slice(0, -2));
      out.push(w.slice(0, -1));
      if (w.length > 5 && w[w.length - 3] === w[w.length - 4]) out.push(w.slice(0, -3));
    }
    if (w.endsWith("ing") && w.length > 5) {
      out.push(w.slice(0, -3));
      out.push(w.slice(0, -3) + "e");
      if (w.length > 6 && w[w.length - 4] === w[w.length - 5]) out.push(w.slice(0, -4));
    }
    if (w.endsWith("ier") && w.length > 4) out.push(w.slice(0, -3) + "y");
    if (w.endsWith("iest") && w.length > 5) out.push(w.slice(0, -4) + "y");
    if (w.endsWith("er") && w.length > 4) {
      out.push(w.slice(0, -2));
      out.push(w.slice(0, -1));
    }
    if (w.endsWith("est") && w.length > 5) {
      out.push(w.slice(0, -3));
      out.push(w.slice(0, -2));
    }
    if (w.endsWith("ly") && w.length > 4) {
      out.push(w.slice(0, -2));
      if (w.endsWith("ily")) out.push(w.slice(0, -3) + "y");
    }
    return out;
  }

  function lookupWord(rawToken) {
    const cleaned = String(rawToken || "")
      .toLowerCase()
      .replace(/’/g, "'")
      .replace(/^[^a-z]+|[^a-z]+$/g, "");
    if (!cleaned) return null;

    const coreMap = getCoreMap();
    const flipDict = window.FLIP_DICT || Object.create(null);
    const legacyMap = getLegacyMap();
    const cands = candidateLemmas(cleaned);

    // 1. Check exact / lemma in Core Vocab (KET / PET / AWL -> bolded!)
    for (const c of cands) {
      if (coreMap[c]) {
        const entry = coreMap[c];
        return {
          word: cleaned,
          lemma: entry.w,
          zh: entry.zh,
          ipa: entry.ipa || "",
          pos: entry.pos || "",
          enDef: entry.enDef || "",
          ex: entry.ex || "",
          theme: entry.theme || "science",
          level: entry.level || "KET",
          syn: entry.syn || [],
          ant: entry.ant || [],
          fam: entry.fam || [],
          cards: entry.cards || [],
          isCore: true
        };
      }
    }

    // 2. Check exact / lemma in complete inline FLIP_DICT
    for (const c of cands) {
      const hit = flipDict[c];
      if (hit) {
        if (typeof hit === "string") {
          return { word: cleaned, lemma: c, zh: hit, ipa: "", pos: "", enDef: "", ex: "", isCore: false };
        }
        return {
          word: cleaned,
          lemma: c,
          zh: hit.zh || "",
          ipa: hit.ipa || "",
          pos: hit.pos || "",
          enDef: hit.enDef || "",
          ex: hit.ex || "",
          isCore: false
        };
      }
    }

    // 3. Check hyphenated compound words (e.g., "blue-ringed", "food-chain")
    if (cleaned.includes("-")) {
      const parts = cleaned.split("-").filter(Boolean);
      const zhParts = [];
      let anyCore = false;
      for (const p of parts) {
        const sub = lookupWord(p);
        if (sub && sub.zh) {
          zhParts.push(sub.zh);
          if (sub.isCore) anyCore = true;
        }
      }
      if (zhParts.length) {
        return {
          word: cleaned,
          lemma: cleaned,
          zh: zhParts.join("·"),
          ipa: "",
          pos: "",
          enDef: "",
          ex: "",
          isCore: anyCore
        };
      }
    }

    // 4. Legacy curiosity vocab fallback
    for (const c of cands) {
      if (legacyMap[c]) {
        return {
          word: cleaned,
          lemma: c,
          zh: legacyMap[c].zh,
          ipa: "",
          pos: "",
          enDef: "",
          ex: legacyMap[c].ex || "",
          isCore: false
        };
      }
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // WordBox & Spaced Mastery Manager (localStorage + ./api/progress cloud sync)
  // --------------------------------------------------------------------------
  class WordBoxManager {
    constructor() {
      this.data = {
        wordBox: {},      // lemma -> { w, zh, ipa, pos, isCore, theme, level, taps, correct, mastered, sourceCard, addedAt, lastSeen }
        coreMastery: {},  // lemma -> { correct, mastered, lastSeen }
        updatedAt: 0
      };
      this._syncTimer = null;
      this._cloudAvailable = true;
      this._loadLocal();
      this._pullCloud();
    }

    _loadLocal() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            if (parsed.wordBox) this.data.wordBox = parsed.wordBox;
            if (parsed.coreMastery) this.data.coreMastery = parsed.coreMastery;
            if (parsed.updatedAt) this.data.updatedAt = parsed.updatedAt;
          }
        }
      } catch (_) {}
    }

    _saveLocal() {
      this.data.updatedAt = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (_) {}
      this.updateTopBadge();
      this._scheduleCloudPush();
      window.dispatchEvent(new CustomEvent("duwu:wordboxchange"));
    }

    _scheduleCloudPush() {
      if (this._syncTimer) clearTimeout(this._syncTimer);
      this._syncTimer = setTimeout(() => this._pushCloud(), 1800);
    }

    async _pullCloud() {
      try {
        const res = await fetch("./api/progress", { cache: "no-store" });
        if (res.status === 404 || res.status === 405 || res.status === 501) {
          this._cloudAvailable = false;
          return;
        }
        if (!res.ok) return;
        const json = await res.json();
        if (!json || !json.ok || !json.progress) return;
        const remote = json.progress;
        let changed = false;
        if (remote.wordBox && typeof remote.wordBox === "object") {
          for (const [k, rv] of Object.entries(remote.wordBox)) {
            const lv = this.data.wordBox[k];
            if (!lv) {
              this.data.wordBox[k] = rv;
              changed = true;
            } else {
              const merged = {
                ...lv,
                ...rv,
                taps: Math.max(lv.taps || 0, rv.taps || 0),
                correct: Math.max(lv.correct || 0, rv.correct || 0),
                mastered: Boolean(lv.mastered || rv.mastered),
                lastSeen: Math.max(lv.lastSeen || 0, rv.lastSeen || 0)
              };
              if (
                merged.taps !== lv.taps ||
                merged.correct !== lv.correct ||
                merged.mastered !== lv.mastered
              ) {
                this.data.wordBox[k] = merged;
                changed = true;
              }
            }
          }
        }
        if (remote.coreMastery && typeof remote.coreMastery === "object") {
          for (const [k, rv] of Object.entries(remote.coreMastery)) {
            const lv = this.data.coreMastery[k];
            if (!lv) {
              this.data.coreMastery[k] = rv;
              changed = true;
            } else {
              const merged = {
                correct: Math.max(lv.correct || 0, rv.correct || 0),
                mastered: Boolean(lv.mastered || rv.mastered),
                lastSeen: Math.max(lv.lastSeen || 0, rv.lastSeen || 0)
              };
              if (merged.correct !== lv.correct || merged.mastered !== lv.mastered) {
                this.data.coreMastery[k] = merged;
                changed = true;
              }
            }
          }
        }
        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
          } catch (_) {}
          this.updateTopBadge();
          window.dispatchEvent(new CustomEvent("duwu:wordboxchange"));
        }
      } catch (_) {
        // Offline or static local preview (port 8892) — silently stay local!
      }
    }

    async _pushCloud() {
      if (!this._cloudAvailable) return;
      try {
        const res = await fetch("./api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            progress: {
              wordBox: this.data.wordBox,
              coreMastery: this.data.coreMastery
            }
          })
        });
        if (res.status === 404 || res.status === 405 || res.status === 501) {
          this._cloudAvailable = false;
        }
      } catch (_) {
        // Offline / static server fallback
      }
    }

    recordTap(info, sourceCardId) {
      if (!info || !info.lemma) return;
      const key = info.lemma.toLowerCase();
      const now = Date.now();
      const prev = this.data.wordBox[key];
      const isNew = !prev;
      this.data.wordBox[key] = {
        w: key,
        zh: info.zh || (prev && prev.zh) || "",
        ipa: info.ipa || (prev && prev.ipa) || "",
        pos: info.pos || (prev && prev.pos) || "",
        enDef: info.enDef || (prev && prev.enDef) || "",
        ex: info.ex || (prev && prev.ex) || "",
        isCore: Boolean(info.isCore || (prev && prev.isCore)),
        theme: info.theme || (prev && prev.theme) || "",
        level: info.level || (prev && prev.level) || "",
        taps: (prev ? prev.taps || 0 : 0) + 1,
        correct: prev ? prev.correct || 0 : 0,
        mastered: prev ? Boolean(prev.mastered) : false,
        sourceCard: sourceCardId || (prev && prev.sourceCard) || "",
        addedAt: prev ? prev.addedAt || now : now,
        lastSeen: now
      };
      this._saveLocal();
      this._pulseBadge(isNew);
    }

    recordCorrect(word) {
      const key = String(word || "").toLowerCase().trim();
      if (!key) return { correct: 0, mastered: false, justMastered: false };
      const now = Date.now();
      let justMastered = false;

      // Update WordBox entry if present
      const wb = this.data.wordBox[key];
      if (wb) {
        const wasMastered = Boolean(wb.mastered);
        wb.correct = (wb.correct || 0) + 1;
        wb.lastSeen = now;
        if (wb.correct >= MASTER_HITS) {
          wb.mastered = true;
          if (!wasMastered) justMastered = true;
        }
      }

      // Update CoreMastery
      const cm = this.data.coreMastery[key] || { correct: 0, mastered: false, lastSeen: now };
      const wasCmMastered = Boolean(cm.mastered);
      cm.correct = (cm.correct || 0) + 1;
      cm.lastSeen = now;
      if (cm.correct >= MASTER_HITS) {
        cm.mastered = true;
        if (!wasCmMastered) justMastered = true;
      }
      this.data.coreMastery[key] = cm;
      this._saveLocal();

      return {
        correct: Math.max(wb ? wb.correct : 0, cm.correct),
        mastered: Boolean((wb && wb.mastered) || cm.mastered),
        justMastered
      };
    }

    getEntry(word) {
      const key = String(word || "").toLowerCase().trim();
      return this.data.wordBox[key] || null;
    }

    getCoreProgress(word) {
      const key = String(word || "").toLowerCase().trim();
      const cm = this.data.coreMastery[key];
      const wb = this.data.wordBox[key];
      const correct = Math.max(cm ? cm.correct || 0 : 0, wb ? wb.correct || 0 : 0);
      const mastered = Boolean((cm && cm.mastered) || (wb && wb.mastered) || correct >= MASTER_HITS);
      return { correct, mastered, inBox: Boolean(wb) };
    }

    getAllBoxItems() {
      return Object.values(this.data.wordBox).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
    }

    getLearningItems() {
      return this.getAllBoxItems().filter((x) => !x.mastered);
    }

    getMasteredBoxItems() {
      return this.getAllBoxItems().filter((x) => x.mastered);
    }

    getMasteredCoreCount() {
      const coreMap = getCoreMap();
      let count = 0;
      for (const k of Object.keys(coreMap)) {
        if (this.getCoreProgress(k).mastered) count++;
      }
      return count;
    }

    getThemeStats(themeId) {
      const all = (window.CORE_VOCAB_DATA || []).filter((w) => w.theme === themeId);
      let mastered = 0;
      let started = 0;
      all.forEach((item) => {
        const p = this.getCoreProgress(item.w);
        if (p.mastered) mastered++;
        else if (p.correct > 0 || p.inBox) started++;
      });
      return { total: all.length, mastered, started };
    }

    removeFromBox(word) {
      const key = String(word || "").toLowerCase().trim();
      if (this.data.wordBox[key]) {
        delete this.data.wordBox[key];
        this._saveLocal();
      }
    }

    updateTopBadge() {
      const badge = document.getElementById("wordBoxCountBadge");
      if (!badge) return;
      const learning = this.getLearningItems().length;
      const total = this.getAllBoxItems().length;
      badge.textContent = String(learning > 0 ? learning : total);
      badge.classList.toggle("has-items", total > 0);
    }

    _pulseBadge(isNew) {
      const btn = document.getElementById("btnWordBox");
      if (!btn) return;
      btn.classList.remove("wb-pulse");
      void btn.offsetWidth;
      btn.classList.add("wb-pulse");
      if (isNew) {
        const pop = document.createElement("span");
        pop.className = "wb-float-plus";
        pop.textContent = "+1";
        btn.appendChild(pop);
        setTimeout(() => pop.remove(), 900);
      }
    }

    openDrawer(initialTab) {
      let modal = document.getElementById("wordBoxDrawerModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "wordBoxDrawerModal";
        modal.className = "card-modal-backdrop wb-drawer-backdrop";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.remove("open");
        });
        document.body.appendChild(modal);
      }
      this._drawerTab = initialTab || this._drawerTab || "learning";
      this._renderDrawer(modal);
      modal.classList.add("open");
    }

    _renderDrawer(modal) {
      const en = window.isEn ? window.isEn() : true;
      const learning = this.getLearningItems();
      const mastered = this.getMasteredBoxItems();
      const totalCore = (window.CORE_VOCAB_DATA || []).length;
      const masteredCore = this.getMasteredCoreCount();
      const activeTab = this._drawerTab || "learning";
      const list = activeTab === "mastered" ? mastered : learning;

      const mascotSrc = activeTab === "mastered" && mastered.length > 0
        ? "assets/art/mascot_cheer.jpg"
        : "assets/art/mascot_reading.jpg";

      const tipMsg = en
        ? (learning.length > 0
            ? `Professor Dart: "You collected ${learning.length} words while reading! Practice them in Flip Duel — get a word right 3 times to unlock 🌟 Mastered!"`
            : `Professor Dart: "Tap ANY unknown English word while reading a card! It will flip to Chinese and jump right into your Word Box!"`)
        : (learning.length > 0
            ? `箭毒蛙小博士：「你在阅读时收录了 ${learning.length} 个生词！去生词闪卡闯关答对 3 次就能点亮 🌟 已掌握哦！」`
            : `箭毒蛙小博士：「阅读英文卡片时，用手指点任意不认识的单词，它就会翻转成中文并自动收进这里！」`);

      modal.innerHTML = `
        <div class="super-card-modal wb-drawer-card">
          <button class="close-circle-btn" id="btnCloseWordBox" aria-label="Close">✕</button>
          <div class="wb-drawer-hero">
            <img src="${mascotSrc}" alt="Professor Dart" class="wb-mascot-avatar" />
            <div class="wb-drawer-hero-copy">
              <h2>🧰 ${en ? "My Word Box" : "我的生词宝盒"}</h2>
              <p>${esc(tipMsg)}</p>
              <div class="wb-drawer-stats-row">
                <span class="wb-stat-pill">📥 ${en ? "Learning" : "待复习"}: <b>${learning.length}</b></span>
                <span class="wb-stat-pill ok">🌟 ${en ? "Mastered" : "已毕业"}: <b>${mastered.length}</b></span>
                <span class="wb-stat-pill core">📚 ${en ? "Core Bank" : "核心词库"}: <b>${masteredCore}/${totalCore}</b></span>
              </div>
            </div>
          </div>

          <div class="wb-drawer-actions">
            <div class="wb-drawer-tabs">
              <button type="button" class="scene-pill ${activeTab === "learning" ? "active" : ""}" data-wbtab="learning">
                📥 ${en ? `Need Practice (${learning.length})` : `待复习 (${learning.length})`}
              </button>
              <button type="button" class="scene-pill ${activeTab === "mastered" ? "active" : ""}" data-wbtab="mastered">
                🌟 ${en ? `Mastered (${mastered.length})` : `已毕业 (${mastered.length})`}
              </button>
            </div>
            <button type="button" class="big-action-btn wb-launch-duel-btn" id="btnLaunchFlipDuelFromBox">
              ⚔️ ${en ? "Play Flip Duel Now!" : "去玩生词闪卡闯关！"}
            </button>
          </div>

          <div class="wb-drawer-list">
            ${list.length === 0 ? `
              <div class="wb-empty-state">
                <img src="assets/art/mascot_happy.jpg" alt="Professor Dart" class="wb-empty-img" />
                <div class="wb-empty-title">${
                  activeTab === "mastered"
                    ? (en ? "No mastered words yet — play Flip Duel to earn 🌟!" : "还没有毕业单词，快去闯关集满 3 颗星吧！")
                    : (en ? "Your Word Box is fresh and ready!" : "生词宝盒现在空空的，快去点词探索吧！")
                }</div>
                <div class="wb-empty-sub">${
                  en
                    ? "Open any of the 99 Poison Cards and tap bold or tricky words to flip them into Chinese!"
                    : "打开任意一张毒物档案卡，手指点击任意英文单词即可翻卡并自动收入宝盒！"
                }</div>
              </div>
            ` : list.map((item) => {
              const coreInfo = getCoreMap()[item.w];
              const zh = (coreInfo && coreInfo.zh) || item.zh || "";
              const ipa = (coreInfo && coreInfo.ipa) || item.ipa || "";
              const enDef = (coreInfo && coreInfo.enDef) || item.enDef || "";
              const lvl = (coreInfo && coreInfo.level) || item.level || "";
              const stars = Math.min(MASTER_HITS, item.correct || 0);
              const starDots = "★".repeat(stars) + "☆".repeat(MASTER_HITS - stars);
              const svgIcon = CORE_SVG_ICONS[(coreInfo && coreInfo.theme) || item.theme || "thinking"] || "";
              return `
                <div class="wb-item-card ${item.mastered ? "is-mastered" : ""}">
                  <div class="wb-item-icon">${svgIcon}</div>
                  <div class="wb-item-main">
                    <div class="wb-item-top">
                      <span class="wb-item-word">${esc(item.w)}</span>
                      ${ipa ? `<span class="wb-item-ipa">${esc(ipa)}</span>` : ""}
                      ${lvl ? `<span class="wb-lvl-tag lvl-${esc(lvl).toLowerCase()}">${esc(lvl)}</span>` : ""}
                      <span class="wb-item-stars" title="${stars}/${MASTER_HITS}">${starDots}</span>
                    </div>
                    <div class="wb-item-zh">${esc(zh)} ${enDef ? `<span class="wb-item-def">— ${esc(enDef)}</span>` : ""}</div>
                  </div>
                  <div class="wb-item-btns">
                    <button type="button" class="mini-btn wb-say-btn" data-wbsay="${esc(item.w)}" title="Listen">🔊</button>
                    <button type="button" class="mini-btn wb-info-btn" data-wbinfo="${esc(item.w)}" title="Details">📖</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      modal.querySelector("#btnCloseWordBox").addEventListener("click", () => modal.classList.remove("open"));
      modal.querySelectorAll("[data-wbtab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this._drawerTab = btn.getAttribute("data-wbtab");
          this._renderDrawer(modal);
        });
      });
      modal.querySelector("#btnLaunchFlipDuelFromBox").addEventListener("click", () => {
        modal.classList.remove("open");
        if (window.DUWU_APP && typeof window.DUWU_APP.switchStage === "function") {
          window.DUWU_APP.switchStage("english");
        }
        setTimeout(() => {
          if (window.WordAdventureGames && typeof window.WordAdventureGames.openGame === "function") {
            window.WordAdventureGames.openGame("flipduel");
          }
        }, 80);
      });
      modal.querySelectorAll("[data-wbsay]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const w = btn.getAttribute("data-wbsay");
          if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(w);
        });
      });
      modal.querySelectorAll("[data-wbinfo]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const w = btn.getAttribute("data-wbinfo");
          const info = lookupWord(w);
          if (info) openWordDetailPopover(info);
        });
      });
    }
  }

  const wordBox = new WordBoxManager();
  window.WordBox = wordBox;

  // --------------------------------------------------------------------------
  // Word Detail Popover (triggered by tapping 📖 on a flipped word pill)
  // --------------------------------------------------------------------------
  let activePopover = null;
  let pausedCardEl = null;

  function closeWordDetailPopover() {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }
    if (pausedCardEl) {
      scheduleFlipBack(pausedCardEl, 1800);
      pausedCardEl = null;
    }
  }

  function openWordDetailPopover(info, cardEl) {
    closeWordDetailPopover();
    if (!info) return;
    if (cardEl) {
      if (cardEl._flipTimer) {
        clearTimeout(cardEl._flipTimer);
        cardEl._flipTimer = null;
      }
      cardEl.classList.add("timer-paused");
      pausedCardEl = cardEl;
    }

    const en = window.isEn ? window.isEn() : true;
    const prog = wordBox.getCoreProgress(info.lemma);
    const stars = Math.min(MASTER_HITS, prog.correct);
    const starBar = "★".repeat(stars) + "☆".repeat(MASTER_HITS - stars);
    const svgIcon = CORE_SVG_ICONS[info.theme || "thinking"] || "";

    const overlay = document.createElement("div");
    overlay.className = "fw-detail-backdrop";
    overlay.innerHTML = `
      <div class="fw-detail-card" role="dialog" aria-modal="true">
        <button type="button" class="close-circle-btn fw-detail-close" aria-label="Close">✕</button>
        <div class="fw-detail-head">
          <div class="fw-detail-icon">${svgIcon}</div>
          <div>
            <div class="fw-detail-word-row">
              <span class="fw-detail-word">${esc(info.lemma)}</span>
              ${info.pos ? `<span class="fw-detail-pos">${esc(info.pos)}</span>` : ""}
              ${info.level ? `<span class="wb-lvl-tag lvl-${esc(info.level).toLowerCase()}">${esc(info.level)}</span>` : ""}
            </div>
            ${info.ipa ? `<div class="fw-detail-ipa">${esc(info.ipa)}</div>` : ""}
          </div>
        </div>

        <div class="fw-detail-zh">${esc(info.zh || "—")}</div>
        ${info.enDef ? `<div class="fw-detail-def">💡 ${esc(info.enDef)}</div>` : ""}
        ${info.ex ? `
          <div class="fw-detail-ex">
            <span>📖 ${esc(info.ex)}</span>
            <button type="button" class="mini-btn fw-ex-play" title="Read sentence">🔊</button>
          </div>
        ` : ""}

        ${(info.syn && info.syn.length) || (info.ant && info.ant.length) || (info.fam && info.fam.length) ? `
          <div class="fw-detail-links">
            ${info.syn && info.syn.length ? `<span class="fw-link-chip syn">≈ ${esc(info.syn.join(", "))}</span>` : ""}
            ${info.ant && info.ant.length ? `<span class="fw-link-chip ant">↔ ${esc(info.ant.join(", "))}</span>` : ""}
            ${info.fam && info.fam.length ? `<span class="fw-link-chip fam">🌱 ${esc(info.fam.join(", "))}</span>` : ""}
          </div>
        ` : ""}

        <div class="fw-detail-footer">
          <div class="fw-detail-audio-btns">
            <button type="button" class="big-action-btn fw-play-normal" style="min-height:38px;padding:6px 14px;font-size:0.86rem;">🔊 ${en ? "Listen" : "常速读"}</button>
            <button type="button" class="mini-btn fw-play-slow">🐢 ${en ? "Slow" : "慢速读"}</button>
          </div>
          <div class="fw-detail-mastery">
            <span>🧰 ${en ? "Saved in Word Box" : "已收入生词宝盒"}</span>
            <span class="fw-detail-stars">${starBar}</span>
          </div>
        </div>
      </div>
    `;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest(".fw-detail-close")) {
        closeWordDetailPopover();
      }
    });
    overlay.querySelector(".fw-play-normal").addEventListener("click", () => {
      if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(info.lemma, { slow: false });
    });
    overlay.querySelector(".fw-play-slow").addEventListener("click", () => {
      if (window.DoubaoTTS) window.DoubaoTTS.speakWordFast(info.lemma, { slow: true });
    });
    const exBtn = overlay.querySelector(".fw-ex-play");
    if (exBtn && info.ex) {
      exBtn.addEventListener("click", () => {
        if (window.DoubaoTTS) window.DoubaoTTS.speakEnglish(info.ex);
      });
    }

    document.body.appendChild(overlay);
    activePopover = overlay;
  }

  // --------------------------------------------------------------------------
  // Tap-to-Flip 3D Inline Tokenizer & Event Delegation
  // --------------------------------------------------------------------------
  function scheduleFlipBack(cardEl, delayMs) {
    if (!cardEl) return;
    if (cardEl._flipTimer) clearTimeout(cardEl._flipTimer);
    cardEl.classList.remove("timer-paused");
    cardEl._flipTimer = setTimeout(() => {
      cardEl.classList.remove("is-flipped");
      cardEl._flipTimer = null;
    }, delayMs || FLIP_BACK_MS);
  }

  function renderFlipText(text, opts) {
    const raw = String(text || "");
    if (!raw) return "";
    const options = opts || {};
    const sourceCard = options.cardId || "";
    const forceBoldSet = options.boldWords
      ? new Set(options.boldWords.map((w) => String(w).toLowerCase()))
      : null;

    // Split text keeping English words (including internal apostrophes/hyphens) distinct from punctuation/spaces
    const tokenRe = /([A-Za-z]+(?:['’\-][A-Za-z]+)*)/g;
    let out = "";
    let lastIdx = 0;
    let match;

    while ((match = tokenRe.exec(raw)) !== null) {
      if (match.index > lastIdx) {
        out += esc(raw.slice(lastIdx, match.index));
      }
      const tok = match[1];
      const info = lookupWord(tok);
      if (info && info.zh) {
        const isCore = Boolean(info.isCore || (forceBoldSet && forceBoldSet.has(tok.toLowerCase())));
        const prog = wordBox.getCoreProgress(info.lemma);
        const cls = [
          "fw-card",
          isCore ? "fw-core" : "fw-basic",
          prog.inBox ? "fw-in-box" : "",
          prog.mastered ? "fw-mastered" : ""
        ]
          .filter(Boolean)
          .join(" ");

        out +=
          `<span class="${cls}" role="button" tabindex="0" ` +
          `data-fw="${esc(tok)}" data-fw-lemma="${esc(info.lemma)}" data-fw-zh="${esc(info.zh)}" ` +
          `data-fw-core="${isCore ? "1" : "0"}"${sourceCard ? ` data-fw-card="${esc(sourceCard)}"` : ""}>` +
          `<span class="fw-inner">` +
          `<span class="fw-face fw-front">${esc(tok)}</span>` +
          `<span class="fw-face fw-back">` +
          `<span class="fw-zh">${esc(info.zh)}</span>` +
          `<span class="fw-info-dot" data-fw-info="1" aria-label="Word details">📖</span>` +
          `<span class="fw-timer-bar"></span>` +
          `</span></span></span>`;
      } else {
        out += esc(tok);
      }
      lastIdx = tokenRe.lastIndex;
    }

    if (lastIdx < raw.length) {
      out += esc(raw.slice(lastIdx));
    }
    return out;
  }

  function handleWordFlipActivation(cardEl, infoDotClicked) {
    if (!cardEl) return;
    const rawWord = cardEl.getAttribute("data-fw") || "";
    const lemma = cardEl.getAttribute("data-fw-lemma") || rawWord;
    const sourceCard = cardEl.getAttribute("data-fw-card") || "";
    const info = lookupWord(lemma) || lookupWord(rawWord);

    if (infoDotClicked) {
      if (window.SFX) window.SFX.pop();
      openWordDetailPopover(info, cardEl);
      return;
    }

    // If already flipped -> flip back right away
    if (cardEl.classList.contains("is-flipped")) {
      if (cardEl._flipTimer) {
        clearTimeout(cardEl._flipTimer);
        cardEl._flipTimer = null;
      }
      cardEl.classList.remove("is-flipped", "timer-paused");
      if (window.SFX) window.SFX.pop();
      return;
    }

    // Flip 3D to Chinese + instant 0ms en-US audio + record into My Word Box + schedule 3.6s flip-back!
    cardEl.classList.add("is-flipped", "fw-in-box");
    // Restart timer bar CSS animation cleanly
    const bar = cardEl.querySelector(".fw-timer-bar");
    if (bar) {
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
    }

    if (window.DoubaoTTS) {
      window.DoubaoTTS.speakWordFast(rawWord);
    }
    if (info) {
      wordBox.recordTap(info, sourceCard);
    }
    scheduleFlipBack(cardEl, FLIP_BACK_MS);
  }

  document.addEventListener("click", (e) => {
    const infoDot = e.target.closest(".fw-info-dot");
    const cardEl = e.target.closest(".fw-card");
    if (!cardEl) return;
    e.stopPropagation();
    handleWordFlipActivation(cardEl, Boolean(infoDot));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activePopover) {
      closeWordDetailPopover();
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("fw-card")) {
      e.preventDefault();
      handleWordFlipActivation(e.target, false);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    wordBox.updateTopBadge();
    const btn = document.getElementById("btnWordBox");
    if (btn) {
      btn.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        wordBox.openDrawer("learning");
      });
    }
  });

  window.FlipReader = {
    render: renderFlipText,
    lookup: lookupWord,
    openDetail: openWordDetailPopover,
    closeDetail: closeWordDetailPopover,
    getCoreMap,
    SVG_ICONS: CORE_SVG_ICONS,
    MASTER_HITS
  };
})();
