// ============================================================================
// 升级7：🔬 毒物分类实验室 · 🛡️ 生活安全大冒险(16关) · 🏅 小馆长科学英语护照 & 每日任务
// 目标：让小朋友把书里 99 篇知识真正用起来（分类、判断、安全救急），同时把英语融入每个真实场景！
// ============================================================================

(function () {
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getTodayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  // ==========================================================================
  // 16 关《致命毒物大百科》真实生活安全大冒险（含双语安全口诀！）
  // ==========================================================================
  const SAFETY_SCENARIOS = [
    {
      id: "safe_potato",
      cat: "kitchen",
      catLabel: "🍳 厨房餐桌",
      cardId: "ch4-01",
      title: "绿皮发芽的土豆能炸薯条吗？",
      scene: "你在厨房帮妈妈拿土豆，发现有一颗表皮变绿、还长出了好几个嫩嫩的小芽眼！",
      opts: [
        { icon: "🔪", text: "用水冲一下表皮，直接切条炸薯条吃" },
        { icon: "🗑️", text: "果断扔掉不吃！发芽绿皮里藏着耐高温的龙葵碱", ok: true },
        { icon: "🍲", text: "多放点盐在锅里煮沸就能把毒全煮没" }
      ],
      explain: "答对啦！土豆发芽变绿部位富含『龙葵碱』，100°C 沸水也拆不掉它！所以变绿或发芽严重的土豆千万别吃，要果断丢掉哦！",
      enMotto: "Never eat green or sprouted potatoes!",
      zhMotto: "千万别吃变绿或发芽的土豆！"
    },
    {
      id: "safe_beans",
      cat: "kitchen",
      catLabel: "🍳 厨房餐桌",
      cardId: "ch4-02",
      title: "脆生生的半熟四季豆",
      scene: "餐桌上刚炒好一盘四季豆，你夹起一根咬了一口，觉得还有点生豆腥味、绿绿脆脆的……",
      opts: [
        { icon: "🔥", text: "立刻停下！回锅彻底炖熟煮透到 100°C 变软再吃", ok: true },
        { icon: "🥗", text: "蔬菜生吃最有营养，赶紧大口吃光" },
        { icon: "🧊", text: "放进冰箱冰镇一下就能解毒" }
      ],
      explain: "太棒啦！生四季豆里有『植物血球凝集素』蛋白，会让肚子剧痛呕吐。好在它是蛋白质，只要在 100°C 滚水里彻底煮透 10 分钟以上，就会彻底散架变成安全美食！",
      enMotto: "Boil kidney beans well before eating!",
      zhMotto: "吃四季豆前一定要彻底煮透！"
    },
    {
      id: "safe_zucchini",
      cat: "kitchen",
      catLabel: "🍳 厨房餐桌",
      cardId: "ch4-03",
      title: "一口苦到皱眉的西葫芦/瓠瓜",
      scene: "晚饭炒了一盘清甜的西葫芦，你刚咬第一口，突然觉得苦得像吃黄连一样！",
      opts: [
        { icon: "🍬", text: "撒点白糖盖住苦味，坚持咽下去别浪费" },
        { icon: "🍲", text: "加点水再多煮五分钟就不苦了" },
        { icon: "🚨", text: "马上吐出来并整盘倒掉！苦瓜味里藏着耐热的葫芦素", ok: true }
      ],
      explain: "机智满分！平时清甜的西葫芦、瓠瓜如果突然发苦，说明积累了剧毒『葫芦素』，高温都破坏不了！尝到异常发苦一定要立刻吐掉、整盘不吃！",
      enMotto: "If a gourd tastes bitter, spit it out!",
      zhMotto: "瓜类如果尝到异常发苦，马上吐掉！"
    },
    {
      id: "safe_ginkgo",
      cat: "kitchen",
      catLabel: "🍳 厨房餐桌",
      cardId: "ch4-06",
      title: "秋天捡到一大袋银杏果（白果）",
      scene: "公园银杏树下掉满金黄果子，你想剥壳生吃，或者一次烤二十颗当零食狂吃！",
      opts: [
        { icon: "✋", text: "不能生吃，熟白果小朋友一次也最多吃 2~3 颗甚至不吃", ok: true },
        { icon: "😋", text: "纯天然坚果，烤香了可以当瓜子吃一大碗" },
        { icon: "💧", text: "冷水泡十分钟就能生吃" }
      ],
      explain: "太懂毒理学啦！白果里的 MPN 分子会冒充维生素 B6，干扰大脑正常电信号！绝不能生吃，且小朋友体轻，熟的也绝不能贪多哦！",
      enMotto: "Never eat raw ginkgo nuts!",
      zhMotto: "千万不能生吃银杏白果！"
    },
    {
      id: "safe_inkcap",
      cat: "kitchen",
      catLabel: "🍳 厨房餐桌",
      cardId: "ch5-14",
      title: "吃墨汁鬼伞蘑菇时，爸爸想喝啤酒",
      scene: "书里讲到墨汁鬼伞里有『鬼伞素』，它会把肝脏里的 2 号解酒酶牢牢锁死。如果刚吃完它，爸爸能喝啤酒吗？",
      opts: [
        { icon: "🍺", text: "喝一小杯冰啤酒解解腻没关系" },
        { icon: "🚫", text: "绝对不行！解酒酶被锁死，一喝酒有毒乙醛就会在血管大堵车", ok: true },
        { icon: "🍋", text: "往啤酒里挤点柠檬汁就能中和" }
      ],
      explain: "生化大师就是你！鬼伞素锁住乙醛脱氢酶后，只要一喝酒（甚至前后几天内），有毒的乙醛就会瞬间堆满血管让人面红心慌——吃头孢不能喝酒也是同一个道理！",
      enMotto: "Never mix ink cap mushrooms with alcohol!",
      zhMotto: "墨汁鬼伞和酒精绝对不能一起碰！"
    },
    {
      id: "safe_mushroom",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch5-01",
      title: "森林里纯白无瑕的『小伞蘑菇』",
      scene: "雨后森林里长出一朵雪白干净、菌柄底部像穿着小靴子（菌托）的蘑菇，看起来一点也不花哨……",
      opts: [
        { icon: "🧺", text: "只有鲜艳花蘑菇才有毒，白蘑菇肯定能煮汤" },
        { icon: "📷", text: "绝不采摘不乱吃！素白『白鹅膏』是剧毒鹅膏毒肽之王", ok: true },
        { icon: "🧄", text: "放进锅里和大蒜一起煮，大蒜不变黑就能吃" }
      ],
      explain: "保命常识满分！『看颜色/银针/大蒜验毒』全是谣言！剧毒的鳞柄白鹅膏全身雪白，有着『头上戴帽、腰间系裙、脚穿靴子』特征，100°C 沸水也煮不烂它的 8 字铁锁！",
      enMotto: "Never pick or eat wild mushrooms!",
      zhMotto: "千万不要采摘或吃野生蘑菇！"
    },
    {
      id: "safe_octopus",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch6-08",
      title: "海边礁石坑里闪着霓虹蓝圈的小章鱼",
      scene: "退潮后的海边水洼里，有一只只有高尔夫球大小、浑身突然闪亮出荧光蓝色圆环的小章鱼！",
      opts: [
        { icon: "🤲", text: "太可爱啦，伸手捧在手心里拍张照片" },
        { icon: "🏃", text: "立刻退后远离、绝不触碰！它是携带剧毒河鲀毒素的蓝环章鱼", ok: true },
        { icon: "🪣", text: "用小网兜捞进塑料桶带回家当宠物" }
      ],
      explain: "超级警觉！蓝环章鱼亮出蓝色荧光环就是在拉最高级警报！它的唾液腺藏着和河鲀同款的河鲀毒素（TTX），咬一口几乎无痛却能瞬间堵死呼吸神经通道，只能远观绝不能碰！",
      enMotto: "Bright blue rings mean stay back!",
      zhMotto: "亮起蓝环代表着快快退后！"
    },
    {
      id: "safe_jellyfish",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch6-13",
      title: "沙滩上像蓝紫色透明气球的『僧帽水母』",
      scene: "海滩湿沙上搁浅着一个半透明、带着梦幻蓝紫色的『小气球』，旁边拖着几根细长蓝丝……",
      opts: [
        { icon: "🎈", text: "像塑料泡泡一样，拿小脚丫踩破听响声" },
        { icon: "🚫", text: "远离它和周围的透明细丝！死掉的刺丝囊碰一下仍会发射毒鱼叉", ok: true },
        { icon: "🧤", text: "光手拎着它的气球顶扔回海里" }
      ],
      explain: "答得太准啦！僧帽水母细长的触手上排满数百万个微型刺丝囊鱼叉，哪怕冲上沙滩看似死掉了，一碰依然能以子弹般的速度射出毒针！在海边看到绝不能触碰！",
      enMotto: "Do not touch tentacles on the beach!",
      zhMotto: "海滩上的水母触手千万不能碰！"
    },
    {
      id: "safe_honeybee",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch2-02",
      title: "被小蜜蜂蛰了，皮肤上留着小毒囊",
      scene: "在花园玩时不小心碰到蜜蜂，手臂上扎了一根带白色小毒囊的倒钩刺，正一跳一跳的……",
      opts: [
        { icon: "🤏", text: "用手指捏住小毒囊用力拔出来" },
        { icon: "💳", text: "用硬卡片平行轻轻刮掉毒刺，再清水冲洗冰敷", ok: true },
        { icon: "🧼", text: "不用管毒刺，直接抹厚厚一层牙膏" }
      ],
      explain: "急救小专家！用手指捏毒囊就像挤眼药水，反而会把剩下毒液全挤进皮肤里！正确做法是用银行卡或硬纸片紧贴皮肤平行轻轻刮掉，再冷水冲洗冰敷，如出现呼吸困难立刻就医！",
      enMotto: "Scrape the stinger, never squeeze it!",
      zhMotto: "用卡片轻轻刮掉毒刺，千万别挤捏！"
    },
    {
      id: "safe_hornet",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch2-01",
      title: "一只大胡蜂围着你的头嗡嗡转",
      scene: "在公园树林里散步，一只黑黄条纹的大胡蜂突然飞过来绕着你打转侦察……",
      opts: [
        { icon: "🙌", text: "大喊大叫，疯狂挥舞双臂拍打赶走它" },
        { icon: "🚶", text: "护住头颈、保持冷静，低头安静慢慢朝反方向走开", ok: true },
        { icon: "🪨", text: "捡起石子扔向树上的蜂巢" }
      ],
      explain: "冷静大师！大声尖叫和疯狂挥手会让胡蜂觉得你正在攻击它，还会释放报警信息素呼叫全巢伙伴！保持镇定、护住头部慢慢后退离开才是最安全的！",
      enMotto: "Stay calm and walk away slowly!",
      zhMotto: "遇到胡蜂保持冷静，慢慢走开！"
    },
    {
      id: "safe_moth",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch2-06",
      title: "毒蛾幼虫的隐形毒毛飘到了手臂上",
      scene: "大树下走过，几根肉眼几乎看不见的毒蛾小毛毛落在胳膊上，突然又痒又红！",
      opts: [
        { icon: "✋", text: "用指甲狠狠挠一挠，再用手使劲搓掉" },
        { icon: "🩹", text: "千万别搓！用透明胶带轻轻反复粘走毒毛，再用肥皂水冲", ok: true },
        { icon: "🧣", text: "拿干毛巾来回用力擦拭" }
      ],
      explain: "太聪明啦！毒蛾毒毛像空心微针带倒钩，用手越挠越搓会把它扎进皮肤深处！先用胶带轻轻一贴一揭把微针粘出来，再用流水和肥皂冲洗就舒服多啦！",
      enMotto: "Don't rub your skin! Lift with tape and wash!",
      zhMotto: "千万别搓皮肤！用胶带粘走再冲洗！"
    },
    {
      id: "safe_oleander",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch3-17",
      title: "用夹竹桃的笔直树枝串棉花糖烤着吃？",
      scene: "小区路边开满粉红花朵的夹竹桃树枝又直又光滑，有小伙伴提议折一根来当烤串签子……",
      opts: [
        { icon: "🍢", text: "剥掉树皮烤一烤就能当环保竹签" },
        { icon: "🛑", text: "坚决阻止！夹竹桃全株含剧毒强心苷，连树枝和烟雾都有毒", ok: true },
        { icon: "🌸", text: "树枝不能用，但把花瓣摘下来泡茶很香" }
      ],
      explain: "守护了所有人！夹竹桃从花瓣、叶子、树枝到汁液全部含有剧毒强心苷，高温都烤不坏，绝不能用来串食物、折枝玩耍或放进嘴里，远远欣赏它的美就好！",
      enMotto: "Look at the flowers, never break the branches!",
      zhMotto: "只用眼睛赏花，千万别折树枝！"
    },
    {
      id: "safe_frog",
      cat: "wild",
      catLabel: "🏖️ 海边野外",
      cardId: "ch1-09",
      title: "大自然里的『电光黄 / 鲜红斑』警告信号",
      scene: "在雨林馆或野外纪录片里，看到一只通体电光金黄的小青蛙，或者黑身带亮红条纹的蜘蛛，这鲜艳颜色是什么意思？",
      opts: [
        { icon: "⚠️", text: "这是大自然的『警戒色』，大声宣告『我有毒，快离远点！』", ok: true },
        { icon: "🎨", text: "它想吸引大动物过来和它做朋友" },
        { icon: "🍓", text: "说明它吃起来像草莓一样甜" }
      ],
      explain: "自然语言翻译官！鲜亮的黄黑、红黑、蓝黑配色在生物界叫『警戒色』，专门提醒捕食者千万别乱碰乱咬！记住英文金句：Bright colors mean danger!",
      enMotto: "Bright colors mean danger in nature!",
      zhMotto: "大自然里鲜艳的颜色代表着危险警告！"
    },
    {
      id: "safe_choco",
      cat: "home",
      catLabel: "🏠 居家萌宠",
      cardId: "ch0-01",
      title: "贪吃小修狗眼巴巴盯着你的黑巧克力",
      scene: "你正在吃一块香浓黑巧克力，家里的可爱小狗摇着尾巴凑过来，想分吃两块……",
      opts: [
        { icon: "🍫", text: "好朋友要分享，掰一大块喂给狗狗吃" },
        { icon: "🐶", text: "温和拒绝并改喂狗狗零食！狗狗肝脏拆不掉可可碱会中毒", ok: true },
        { icon: "🥛", text: "只要配一杯牛奶，狗狗就能放心吃黑巧" }
      ],
      explain: "最棒的铲屎官！人类肝脏里的代谢酶像高速风扇很快拆掉可可碱，可狗狗的慢酶要花十几个小时，可可碱会在狗狗血液里爆仓引发心跳乱套！千万别给猫狗喂巧克力！",
      enMotto: "Chocolate is yummy for kids, but toxic for dogs!",
      zhMotto: "巧克力小朋友爱吃，但对小狗有毒哦！"
    },
    {
      id: "safe_bleach",
      cat: "home",
      catLabel: "🏠 居家萌宠",
      cardId: "ch8-03",
      title: "大扫除时把『84 消毒液』和『洁厕灵』混一起？",
      scene: "卫生间有点污垢，有人想把含氯的 84 消毒液和酸性的洁厕灵倒进同一个马桶里『双倍去污』！",
      opts: [
        { icon: "🫧", text: "两种清洁剂强强联手，洗得更干净" },
        { icon: "☣️", text: "快大喊停手！两者混合会立刻化学反应冒出剧毒黄绿色氯气", ok: true },
        { icon: "🔥", text: "加点热水搅拌匀就安全了" }
      ],
      explain: "超级家庭安全卫士！含次氯酸钠的消毒液遇上酸性洁厕灵，瞬间就会生成刺激肺部的剧毒『氯气』！家用清洁剂永远只能单用一种，并保持开窗通风！",
      enMotto: "Never mix bleach and acid toilet cleaner!",
      zhMotto: "千万别把消毒液和洁厕灵混在一起！"
    },
    {
      id: "safe_cinnabar",
      cat: "home",
      catLabel: "🏠 居家萌宠",
      cardId: "ch7-01",
      title: "漂亮的朱红色辰砂 / 金黄色雌黄矿石标本",
      scene: "在地质博物馆或矿石展览上，看到亮晶晶的鲜红辰砂（硫化汞）和亮黄雌黄（硫化砷）晶体！",
      opts: [
        { icon: "👅", text: "舔一舔尝尝看漂亮石头是不是咸的" },
        { icon: "🔥", text: "拿打火机烧一烧看看会不会变金子" },
        { icon: "🧤", text: "只用玻璃柜观赏不入口、绝不加热，摸过矿石一定认真洗手", ok: true }
      ],
      explain: "地质小专家！辰砂含汞、雌黄含砷，一遇高温灼烧就会释放剧毒汞蒸气或砒霜烟雾！欣赏矿物标本要隔盒观赏、不入口、不火烧、接触后立刻肥皂洗手！",
      enMotto: "Never put toxic minerals in fire or near your mouth!",
      zhMotto: "矿物标本绝不火烧，也绝不能放嘴边！"
    }
  ];

  // ==========================================================================
  // 模块 1：⚖️ 毒物分类实验室 (Stage 4 · Game 5)
  // ==========================================================================
  class ToxClassificationLab {
    constructor(mountEl, app) {
      this.mountEl = mountEl;
      this.app = app;
      this.mode = "strategy"; // 'strategy' (Venom/Poison/Mineral) | 'mech' (5 mechanisms)
      this.streak = 0;
      this.currentItem = null;
      this.answered = false;
      this.lastWrongBay = null;
      this.feedbackHTML = "";
    }

    init() {
      if (!this.mountEl) return;
      this.nextSpecimen();
    }

    _getPool() {
      return (window.CATALOG_DATA || []).filter((x) => {
        if (x.chapter === "ch0") return false;
        if (this.mode === "strategy") {
          return x.strategy === "venom" || x.strategy === "poison" || x.strategy === "mineral_chem";
        }
        return ["neuro", "blood", "cell", "enzyme", "physical"].includes(x.mech);
      });
    }

    nextSpecimen() {
      const pool = this._getPool();
      if (!pool.length) return;
      const sorted = new Set(this.app.state.sortedCorrect || []);
      const fresh = pool.filter((x) => !sorted.has(`${this.mode}_${x.id}`) && (!this.currentItem || x.id !== this.currentItem.id));
      const candidates = fresh.length > 0 ? fresh : pool.filter((x) => !this.currentItem || x.id !== this.currentItem.id);
      this.currentItem = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
      this.answered = false;
      this.lastWrongBay = null;
      this.feedbackHTML = "";
      this.render();
    }

    _handlePick(bayId) {
      const item = this.currentItem;
      if (!item || this.answered) return;
      const rightBay = this.mode === "strategy" ? item.strategy : item.mech;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || {};

      if (bayId === rightBay) {
        this.answered = true;
        this.lastWrongBay = null;
        this.streak += 1;
        if (window.SFX) window.SFX.chime();
        const s = this.app.state;
        if (!Array.isArray(s.sortedCorrect)) s.sortedCorrect = [];
        const saveKey = `${this.mode}_${item.id}`;
        const firstTime = !s.sortedCorrect.includes(saveKey);
        if (firstTime) {
          s.sortedCorrect.push(saveKey);
          this.app.addStars(2);
        } else {
          this.app.addStars(1);
        }
        if (this.app.trackMission) this.app.trackMission("knowledge", 1);
        if (window.PlaygroundFX) window.PlaygroundFX.celebrate(this.mountEl);

        let explain = "";
        let enLine = "";
        if (this.mode === "strategy") {
          const stObj = window.STRATEGIES && window.STRATEGIES[rightBay];
          explain = stObj ? stObj.chemRule : item.summary;
          enLine =
            rightBay === "venom"
              ? `${ce.enName || item.name} uses VENOM. It injects toxin!`
              : rightBay === "poison"
              ? `${ce.enName || item.name} carries POISON. Don't eat or touch it!`
              : `${ce.enName || item.name} is a MINERAL or CHEMICAL toxin!`;
        } else {
          const mObj = window.MECHANISMS && window.MECHANISMS[rightBay];
          explain = mObj ? `${mObj.name}：${mObj.principle}` : item.summary;
          enLine = `${ce.enName || item.name}. ${(ce.enScene && ce.enScene.en) || ""}`.trim();
        }

        this.feedbackHTML = `
          <div class="cls-win-box">
            <div class="win-title-text">
              🎉 分类精准 (+${firstTime ? 2 : 1}⭐)！${this.app.ruby(item.name)}（🇬🇧 ${esc(ce.enName || "")}）
            </div>
            <div style="margin:6px 0;font-size:0.9rem;font-weight:700;color:var(--text-main);line-height:1.55;">
              🧪 ${this.app.ruby(explain)}
            </div>
            <div class="cls-en-banner" id="btnClsSpeakEn" data-en="${esc(enLine)}" title="点我听这句英文科学总结">
              <span>🇬🇧 🔊</span>
              <span>${esc(enLine)}</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
              <button type="button" class="mini-btn" id="btnClsOpenCard">📖 打开完整 3D 档案</button>
              <button type="button" class="big-action-btn" id="btnClsNext" style="padding:8px 20px;min-height:40px;font-size:0.92rem;">下一个标本 ➜</button>
            </div>
          </div>
        `;
        this.render();
        if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish && enLine) {
          window.DoubaoTTS.speakEnglish(enLine, { playTapSfx: false });
        }
      } else {
        this.lastWrongBay = bayId;
        this.streak = 0;
        if (window.SFX) window.SFX.bonk();
        let hint = "";
        if (this.mode === "strategy") {
          hint =
            rightBay === "venom"
              ? "💡 小提示：它会主动用毒牙、毒刺或鱼叉把毒液注射进目标体内哦！"
              : rightBay === "poison"
              ? "💡 小提示：它不会主动扎人，而是把毒藏在皮肤、羽毛、叶子或菌盖里防被吃哦！"
              : "💡 小提示：它不是活生生的动植物，而是地壳里的矿石或化学物质哦！";
        } else {
          hint = `💡 小提示：瞄一眼它的武器【${item.molecule}】，想想它最擅长攻击身体的哪个系统？`;
        }
        this.feedbackHTML = `<div style="color:var(--c-warn-text);font-weight:800;padding:8px 12px;background:rgba(251,191,36,0.14);border:1.5px solid rgba(251,191,36,0.5);border-radius:14px;">${this.app.ruby(hint)}</div>`;
        this.render();
      }
    }

    render() {
      if (!this.mountEl || !this.currentItem) return;
      const item = this.currentItem;
      const photo = this.app.getPhoto(item.id);
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[item.id]) || {};
      const sortedCnt = (this.app.state.sortedCorrect || []).filter((k) => k.startsWith(`${this.mode}_`)).length;
      const totalPool = this._getPool().length;

      const strategyBays = [
        { id: "venom", icon: "🗡️", title: "Venom · 主动注射型", en: "Bites, stings, or injects!", color: "#fb7185" },
        { id: "poison", icon: "🛡️", title: "Poison · 被动防御型", en: "Toxic if eaten or touched!", color: "#4ade80" },
        { id: "mineral_chem", icon: "💎", title: "Mineral & Chem · 矿物化学", en: "Rocks, crystals & chemicals!", color: "#38bdf8" }
      ];

      const mechBays = [
        { id: "neuro", icon: "⚡", title: "神经信号拦截器", en: "Neuro · Nerves & Channels", color: "#38bdf8" },
        { id: "blood", icon: "🩸", title: "血液血管破坏者", en: "Blood · Clotting & Vessels", color: "#fb7185" },
        { id: "cell", icon: "🏭", title: "细胞工厂停摆器", en: "Cell · Factory & DNA", color: "#c084fc" },
        { id: "enzyme", icon: "🔥", title: "代谢与酶劫持者", en: "Enzyme · Metabolism Lock", color: "#fbbf24" },
        { id: "physical", icon: "🛡️", title: "微型鱼叉与刺针", en: "Physical · Needles & Stings", color: "#34d399" }
      ];

      const bays = this.mode === "strategy" ? strategyBays : mechBays;
      const rightBay = this.mode === "strategy" ? item.strategy : item.mech;

      this.mountEl.innerHTML = `
        <div class="cls-lab-shell">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${this.mode === "strategy" ? "active" : ""}" data-clsmode="strategy">
                ⚖️ 模式A：Venom(注射) vs Poison(防御) vs 矿物
              </button>
              <button type="button" class="scene-pill ${this.mode === "mech" ? "active" : ""}" data-clsmode="mech">
                🔬 模式B：五大生化靶点实验室
              </button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <span class="mini-btn" style="pointer-events:none;">✅ 已分类 ${sortedCnt}/${totalPool}</span>
              <span class="live-en-streak-pill">🔥 连对：${this.streak} 题</span>
            </div>
          </div>

          <div class="cls-specimen-stage">
            <div class="cls-specimen-card">
              <div class="cls-photo-wrap">
                ${photo ? `<img src="${esc(photo)}" alt="${esc(item.name)}" class="cls-photo" />` : `<div class="cls-emoji-fallback">${item.emoji}</div>`}
                <span class="cls-code-tag">${esc(item.code)}</span>
              </div>
              <div class="cls-specimen-meta">
                <div class="cls-specimen-name">${item.emoji} ${this.app.ruby(item.name)}</div>
                ${
                  ce.enName
                    ? `<button type="button" class="cls-en-chip" id="btnClsPronounce" title="点我听英文名字">
                         🇬🇧 ${esc(ce.enName)} 🔊
                       </button>`
                    : ""
                }
                <div class="cls-weapon-clue">
                  ${
                    this.mode === "mech"
                      ? `🧪 秘密武器：<strong>${this.app.ruby(item.molecule)}</strong>`
                      : `🤔 请判断：这位主角属于 <strong>Venom（主动注射）</strong>、<strong>Poison（被动防御）</strong> 还是 <strong>矿物化学</strong>？`
                  }
                </div>
              </div>
            </div>

            <div class="cls-bays-grid ${this.mode === "mech" ? "five-bays" : "three-bays"}">
              ${bays
                .map((b) => {
                  const isRightPicked = this.answered && b.id === rightBay;
                  const isWrongPicked = this.lastWrongBay === b.id;
                  return `
                    <button type="button" class="cls-bay-btn ${isRightPicked ? "bay-right" : ""} ${isWrongPicked ? "bay-wrong" : ""}" data-bay="${b.id}" style="--bay-color:${b.color};">
                      <span class="cls-bay-icon">${b.icon}</span>
                      <div class="cls-bay-title">${b.title}</div>
                      <div class="cls-bay-en">${b.en}</div>
                    </button>
                  `;
                })
                .join("")}
            </div>

            <div style="margin-top:12px;">${this.feedbackHTML}</div>
          </div>
        </div>
      `;

      this.mountEl.querySelectorAll("[data-clsmode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nextMode = btn.getAttribute("data-clsmode");
          if (nextMode === this.mode) return;
          if (window.SFX) window.SFX.pop();
          this.mode = nextMode;
          this.nextSpecimen();
        });
      });

      const bPron = document.getElementById("btnClsPronounce");
      if (bPron && ce.enName) {
        bPron.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(ce.enName, { repeat: 2 });
          } else {
            this.app.speak(ce.enName);
          }
        });
      }

      this.mountEl.querySelectorAll(".cls-bay-btn").forEach((btn) => {
        btn.addEventListener("click", () => this._handlePick(btn.getAttribute("data-bay")));
      });

      const bEn = document.getElementById("btnClsSpeakEn");
      if (bEn) {
        bEn.addEventListener("click", () => {
          const txt = bEn.getAttribute("data-en") || bEn.textContent.replace("🇬🇧 🔊", "").trim();
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(txt, { repeat: 1 });
          }
        });
      }

      const bOpen = document.getElementById("btnClsOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(item.id));

      const bNext = document.getElementById("btnClsNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.nextSpecimen();
        });
      }
    }
  }

  // ==========================================================================
  // 模块 2：🛡️ 生活安全大冒险 · 16关实景守护 (Stage 4 · Game 6)
  // ==========================================================================
  class SafetyAdventureArena {
    constructor(mountEl, app) {
      this.mountEl = mountEl;
      this.app = app;
      this.cat = "all"; // 'all' | 'kitchen' | 'wild' | 'home'
      this.idx = 0;
      this.pickedIdx = -1;
      this.solvedCurrent = false;
      this.reviewingWin = false;
    }

    init() {
      if (!this.mountEl) return;
      this.render();
    }

    _getFiltered() {
      if (this.cat === "all") return SAFETY_SCENARIOS;
      return SAFETY_SCENARIOS.filter((s) => s.cat === this.cat);
    }

    render() {
      if (!this.mountEl) return;
      const en = window.isEn ? window.isEn() : true;
      const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : esc(txt));
      const enSafety = (window.DUWU_I18N && window.DUWU_I18N.getStagesEn().SAFETY_SCENARIOS) || {};

      const list = this._getFiltered();
      if (this.idx >= list.length) this.idx = 0;
      const sc = list[this.idx];
      if (!sc) return;
      const enSc = enSafety[sc.id] || null;

      const wonList = this.app.state.safetyWon || [];
      const alreadyWon = wonList.includes(sc.id);
      const totalWon = SAFETY_SCENARIOS.filter((x) => wonList.includes(x.id)).length;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[sc.cardId]) || {};
      const illu = ce.illuSrc || this.app.getPhoto(sc.cardId) || "assets/scenes/panorama.jpg";
      const photo = this.app.getPhoto(sc.cardId);
      const showWin = this.solvedCurrent || this.reviewingWin;

      const scTitle = en && enSc ? enSc.title : sc.title;
      const scScene = en && enSc ? enSc.scene : sc.scene;
      const scCatLabel = en && enSc ? enSc.catLabel : sc.catLabel;
      const scExplain = en && enSc ? enSc.explain : sc.explain;
      const scOpts = sc.opts.map((o, i) => ({
        ...o,
        text: en && enSc && enSc.opts && enSc.opts[i] ? enSc.opts[i].text : o.text
      }));

      this.mountEl.innerHTML = `
        <div class="safety-arena-shell">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${this.cat === "all" ? "active" : ""}" data-sfcat="all">${en ? "🌟 All 16 Quests" : "🌟 全部 16 关"}</button>
              <button type="button" class="scene-pill ${this.cat === "kitchen" ? "active" : ""}" data-sfcat="kitchen">${en ? "🍳 Kitchen & Food" : "🍳 厨房餐桌"}</button>
              <button type="button" class="scene-pill ${this.cat === "wild" ? "active" : ""}" data-sfcat="wild">${en ? "🏖️ Beach & Wild" : "🏖️ 海边野外"}</button>
              <button type="button" class="scene-pill ${this.cat === "home" ? "active" : ""}" data-sfcat="home">${en ? "🏠 Home & Pets" : "🏠 居家萌宠"}</button>
            </div>
            <div class="en-pg-mastered-pill">🛡️ ${en ? `Protected ${totalWon}/${SAFETY_SCENARIOS.length}` : `已守护 ${totalWon}/${SAFETY_SCENARIOS.length} 个场景`}</div>
          </div>

          <!-- 关卡圆点导航条 -->
          <div class="safety-dots-bar">
            ${list
              .map((item, i) => {
                const done = wonList.includes(item.id);
                const eIt = enSafety[item.id];
                const tLabel = en && eIt ? eIt.title.slice(0, 14) : item.title.slice(0, 8);
                return `
                  <button type="button" class="safety-dot-pill ${i === this.idx ? "active" : ""} ${done ? "done" : ""}" data-sfidx="${i}">
                    ${done ? "✅" : i + 1} ${esc(tLabel)}…
                  </button>
                `;
              })
              .join("")}
          </div>

          <div class="safety-stage-grid">
            <!-- 左侧写实插画情景 -->
            <div class="safety-visual-card">
              <div class="safety-illu-frame">
                <img src="${esc(illu)}" alt="${esc(scTitle)}" class="safety-illu-img" />
                <span class="safety-cat-badge">${esc(scCatLabel)} · ${en ? `${this.idx + 1}/${list.length}` : `第 ${this.idx + 1}/${list.length} 关`}</span>
                ${photo ? `<img src="${esc(photo)}" alt="" class="safety-corner-photo" title="Related species" />` : ""}
              </div>
              <h3 class="safety-title">🚨 ${en ? flip(scTitle) : this.app.ruby(scTitle)}</h3>
              <div class="safety-story-box">${en ? flip(scScene) : this.app.ruby(scScene)}</div>
            </div>

            <!-- 右侧三大行动决策 + 双语安全口诀 -->
            <div class="safety-action-col">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <div style="font-weight:900;font-size:1.02rem;color:var(--c-warn-text);">
                  ${en ? "🤔 Safety Hero, what is the smartest thing to do?" : "🤔 小安全卫士，遇到这种情况你应该怎么做？"}
                </div>
                ${
                  alreadyWon && !showWin
                    ? `<button type="button" class="mini-btn on" id="btnSfReviewWin" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">${en ? "✅ Cleared · Review Motto" : "✅ 已通关 · 复习金句"}</button>`
                    : ""
                }
              </div>
              <div class="safety-opts-list">
                ${scOpts
                  .map((o, oIdx) => {
                    const isPicked = this.pickedIdx === oIdx;
                    const cls =
                      (showWin && o.ok) || (isPicked && o.ok)
                        ? "picked-right"
                        : isPicked && !o.ok
                        ? "picked-wrong"
                        : "";
                    return `
                      <button type="button" class="safety-opt-btn ${cls}" data-sfopt="${oIdx}">
                        <span class="safety-opt-icon">${o.icon}</span>
                        <span class="safety-opt-txt">${en ? esc(o.text) : this.app.ruby(o.text)}</span>
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              ${
                this.pickedIdx >= 0 && !sc.opts[this.pickedIdx].ok
                  ? `<div style="margin-top:10px;padding:10px 14px;border-radius:14px;background:rgba(251,113,133,0.16);border:1.5px solid #fb7185;color:var(--c-err-text);font-weight:800;font-size:0.9rem;">
                       ${en ? "🙈 Careful! That could be risky! Think about the science and pick the safest plan!" : "🙈 哎呀这样会中招哦！想想《致命毒物大百科》里的科学原理，再选一个安全方案试试！"}
                     </div>`
                  : ""
              }

              ${
                showWin
                  ? `
                <div class="safety-win-panel">
                  <div class="safety-explain-txt">🎉🛡️ ${en ? flip(scExplain) : this.app.ruby(scExplain)}</div>
                  <div class="safety-en-motto-card" id="btnSfSpeakMotto" title="Tap to listen">
                    <div class="safety-motto-top">
                      <span class="bilingual-tag">🇬🇧 ${en ? "Safety Golden Motto" : "英文安全金句 ×2遍"}</span>
                      <span style="font-size:0.78rem;color:var(--c-teal-text);font-weight:900;">🔊 ${en ? "Tap to Listen" : "点我跟读"}</span>
                    </div>
                    <div class="safety-motto-en">${en ? flip(sc.enMotto) : esc(sc.enMotto)}</div>
                    ${!en ? `<div class="safety-motto-zh">${this.app.ruby(sc.zhMotto)}</div>` : ""}
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
                    <button type="button" class="mini-btn" id="btnSfOpenCard">📖 ${en ? "Open Fact Card" : "看对应百科档案"}</button>
                    <button type="button" class="big-action-btn" id="btnSfNext" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">
                      ${this.idx + 1 < list.length ? (en ? "Next Adventure ➜" : "下一关冒险 ➜") : (en ? "Back to Quest 1 🔄" : "回到第 1 关 🔄")}
                    </button>
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      this.mountEl.querySelectorAll("[data-sfcat]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.cat = b.getAttribute("data-sfcat");
          this.idx = 0;
          this.pickedIdx = -1;
          this.solvedCurrent = false;
          this.reviewingWin = false;
          this.render();
        });
      });

      this.mountEl.querySelectorAll("[data-sfidx]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.idx = parseInt(b.getAttribute("data-sfidx"), 10) || 0;
          this.pickedIdx = -1;
          this.solvedCurrent = false;
          this.reviewingWin = false;
          this.render();
        });
      });

      const bReviewWin = document.getElementById("btnSfReviewWin");
      if (bReviewWin) {
        bReviewWin.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.reviewingWin = true;
          this.render();
        });
      }

      this.mountEl.querySelectorAll("[data-sfopt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const oIdx = parseInt(btn.getAttribute("data-sfopt"), 10);
          const opt = sc.opts[oIdx];
          if (!opt) return;
          this.pickedIdx = oIdx;
          if (opt.ok) {
            this.solvedCurrent = true;
            if (window.SFX) window.SFX.chime();
            const s = this.app.state;
            if (!Array.isArray(s.safetyWon)) s.safetyWon = [];
            const firstTime = !s.safetyWon.includes(sc.id);
            if (firstTime) {
              s.safetyWon.push(sc.id);
              this.app.addStars(3);
            } else {
              this.app.addStars(1);
            }
            if (this.app.trackMission) this.app.trackMission("knowledge", 1);
            if (window.PlaygroundFX) window.PlaygroundFX.celebrate(this.mountEl);
            this.render();
            if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
              window.DoubaoTTS.speakEnglish(sc.enMotto, { repeat: 2, playTapSfx: false });
            }
          } else {
            if (window.SFX) window.SFX.bonk();
            this.render();
          }
        });
      });

      const bMotto = document.getElementById("btnSfSpeakMotto");
      if (bMotto) {
        bMotto.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(sc.enMotto, { repeat: 2 });
          } else {
            this.app.speak(sc.enMotto);
          }
        });
      }

      const bOpen = document.getElementById("btnSfOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(sc.cardId));

      const bNext = document.getElementById("btnSfNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.idx = (this.idx + 1) % list.length;
          this.pickedIdx = -1;
          this.solvedCurrent = false;
          this.reviewingWin = false;
          this.render();
        });
      }

      const activeDot = this.mountEl.querySelector(".safety-dot-pill.active");
      if (activeDot && typeof activeDot.scrollIntoView === "function") {
        try {
          activeDot.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        } catch (_) {}
      }
    }
  }

  // ==========================================================================
  // 24 关《致命毒物大百科》科学真假大法官题库 (True / False + 英文科学金句)
  // ==========================================================================
  const MYTH_QUESTIONS = [
    {
      id: "myth_white_mush",
      cat: "nature",
      cardId: "ch5-01",
      stmt: "只有颜色鲜艳的花蘑菇才有毒，纯白干净的野生蘑菇都能煮汤吃。",
      isTrue: false,
      explain: "大错特错！头号毒蘑菇『鳞柄白鹅膏』全身雪白无瑕，菌柄带裙、底部穿靴，哪怕只吃一小口就可能致命，绝不能按颜色判断野蘑菇！",
      enFact: "Pure white wild mushrooms can be super deadly!",
      zhFact: "纯白色的野生蘑菇也可能超级致命！"
    },
    {
      id: "myth_zoo_frog",
      cat: "nature",
      cardId: "ch1-09",
      stmt: "动物园里吃普通果蝇长大的黄金箭毒蛙宝宝，皮肤里其实一点毒都没有！",
      isTrue: true,
      explain: "千真万确！箭毒蛙自己不会造毒，它们靠吃雨林里的有毒蚂蚁和甲虫，把生物碱分子『借』到皮肤腺体里当护甲！",
      enFact: "Zoo frogs eating fruit flies are not poisonous!",
      zhFact: "动物园里吃果蝇长大的箭毒蛙其实没有毒！"
    },
    {
      id: "myth_boil_amanita",
      cat: "law",
      cardId: "ch5-01",
      stmt: "只要在 100°C 沸水里多煮半小时，就能把鳞柄白鹅膏里的毒素彻底煮坏。",
      isTrue: false,
      explain: "千万别信！鹅膏毒肽是焊死成『8字双环硫醚桥』的小铁锁，250°C 都煮不散架，所以绝不能抱侥幸心理去煮野蘑菇！",
      enFact: "Boiling water cannot destroy death cap mushroom toxin!",
      zhFact: "沸水根本破坏不了鹅膏毒蘑菇的毒素！"
    },
    {
      id: "myth_boil_beans",
      cat: "law",
      cardId: "ch4-02",
      stmt: "生四季豆有毒，但在 100°C 沸水里彻底煮透变软后，毒素会散架变成安全美食。",
      isTrue: true,
      explain: "完全正确！生四季豆的毒素『植物血球凝集素』是大分子蛋白质，遇 100°C 高温彻底焖煮就会变性失活，放心享用！",
      enFact: "Well-cooked kidney beans are completely safe to eat!",
      zhFact: "彻底煮熟的四季豆是完全安全可以吃的！"
    },
    {
      id: "myth_venom_poison",
      cat: "law",
      cardId: "ch1-06",
      stmt: "英文里『毒蛇的毒』和『箭毒蛙皮肤的毒』都叫 Poison，没有任何区别。",
      isTrue: false,
      explain: "它们有黄金区别哦！主动咬、蛰、注射进体内的毒叫 Venom（毒液）；吃下去或摸到才中毒的叫 Poison（毒物）！记住：If it bites you, it's venom; if you eat it, it's poison!",
      enFact: "Venom is injected, while poison is eaten or touched!",
      zhFact: "Venom 是主动注射的毒液，Poison 是吃进或摸到的毒物！"
    },
    {
      id: "myth_ttx_twin",
      cat: "nature",
      cardId: "ch6-08",
      stmt: "红鳍东方鲀和蓝环章鱼虽是完全不同的海洋动物，体内却藏着同一种河鲀毒素(TTX)！",
      isTrue: true,
      explain: "神奇的海洋盟友！它们俩的 TTX 都源自海洋细菌，河鲀存进肝脏卵巢，蓝环章鱼存进唾液腺，都是堵死钠离子城门的软木塞！",
      enFact: "Both pufferfish and blue-ringed octopuses carry TTX!",
      zhFact: "河鲀和蓝环章鱼都携带河鲀毒素 TTX！"
    },
    {
      id: "myth_toxic_bird",
      cat: "nature",
      cardId: "ch1-03",
      stmt: "世界上真的存在会飞的毒鸟『黑头林鵙鹟』，羽毛里带着和箭毒蛙同款的毒素！",
      isTrue: true,
      explain: "超酷的真实发现！生活在新几内亚的黑头林鵙鹟和南美箭毒蛙隔着半个地球，却都爱吃同家族有毒甲虫，攒出了同款树蛙毒素！",
      enFact: "The hooded pitohui is a real bird with toxic feathers!",
      zhFact: "黑头林鵙鹟是真实存在的毒羽毛小鸟！"
    },
    {
      id: "myth_platypus",
      cat: "nature",
      cardId: "ch1-01",
      stmt: "鸭嘴兽是极少数带毒的哺乳动物，而且只有雄性后脚踝长着空心毒刺。",
      isTrue: true,
      explain: "答对啦！雄性鸭嘴兽后脚踝有空心毒距，会分泌 80 多种混合多肽毒液，科学家还从中发现了启发糖尿病新药的稳定激素！",
      enFact: "Male platypuses have venomous spurs on their back feet!",
      zhFact: "雄性鸭嘴兽的后脚长着有毒的空心毒距！"
    },
    {
      id: "myth_snake_frog",
      cat: "nature",
      cardId: "ch1-04",
      stmt: "虎斑颈槽蛇脖子后面能喷毒，其实是从它吃掉的蟾蜍身上『借』来的毒！",
      isTrue: true,
      explain: "借毒大师二号！虎斑颈槽蛇自己不造颈腺毒，而是把吃掉的蟾蜍毒素存进脖子后的腺体袋子里，遇到天敌就亮出来防身！",
      enFact: "This tiger snake borrows poison from the toads it eats!",
      zhFact: "虎斑颈槽蛇从它吃掉的蟾蜍身上借毒！"
    },
    {
      id: "myth_ttx_stomach",
      cat: "law",
      cardId: "ch6-01",
      stmt: "河鲀毒素(TTX)吃进肚子里会被胃蛋白酶大剪刀剪成无毒营养碎片。",
      isTrue: false,
      explain: "可别搞混啦！胃蛋白酶只剪蛋白质大分子（如蛇毒）；河鲀毒素 TTX 是结实的笼状小分子，胃酸完全剪不动，误食照样剧毒！",
      enFact: "Stomach acid cannot break down small TTX molecules!",
      zhFact: "胃酸剪不断结实的河鲀毒素小分子！"
    },
    {
      id: "myth_water_dose",
      cat: "law",
      cardId: "ch0-04",
      stmt: "纯净水是最健康的东西，就算一两小时内一口气猛灌 6 升白水也绝对不会中毒。",
      isTrue: false,
      explain: "记住帕拉塞尔苏斯黄金定律：『剂量决定毒与药』！短时间猛喝太多水会稀释血液盐分，引发低钠血症（水中毒），喝水也要分次适量哦！",
      enFact: "The dose makes the poison, even for pure water!",
      zhFact: "剂量决定了它是毒还是药，连纯净水也不例外！"
    },
    {
      id: "myth_dog_choco",
      cat: "law",
      cardId: "ch0-01",
      stmt: "香甜的黑巧克力对人类和小狗都一样安全，可以经常掰给狗狗当零食。",
      isTrue: false,
      explain: "千万不要喂狗狗巧克力！狗狗肝脏里的分解酶太慢，拆不掉巧克力里的可可碱，会让小狗心跳乱套甚至中毒！",
      enFact: "Chocolate is tasty for people, but toxic for dogs!",
      zhFact: "巧克力对人很美味，但对小狗有毒！"
    },
    {
      id: "myth_inkcap_beer",
      cat: "law",
      cardId: "ch5-14",
      stmt: "吃完墨汁鬼伞蘑菇后如果喝啤酒，蘑菇里的鬼伞素会锁死肝脏解酒酶导致中毒。",
      isTrue: true,
      explain: "生化神探！鬼伞素会卡住负责分解乙醛的 2 号解酒酶，只要一碰酒精，有毒的乙醛就会在血管大堵车让人难受！",
      enFact: "Ink cap mushrooms block the body from breaking down alcohol!",
      zhFact: "墨汁鬼伞会挡住身体分解酒精的通路！"
    },
    {
      id: "myth_bee_squeeze",
      cat: "safety",
      cardId: "ch2-02",
      stmt: "被蜜蜂蛰了后，应该立刻用两根手指捏住皮肤上的白色小毒囊用力拔出来。",
      isTrue: false,
      explain: "越捏越痛哦！捏小毒囊就像挤眼药水，会把毒液全挤进皮肤里！正确做法是用硬卡片贴着皮肤平行轻轻刮掉毒刺！",
      enFact: "Scrape a bee stinger off gently, never squeeze it!",
      zhFact: "用卡片轻轻刮掉蜂刺，千万别挤捏毒囊！"
    },
    {
      id: "myth_moth_rub",
      cat: "safety",
      cardId: "ch2-06",
      stmt: "如果毒蛾毛毛虫的隐形毒毛落到手臂上又痒又红，应该赶紧用力搓揉擦干净。",
      isTrue: false,
      explain: "千万别搓！带倒钩的空心毒毛越挠越往皮肤里钻！应该用透明胶带轻轻粘走毒毛，再用流水和肥皂冲洗！",
      enFact: "Lift tiny moth hairs with tape and never rub your skin!",
      zhFact: "用透明胶带粘走毒蛾毒毛，千万别揉搓皮肤！"
    },
    {
      id: "myth_dead_jelly",
      cat: "safety",
      cardId: "ch6-13",
      stmt: "沙滩上已经搁浅死掉的僧帽水母不再有生命，可以放心光手捡起来玩。",
      isTrue: false,
      explain: "超级危险！水母触手上数百万个微型刺丝囊鱼叉靠物理压力触发，即使水母死了，碰一下依然会瞬间发射毒针！",
      enFact: "Even dead jellyfish tentacles on the beach can still sting!",
      zhFact: "就算沙滩上死掉的水母触手依然会蛰人！"
    },
    {
      id: "myth_oleander_flower",
      cat: "safety",
      cardId: "ch3-17",
      stmt: "夹竹桃只是树枝有毒，它的粉红花瓣很香，可以摘下来泡花茶喝。",
      isTrue: false,
      explain: "全株都有剧毒！夹竹桃从花瓣、叶子、树枝到树汁都含强心苷，连燃烧的烟雾都有毒，只能远远用眼睛欣赏哦！",
      enFact: "Every part of the oleander plant is poisonous!",
      zhFact: "夹竹桃的每一个部位都是有毒的！"
    },
    {
      id: "myth_potato_boil",
      cat: "safety",
      cardId: "ch4-01",
      stmt: "发芽变绿的土豆只要多加点水煮久一点，里面的龙葵碱就会被煮没。",
      isTrue: false,
      explain: "煮不坏哦！土豆绿皮和芽眼里的『龙葵碱』耐 200°C 以上高温，普通煮炒炸根本破坏不了，发芽变绿严重的土豆要果断丢掉！",
      enFact: "Cooking heat does not remove solanine from green potatoes!",
      zhFact: "做饭的高温去不掉变绿土豆里的龙葵碱！"
    },
    {
      id: "myth_bleach_mix",
      cat: "safety",
      cardId: "ch8-03",
      stmt: "大扫除时把 84 消毒液和酸性洁厕灵混倒进马桶，清洁力翻倍且非常安全。",
      isTrue: false,
      explain: "绝对禁止！含氯消毒液遇上酸性洁厕灵会瞬间发生化学反应，冒出剧毒黄绿色『氯气』伤害肺部，清洁剂永远不能乱混！",
      enFact: "Mixing bleach and acid cleaner makes dangerous chlorine gas!",
      zhFact: "把消毒液和酸性洁厕灵混合会产生危险的氯气！"
    },
    {
      id: "myth_viper_med",
      cat: "safety",
      cardId: "ch1-05",
      stmt: "科学家竟然能从剧毒蝮蛇毒液中获得灵感，造出拯救无数人的降血压良药！",
      isTrue: true,
      explain: "化毒为药的奇迹！科学家受巴西蝮蛇毒液让猎物血压骤降的启发，研发出了经典降压药『卡托普利』！",
      enFact: "Viper venom inspired life-saving blood pressure medicine!",
      zhFact: "蝮蛇毒液启发了救命的降血压药物！"
    },
    {
      id: "myth_cone_pain",
      cat: "safety",
      cardId: "ch6-07",
      stmt: "会射毒鱼叉的地纹芋螺，它的芋螺毒素被科学家改造成了超强止痛新药『齐考诺肽』！",
      isTrue: true,
      explain: "太厉害啦！地纹芋螺毒素能精准锁住痛觉神经的钙离子通道，科学家精准控制剂量后造出了不让人上瘾的强力止痛药！",
      enFact: "Cone snail venom helped scientists make strong pain medicine!",
      zhFact: "芋螺毒液帮科学家造出了强力止痛药！"
    },
    {
      id: "myth_scorpion_paint",
      cat: "safety",
      cardId: "ch2-05",
      stmt: "以色列金蝎毒液里的氯毒素，连上荧光分子后能变成『肿瘤荧光画笔』帮医生精准做手术！",
      isTrue: true,
      explain: "酷炫的化毒为药！氯毒素会精准黏在癌细胞表面而不碰健康细胞，给它装上发光小灯就能帮外科医生把肿瘤看得清清楚楚！",
      enFact: "Scorpion toxin can light up tumor cells for doctors!",
      zhFact: "蝎子毒素能像荧光笔一样帮医生点亮肿瘤细胞！"
    },
    {
      id: "myth_foxglove_heart",
      cat: "safety",
      cardId: "ch3-06",
      stmt: "毛地黄里的强心苷（地高辛）精准用微量是救心脏的百年良药，吃过量则会变回毒药。",
      isTrue: true,
      explain: "治疗窗最经典的教科书案例！每天 0.125~0.25 毫克能帮衰竭的心脏有力跳动，多吃几倍就会引发心律紊乱，必须由医生严格把控剂量！",
      enFact: "Foxglove medicine heals the heart only in tiny doses!",
      zhFact: "毛地黄药物只有在极微精准剂量下才能治好心脏！"
    },
    {
      id: "myth_aconite_cut",
      cat: "law",
      cardId: "ch3-01",
      stmt: "中药炮制乌头时用热水长时间蒸煮水解，能剪掉乌头碱分子上的两个酯基让毒性骤降。",
      isTrue: true,
      explain: "分子手术大师！乌头碱上有两个带炸弹威力的红色酯基，长时间水煮水解把它们剪掉变成『乌头原碱』，毒性就会下降几百倍！",
      enFact: "Steaming cuts toxic groups off aconitine molecules!",
      zhFact: "蒸煮水解能剪掉乌头碱分子上的剧毒基团！"
    }
  ];

  // ==========================================================================
  // 模块 3：🕵️ 神秘毒物三步破案 (Stage 4 · Game 7 — 95物种推理 + 英文线索)
  // ==========================================================================
  class MysteryDetectiveArena {
    constructor(mountEl, app) {
      this.mountEl = mountEl;
      this.app = app;
      this.caseTarget = null;
      this.suspects = [];
      this.clueLevel = 1; // 1, 2, 3
      this.solved = false;
      this.wrongIds = new Set();
      this.streak = 0;
    }

    init() {
      if (!this.mountEl) return;
      this.nextCase();
    }

    _maskName(text, item, ce) {
      let s = String(text || "");
      if (item && item.name) {
        s = s.split(item.name).join("【神秘主角】");
        if (item.name.length >= 3) {
          s = s.split(item.name.slice(-2)).join("【它】");
        }
        if (item.name.includes("东方鲀")) s = s.split("河鲀").join("【它】");
      }
      if (ce && ce.enName) {
        const escaped = ce.enName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        s = s.replace(new RegExp(escaped + "(?:s|es)?", "ig"), "???");
      }
      return s;
    }

    nextCase() {
      const ceMap = window.CURIOSITY_ENGLISH_DATA || {};
      const pool = (window.CATALOG_DATA || []).filter(
        (x) => x.chapter !== "ch0" && ceMap[x.id] && this.app.getPhoto(x.id)
      );
      if (pool.length < 4) return;
      const wonSet = new Set(this.app.state.detectiveCasesWon || []);
      const fresh = pool.filter((x) => !wonSet.has(x.id) && (!this.caseTarget || x.id !== this.caseTarget.id));
      const candidates = fresh.length > 0 ? fresh : pool.filter((x) => !this.caseTarget || x.id !== this.caseTarget.id);
      const ans = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];

      // 优先挑 1 个同章干扰项 + 2 个跨章干扰项，既有挑战又有趣
      const sameCh = pool.filter((x) => x.id !== ans.id && x.chapter === ans.chapter).sort(() => Math.random() - 0.5);
      const otherCh = pool.filter((x) => x.id !== ans.id && x.chapter !== ans.chapter).sort(() => Math.random() - 0.5);
      const distractors = [...sameCh.slice(0, 1), ...otherCh].slice(0, 3);

      this.caseTarget = ans;
      this.suspects = [ans, ...distractors].sort(() => Math.random() - 0.5);
      this.clueLevel = 1;
      this.solved = false;
      this.wrongIds = new Set();
      this.render();
    }

    _handleGuess(suspectId, btnEl) {
      if (this.solved || !this.caseTarget) return;
      if (suspectId === this.caseTarget.id) {
        this.solved = true;
        const solvedLvl = this._solvedAtLevel || this.clueLevel || 1;
        this.clueLevel = 3;
        this.streak += 1;
        // 简洁公平计星：线索1破案+3⭐，线索2破案+2⭐，线索3破案+1⭐
        const starEarned = this.wrongIds.size > 0 ? 1 : Math.max(1, 4 - solvedLvl);
        this.lastStarsEarned = starEarned;
        if (window.SFX) window.SFX.chime();
        const s = this.app.state;
        if (!Array.isArray(s.detectiveCasesWon)) s.detectiveCasesWon = [];
        if (!s.detectiveCasesWon.includes(this.caseTarget.id)) {
          s.detectiveCasesWon.push(this.caseTarget.id);
        }
        this.app.addStars(starEarned);
        if (this.app.trackMission) this.app.trackMission("knowledge", 1);
        if (window.PlaygroundFX) window.PlaygroundFX.celebrate(btnEl || this.mountEl);
        this.render();
        const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[this.caseTarget.id]) || {};
        if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish && ce.enName) {
          const line = `${ce.enName}! ${(ce.enScene && ce.enScene.en) || ""}`.trim();
          window.DoubaoTTS.speakEnglish(line, { playTapSfx: false });
        }
      } else {
        this.wrongIds.add(suspectId);
        this.streak = 0;
        if (window.SFX) window.SFX.bonk();
        if (this.clueLevel < 3) this.clueLevel += 1;
        this.render();
      }
    }

    render() {
      if (!this.mountEl || !this.caseTarget) return;
      const ans = this.caseTarget;
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[ans.id]) || {};
      const bi = (window.BILINGUAL_NOTES && window.BILINGUAL_NOTES[ans.id]) || {};
      const chObj = (window.CHAPTERS || []).find((c) => c.id === ans.chapter) || { icon: "📖", short: ans.chapter };
      const stObj = (window.STRATEGIES && window.STRATEGIES[ans.strategy]) || { label: ans.strategy };
      const mechObj = (window.MECHANISMS && window.MECHANISMS[ans.mech]) || { name: ans.mech };
      const wonTotal = (this.app.state.detectiveCasesWon || []).length;
      const potentialStars = this.wrongIds.size > 0 ? 1 : Math.max(1, 4 - this.clueLevel);

      const enClueRaw = (ce.enScene && ce.enScene.en) || bi.en || "";
      const enClueMasked = this.solved ? enClueRaw : this._maskName(enClueRaw, ans, ce);
      const lifeClue = this.solved ? ce.lifeStory || ans.summary : this._maskName(ce.lifeStory || ans.summary, ans, ce);
      const ansPhoto = this.app.getPhoto(ans.id);

      this.mountEl.innerHTML = `
        <div class="cls-lab-shell detective-case-shell">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <span class="mini-btn on" style="pointer-events:none;">🕵️ 已破获 ${wonTotal}/95 宗奇案</span>
              <span class="mini-btn" style="pointer-events:none;">⭐ 本案悬赏：+${potentialStars}⭐</span>
            </div>
            <div class="live-en-streak-pill">🔥 连续破案：${this.streak} 宗</div>
          </div>

          <div class="det-case-grid">
            <!-- 左侧：三步递进线索档案板 -->
            <div class="det-clue-board">
              <div class="det-clue-card unlocked">
                <div class="det-clue-head">
                  <span>🔍 线索 1 · 生态标签 + 🇬🇧 英文情报</span>
                  <span class="det-star-tag">一步破案 +3⭐</span>
                </div>
                <div class="det-tags-row">
                  <span class="det-fact-pill">${chObj.icon} ${esc(chObj.short)}</span>
                  <span class="det-fact-pill">${stObj.label}</span>
                </div>
                ${
                  enClueMasked
                    ? `<div class="det-en-clue-box">
                         <div class="det-en-clue-txt">🇬🇧 “${esc(enClueMasked)}”</div>
                         <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                           <button type="button" class="mini-btn on" id="btnDetSpeakEn" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">🔊 听英文线索</button>
                           <button type="button" class="mini-btn" id="btnDetSpeakEnSlow" style="padding:4px 10px;min-height:30px;font-size:0.78rem;">🐢 慢速听</button>
                         </div>
                       </div>`
                    : ""
                }
              </div>

              ${
                this.clueLevel >= 2
                  ? `<div class="det-clue-card unlocked">
                       <div class="det-clue-head">
                         <span>🧪 线索 2 · 秘密化学武器 &amp; 英文关键词</span>
                         <span class="det-star-tag">两步破案 +2⭐</span>
                       </div>
                       <div style="font-size:0.9rem;font-weight:800;line-height:1.55;">
                         <div>⚗️ 毒素武器：<strong>${this.app.ruby(ans.molecule)}</strong></div>
                         <div>🎯 攻击靶点：<strong>${mechObj.name}</strong></div>
                       </div>
                       <div class="det-tags-row" style="margin-top:6px;">
                         ${(ce.vocab || [])
                           .map((v) => `<span class="det-vocab-chip">${v.icon || "🔤"} <strong>${esc(v.w)}</strong> (${esc(v.zh)})</span>`)
                           .join("")}
                       </div>
                     </div>`
                  : `<button type="button" class="det-unlock-btn" id="btnDetUnlock2">
                       🔓 解锁线索 2（查看化学武器 + 3个英文关键词）
                     </button>`
              }

              ${
                this.clueLevel >= 3
                  ? `<div class="det-clue-card unlocked">
                       <div class="det-clue-head">
                         <span>🏠 线索 3 · 生活奇案还原</span>
                         <span class="det-star-tag">终极线索 +1⭐</span>
                       </div>
                       <div style="display:flex;gap:10px;align-items:center;">
                         ${ansPhoto ? `<img src="${esc(ansPhoto)}" alt="" class="det-clue-photo ${this.solved ? "clear" : "blurred"}" />` : ""}
                         <div style="font-size:0.86rem;font-weight:700;line-height:1.55;color:var(--text-sub);">
                           ${this.app.ruby(lifeClue)}
                         </div>
                       </div>
                     </div>`
                  : this.clueLevel === 2
                  ? `<button type="button" class="det-unlock-btn" id="btnDetUnlock3">
                       🔓 解锁线索 3（生活实例故事 + 模糊照片剪影）
                     </button>`
                  : ""
              }
            </div>

            <!-- 右侧：4位嫌疑目标卡片 -->
            <div>
              <h3 style="margin:0 0 12px;font-size:1.18rem;">
                ${this.solved ? `🎉 案件告破！神秘主角正是 ${this.app.ruby(ans.name)}！` : "🕵️‍♀️ 根据左边的科学 & 英文线索，锁定真正的主角："}
              </h3>
              <div class="live-en-choices-grid">
                ${this.suspects
                  .map((sp) => {
                    const ph = this.app.getPhoto(sp.id);
                    const spCe = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[sp.id]) || {};
                    const isRight = this.solved && sp.id === ans.id;
                    const isWrong = this.wrongIds.has(sp.id);
                    return `
                      <button type="button" class="live-en-choice-card det-suspect-card ${isRight ? "picked-right" : ""} ${isWrong ? "picked-wrong" : ""}" data-spid="${sp.id}" ${isWrong || this.solved ? "disabled" : ""}>
                        ${ph ? `<img src="${esc(ph)}" alt="" class="lec-thumb" />` : `<div class="lec-thumb lec-emoji">${sp.emoji}</div>`}
                        <div class="lec-meta">
                          <div class="lec-name">${this.app.ruby(sp.name)}</div>
                          <div class="lec-sub">🇬🇧 ${esc(spCe.enName || sp.code)}</div>
                        </div>
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              ${
                this.solved
                  ? `<div class="cls-win-box" style="margin-top:14px;">
                       <div class="win-title-text">
                         🏆 破案成功 (+${this.lastStarsEarned || 2}⭐)！${ans.emoji} ${this.app.ruby(ans.name)}（🇬🇧 ${esc(ce.enName || "")}）
                       </div>
                       <div style="font-size:0.88rem;font-weight:700;margin:6px 0;line-height:1.55;">
                         ${this.app.ruby(ans.summary)}
                       </div>
                       <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
                         <button type="button" class="mini-btn" id="btnDetOpenCard">📖 打开完整 3D 档案</button>
                         <button type="button" class="big-action-btn" id="btnDetNextCase" style="padding:8px 18px;min-height:40px;font-size:0.9rem;">下一宗奇案 ➜</button>
                       </div>
                     </div>`
                  : this.wrongIds.size > 0
                  ? `<div style="margin-top:12px;padding:9px 13px;border-radius:14px;background:rgba(251,191,36,0.14);border:1.5px solid rgba(251,191,36,0.5);font-weight:800;font-size:0.88rem;color:var(--c-warn-text);">
                       💡 不是这位哦！已自动为你多解锁一条线索，仔细对比左边的化学武器和英文词再选！
                     </div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      const bSpeakEn = document.getElementById("btnDetSpeakEn");
      if (bSpeakEn && enClueRaw) {
        bSpeakEn.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(enClueRaw, { slow: false, repeat: 1 });
          }
        });
      }
      const bSpeakEnSlow = document.getElementById("btnDetSpeakEnSlow");
      if (bSpeakEnSlow && enClueRaw) {
        bSpeakEnSlow.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(enClueRaw, { slow: true, repeat: 1 });
          }
        });
      }
      const bU2 = document.getElementById("btnDetUnlock2");
      if (bU2) {
        bU2.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.clueLevel = 2;
          this.render();
        });
      }
      const bU3 = document.getElementById("btnDetUnlock3");
      if (bU3) {
        bU3.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.clueLevel = 3;
          this.render();
        });
      }

      this.mountEl.querySelectorAll(".det-suspect-card").forEach((btn) => {
        btn.addEventListener("click", () => {
          this._solvedAtLevel = this.clueLevel;
          this._handleGuess(btn.getAttribute("data-spid"), btn);
        });
      });

      const bOpen = document.getElementById("btnDetOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(ans.id));
      const bNext = document.getElementById("btnDetNextCase");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.nextCase();
        });
      }
    }
  }

  // ==========================================================================
  // 模块 4：⚡ 毒物真假大法官 · 24关科学辟谣擂台 (Stage 4 · Game 8)
  // ==========================================================================
  class ScienceMythBusterArena {
    constructor(mountEl, app) {
      this.mountEl = mountEl;
      this.app = app;
      this.cat = "all"; // 'all' | 'law' | 'nature' | 'safety'
      this.idx = 0;
      this.streak = 0;
      this.picked = null; // null | true | false
      this._bindKeys();
    }

    _bindKeys() {
      document.addEventListener("keydown", (e) => {
        if (this.app.state.stage !== "detective" || this.app.state.detSub !== "myths") return;
        const tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (document.querySelector(".card-modal-backdrop.open, .ai-companion-backdrop.open")) return;
        const k = e.key.toLowerCase();
        if (this.picked === null) {
          if (k === "t" || k === "1") {
            e.preventDefault();
            this._judge(true, document.getElementById("btnMythTrue"));
          } else if (k === "f" || k === "2") {
            e.preventDefault();
            this._judge(false, document.getElementById("btnMythFalse"));
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          const list = this._getFiltered();
          this.idx = (this.idx + 1) % list.length;
          this.picked = null;
          this.render();
        }
      });
    }

    init() {
      if (!this.mountEl) return;
      this.render();
    }

    _getFiltered() {
      if (this.cat === "all") return MYTH_QUESTIONS;
      return MYTH_QUESTIONS.filter((q) => q.cat === this.cat);
    }

    _judge(choiceBool, btnEl) {
      const list = this._getFiltered();
      const q = list[this.idx];
      if (!q || this.picked !== null) return;
      this.picked = choiceBool;
      const correct = choiceBool === q.isTrue;
      if (correct) {
        this.streak += 1;
        if (window.SFX) window.SFX.chime();
        const s = this.app.state;
        if (!Array.isArray(s.mythWon)) s.mythWon = [];
        const isFirst = !s.mythWon.includes(q.id);
        if (isFirst) {
          s.mythWon.push(q.id);
          this.app.addStars(2);
        } else {
          this.app.addStars(1);
        }
        if (this.app.trackMission) this.app.trackMission("knowledge", 1);
        if (window.PlaygroundFX) window.PlaygroundFX.celebrate(btnEl || this.mountEl);
      } else {
        this.streak = 0;
        if (window.SFX) window.SFX.bonk();
      }
      this.render();
      if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish && q.enFact) {
        window.DoubaoTTS.speakEnglish(q.enFact, { repeat: 1, playTapSfx: false });
      }
    }

    render() {
      if (!this.mountEl) return;
      const en = window.isEn ? window.isEn() : true;
      const flip = (txt) => (window.FlipReader ? window.FlipReader.render(txt) : esc(txt));
      const enMyths = (window.DUWU_I18N && window.DUWU_I18N.getStagesEn().MYTH_QUESTIONS) || {};

      const list = this._getFiltered();
      if (this.idx >= list.length) this.idx = 0;
      const q = list[this.idx];
      if (!q) return;
      const enQ = enMyths[q.id] || null;
      const stmtTxt = en && enQ ? enQ.stmt : q.stmt;
      const expTxt = en && enQ ? enQ.explain : q.explain;

      const wonList = this.app.state.mythWon || [];
      const totalWon = MYTH_QUESTIONS.filter((x) => wonList.includes(x.id)).length;
      const photo = this.app.getPhoto(q.cardId);
      const ce = (window.CURIOSITY_ENGLISH_DATA && window.CURIOSITY_ENGLISH_DATA[q.cardId]) || {};
      const item = (window.CATALOG_DATA || []).find((x) => x.id === q.cardId);
      const isRight = this.picked !== null && this.picked === q.isTrue;

      this.mountEl.innerHTML = `
        <div class="safety-arena-shell myth-arena-shell">
          <div class="wb-header-row">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="scene-pill ${this.cat === "all" ? "active" : ""}" data-mcat="all">${en ? "🌟 All 24 Cases" : "🌟 全部 24 题"}</button>
              <button type="button" class="scene-pill ${this.cat === "law" ? "active" : ""}" data-mcat="law">${en ? "🧪 Toxin Laws" : "🧪 毒理规律"}</button>
              <button type="button" class="scene-pill ${this.cat === "nature" ? "active" : ""}" data-mcat="nature">${en ? "🌿 Nature Secrets" : "🌿 动植物秘闻"}</button>
              <button type="button" class="scene-pill ${this.cat === "safety" ? "active" : ""}" data-mcat="safety">${en ? "🛡️ Safety & Meds" : "🛡️ 防护与入药"}</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <span class="en-pg-mastered-pill">⚖️ ${en ? `Judged ${totalWon}/${MYTH_QUESTIONS.length}` : `已判案 ${totalWon}/${MYTH_QUESTIONS.length}`}</span>
              <span class="live-en-streak-pill">🔥 ${en ? "Streak:" : "连对："}${this.streak}</span>
            </div>
          </div>

          <div class="safety-dots-bar">
            ${list
              .map((mq, i) => {
                const done = wonList.includes(mq.id);
                const eM = enMyths[mq.id];
                const lbl = en && eM ? eM.stmt.slice(0, 14) : mq.stmt.slice(0, 7);
                return `
                  <button type="button" class="safety-dot-pill ${i === this.idx ? "active" : ""} ${done ? "done" : ""}" data-midx="${i}">
                    ${done ? "✅" : i + 1} ${esc(lbl)}…
                  </button>
                `;
              })
              .join("")}
          </div>

          <div class="myth-court-card">
            <div class="myth-card-top">
              ${photo ? `<img src="${esc(photo)}" alt="" class="myth-thumb-img" />` : `<div style="font-size:3rem;">⚖️</div>`}
              <div>
                <div style="font-size:0.8rem;font-weight:900;color:var(--c-teal-text);">
                  ⚖️ ${en ? `Science Court · Case ${this.idx + 1}/${list.length} · ${item ? item.emoji : ""} ${esc(ce.enName || "")}` : `科学法庭 · 第 ${this.idx + 1}/${list.length} 题 · 相关档案：${item ? `${item.emoji} ${this.app.ruby(item.name)}` : ""} ${ce.enName ? `(${esc(ce.enName)})` : ""}`}
                </div>
                <div class="myth-stmt-text">“${en ? flip(stmtTxt) : this.app.ruby(stmtTxt)}”</div>
              </div>
            </div>

            <div class="myth-judge-row">
              <button
                type="button"
                class="myth-judge-btn btn-true ${this.picked === true ? (q.isTrue ? "is-right" : "is-wrong") : this.picked !== null && q.isTrue ? "is-reveal" : ""}"
                id="btnMythTrue"
                ${this.picked !== null ? "disabled" : ""}
              >
                <span class="myth-judge-icon">✅</span>
                <span>
                  <div style="font-size:1.15rem;font-weight:900;">${en ? "TRUE!" : "真的！TRUE"}</div>
                  <div style="font-size:0.78rem;opacity:0.85;">${en ? "Real Science Fact" : "符合科学事实"}</div>
                </span>
              </button>
              <button
                type="button"
                class="myth-judge-btn btn-false ${this.picked === false ? (!q.isTrue ? "is-right" : "is-wrong") : this.picked !== null && !q.isTrue ? "is-reveal" : ""}"
                id="btnMythFalse"
                ${this.picked !== null ? "disabled" : ""}
              >
                <span class="myth-judge-icon">❌</span>
                <span>
                  <div style="font-size:1.15rem;font-weight:900;">${en ? "FALSE!" : "假的！FALSE"}</div>
                  <div style="font-size:0.78rem;opacity:0.85;">${en ? "Science Myth!" : "这是科学谣言"}</div>
                </span>
              </button>
            </div>

            ${
              this.picked !== null
                ? `
              <div class="safety-win-panel ${isRight ? "" : "myth-wrong-panel"}">
                <div class="${isRight ? "win-title-text" : "warn-hint-text"}" style="margin-bottom:6px;">
                  ${
                    isRight
                      ? (en ? `🔨 Gavel Down! Spot-on Science Judge (+2⭐)! This is ${q.isTrue ? "✅ TRUE" : "❌ FALSE"}!` : `🔨 啪！科学大法官判决精准 (+2⭐)！这句话是【${q.isTrue ? "✅ 真的" : "❌ 假的"}】！`)
                      : (en ? `💡 Tricky myth! The real answer is ${q.isTrue ? "✅ TRUE" : "❌ FALSE"}!` : `💡 差点就上当啦！正确答案是【${q.isTrue ? "✅ 真的" : "❌ 假的"}】，记下来下次稳拿满分！`)
                  }
                </div>
                <div class="safety-explain-txt">🧪 ${en ? flip(expTxt) : this.app.ruby(expTxt)}</div>
                <div class="safety-en-motto-card" id="btnMythSpeakEn" title="Tap to listen">
                  <div class="safety-motto-top">
                    <span class="bilingual-tag">🇬🇧 ${en ? "Key Science Fact" : "英文科学金句 ×2遍"}</span>
                    <span style="font-size:0.78rem;color:var(--c-teal-text);font-weight:900;">🔊 ${en ? "Listen" : "点我跟读"}</span>
                  </div>
                  <div class="safety-motto-en">${en ? flip(q.enFact) : esc(q.enFact)}</div>
                  ${!en ? `<div class="safety-motto-zh">${this.app.ruby(q.zhFact)}</div>` : ""}
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
                  <button type="button" class="mini-btn" id="btnMythOpenCard">📖 ${en ? "Open 3D Fact Card" : "看对应 3D 档案"}</button>
                  <button type="button" class="big-action-btn" id="btnMythNext" style="padding:9px 20px;min-height:42px;font-size:0.92rem;">
                    ${this.idx + 1 < list.length ? (en ? "Next Case ➜" : "下一题判决 ➜") : (en ? "Back to Case 1 🔄" : "回到第 1 题 🔄")}
                  </button>
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      this.mountEl.querySelectorAll("[data-mcat]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.cat = b.getAttribute("data-mcat");
          this.idx = 0;
          this.picked = null;
          this.render();
        });
      });

      this.mountEl.querySelectorAll("[data-midx]").forEach((b) => {
        b.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.idx = parseInt(b.getAttribute("data-midx"), 10) || 0;
          this.picked = null;
          this.render();
        });
      });

      const bT = document.getElementById("btnMythTrue");
      if (bT) bT.addEventListener("click", () => this._judge(true, bT));
      const bF = document.getElementById("btnMythFalse");
      if (bF) bF.addEventListener("click", () => this._judge(false, bF));

      const bSpeak = document.getElementById("btnMythSpeakEn");
      if (bSpeak) {
        bSpeak.addEventListener("click", () => {
          if (window.DoubaoTTS && window.DoubaoTTS.speakEnglish) {
            window.DoubaoTTS.speakEnglish(q.enFact, { repeat: 2 });
          } else {
            this.app.speak(q.enFact);
          }
        });
      }

      const bOpen = document.getElementById("btnMythOpenCard");
      if (bOpen) bOpen.addEventListener("click", () => this.app.openSuperCard(q.cardId));

      const bNext = document.getElementById("btnMythNext");
      if (bNext) {
        bNext.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          this.idx = (this.idx + 1) % list.length;
          this.picked = null;
          this.render();
        });
      }

      const activeDot = this.mountEl.querySelector(".safety-dot-pill.active");
      if (activeDot && typeof activeDot.scrollIntoView === "function") {
        try {
          activeDot.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        } catch (_) {}
      }
    }
  }

  // ==========================================================================
  // 模块 5：🏅 小馆长科学英语护照 & 每日探索任务弹窗
  // ==========================================================================
  function ensureDailyState(state) {
    const today = getTodayStr();
    if (!state.dailyProgress || state.dailyProgress.date !== today) {
      state.dailyProgress = { date: today, cards: 0, words: 0, knowledge: 0, claimed: [] };
    }
    if (!Array.isArray(state.dailyProgress.claimed)) state.dailyProgress.claimed = [];
    return state.dailyProgress;
  }

  const DAILY_MISSIONS = [
    {
      id: "m_cards",
      field: "cards",
      goal: 2,
      reward: 5,
      icon: "🗺️",
      title: "点亮或探索 2 张百科闪卡",
      stage: "world"
    },
    {
      id: "m_words",
      field: "words",
      goal: 3,
      reward: 5,
      icon: "🇬🇧",
      title: "英语游乐场挑战 3 次（拼词/翻翻乐/造句/跟读）",
      stage: "english"
    },
    {
      id: "m_knowledge",
      field: "knowledge",
      goal: 2,
      reward: 5,
      icon: "🔬",
      title: "知识闯关 2 题（分类/安全冒险/卡片问答）",
      stage: "detective"
    }
  ];

  function getBadges(state) {
    const lit = (state.litCards || []).length;
    const words = (state.masteredWords || []).length;
    const sents = (state.sentencesBuilt || []).length;
    const mem = state.memoryWins || 0;
    const pops = state.bubblePops || 0;
    const spoke = state.speakStageCount || 0;
    const sorted = (state.sortedCorrect || []).length;
    const safety = (state.safetyWon || []).length;
    const cases = (state.detectiveCasesWon || []).length;
    const myths = (state.mythWon || []).length;
    const cured = (state.curedIds || []).length;
    const cur = (state.unlockedCuriosities || []).length;
    const shadow = (state.wonEnShadowing || []).length;
    const hunt = (state.foundHunt || []).length;
    const quiz = (state.cardQuizWon || []).length;

    return [
      { icon: "🌱", name: "初级探索员", desc: "点亮 5 张实拍卡", ok: lit >= 5, prog: `${Math.min(lit, 5)}/5` },
      { icon: "🗺️", name: "图鉴大藏家", desc: "点亮 30 张实拍卡", ok: lit >= 30, prog: `${Math.min(lit, 30)}/30` },
      { icon: "🧩", name: "英语拼词王", desc: "掌握 10 个科学英文词", ok: words >= 10, prog: `${Math.min(words, 10)}/10` },
      { icon: "🚂", name: "英文造句师", desc: "拼通 5 列英语造句火车", ok: sents >= 5, prog: `${Math.min(sents, 5)}/5` },
      { icon: "🃏", name: "翻翻乐记忆王", desc: "通关 2 局双语翻翻乐", ok: mem >= 2, prog: `${Math.min(mem, 2)}/2` },
      { icon: "🎈", name: "泡泡神射手", desc: "听音戳破 10 个词泡", ok: pops >= 10, prog: `${Math.min(pops, 10)}/10` },
      { icon: "🎤", name: "英语演讲家", desc: "开口舞台完成 6 次朗读", ok: spoke >= 6, prog: `${Math.min(spoke, 6)}/6` },
      { icon: "🎙️", name: "开口朗读星", desc: "完成 5 张卡英文跟读", ok: shadow >= 5, prog: `${Math.min(shadow, 5)}/5` },
      { icon: "⚖️", name: "毒液分类专家", desc: "准确分类 10 个毒物标本", ok: sorted >= 10, prog: `${Math.min(sorted, 10)}/10` },
      { icon: "🛡️", name: "生活安全超人", desc: "守护 8 个生活安全场景", ok: safety >= 8, prog: `${Math.min(safety, 8)}/8` },
      { icon: "🕵️", name: "毒理大侦探", desc: "三步线索破案 8 宗", ok: cases >= 8, prog: `${Math.min(cases, 8)}/8` },
      { icon: "⚡", name: "真假科学官", desc: "判对 10 题科学真假", ok: myths >= 10, prog: `${Math.min(myths, 10)}/10` },
      { icon: "💊", name: "化毒为药神医", desc: "治愈全部 5 位急诊病人", ok: cured >= 5, prog: `${Math.min(cured, 5)}/5` },
      { icon: "💡", name: "十万个为什么", desc: "解锁 15 个深度科学秘密", ok: cur >= 15, prog: `${Math.min(cur, 15)}/15` },
      { icon: "👀", name: "绘本找茬鹰眼", desc: "找出 12 处隐藏毒物", ok: hunt >= 12, prog: `${Math.min(hunt, 12)}/12` },
      { icon: "👑", name: "百科荣誉馆长", desc: "通关 15 张卡馆长问答", ok: quiz >= 15, prog: `${Math.min(quiz, 15)}/15` }
    ];
  }

  class ExplorerPassportModal {
    constructor(app) {
      this.app = app;
      this.backdrop = null;
      this._initDOM();
    }

    _initDOM() {
      const el = document.createElement("div");
      el.id = "passportModalBackdrop";
      el.className = "card-modal-backdrop";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.innerHTML = `
        <div class="super-card-modal passport-modal-box">
          <button type="button" class="close-circle-btn" id="btnClosePassport" aria-label="关闭护照">✕</button>
          <div id="passportModalBody"></div>
        </div>
      `;
      document.body.appendChild(el);
      this.backdrop = el;

      document.getElementById("btnClosePassport").addEventListener("click", () => this.close());
      el.addEventListener("click", (e) => {
        if (e.target === el) this.close();
      });
    }

    hasClaimableMission() {
      const dp = ensureDailyState(this.app.state);
      return DAILY_MISSIONS.some((m) => (dp[m.field] || 0) >= m.goal && !dp.claimed.includes(m.id));
    }

    syncTopBadge() {
      const btn = document.getElementById("starCounter");
      if (!btn) return;
      const en = window.isEn ? window.isEn() : true;
      const hasGift = this.hasClaimableMission();
      btn.innerHTML = `⭐ ${this.app.state.stars || 0} <span class="passport-chip-tag">${en ? "🏅Passport" : "🏅护照"}${hasGift ? " 🎁" : ""}</span>`;
      btn.classList.toggle("has-gift", hasGift);
    }

    open() {
      if (!this.backdrop) return;
      this.render();
      this.backdrop.classList.add("open");
    }

    close() {
      if (this.backdrop) this.backdrop.classList.remove("open");
    }

    render() {
      const body = document.getElementById("passportModalBody");
      if (!body) return;
      const s = this.app.state;
      const dp = ensureDailyState(s);
      const badges = getBadges(s);
      const unlockedBadges = badges.filter((b) => b.ok).length;
      const totalVocab =
        window.EnglishPlaygroundModule && window.EnglishPlaygroundModule.buildMasterVocabList
          ? window.EnglishPlaygroundModule.buildMasterVocabList().length
          : 251;

      const stats = [
        { icon: "🗺️", label: "99 实拍图鉴", val: (s.litCards || []).length, max: 99, color: "#2dd4bf", stage: "world" },
        { icon: "🧩", label: "掌握英文科学词", val: (s.masteredWords || []).length, max: totalVocab, color: "#38bdf8", stage: "english", ensub: "wordbook" },
        { icon: "🚂", label: "拼通英文造句", val: (s.sentencesBuilt || []).length, max: 50, color: "#fbbf24", stage: "english", ensub: "train" },
        { icon: "🎈", label: "听音戳泡泡", val: s.bubblePops || 0, max: 30, color: "#f472b6", stage: "english", ensub: "bubbles" },
        { icon: "🎙️", label: "英语开口舞台", val: s.speakStageCount || 0, max: 30, color: "#ec4899", stage: "english", ensub: "speak" },
        { icon: "🛡️", label: "生活安全大冒险", val: (s.safetyWon || []).length, max: SAFETY_SCENARIOS.length, color: "#4ade80", stage: "detective", dsub: "safety" },
        { icon: "⚖️", label: "毒液/毒物分类", val: (s.sortedCorrect || []).length, max: 50, color: "#fb7185", stage: "detective", dsub: "classify" },
        { icon: "🕵️", label: "三步线索破案", val: (s.detectiveCasesWon || []).length, max: 30, color: "#a78bfa", stage: "detective", dsub: "mystery" },
        { icon: "⚡", label: "科学真假大法官", val: (s.mythWon || []).length, max: MYTH_QUESTIONS.length, color: "#f59e0b", stage: "detective", dsub: "myths" },
        { icon: "💡", label: "十万个为什么", val: (s.unlockedCuriosities || []).length, max: 297, color: "#34d399", stage: "world" }
      ];

      body.innerHTML = `
        <div class="passport-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="passport-avatar">🧑‍🔬</div>
            <div>
              <h2 style="margin:0;font-size:1.45rem;font-weight:900;">🏅 小馆长科学英语护照</h2>
              <div style="font-size:0.86rem;color:var(--c-teal-text);font-weight:800;margin-top:2px;">
                ⭐ 总星星：${s.stars || 0} 颗 · 🏆 荣誉勋章：${unlockedBadges}/${badges.length} 枚
              </div>
            </div>
          </div>
        </div>

        <!-- 今日探索小任务 -->
        <div class="passport-section">
          <div class="passport-sec-title">🎯 今日探索任务（每天刷新 · 完成领宝箱 ⭐）</div>
          <div class="daily-missions-grid">
            ${DAILY_MISSIONS.map((m) => {
              const cur = Math.min(m.goal, dp[m.field] || 0);
              const done = cur >= m.goal;
              const claimed = dp.claimed.includes(m.id);
              const pct = Math.round((cur / m.goal) * 100);
              return `
                <div class="daily-mission-card ${claimed ? "claimed" : done ? "ready" : ""}">
                  <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;">
                    <div style="font-weight:900;font-size:0.9rem;">${m.icon} ${m.title}</div>
                    <span class="mission-prog-num">${cur}/${m.goal}</span>
                  </div>
                  <div class="passport-bar-track" style="margin:8px 0;">
                    <div class="passport-bar-fill" style="width:${pct}%;background:${claimed ? "#4ade80" : done ? "#fbbf24" : "#38bdf8"};"></div>
                  </div>
                  <div style="display:flex;justify-content:flex-end;">
                    ${
                      claimed
                        ? `<span style="font-size:0.8rem;font-weight:900;color:var(--c-ok-text);">✅ 今日奖励已领取</span>`
                        : done
                        ? `<button type="button" class="big-action-btn" data-claim-m="${m.id}" style="padding:6px 14px;min-height:34px;font-size:0.84rem;">🎁 领 +${m.reward}⭐</button>`
                        : `<button type="button" class="mini-btn on" data-jump-stage="${m.stage}" style="padding:5px 12px;min-height:32px;font-size:0.8rem;">去完成 ➜</button>`
                    }
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- 科学 & 英语成长仪表盘 -->
        <div class="passport-section">
          <div class="passport-sec-title">📊 我的科学知识 × 英语成长进度</div>
          <div class="passport-stats-grid">
            ${stats
              .map((st) => {
                const pct = Math.min(100, Math.round((st.val / Math.max(1, st.max)) * 100));
                return `
                  <button type="button" class="passport-stat-card" data-jump-stage="${st.stage}" data-jump-dsub="${st.dsub || ""}" data-jump-ensub="${st.ensub || ""}">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.86rem;font-weight:900;">
                      <span>${st.icon} ${st.label}</span>
                      <span style="color:${st.color};">${st.val}/${st.max}</span>
                    </div>
                    <div class="passport-bar-track" style="margin-top:7px;">
                      <div class="passport-bar-fill" style="width:${pct}%;background:${st.color};"></div>
                    </div>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <!-- 12 枚荣誉勋章墙 -->
        <div class="passport-section">
          <div class="passport-sec-title">🏆 荣誉勋章收藏墙 (${unlockedBadges}/${badges.length})</div>
          <div class="passport-badges-grid">
            ${badges
              .map(
                (b) => `
              <div class="passport-badge-tile ${b.ok ? "unlocked" : "locked"}">
                <div class="pb-icon">${b.icon}</div>
                <div class="pb-name">${b.name}</div>
                <div class="pb-desc">${b.ok ? "✅ 已点亮！" : `${b.desc} (${b.prog})`}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      body.querySelectorAll("[data-claim-m]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const mid = btn.getAttribute("data-claim-m");
          const m = DAILY_MISSIONS.find((x) => x.id === mid);
          if (!m) return;
          const curDp = ensureDailyState(this.app.state);
          if (!curDp.claimed.includes(mid)) {
            curDp.claimed.push(mid);
            if (window.SFX) window.SFX.chime();
            this.app.addStars(m.reward);
            if (window.PlaygroundFX) window.PlaygroundFX.celebrate(btn);
            this.syncTopBadge();
            this.render();
          }
        });
      });

      body.querySelectorAll("[data-jump-stage]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.SFX) window.SFX.pop();
          const stg = btn.getAttribute("data-jump-stage");
          const dsub = btn.getAttribute("data-jump-dsub");
          const ensub = btn.getAttribute("data-jump-ensub");
          this.close();
          if (stg) this.app.switchStage(stg);
          if (dsub) {
            const subBtn = document.querySelector(`.det-sub-btn[data-dsub="${dsub}"]`);
            if (subBtn) subBtn.click();
          }
          if (ensub) {
            setTimeout(() => {
              const enBtn = document.querySelector(`[data-ensub="${ensub}"]`);
              if (enBtn) enBtn.click();
            }, 30);
          }
        });
      });
    }
  }

  window.KnowledgeGamesModule = {
    ToxClassificationLab,
    SafetyAdventureArena,
    MysteryDetectiveArena,
    ScienceMythBusterArena,
    ExplorerPassportModal,
    ensureDailyState,
    SAFETY_SCENARIOS,
    MYTH_QUESTIONS
  };
})();
