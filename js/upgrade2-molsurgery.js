// ============================================================================
// 升级模块 2：🔑 分子锁孔拼图 & 官能团拆弹手术台 (Molecular Lock & Surgery Toy)
// 亲手旋转拖拽河鲀毒素插锁孔、亲手剪掉乌头碱危险基团、亲眼对比100°C沸水拆锁！
// ============================================================================

(function () {
  class MolecularSurgeryWorkbench {
    constructor(canvas, onToast, onWinStars) {
      this.canvas = canvas;
      this.onToast = onToast;
      this.onWinStars = onWinStars;
      this.mode = "ttx_lock"; // 'ttx_lock' | 'aconitine_surgery' | 'boil_duel'
      this.dragging = false;
      this.resetMode("ttx_lock");
      this.bindPointer();
      this.loop();
    }

    resetMode(mode) {
      this.mode = mode;
      if (mode === "ttx_lock") {
        this.keyX = 0.25;
        this.keyY = 0.52;
        this.flipped = true; // 初始故意反着放，让小朋友发现方向秘密！
        this.locked = false;
        this.bounceTimer = 0;
        this.toast("🔑 试试用手指把左边的『河鲀毒素』拖进右边的细胞城门锁孔！（注意看正负电方向哦！）");
      } else if (mode === "aconitine_surgery") {
        this.group1Cut = false; // 乙酰基
        this.group2Cut = false; // 苯甲酰基
        this.steamBursts = [];
        this.toast("💨🔥 点击乌头碱头顶两个发光的『红色危险挂件』，用水蒸气水解剪掉它们！");
      } else if (mode === "boil_duel") {
        this.temp = 25; // 25°C -> 100°C
        this.boiling = false;
        this.toast("🔥 点击『点火煮沸到 100°C』按钮，看看左边的四季豆蛋白和右边的白鹅膏铁锁谁会散架！");
      }
    }

    toast(msg) {
      if (this.onToast) this.onToast(msg);
    }

    flipTTX() {
      if (this.mode !== "ttx_lock" || this.locked) return;
      this.flipped = !this.flipped;
      if (window.SFX) window.SFX.pop();
      this.toast(this.flipped
        ? "🔄 现在胖笼子朝右、蓝色正电头朝左——再去塞锁孔试试？"
        : "✨ 对啦！蓝色『+NH₂ 正电钥匙头』朝向了右边的『-COO⁻ 负电锁孔』，快拖过去吸住它！");
    }

    toggleBoil() {
      if (this.mode !== "boil_duel") return;
      this.boiling = !this.boiling;
      if (this.boiling && window.SFX) window.SFX.sizzle();
    }

    bindPointer() {
      const getNorm = (e) => {
        const r = this.canvas.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx - r.left) / r.width, y: (cy - r.top) / r.height };
      };

      const onDown = (e) => {
        const p = getNorm(e);
        if (this.mode === "ttx_lock" && !this.locked) {
          if (Math.hypot(p.x - this.keyX, p.y - this.keyY) < 0.16) {
            this.dragging = true;
          }
        } else if (this.mode === "aconitine_surgery") {
          // 检测点击两个红色酯基挂件：(0.34, 0.30) 与 (0.64, 0.30)
          if (!this.group1Cut && Math.hypot(p.x - 0.34, p.y - 0.31) < 0.12) {
            this.group1Cut = true;
            this.spawnSteam(0.34, 0.31);
            this.checkAconitineDone();
          } else if (!this.group2Cut && Math.hypot(p.x - 0.64, p.y - 0.31) < 0.12) {
            this.group2Cut = true;
            this.spawnSteam(0.64, 0.31);
            this.checkAconitineDone();
          }
        }
      };

      const onMove = (e) => {
        if (!this.dragging || this.mode !== "ttx_lock" || this.locked) return;
        if (e.cancelable) e.preventDefault();
        const p = getNorm(e);
        this.keyX = Math.max(0.14, Math.min(0.75, p.x));
        this.keyY = Math.max(0.22, Math.min(0.80, p.y));

        // 检测靠近右侧钠离子城门锁孔 (0.68, 0.52)
        if (Math.hypot(this.keyX - 0.62, this.keyY - 0.52) < 0.10) {
          if (!this.flipped) {
            // 方向正确：正负电荷咔哒吸合！
            this.locked = true;
            this.dragging = false;
            this.keyX = 0.60;
            this.keyY = 0.52;
            if (window.SFX) window.SFX.chime();
            if (this.onWinStars) this.onWinStars(3, "ttx_lock");
            this.toast("🎉 咔哒锁死！正电胍基(+NH₂)吸住负电门框，胖笼子完美堵死城门，钠离子进不去啦！");
          } else {
            // 方向反了：胖笼子撞门弹飞！
            this.dragging = false;
            this.keyX = 0.26;
            this.bounceTimer = 30;
            if (window.SFX) window.SFX.bonk();
            this.toast("💥 哎哟弹飞啦！胖笼子太大塞不进窄门，快点下方『🔄 翻转钥匙方向』按钮！");
          }
        }
      };

      const onUp = () => { this.dragging = false; };

      this.canvas.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      this.canvas.addEventListener("touchstart", onDown, { passive: true });
      this.canvas.addEventListener("touchmove", onMove, { passive: false });
      this.canvas.addEventListener("touchend", onUp);
    }

    spawnSteam(nx, ny) {
      if (window.SFX) window.SFX.sizzle();
      for (let i = 0; i < 12; i++) {
        this.steamBursts.push({
          x: nx, y: ny,
          vx: (Math.random() - 0.5) * 0.014,
          vy: -0.005 - Math.random() * 0.01,
          life: 40
        });
      }
    }

    checkAconitineDone() {
      if (this.group1Cut && this.group2Cut) {
        if (window.SFX) window.SFX.chime();
        if (this.onWinStars) this.onWinStars(3, "aconitine_surgery");
        this.toast("🎉 拆弹成功！两个危险酯基全被水分子换成了温和羟基(-OH)，毒性暴降 1000 倍，心跳恢复平稳啦！");
      } else {
        this.toast("✂️ 已剪掉 1 个危险挂件！再点掉右边那颗红色炸弹挂件试试！");
      }
    }

    loop() {
      let tick = 0;
      const step = () => {
        tick++;
        if (this.canvas && this.canvas.offsetParent) {
          this.draw(tick);
        }
        requestAnimationFrame(step);
      };
      step();
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

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (this.mode === "ttx_lock") {
        this.drawTTXLockGame(ctx, w, h, tick);
      } else if (this.mode === "aconitine_surgery") {
        this.drawAconitineSurgery(ctx, w, h, tick);
      } else {
        this.drawBoilDuel(ctx, w, h, tick);
      }
    }

    drawTTXLockGame(ctx, w, h, tick) {
      if (this.bounceTimer > 0) this.bounceTimer--;
      const lockX = w * 0.72, lockY = h * 0.52;

      // 右侧：钠离子通道城门凹槽（带红色负电荷 -COO⁻ 磁铁吸盘）
      ctx.fillStyle = "#14b8a6";
      ctx.beginPath();
      ctx.roundRect(lockX - 18, lockY - 105, 95, 72, 16);
      ctx.roundRect(lockX - 18, lockY + 33, 95, 72, 16);
      ctx.fill();

      // 窄滤孔凹槽
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.roundRect(lockX + 18, lockY - 28, 36, 56, 10);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("➖负电锁孔", lockX + 36, lockY + 5);
      ctx.fillText("⚡钠离子城门", lockX + 30, lockY - 114);

      // 门外焦急排队的 Na+ 金球
      for (let i = 0; i < 4; i++) {
        const ix = this.locked ? w * (0.14 + i * 0.07) : w * (0.45 + Math.sin(tick * 0.05 + i) * 0.04);
        const iy = h * (0.18 + (i % 2) * 0.66);
        ctx.beginPath();
        ctx.arc(ix, iy, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "900 10px sans-serif";
        ctx.fillText("Na⁺", ix, iy + 4);
      }

      // 左侧可拖拽的 TTX 分子钥匙拼图块
      const shake = this.bounceTimer > 0 ? Math.sin(tick * 1.2) * 8 : 0;
      const kx = this.keyX * w + shake;
      const ky = this.keyY * h;

      ctx.save();
      ctx.translate(kx, ky);
      if (this.flipped) ctx.scale(-1, 1);

      // 胖金刚烷笼子后座（左）
      ctx.fillStyle = "#f43f5e";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-24, 0, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 窄正电荷胍基钥匙尖（右）
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(10, -20, 40, 40, 10);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // 保持正立不镜像的文字标注
      const cageX = this.flipped ? kx + 24 : kx - 24;
      const tipX = this.flipped ? kx - 30 : kx + 30;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 12px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🛑胖笼子", cageX, ky + 4);
      ctx.fillText("➕胍基头", tipX, ky + 4);

      if (!this.locked) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "700 13px -apple-system, 'PingFang SC', sans-serif";
        ctx.fillText("👆 按住我往右边锁孔拖！", kx, ky + 58);
      }
    }

    drawAconitineSurgery(ctx, w, h, tick) {
      const cx = w * 0.49, cy = h * 0.60;
      const cured = this.group1Cut && this.group2Cut;

      // 右上角实时心跳表
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.strokeStyle = cured ? "#4ade80" : "#fb7185";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(w - 195, 14, 180, 48, 14);
      ctx.fill();
      ctx.stroke();
      ctx.font = "900 14px -apple-system, 'PingFang SC', sans-serif";
      ctx.fillStyle = cured ? "#4ade80" : "#fb7185";
      ctx.textAlign = "center";
      ctx.fillText(cured ? "💓 75 BPM 安全温和" : (!this.group1Cut && !this.group2Cut ? "🚨 210 BPM 剧毒狂跳" : "⚠️ 135 BPM 半脱毒"), w - 105, 43);

      // 连接化学键干线
      const g1x = w * 0.34, g1y = h * 0.31;
      const g2x = w * 0.64, g2y = h * 0.31;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - 32, cy - 22);
      ctx.lineTo(g1x, g1y);
      ctx.moveTo(cx + 32, cy - 22);
      ctx.lineTo(g2x, g2y);
      ctx.stroke();

      // 乌头核心骨架
      ctx.fillStyle = cured ? "#10b981" : "#8b5cf6";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 82, cy - 36, 164, 72, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cured ? "🌿 乌头原碱 (温和骨架)" : "💜 乌头碱核心骨架", cx, cy + 5);

      // 两个可点击剪切的基团
      this.drawEsterBomb(ctx, g1x, g1y, this.group1Cut, "💣 乙酰基 (-Ac)", "💧 温和羟基 (-OH)", tick);
      this.drawEsterBomb(ctx, g2x, g2y, this.group2Cut, "💣 苯甲酰基 (-Bz)", "💧 温和羟基 (-OH)", tick);

      // 蒸汽粒子
      this.steamBursts = this.steamBursts.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life--;
        ctx.fillStyle = `rgba(186, 230, 253, ${s.life / 40})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, 8, 0, Math.PI * 2);
        ctx.fill();
        return s.life > 0;
      });
    }

    drawEsterBomb(ctx, x, y, isCut, badLabel, goodLabel, tick) {
      const pulse = isCut ? 0 : Math.sin(tick * 0.15) * 4;
      ctx.fillStyle = isCut ? "#0284c7" : "#e11d48";
      ctx.strokeStyle = isCut ? "#7dd3fc" : "#fde047";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 32 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 12.5px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isCut ? "✓已水解" : "✂️点我剪掉", x, y + 4);
      ctx.fillText(isCut ? goodLabel : badLabel, x, y - 42);
    }

    drawBoilDuel(ctx, w, h, tick) {
      if (this.boiling && this.temp < 100) {
        this.temp = Math.min(100, this.temp + 0.65);
        if (this.temp === 100 && this.onWinStars) {
          this.onWinStars(2, "boil_duel");
          this.toast("🫧 100°C 沸腾啦！左边四季豆大蛋白散成安全面条，右边白鹅膏『8字硫桥铁锁』纹丝不动！");
        }
      } else if (!this.boiling && this.temp > 25) {
        this.temp = Math.max(25, this.temp - 0.8);
      }

      // 顶部温度计大屏
      ctx.fillStyle = this.temp >= 95 ? "#ef4444" : "#38bdf8";
      ctx.font = "900 18px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🌡️ 当前水温：${Math.round(this.temp)}°C ${this.temp >= 98 ? "🔥咕嘟沸腾中！" : ""}`, w / 2, 34);

      const leftX = w * 0.27, rightX = w * 0.73, potY = h * 0.57;

      // 左右两口实验锅
      [leftX, rightX].forEach((px) => {
        ctx.fillStyle = "rgba(30, 58, 138, 0.45)";
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(px - 110, potY - 68, 220, 136, 20);
        ctx.fill();
        ctx.stroke();

        // 沸水气泡
        if (this.temp > 65) {
          for (let b = 0; b < 6; b++) {
            const bx = px - 80 + ((b * 33 + tick * 2) % 160);
            const by = potY + 55 - ((tick * 2.5 + b * 24) % 110);
            ctx.strokeStyle = "rgba(255,255,255,0.55)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bx, by, 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // 左锅：生四季豆凝集素蛋白（低于85°C紧盘成球，高于90°C展开成温柔面条！）
      const unravel = Math.max(0, (this.temp - 80) / 20);
      ctx.strokeStyle = unravel > 0.8 ? "#4ade80" : "#f472b6";
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i < 24; i++) {
        const t = i / 23;
        const coiledX = leftX + Math.cos(i * 1.1) * 32 * (1 - unravel) + (t - 0.5) * 145 * unravel;
        const coiledY = potY + Math.sin(i * 1.3) * 30 * (1 - unravel) + Math.sin(i * 0.8 + tick * 0.1) * 8 * unravel;
        if (i === 0) ctx.moveTo(coiledX, coiledY);
        else ctx.lineTo(coiledX, coiledY);
      }
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13.5px -apple-system, 'PingFang SC', sans-serif";
      ctx.fillText("🫘 四季豆毒蛋白（长毛线团）", leftX, potY - 80);
      ctx.fillStyle = unravel > 0.8 ? "#4ade80" : "#fda4af";
      ctx.fillText(unravel > 0.8 ? "✅ 100°C 散架变营养面条啦！" : "⚠️ 生豆未熟：毛线团紧缩有毒", leftX, potY + 90);

      // 右锅：白鹅膏双环八肽（不管多少度都焊死成8字双铁环！）
      const jiggle = this.temp > 80 ? Math.sin(tick * 0.7) * 2.5 : 0;
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(rightX - 24 + jiggle, potY, 28, 0, Math.PI * 2);
      ctx.arc(rightX + 24 + jiggle, potY, 28, 0, Math.PI * 2);
      ctx.stroke();

      // 中间金色硫醚焊桥
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(rightX + jiggle, potY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText("🍄 白鹅膏毒肽（8字硫桥铁锁）", rightX, potY - 80);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("☠️ 焊死双环！沸水完全拆不动！", rightX, potY + 90);
    }
  }

  window.MolecularSurgeryModule = {
    MolecularSurgeryWorkbench
  };
})();
