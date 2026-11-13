// ============================================================================
// 视觉优先交互引擎：WebAudio 音效 + 360° 真 3D 分子旋转器 + 活体细胞拖拽游乐场
// ============================================================================

class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  ensure() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  pop() {
    const ctx = this.ensure();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(340, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.09);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.12);
  }

  bonk() {
    const ctx = this.ensure();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(220, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.18);
    g.gain.setValueAtTime(0.22, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.21);
  }

  chime() {
    const ctx = this.ensure();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const t0 = ctx.currentTime + i * 0.07;
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.14, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.3);
    });
  }

  sizzle() {
    const ctx = this.ensure();
    if (!ctx) return;
    [280, 390, 510].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const t0 = ctx.currentTime + i * 0.06;
      o.frequency.setValueAtTime(f, t0);
      o.frequency.exponentialRampToValueAtTime(f * 1.4, t0 + 0.08);
      g.gain.setValueAtTime(0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.11);
    });
  }
}

window.SFX = new SoundFX();

function setupHiDPI(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(rect.width, 280);
  const h = Math.max(rect.height, 240);
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

// ============================================================================
// 1. 真实 360° 触控旋转 3D 分子球棍渲染器 (支持 PubChem 真实三维坐标)
// ============================================================================
const ATOM_STYLE = {
  C: { color: "#475569", hi: "#94a3b8", r: 10.5, name: "碳 C" },
  N: { color: "#0284c7", hi: "#7dd3fc", r: 11.2, name: "氮 N" },
  O: { color: "#e11d48", hi: "#fda4af", r: 11.0, name: "氧 O" },
  S: { color: "#d97706", hi: "#fde047", r: 13.5, name: "硫 S" },
  P: { color: "#f97316", hi: "#fed7aa", r: 13.2, name: "磷 P" },
  Cl: { color: "#16a34a", hi: "#86efac", r: 13.0, name: "氯 Cl" },
  As: { color: "#9333ea", hi: "#d8b4fe", r: 14.5, name: "砷 As" },
  Hg: { color: "#dc2626", hi: "#fecaca", r: 15.5, name: "汞 Hg" },
  H: { color: "#cbd5e1", hi: "#ffffff", r: 6.8, name: "氢 H" }
};

class Molecule3DViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.mol = null;
    this.rotX = 0.42;
    this.rotY = 0.65;
    this.dragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.scale = 34;

    this.bindTouchMouse();
    this.loop();
  }

  setMolecule(molData) {
    this.mol = molData;
    this.rotX = 0.35;
    this.rotY = 0.5;
    if (molData && molData.atoms.length) {
      let maxSpan = 1;
      molData.atoms.forEach((a) => {
        maxSpan = Math.max(maxSpan, Math.hypot(a.x, a.y, a.z));
      });
      this.scale = Math.min(46, Math.max(19, 112 / maxSpan));
    }
  }

  bindTouchMouse() {
    const down = (x, y) => {
      this.dragging = true;
      this.lastX = x;
      this.lastY = y;
    };
    const move = (x, y) => {
      if (!this.dragging) return;
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      this.rotY += dx * 0.012;
      this.rotX += dy * 0.012;
      this.lastX = x;
      this.lastY = y;
    };
    const up = () => { this.dragging = false; };

    this.canvas.addEventListener("mousedown", (e) => down(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", up);

    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) down(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        move(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });
    this.canvas.addEventListener("touchend", up);
  }

  loop() {
    const step = () => {
      if (this.canvas.offsetParent && this.mol) {
        if (!this.dragging) {
          this.rotY += 0.009;
        }
        this.draw();
      }
      requestAnimationFrame(step);
    };
    step();
  }

  draw() {
    const { ctx, w, h } = setupHiDPI(this.canvas);
    ctx.clearRect(0, 0, w, h);

    // 深邃星空渐变背景格栅
    const bg = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.65);
    bg.addColorStop(0, "#172554");
    bg.addColorStop(1, "#090f1f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    const cx = w / 2, cy = h / 2 - 6;

    const proj = this.mol.atoms.map((a, idx) => {
      const x1 = a.x * cosY - a.z * sinY;
      const z1 = a.x * sinY + a.z * cosY;
      const y2 = a.y * cosX - z1 * sinX;
      const z2 = a.y * sinX + z1 * cosX;
      const persp = 320 / (320 - z2 * 14);
      return {
        idx,
        el: a.el,
        sx: cx + x1 * this.scale * persp,
        sy: cy + y2 * this.scale * persp,
        z: z2,
        persp
      };
    });

    // 组合化学键与原子并按 Z 深度排序绘制（真 3D 遮挡感！）
    const renderItems = [];
    this.mol.bonds.forEach(([i, j, order]) => {
      const p1 = proj[i], p2 = proj[j];
      if (!p1 || !p2) return;
      renderItems.push({
        type: "bond",
        z: (p1.z + p2.z) * 0.5 - 0.05,
        p1, p2, order
      });
    });
    proj.forEach((p) => {
      renderItems.push({ type: "atom", z: p.z, p });
    });

    renderItems.sort((a, b) => a.z - b.z);

    renderItems.forEach((item) => {
      if (item.type === "bond") {
        const { p1, p2, order } = item;
        ctx.strokeStyle = "rgba(203, 213, 225, 0.78)";
        ctx.lineCap = "round";
        if (order === 2) {
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 1.6;
          ctx.stroke();
        } else {
          ctx.lineWidth = 3.8;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      } else {
        const { p } = item;
        const st = ATOM_STYLE[p.el] || ATOM_STYLE.C;
        const rad = st.r * p.persp * (this.scale / 32);
        const grad = ctx.createRadialGradient(
          p.sx - rad * 0.32, p.sy - rad * 0.32, rad * 0.1,
          p.sx, p.sy, rad
        );
        grad.addColorStop(0, st.hi);
        grad.addColorStop(0.55, st.color);
        grad.addColorStop(1, "#020617");

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(3.5, rad), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    // 顶部与底部视觉图例（无长文字，只有分子式与原子色球）
    ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
    ctx.beginPath();
    ctx.roundRect(12, 12, w - 24, 34, 10);
    ctx.fill();

    ctx.font = "800 13px -apple-system, 'PingFang SC', sans-serif";
    ctx.fillStyle = "#5eead4";
    ctx.textAlign = "left";
    ctx.fillText(`🧬 ${this.mol.name}  ${this.mol.formula}`, 22, 33);

    ctx.textAlign = "right";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "700 12px -apple-system, 'PingFang SC', sans-serif";
    ctx.fillText("👆 用手指滑动 360° 旋转", w - 20, 33);

    // 原子颜色小图例
    const presentEls = [...new Set(this.mol.atoms.map((a) => a.el))];
    let lx = 18;
    presentEls.forEach((el) => {
      const st = ATOM_STYLE[el] || ATOM_STYLE.C;
      ctx.beginPath();
      ctx.arc(lx + 6, h - 54, 6, 0, Math.PI * 2);
      ctx.fillStyle = st.color;
      ctx.fill();
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 11.5px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(st.name, lx + 16, h - 50);
      lx += 58;
    });
  }
}

// ============================================================================
// 2. 活体细胞游乐场 (绘制在 Pixar/Kurzgesagt 风格细胞插画背景上的互动玩具！)
// ============================================================================
class LivingCellPlayground {
  constructor(canvas, onStateChange) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.bgImg = new Image();
    this.bgImg.src = "assets/scenes/cell_bg.jpg";
    this.mode = "clean"; // clean | ttx | frog | cobra | amanitin
    this.pepsinAnim = 0;
    this.pepsinResult = "";
    this.confetti = [];
    this.ions = [];
    this.messengers = [];

    for (let i = 0; i < 24; i++) {
      this.ions.push({
        x: Math.random(),
        y: 0.06 + Math.random() * 0.22,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.002,
        inside: false,
        dizzy: 0
      });
    }

    this.loop();
  }

  applyReagent(reagentId) {
    if (reagentId === "clean") {
      this.mode = "clean";
      this.pepsinAnim = 0;
      this.ions.forEach((p) => { p.inside = false; p.y = 0.08 + Math.random() * 0.2; p.dizzy = 0; });
      window.SFX.pop();
      this.notify("💓", "75 BPM · 细胞健康活力满满！", "✨ 干净啦！金色钠离子小精灵排着队有序进出城门！");
      return;
    }

    if (reagentId === "pepsin") {
      this.pepsinAnim = 110;
      if (this.mode === "cobra") {
        // 胃蛋白酶把眼镜王蛇蛋白质剪碎成五彩氨基酸！
        window.SFX.chime();
        this.pepsinResult = "digested";
        for (let i = 0; i < 26; i++) {
          this.confetti.push({
            x: 0.80, y: 0.34,
            vx: (Math.random() - 0.5) * 0.018,
            vy: (Math.random() - 0.7) * 0.018,
            color: ["#f472b6", "#fbbf24", "#34d399", "#38bdf8"][i % 4],
            life: 75
          });
        }
        this.mode = "clean";
        this.notify("😋", "75 BPM · 蛇毒蛋白被消化啦！", "✂️ 咔嚓咔嚓！眼镜王蛇毒是『大分子蛋白质』，被胃蛋白酶剪成了无害小碎片！");
      } else if (this.mode === "clean") {
        window.SFX.pop();
        this.pepsinResult = "idle";
        this.notify("✂️", "75 BPM · 胃蛋白酶巡逻中", "✂️ 先滴一种毒物进来，再放胃蛋白酶大剪刀试试能不能剪碎它！");
      } else {
        // 小分子或双环八肽：剪刀崩牙弹开！
        window.SFX.bonk();
        this.pepsinResult = "bounce";
        this.notify("💥", "剪刀崩牙啦！", "💥 哎哟咬不动！河鲀毒素、蛙毒和白鹅膏双环锁不是普通蛋白，胃酸和沸水都拿它们没办法！");
      }
      return;
    }

    this.mode = reagentId;
    this.pepsinAnim = 0;
    window.SFX.pop();

    if (reagentId === "ttx") {
      this.ions.forEach((p) => { p.inside = false; p.y = 0.08 + Math.random() * 0.18; });
      this.notify("😴", "25 BPM · 信号断电麻痹！", "🐡 砰！河鲀毒素像带正电的大软木塞，死死堵住了红色钠离子城门！");
    } else if (reagentId === "frog") {
      this.notify("⚡", "210 BPM · 疯狂放电抽搐！", "🐸 咔嚓！箭毒蛙与乌头碱像木楔子卡住城门不让关，钠离子洪水冲垮细胞啦！");
    } else if (reagentId === "cobra") {
      this.notify("🛑", "35 BPM · 受体座位被抢！", "👑 眼镜王蛇的『三指毒蛋白』霸占了右侧蓝色信号接收器！（快点胃蛋白酶剪刀试试！）");
    } else if (reagentId === "amanitin") {
      this.notify("🏭", "工厂停摆警报！", "🍄 咔哒！白鹅膏的『8字双环铁锁』焊死了右下角紫色细胞核的图纸复印机！");
    }
  }

  notify(heartIcon, bpmText, speech) {
    if (this.onStateChange) this.onStateChange(heartIcon, bpmText, speech);
  }

  loop() {
    let tick = 0;
    const step = () => {
      tick++;
      if (this.canvas.offsetParent) {
        this.draw(tick);
      }
      requestAnimationFrame(step);
    };
    step();
  }

  draw(tick) {
    const { ctx, w, h } = setupHiDPI(this.canvas);
    ctx.clearRect(0, 0, w, h);

    // 1. 绘制高清 Kurzgesagt/Pixar 细胞插画底图
    if (this.bgImg.complete && this.bgImg.naturalWidth) {
      ctx.drawImage(this.bgImg, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#0c2d48";
      ctx.fillRect(0, 0, w, h);
    }

    // 关键解剖位置（与 cell_bg.jpg 完全精准对齐！）
    const navX = w * 0.602, navY = h * 0.365;   // 中央珊瑚红钠离子通道
    const recX = w * 0.802, recY = h * 0.388;   // 右侧青色受体通道
    const rnaX = w * 0.81,  rnaY = h * 0.80;    // 右下紫色细胞核工厂
    const mitoX = w * 0.33, mitoY = h * 0.68;   // 左下金色线粒体

    const doorOpen = this.mode === "frog" || (this.mode !== "ttx" && Math.sin(tick * 0.055) > -0.15);

    // 2. 绘制中央通道开合光效
    if (doorOpen) {
      const glow = ctx.createRadialGradient(navX, navY, 4, navX, navY, 44);
      glow.addColorStop(0, this.mode === "frog" ? "rgba(250, 204, 21, 0.75)" : "rgba(74, 222, 128, 0.45)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(navX, navY, 44, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. 更新并绘制带大眼睛表情的金色 Na+ 离子小精灵！
    this.ions.forEach((ion) => {
      if (ion.dizzy > 0) ion.dizzy--;

      if (!ion.inside) {
        if (doorOpen && Math.abs(ion.x * w - navX) < 42) {
          ion.x += (0.602 - ion.x) * 0.16;
          ion.y += this.mode === "frog" ? 0.016 : 0.009;
          if (ion.y > 0.46) ion.inside = true;
        } else {
          if (doorOpen && Math.random() < 0.05) {
            ion.vx += (0.602 - ion.x) * 0.0012;
          }
          ion.x += ion.vx;
          ion.y += ion.vy;
          if (ion.x < 0.05 || ion.x > 0.95) ion.vx *= -1;
          if (ion.y < 0.05 || ion.y > 0.27) ion.vy *= -1;

          // 撞上河鲀毒素软木塞被弹飞！
          if (this.mode === "ttx" && Math.hypot(ion.x * w - navX, ion.y * h - (navY - 26)) < 36) {
            ion.vy = -0.007;
            ion.vx = (Math.random() - 0.5) * 0.012;
            ion.dizzy = 35;
          }
        }
      } else {
        ion.x += ion.vx * (this.mode === "frog" ? 2.8 : 1.3);
        ion.y += (0.58 - ion.y) * 0.03 + Math.sin(tick * 0.1 + ion.x * 10) * 0.002;
        if (ion.x < 0.08 || ion.x > 0.92) ion.vx *= -1;
        if (this.mode !== "frog" && Math.random() < 0.018) {
          ion.inside = false;
          ion.y = 0.08 + Math.random() * 0.15;
        }
      }

      const px = ion.x * w, py = ion.y * h;
      this.drawCuteIon(ctx, px, py, ion.dizzy > 0);
    });

    // 4. 绘制当前激活的巨型卡通毒素道具！
    if (this.mode === "ttx") {
      this.drawTTXCork(ctx, navX, navY - 24, tick);
    } else if (this.mode === "frog") {
      this.drawFrogWedge(ctx, navX, navY, tick);
    } else if (this.mode === "cobra") {
      this.drawCobraHand(ctx, recX, recY - 18, tick);
    } else if (this.mode === "amanitin") {
      this.drawAmanitinLock(ctx, rnaX, rnaY, tick);
    }

    // 右下角细胞核齿轮状态（正常旋转 vs 被白鹅膏锁停）
    this.drawFactoryGear(ctx, rnaX - 42, rnaY - 28, this.mode === "amanitin" ? 0 : tick * 0.04, this.mode === "amanitin");

    // 线粒体开心呼吸表情
    ctx.font = "700 13px -apple-system, 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.beginPath();
    ctx.roundRect(mitoX - 58, mitoY - 14, 116, 26, 12);
    ctx.fill();
    ctx.fillStyle = "#fde047";
    ctx.fillText(this.mode === "frog" ? "🔥 能量过载啦！" : "⚡ 线粒体发电站", mitoX, mitoY + 4);

    // 5. 胃蛋白酶大剪刀动画
    if (this.pepsinAnim > 0) {
      this.pepsinAnim--;
      const targetX = this.pepsinResult === "digested" ? recX : (this.mode === "amanitin" ? rnaX : navX);
      const targetY = this.pepsinResult === "digested" ? recY - 20 : (this.mode === "amanitin" ? rnaY - 20 : navY - 30);
      const bounceOffset = this.pepsinResult === "bounce" ? Math.sin(this.pepsinAnim * 0.35) * 26 : 0;
      this.drawGiantScissor(ctx, targetX - 55 - bounceOffset, targetY, tick, this.pepsinResult === "bounce");
    }

    // 五彩氨基酸碎片烟花
    this.confetti = this.confetti.filter((c) => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.0005;
      c.life--;
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x * w, c.y * h, 5.5, 0, Math.PI * 2);
      ctx.fill();
      return c.life > 0;
    });
  }

  drawCuteIon(ctx, x, y, dizzy) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 10.5, 0, Math.PI * 2);
    ctx.fillStyle = dizzy ? "#fb7185" : "#fbbf24";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // 迷你大眼睛
    ctx.fillStyle = "#0f172a";
    if (dizzy) {
      ctx.font = "900 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("× ×", x, y + 3.5);
    } else {
      ctx.beginPath();
      ctx.arc(x - 3.2, y - 1.5, 1.7, 0, Math.PI * 2);
      ctx.arc(x + 3.2, y - 1.5, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawTTXCork(ctx, x, y, tick) {
    const bob = Math.sin(tick * 0.1) * 2;
    ctx.save();
    // 胖笼子身体
    ctx.fillStyle = "#f43f5e";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y + bob - 8, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 正电荷钥匙塞头
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.roundRect(x - 13, y + bob + 10, 26, 18, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🐡 TTX塞子", x, y + bob - 5);
    ctx.font = "900 11px sans-serif";
    ctx.fillText("+NH₂", x, y + bob + 23);
    ctx.restore();
  }

  drawFrogWedge(ctx, x, y, tick) {
    ctx.save();
    ctx.fillStyle = "#a855f7";
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 3;
    // 左右两根木楔子把通道撑到最大！
    [-34, 34].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(x + dx, y - 22);
      ctx.lineTo(x + dx * 0.45, y);
      ctx.lineTo(x + dx, y + 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // 闪电火花
    if (tick % 12 < 6) {
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚡", x, y - 30);
    }
    ctx.restore();
  }

  drawCobraHand(ctx, x, y, tick) {
    const sway = Math.sin(tick * 0.08) * 3;
    ctx.save();
    ctx.fillStyle = "#ec4899";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    // 三根手指造型（三指毒素 3FTx！）
    [-16, 0, 16].forEach((dx, i) => {
      ctx.beginPath();
      ctx.roundRect(x + dx - 6, y + sway - (i === 1 ? 28 : 22), 12, 30, 6);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 12px -apple-system, 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🐍 三指毒蛋白霸座", x, y + sway - 35);
    ctx.restore();
  }

  drawAmanitinLock(ctx, x, y, tick) {
    ctx.save();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x - 18, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 18, y, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(x - 24, y - 14, 48, 28, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "900 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🔒8字铁锁", x, y + 5);
    ctx.restore();
  }

  drawFactoryGear(ctx, x, y, angle, locked) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = locked ? "#ef4444" : "#c084fc";
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-4, -20, 8, 8);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawGiantScissor(ctx, x, y, tick, dizzy) {
    const bite = Math.abs(Math.sin(tick * 0.32)) * 0.55;
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 24, bite, Math.PI * 2 - bite);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "900 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(dizzy ? "💫咬不动!" : "✂️胃蛋白酶", x, y - 30);
    ctx.restore();
  }
}

window.PlaygroundEngines = {
  Molecule3DViewer,
  LivingCellPlayground
};
