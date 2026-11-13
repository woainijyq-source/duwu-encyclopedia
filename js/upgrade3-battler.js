// ============================================================================
// 升级模块 3：🃏「大百科 99 王牌生化属性对战」(Bio-Chem Trump Card Battler)
// 支持【🤖 挑战科学博士 AI】与【👨‍👧 父女同屏双人暗置出牌 PK】！
// 零长文规则：真身实拍卡 + 4大科学战术神卡（沸水锅/胃酸剪刀/突变护盾/化毒为药）
// ============================================================================

(function () {
  const HEAT_LABILE_IDS = new Set([
    "ch1-01", "ch1-02", "ch1-04", "ch1-05", "ch1-06", "ch1-07", "ch1-08",
    "ch1-10", "ch1-11", "ch2-01", "ch2-02", "ch2-03", "ch3-18",
    "ch4-02", "ch6-03", "ch6-04", "ch6-05", "ch6-10", "ch6-12",
    "ch6-13", "ch6-14", "ch6-15", "ch6-16", "ch6-17"
  ]);

  const MEDICINAL_IDS = new Set([
    "ch1-01", "ch1-05", "ch1-06", "ch2-02", "ch2-05", "ch2-10",
    "ch3-06", "ch3-07", "ch3-08", "ch3-10", "ch3-11", "ch6-01",
    "ch6-07", "ch7-02"
  ]);

  const TACTICAL_CARDS = [
    {
      uid: "tac_pepsin",
      isTactical: true,
      tacType: "pepsin",
      emoji: "✂️",
      name: "胃蛋白酶大剪刀",
      tag: "秒杀 🗡️蛋白注射毒",
      sub: "遇到小分子会崩牙！",
      color: "#fbbf24"
    },
    {
      uid: "tac_boil",
      isTactical: true,
      tacType: "boil",
      emoji: "🍲",
      name: "100°C 沸水锅",
      tag: "秒杀 ❄️怕热蛋白",
      sub: "煮不烂双环锁/矿物！",
      color: "#fb7185"
    },
    {
      uid: "tac_shield",
      isTactical: true,
      tacType: "shield",
      emoji: "🧬",
      name: "自体受体突变盾",
      tag: "反弹 ⚡神经毒素",
      sub: "箭毒蛙防身秘技！",
      color: "#38bdf8"
    },
    {
      uid: "tac_med",
      isTactical: true,
      tacType: "med",
      emoji: "💊",
      name: "化毒为药反转卡",
      tag: "收服 💊入药/王牌毒",
      sub: "成功还能回 +1❤️！",
      color: "#4ade80"
    }
  ];

  function calcPower(item) {
    const r = item.radar || [75, 50, 50, 60, 60];
    const peak = Math.max(r[0] || 60, r[1] || 60, r[2] || 60);
    const avg = Math.round(((r[0] || 50) + (r[1] || 50) + (r[2] || 50)) / 9);
    const bonusMap = {
      "ch1-07": 7, "ch6-08": 6, "ch1-09": 6, "ch6-01": 5,
      "ch5-01": 5, "ch6-15": 6, "ch1-06": 5, "ch3-01": 4, "ch6-07": 4
    };
    return Math.min(99, Math.max(62, Math.round(peak * 0.84 + avg + (bonusMap[item.id] || 0))));
  }

  function buildCreatureCard(item) {
    const isProteinVenom = item.strategy === "venom" && item.id !== "ch6-08";
    const heatLabile = HEAT_LABILE_IDS.has(item.id);
    const isMed = MEDICINAL_IDS.has(item.id);
    return {
      uid: "c_" + item.id + "_" + Math.random().toString(36).slice(2, 6),
      isTactical: false,
      id: item.id,
      code: item.code.replace("第", "").replace("章 · 档案", "-"),
      name: item.name,
      emoji: item.emoji,
      mech: item.mech,
      strategy: item.strategy,
      isProteinVenom,
      heatLabile,
      isMed,
      power: calcPower(item),
      molecule: item.molecule
    };
  }

  class CardBattlerArena {
    constructor(container, helpers) {
      this.container = container;
      this.ruby = helpers.ruby || ((s) => s);
      this.getPhoto = helpers.getPhoto || (() => null);
      this.speak = helpers.speak || (() => {});
      this.onWinStars = helpers.onWinStars || (() => {});
      this.onOpenCard = helpers.onOpenCard || (() => {});

      this.mode = "ai"; // 'ai' | 'pvp'
      this.startNewMatch();
    }

    setMode(mode) {
      this.mode = mode;
      this.startNewMatch();
    }

    drawCreature() {
      const pool = (window.CATALOG_DATA || []).filter((x) => x.chapter !== "ch0");
      const pick = pool[Math.floor(Math.random() * pool.length)];
      return buildCreatureCard(pick);
    }

    drawTactical(excludeTypes) {
      const avail = TACTICAL_CARDS.filter((t) => !excludeTypes.has(t.tacType));
      const base = avail.length ? avail[Math.floor(Math.random() * avail.length)] : TACTICAL_CARDS[0];
      return Object.assign({}, base, { uid: base.uid + "_" + Math.random().toString(36).slice(2, 6) });
    }

    refillHand(hand) {
      while (hand.filter((c) => !c.isTactical).length < 3) {
        hand.push(this.drawCreature());
      }
      const existingTac = new Set(hand.filter((c) => c.isTactical).map((c) => c.tacType));
      while (hand.filter((c) => c.isTactical).length < 2) {
        const tc = this.drawTactical(existingTac);
        existingTac.add(tc.tacType);
        hand.push(tc);
      }
      return hand;
    }

    startNewMatch() {
      this.topHP = 5;
      this.botHP = 5;
      this.maxHP = 5;
      this.round = 1;
      this.phase = this.mode === "pvp" ? "p1_pick" : "bot_pick";
      // phases:
      // 'ai': 'bot_pick' -> 'clash' -> 'gameover'
      // 'pvp': 'p1_pick' (爸爸选牌暗置) -> 'p2_pick' (女儿选牌亮剑) -> 'clash' -> 'gameover'
      this.topPicked = null;
      this.botPicked = null;
      this.lastOutcome = null;
      this.topHand = this.refillHand([]);
      this.botHand = this.refillHand([]);
      this.render();
    }

    // 核心生化相克裁判引擎！
    resolveClash(topCard, botCard) {
      // 双方都出战术卡
      if (topCard.isTactical && botCard.isTactical) {
        return {
          winner: "draw",
          badge: "⚡ 科学道具大碰撞 · 平局！",
          verdict: `双方同时亮出【${topCard.name}】与【${botCard.name}】，能量互相抵消！`,
          healBot: 0,
          healTop: 0
        };
      }

      // 检验单方战术卡对生物卡的真实生化克制
      if (botCard.isTactical && !topCard.isTactical) {
        const res = this.evalTacticalVsCreature(botCard, topCard, "小馆长", "对手");
        return {
          winner: res.tacWins ? "bot" : "top",
          badge: res.badge,
          verdict: res.verdict,
          healBot: res.heal ? 1 : 0,
          healTop: 0
        };
      }

      if (topCard.isTactical && !botCard.isTactical) {
        const topName = this.mode === "pvp" ? "爸爸" : "科学博士";
        const res = this.evalTacticalVsCreature(topCard, botCard, topName, "小馆长");
        return {
          winner: res.tacWins ? "top" : "bot",
          badge: res.badge,
          verdict: res.verdict,
          healBot: 0,
          healTop: res.heal ? 1 : 0
        };
      }

      // 双方都是大百科真实物种/植物/矿物王牌！计算属性克制 + 战力值
      let topScore = topCard.power;
      let botScore = botCard.power;
      let bonusNote = "";

      const topGroup = this.mechGroup(topCard.mech);
      const botGroup = this.mechGroup(botCard.mech);

      if (botGroup === "neuro" && topGroup === "blood") {
        botScore += 12;
        bonusNote = "（⚡神经闪电克🩸溶血 +12！）";
      } else if (botGroup === "blood" && topGroup === "cell") {
        botScore += 12;
        bonusNote = "（🩸血液风暴克🏭细胞 +12！）";
      } else if (botGroup === "cell" && topGroup === "neuro") {
        botScore += 12;
        bonusNote = "（🛡️铁锁刺甲克⚡神经 +12！）";
      } else if (topGroup === "neuro" && botGroup === "blood") {
        topScore += 12;
        bonusNote = "（对手⚡神经克🩸血液 +12！）";
      } else if (topGroup === "blood" && botGroup === "cell") {
        topScore += 12;
        bonusNote = "（对手🩸血液克🏭细胞 +12！）";
      } else if (topGroup === "cell" && botGroup === "neuro") {
        topScore += 12;
        bonusNote = "（对手🛡️铁锁刺甲克⚡神经 +12！）";
      }

      if (botScore > topScore) {
        return {
          winner: "bot",
          badge: `🏆 ${botCard.name} (${botScore}) 击败 ${topCard.name} (${topScore})！`,
          verdict: `${botCard.emoji}【${botCard.name}】祭出「${botCard.molecule.split(" ")[0]}」压制全场！${bonusNote}`,
          healBot: 0,
          healTop: 0
        };
      } else if (topScore > botScore) {
        return {
          winner: "top",
          badge: `💥 ${topCard.name} (${topScore}) 压制 ${botCard.name} (${botScore})！`,
          verdict: `${topCard.emoji}【${topCard.name}】威力高达 ${topScore} 点！下次试试用相克的科学道具卡反击它！${bonusNote}`,
          healBot: 0,
          healTop: 0
        };
      }
      return {
        winner: "draw",
        badge: `🤝 战力同为 ${botScore} · 势均力敌！`,
        verdict: `【${botCard.name}】与【${topCard.name}】旗鼓相当，平分秋色！`,
        healBot: 0,
        healTop: 0
      };
    }

    mechGroup(mech) {
      if (mech === "neuro") return "neuro";
      if (mech === "blood") return "blood";
      return "cell";
    }

    evalTacticalVsCreature(tac, creature, userLabel, foeLabel) {
      if (tac.tacType === "pepsin") {
        if (creature.isProteinVenom) {
          return {
            tacWins: true,
            heal: false,
            badge: "✂️ 生化暴击！胃蛋白酶剪碎毒蛋白！",
            verdict: `咔嚓咔嚓！${creature.name}是【🗡️主动注射型大分子蛋白】，被${userLabel}的胃蛋白酶剪成了无害氨基酸碎片！`
          };
        }
        return {
          tacWins: false,
          heal: false,
          badge: "💫 剪刀崩牙啦！小分子不怕胃蛋白酶！",
          verdict: `哎哟！${creature.name}靠的是【${creature.id === "ch6-08" ? "小分子河鲀毒素TTX" : "小分子生物碱/环肽/矿物"}】，胃蛋白酶根本咬不动它！`
        };
      }

      if (tac.tacType === "boil") {
        if (creature.heatLabile) {
          return {
            tacWins: true,
            heal: false,
            badge: "🍲 100°C 煮沸立功！怕热毒蛋白散架啦！",
            verdict: `咕嘟咕嘟！${creature.name}的毒素怕高温，被 100°C 沸水煮得彻底变性失活啦！`
          };
        }
        return {
          tacWins: false,
          heal: false,
          badge: "☠️ 沸水无效！它的分子铁锁煮不烂！",
          verdict: `糟糕！${creature.name}的毒素结构极其结实（或矿物受热更危险），100°C 沸水完全拆不动它！`
        };
      }

      if (tac.tacType === "shield") {
        if (creature.mech === "neuro") {
          return {
            tacWins: true,
            heal: false,
            badge: "🧬 突变护盾大反弹！神经毒素找不到锁孔！",
            verdict: `就像箭毒蛙不怕自己的毒一样，${userLabel}把离子通道改了形状，${creature.name}的神经毒素扑了个空！`
          };
        }
        const winByPower = 78 >= creature.power;
        return {
          tacWins: winByPower,
          heal: false,
          badge: winByPower ? "🛡️ 护盾硬扛成功！" : "💥 护盾被非神经毒素攻破！",
          verdict: `${creature.name}攻击的是【${creature.mech === "blood" ? "血液系统" : "细胞工厂"}】，不走神经通道锁孔哦！`
        };
      }

      // tac.tacType === "med"
      if (creature.isMed || creature.power >= 88) {
        return {
          tacWins: true,
          heal: true,
          badge: "💊 化毒为药大反转！回血 +1❤️ 并反败为胜！",
          verdict: `帕拉塞尔苏斯奇迹！${userLabel}把剧毒【${creature.name}】稀释到微克黄金剂量，炼成了救命神药，还恢复了 1 颗红心！`
        };
      }
      return {
        tacWins: 80 >= creature.power,
        heal: false,
        badge: 80 >= creature.power ? "💊 炼金射线险胜！" : "💥 剂量失控被反击！",
        verdict: `这张卡还没开发出经典药物，挡不住威力 ${creature.power} 的【${creature.name}】！`
      };
    }

    pickAICard() {
      // 科学博士 AI 兼具趣味与适度聪明（给小朋友留足用科学克制获胜的爽感！）
      return this.topHand[Math.floor(Math.random() * this.topHand.length)];
    }

    onSelectTopCard(uid) {
      if (this.mode !== "pvp" || this.phase !== "p1_pick") return;
      const idx = this.topHand.findIndex((c) => c.uid === uid);
      if (idx === -1) return;
      if (window.SFX) window.SFX.pop();
      this.topPicked = this.topHand.splice(idx, 1)[0];
      this.phase = "p2_pick";
      this.render();
    }

    onSelectBotCard(uid) {
      if (this.mode === "ai" && this.phase !== "bot_pick") return;
      if (this.mode === "pvp" && this.phase !== "p2_pick") return;

      const idx = this.botHand.findIndex((c) => c.uid === uid);
      if (idx === -1) return;
      this.botPicked = this.botHand.splice(idx, 1)[0];

      if (this.mode === "ai") {
        const aiCard = this.pickAICard();
        this.topHand = this.topHand.filter((c) => c.uid !== aiCard.uid);
        this.topPicked = aiCard;
      }

      this.executeClash();
    }

    executeClash() {
      const out = this.resolveClash(this.topPicked, this.botPicked);
      this.lastOutcome = out;

      if (out.winner === "bot") {
        this.topHP = Math.max(0, this.topHP - 1);
        if (out.healBot) this.botHP = Math.min(this.maxHP, this.botHP + 1);
        if (window.SFX) window.SFX.chime();
      } else if (out.winner === "top") {
        this.botHP = Math.max(0, this.botHP - 1);
        if (out.healTop) this.topHP = Math.min(this.maxHP, this.topHP + 1);
        if (window.SFX) window.SFX.bonk();
      } else {
        if (window.SFX) window.SFX.pop();
      }

      this.speak(out.verdict);

      if (this.topHP <= 0 || this.botHP <= 0) {
        this.phase = "gameover";
        if (this.botHP > 0) {
          this.onWinStars(5);
        } else if (this.mode === "pvp") {
          this.onWinStars(3);
        }
      } else {
        this.phase = "clash";
      }

      this.render();
    }

    nextRound() {
      if (window.SFX) window.SFX.pop();
      this.round++;
      this.topPicked = null;
      this.botPicked = null;
      this.lastOutcome = null;
      this.refillHand(this.topHand);
      this.refillHand(this.botHand);
      this.phase = this.mode === "pvp" ? "p1_pick" : "bot_pick";
      this.render();
    }

    renderHearts(hp) {
      let s = "";
      for (let i = 0; i < this.maxHP; i++) {
        s += `<span style="font-size:1.35rem;filter:${i < hp ? "none" : "grayscale(1) opacity(0.28)"};">❤️</span>`;
      }
      return s;
    }

    renderCardHTML(card, side, interactive, hiddenBack) {
      if (hiddenBack) {
        return `
          <div class="battle-card back-card">
            <div style="font-size:2.3rem;">🎴</div>
            <div style="font-size:0.78rem;font-weight:900;color:#94a3b8;">神秘手牌</div>
          </div>
        `;
      }

      if (card.isTactical) {
        return `
          <button class="battle-card tactical-card ${interactive ? "playable" : ""}" data-side="${side}" data-uid="${card.uid}" style="--tac-color:${card.color};" ${interactive ? "" : "disabled"}>
            <div class="bcard-top-tag" style="background:${card.color};color:#06131f;">⚡ 科学战术卡</div>
            <div class="bcard-tac-icon">${card.emoji}</div>
            <div class="bcard-name">${card.name}</div>
            <div class="bcard-tac-rule">${card.tag}</div>
            <div class="bcard-tac-sub">${card.sub}</div>
          </button>
        `;
      }

      const ph = this.getPhoto(card.id);
      const stratBadge = card.isProteinVenom
        ? `<span class="bchip venom">🗡️蛋白毒</span>`
        : card.strategy === "poison"
          ? `<span class="bchip poison">🛡️小分子</span>`
          : `<span class="bchip mineral">💎奇石</span>`;
      const heatBadge = card.heatLabile
        ? `<span class="bchip cold">❄️怕沸水</span>`
        : `<span class="bchip fire">🔥耐高温</span>`;

      return `
        <button class="battle-card creature-card ${interactive ? "playable" : ""}" data-side="${side}" data-uid="${card.uid}" data-arch="${card.id}" ${interactive ? "" : "disabled"}>
          <div class="bcard-photo-wrap">
            ${ph ? `<img src="${ph}" alt="${card.name}" loading="lazy" />` : `<div style="font-size:2.6rem;">${card.emoji}</div>`}
            <span class="bcard-power">⚔️ ${card.power}</span>
            <span class="bcard-code">${card.code}${card.isMed ? " 💊" : ""}</span>
          </div>
          <div class="bcard-body">
            <div class="bcard-name">${card.emoji} ${this.ruby(card.name)}</div>
            <div class="bcard-chips">${stratBadge}${heatBadge}</div>
          </div>
        </button>
      `;
    }

    render() {
      if (!this.container) return;
      const topLabel = this.mode === "pvp" ? "👨 1P 爸爸选手" : "🤖 斋藤科学博士 AI";
      const botLabel = this.mode === "pvp" ? "👧 2P 小馆长选手" : "👧 毒物小馆长（我）";

      const topInteractive = this.mode === "pvp" && this.phase === "p1_pick";
      const botInteractive = (this.mode === "ai" && this.phase === "bot_pick") || (this.mode === "pvp" && this.phase === "p2_pick");
      const hideTopHand = this.mode === "ai" || (this.mode === "pvp" && this.phase !== "p1_pick");

      let centerHTML = "";
      if (this.phase === "p1_pick") {
        centerHTML = `
          <div class="clash-prompt">
            <div style="font-size:2rem;">👨👆</div>
            <div><strong>第 ${this.round} 回合 · 请【爸爸】先点选上方一张手牌！</strong><br/><span style="font-size:0.86rem;color:var(--text-muted);">（选好后会背面盖在桌上，不怕被偷看哦！）</span></div>
          </div>
        `;
      } else if (this.phase === "p2_pick") {
        centerHTML = `
          <div class="clash-stage-duel">
            <div class="battle-card back-card locked-in">
              <div style="font-size:2.5rem;">🎴</div>
              <div style="font-weight:900;color:#fbbf24;">爸爸已暗置出牌！</div>
            </div>
            <div class="vs-spark">⚡VS⚡</div>
            <div class="clash-wait-slot">👧👆 轮到小馆长点下方手牌亮剑！</div>
          </div>
        `;
      } else if (this.phase === "bot_pick") {
        centerHTML = `
          <div class="clash-prompt">
            <div style="font-size:2.1rem;">🃏⚔️</div>
            <div>
              <strong>第 ${this.round} 回合 · 点下方任意一张王牌或科学道具卡出战！</strong>
              <div style="font-size:0.84rem;color:var(--text-muted);margin-top:3px;">
                秘诀：✂️胃蛋白酶克【🗡️蛋白毒】 · 🍲沸水锅克【❄️怕沸水】 · 🧬突变盾克【⚡神经毒】 · 💊反转卡收服【💊入药王牌】！
              </div>
            </div>
          </div>
        `;
      } else if (this.phase === "clash" || this.phase === "gameover") {
        const out = this.lastOutcome;
        const winBannerColor = out.winner === "bot" ? "#4ade80" : out.winner === "top" ? "#fb7185" : "#fbbf24";
        centerHTML = `
          <div class="clash-stage-duel">
            <div class="clash-card-wrap ${out.winner === "top" ? "winner-glow" : ""}">
              <div class="clash-owner-tag">${topLabel}</div>
              ${this.renderCardHTML(this.topPicked, "clash", false, false)}
            </div>
            <div class="vs-spark">💥</div>
            <div class="clash-card-wrap ${out.winner === "bot" ? "winner-glow" : ""}">
              <div class="clash-owner-tag">${botLabel}</div>
              ${this.renderCardHTML(this.botPicked, "clash", false, false)}
            </div>
          </div>

          <div class="clash-verdict-box" style="border-color:${winBannerColor};">
            <div style="font-weight:900;font-size:1.08rem;color:${winBannerColor};">${out.badge}</div>
            <div style="font-weight:700;font-size:0.95rem;margin-top:4px;">${this.ruby(out.verdict)}</div>
            <div style="margin-top:10px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              ${
                this.phase === "gameover"
                  ? `<button class="big-action-btn" id="btnBattleRematch">🏆 ${this.botHP > 0 ? "小馆长大获全胜！再来一局" : (this.mode === "pvp" ? "爸爸险胜！再来一局" : "再战科学博士！")} 🔄</button>`
                  : `<button class="big-action-btn" id="btnBattleNextRound">下一回合（第 ${this.round + 1} 战）➜</button>`
              }
            </div>
          </div>
        `;
      }

      this.container.innerHTML = `
        <div class="battler-shell">
          <!-- 顶部模式切换栏 -->
          <div class="battler-topbar">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="magic-pill ${this.mode === "ai" ? "active" : ""}" data-bmode="ai">🤖 单人挑战科学博士</button>
              <button class="magic-pill ${this.mode === "pvp" ? "active" : ""}" data-bmode="pvp">👨‍👧 父女 iPad 同屏双人对战</button>
            </div>
            <button class="mini-btn" id="btnResetMatch">🔄 重新洗牌开局</button>
          </div>

          <!-- 上方选手区 -->
          <div class="player-zone top-zone ${topInteractive ? "active-turn" : ""}">
            <div class="player-hud">
              <span style="font-weight:900;font-size:1.05rem;">${topLabel}</span>
              <div>${this.renderHearts(this.topHP)}</div>
            </div>
            <div class="hand-row">
              ${this.topHand.map((c) => this.renderCardHTML(c, "top", topInteractive, hideTopHand)).join("")}
            </div>
          </div>

          <!-- 中央碰撞竞技台 -->
          <div class="center-clash-arena">
            ${centerHTML}
          </div>

          <!-- 下方小馆长选手区 -->
          <div class="player-zone bot-zone ${botInteractive ? "active-turn" : ""}">
            <div class="player-hud">
              <span style="font-weight:900;font-size:1.05rem;">${botLabel} ${botInteractive ? "👈 请出牌！" : ""}</span>
              <div>${this.renderHearts(this.botHP)}</div>
            </div>
            <div class="hand-row">
              ${this.botHand.map((c) => this.renderCardHTML(c, "bot", botInteractive, false)).join("")}
            </div>
          </div>
        </div>
      `;

      // 事件绑定
      this.container.querySelectorAll("[data-bmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.setMode(btn.getAttribute("data-bmode"));
        });
      });

      const resetBtn = this.container.querySelector("#btnResetMatch");
      if (resetBtn) resetBtn.addEventListener("click", () => {
        if (window.SFX) window.SFX.pop();
        this.startNewMatch();
      });

      this.container.querySelectorAll('.battle-card.playable[data-side="top"]').forEach((el) => {
        el.addEventListener("click", () => this.onSelectTopCard(el.getAttribute("data-uid")));
      });

      this.container.querySelectorAll('.battle-card.playable[data-side="bot"]').forEach((el) => {
        el.addEventListener("click", () => this.onSelectBotCard(el.getAttribute("data-uid")));
      });

      // 对决展示阶段点击生物卡可直接查看它的 3D 分子档案！
      this.container.querySelectorAll('.battle-card[data-side="clash"][data-arch]').forEach((el) => {
        el.style.cursor = "pointer";
        el.removeAttribute("disabled");
        el.addEventListener("click", () => this.onOpenCard(el.getAttribute("data-arch")));
      });

      const nextBtn = this.container.querySelector("#btnBattleNextRound");
      if (nextBtn) nextBtn.addEventListener("click", () => this.nextRound());

      const rematchBtn = this.container.querySelector("#btnBattleRematch");
      if (rematchBtn) rematchBtn.addEventListener("click", () => this.startNewMatch());
    }
  }

  window.CardBattlerModule = {
    CardBattlerArena
  };
})();
