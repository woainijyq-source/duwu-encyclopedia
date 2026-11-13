// ============================================================================
// 升级模块 1：🐸「食物链借毒」生态喂食养成沙盒 (Dietary Sequestration Sandbox)
// 亲手喂养小箭毒蛙 / 小河鲀 / 虎斑颈槽蛇，零文字顿悟「毒素从食物链搬运而来」！
// ============================================================================

(function () {
  const CRITTERS = {
    frog: {
      id: "frog",
      tabLabel: "🐸 养小箭毒蛙",
      archiveId: "ch1-09",
      title: "黄金箭毒蛙宝宝 · 借毒穿衣记",
      bgTop: "#064e3b",
      bgBot: "#022c22",
      safeFoodBtn: "🪰 喂普通果蝇（无毒）",
      toxicFoodBtn: "🐜 喂雨林毒蚂蚁/甲虫！",
      predatorBtn: "🐍 放捕食小蛇来试探！",
      predatorEmoji: "🐍",
      meterLabel: "✨ 皮肤生物碱毒衣浓度",
      initHint: "🐣 刚孵化的箭毒蛙宝宝其实一点毒都没有！快喂它不同食物试试看！"
    },
    puffer: {
      id: "puffer",
      tabLabel: "🐡 养小河鲀鱼",
      archiveId: "ch6-01",
      title: "红鳍东方鲀宝宝 · 细菌盟友记",
      bgTop: "#0c4a6e",
      bgBot: "#082f49",
      safeFoodBtn: "🦐 喂纯净无菌饲料",
      toxicFoodBtn: "🦠 喂带海洋弧菌的藻贝！",
      predatorBtn: "🦈 放大鲨鱼来试探！",
      predatorEmoji: "🦈",
      meterLabel: "🐡 体内河鲀毒素 (TTX) 储量",
      initHint: "🌊 河鲀自己不会造毒！试试喂『无菌饲料』和『带海洋细菌的贝类』有什么差别！"
    },
    snake: {
      id: "snake",
      tabLabel: "🐍 养虎斑颈槽蛇",
      archiveId: "ch1-04",
      title: "虎斑颈槽蛇 · 脖子藏蟾蜍毒大师",
      bgTop: "#365314",
      bgBot: "#1a2e05",
      safeFoodBtn: "🐟 喂普通小鱼泥鳅",
      toxicFoodBtn: "🐸 喂中华蟾蜍（攒毒！）",
      predatorBtn: "🦅 放猛禽老鹰来试探！",
      predatorEmoji: "🦅",
      meterLabel: "🛡️ 脖子后方『颈腺』蟾蜍毒储量",
      initHint: "🐍 它嘴里有自己的毒牙，脖子后面还有空口袋！快喂它吃蟾蜍把储毒袋装满！"
    }
  };

  class EcosystemSandbox {
    constructor(canvas, onToast) {
      this.canvas = canvas;
      this.onToast = onToast;
      this.species = "frog";
      this.resetCritter();
      this.loop();
    }

    setSpecies(sp) {
      this.species = sp;
      this.resetCritter();
      if (this.onToast) this.onToast(CRITTERS[sp].initHint, 0);
    }

    resetCritter() {
      this.toxicity = 0;      // 0..100
      this.growth = 1.0;      // 1.0..1.45
      this.foods = [];
      this.absorbs = [];
      this.tongue = null;
      this.predator = null;   // { x, state: 'in'|'lick'|'flee'|'scare', timer }
      this.puffed = 0;
      this.scared = 0;
      this.coolTimer = 0;
    }

    feed(isToxicSource) {
      if (window.SFX) window.SFX.pop();
      const icon = this.species === "frog"
        ? (isToxicSource ? "🐜" : "🪰")
        : this.species === "puffer"
          ? (isToxicSource ? "🦠" : "🦐")
          : (isToxicSource ? "🐸" : "🐟");

      this.foods.push({
        x: 0.22 + Math.random() * 0.56,
        y: 0.16,
        vy: 0.004,
        toxic: isToxicSource,
        icon,
        eaten: false
      });
    }

    testPredator() {
      if (window.SFX) window.SFX.pop();
      this.predator = { x: 1.12, y: 0.54, state: "in", timer: 0 };
    }

    loop() {
      let tick = 0;
      const step = () => {
        tick++;
        if (this.canvas && this.canvas.offsetParent) {
          this.update(tick);
          this.draw(tick);
        }
        requestAnimationFrame(step);
      };
      step();
    }

    update(tick) {
      const cx = 0.45, cy = 0.62;

      // 舌头/捕食动作捕获食物
      if (!this.tongue && this.foods.length > 0) {
        const target = this.foods[0];
        if (target.y > 0.26) {
          this.tongue = { tx: target.x, ty: target.y, progress: 0, target };
        }
      }

      if (this.tongue) {
        this.tongue.progress += 0.14;
        if (this.tongue.progress >= 1 && !this.tongue.target.eaten) {
          const f = this.tongue.target;
          f.eaten = true;
          this.growth = Math.min(1.42, this.growth + 0.06);

          if (f.toxic) {
            this.toxicity = Math.min(100, this.toxicity + 35);
            if (window.SFX) window.SFX.chime();
            // 生成从肚子飘向皮肤/肝脏/颈腺的彩色毒素粒子
            for (let i = 0; i < 14; i++) {
              this.absorbs.push({
                x: cx,
                y: cy + 0.04,
                angle: (i / 14) * Math.PI * 2,
                life: 48
              });
            }
            const msg = this.species === "frog"
              ? `✨ 吸收毒虫生物碱！皮肤黄金毒衣升至 ${this.toxicity}%！`
              : this.species === "puffer"
                ? `🐡 吸收海洋细菌TTX！肝脏毒素储量升至 ${this.toxicity}%！`
                : `🐍 把蟾蜍毒素存进脖子后方颈腺啦！储量 ${this.toxicity}%！`;
            if (this.onToast) this.onToast(msg, this.toxicity);
          } else {
            if (this.onToast) {
              const msg = this.toxicity === 0
                ? "😋 吃饱长胖啦！但普通食物不含毒素原料，毒性依然是 0% 哦！"
                : `😋 美味果腹！当前毒素维持在 ${this.toxicity}%。`;
              this.onToast(msg, this.toxicity);
            }
          }
        }
        if (this.tongue.progress >= 2) {
          this.foods = this.foods.filter((x) => !x.eaten);
          this.tongue = null;
        }
      }

      this.foods.forEach((f) => {
        if (!f.eaten && f.y < 0.42) f.y += f.vy;
      });

      this.absorbs = this.absorbs.filter((a) => {
        a.life--;
        a.x += Math.cos(a.angle) * 0.003;
        a.y += Math.sin(a.angle) * 0.0025 - 0.001;
        return a.life > 0;
      });

      if (this.puffed > 0) this.puffed--;
      if (this.scared > 0) this.scared--;
      if (this.coolTimer > 0) this.coolTimer--;

      // 天敌试探状态机
      if (this.predator) {
        const p = this.predator;
        if (p.state === "in") {
          p.x -= 0.012;
          if (p.x <= 0.63) {
            p.state = "lick";
            p.timer = 36;
            if (this.toxicity >= 35) {
              if (window.SFX) window.SFX.chime();
              this.puffed = 95;
              this.coolTimer = 110;
              if (this.onToast) {
                this.onToast("😎 防御大成功！捕食者尝到警戒毒素，麻得掉头狂奔逃走啦！", this.toxicity);
              }
            } else {
              if (window.SFX) window.SFX.bonk();
              this.scared = 95;
              if (this.onToast) {
                this.onToast("😱 哎呀还没攒够毒素（<35%）！小家伙吓得直发抖，快喂它带毒食物吧！", this.toxicity);
              }
            }
          }
        } else if (p.state === "lick") {
          p.timer--;
          if (p.timer <= 0) {
            p.state = this.toxicity >= 35 ? "flee" : "leaveProud";
          }
        } else {
          p.x += 0.022;
          if (p.x > 1.2) this.predator = null;
        }
      }
    }

    draw(tick) {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(rect.width, 300);
      const h = Math.max(rect.height, 280);
      if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
      }
      const ctx = this.canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const conf = CRITTERS[this.species];
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, conf.bgTop);
      bg.addColorStop(1, conf.bgBot);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 绘制生态装饰（雨林大叶 / 珊瑚气泡 / 溪流苔石）
      this.drawHabitatDecor(ctx, w, h, tick);

      const cx = w * 0.45 + (this.scared > 0 ? Math.sin(tick * 0.8) * 6 : 0);
      const cy = h * 0.64 + Math.sin(tick * 0.06) * 4;

      // 伸舌头捕食动画
      if (this.tongue) {
        const ratio = this.tongue.progress <= 1 ? this.tongue.progress : 2 - this.tongue.progress;
        const tx = cx + (this.tongue.tx * w - cx) * ratio;
        const ty = cy + (this.tongue.ty * h - cy) * ratio;
        ctx.strokeStyle = "#f472b6";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      // 绘制主角小动物（随毒性 0% -> 100% 动态变色发光！）
      this.drawMainCritter(ctx, cx, cy, tick);

      // 毒素向皮肤/颈腺扩散光球
      this.absorbs.forEach((a) => {
        ctx.beginPath();
        ctx.arc(a.x * w, a.y * h, 6, 0, Math.PI * 2);
        ctx.fillStyle = this.species === "puffer" ? "#38bdf8" : "#fde047";
        ctx.fill();
      });

      // 绘制掉落的食物
      this.foods.forEach((f) => {
        if (f.eaten) return;
        ctx.font = "34px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(f.icon, f.x * w, f.y * h + Math.sin(tick * 0.15) * 4);
        if (f.toxic) {
          ctx.strokeStyle = "#fde047";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(f.x * w, f.y * h - 10, 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 绘制前来试探的天敌
      if (this.predator) {
        const px = this.predator.x * w;
        const py = this.predator.y * h;
        ctx.save();
        ctx.font = "68px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(conf.predatorEmoji, px, py);
        if (this.predator.state === "flee" || (this.predator.state === "lick" && this.toxicity >= 35)) {
          ctx.font = "900 15px -apple-system, 'PingFang SC', sans-serif";
          ctx.fillStyle = "#fde047";
          ctx.fillText("🤢 呸呸好毒！快逃！", px - 10, py - 58);
        } else if (this.predator.state === "lick" && this.toxicity < 35) {
          ctx.font = "900 15px -apple-system, 'PingFang SC', sans-serif";
          ctx.fillStyle = "#fda4af";
          ctx.fillText("😈 嘿嘿没毒嘛！", px - 10, py - 58);
        }
        ctx.restore();
      }
    }

    drawHabitatDecor(ctx, w, h, tick) {
      if (this.species === "puffer") {
        for (let i = 0; i < 10; i++) {
          const bx = ((i * 97) % w);
          const by = h - ((tick * 0.8 + i * 45) % h);
          ctx.strokeStyle = "rgba(125, 211, 252, 0.28)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(bx, by, 5 + (i % 4) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.ellipse(w * 0.45, h * 0.78, 130, 26, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawMainCritter(ctx, cx, cy, tick) {
      const scale = this.growth * (this.puffed > 0 && this.species === "puffer" ? 1.38 : 1);
      const toxRatio = this.toxicity / 100;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // 满毒发光警戒光环！
      if (this.toxicity > 0) {
        const aura = ctx.createRadialGradient(0, 0, 18, 0, 0, 68 + toxRatio * 26);
        const col = this.species === "puffer" ? "56, 189, 248" : (this.species === "frog" ? "250, 204, 21" : "74, 222, 128");
        aura.addColorStop(0, `rgba(${col}, ${0.22 + toxRatio * 0.48})`);
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, 92, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.species === "frog") {
        // 小箭毒蛙身体：从暗灰绿(无毒)平滑变身为亮丽黄金色(满毒)！
        const r = Math.round(110 + toxRatio * 145);
        const g = Math.round(155 + toxRatio * 65);
        const b = Math.round(95 - toxRatio * 80);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 8, 42, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 两只大蛙眼
        [-22, 22].forEach((ex) => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ex, -20, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(ex, -20, 6.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // 酷墨镜或害怕表情
        ctx.fillStyle = "#0f172a";
        ctx.font = "900 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(this.scared > 0 ? "﹏" : "‿", 0, 4);
        if (this.coolTimer > 0) {
          ctx.font = "28px sans-serif";
          ctx.fillText("🕶️", 0, -12);
        }
      } else if (this.species === "puffer") {
        // 小河鲀：受惊或满毒测试时鼓成大刺球！
        const rad = this.puffed > 0 ? 48 : 36;
        ctx.fillStyle = toxRatio > 0.3 ? "#38bdf8" : "#94a3b8";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 肚皮白半圆
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(0, 6, rad * 0.72, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.fill();

        // 鼓气尖刺
        if (this.puffed > 0) {
          for (let a = 0; a < 12; a++) {
            const ang = (a / 12) * Math.PI * 2;
            ctx.strokeStyle = "#fde047";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
            ctx.lineTo(Math.cos(ang) * (rad + 11), Math.sin(ang) * (rad + 11));
            ctx.stroke();
          }
        }
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(-14, -10, 5, 0, Math.PI * 2);
        ctx.arc(14, -10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "900 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("嘟", 0, 2);
      } else {
        // 虎斑颈槽蛇：清晰画出脖子后面的发光储毒颈腺！
        ctx.strokeStyle = "#65a30d";
        ctx.lineWidth = 22;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-55, 22);
        ctx.quadraticCurveTo(-15, 34, 10, -4);
        ctx.quadraticCurveTo(22, -26, 36, -24);
        ctx.stroke();

        // 脖子后方的『颈腺储毒囊』（随吃蟾蜍变亮变鼓！）
        ctx.fillStyle = toxRatio > 0 ? `rgba(250, 204, 21, ${0.35 + toxRatio * 0.65})` : "rgba(255,255,255,0.2)";
        ctx.strokeStyle = toxRatio > 0 ? "#ef4444" : "#cbd5e1";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(16, -22, 14 + toxRatio * 6, 8 + toxRatio * 4, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "800 11px -apple-system, 'PingFang SC', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(toxRatio > 0 ? `颈腺毒囊 ${this.toxicity}%` : "空颈腺袋", 12, -38);

        // 蛇头眼睛
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(38, -26, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  window.EcosystemSandboxModule = {
    CRITTERS,
    EcosystemSandbox
  };
})();
