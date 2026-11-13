// ============================================================================
// 《致命毒物大百科》（斋藤胜裕 著）全书 99 档案完整目录 + 深度生物化学知识库
// 包含：生僻字拼音字典、五大生化靶点机制、生态施毒策略、食物链富集秘密与亲子导读
// ============================================================================

window.PINYIN_DICT = {
  "鵙": "jú", "鹟": "wēng", "蝮": "fù", "蝰": "kuí", "蛛": "zhū",
  "络": "luò", "蝎": "xiē", "蜈": "wú", "蚣": "gōng", "蚰": "yóu",
  "蜒": "yán", "芫": "yuán", "菁": "jīng", "莨": "làng", "菪": "dàng",
  "蓖": "bì", "商": "shāng", "陆": "lù", "瓠": "hù", "蒴": "shuò",
  "鳞": "lín", "鹅": "é", "膏": "gāo", "褶": "zhě", "茸": "róng",
  "脐": "qí", "盔": "kuī", "孢": "bāo", "鲀": "tún", "鲉": "yóu",
  "魟": "hóng", "芋": "yù", "棘": "jí", "葵": "kuí", "僧": "sēng",
  "辰": "chén", "砷": "shēn", "锑": "tī", "铀": "yóu", "肽": "tài",
  "苷": "gān", "碱": "jiǎn", "酶": "méi", "巯": "qiú", "胍": "guā"
};

window.CHAPTERS = [
  { id: "all", short: "全部 99 档案", title: "全书总览", icon: "🌌" },
  { id: "ch0", short: "序章 · 毒的奥秘", title: "序章 毒的奥秘", icon: "⚖️" },
  { id: "ch1", short: "第1章 · 动物篇", title: "第1章 动物毒素篇", icon: "🐍" },
  { id: "ch2", short: "第2章 · 昆虫篇", title: "第2章 昆虫毒素篇", icon: "🐝" },
  { id: "ch3", short: "第3章 · 植物篇", title: "第3章 植物毒素篇", icon: "🌿" },
  { id: "ch4", short: "第4章 · 蔬菜篇", title: "第4章 蔬菜毒素篇", icon: "🥔" },
  { id: "ch5", short: "第5章 · 蘑菇篇", title: "第5章 蘑菇毒素篇", icon: "🍄" },
  { id: "ch6", short: "第6章 · 水中生物", title: "第6章 水中生物毒素篇", icon: "🐡" },
  { id: "ch7", short: "第7章 · 矿物篇", title: "第7章 矿物毒素篇", icon: "💎" },
  { id: "ch8", short: "第8章 · 化学篇", title: "第8章 生活与环境化学篇", icon: "🧪" }
];

window.MECHANISMS = {
  neuro: {
    id: "neuro",
    name: "⚡ 神经信号拦截器",
    short: "神经离子通道/受体",
    color: "#38bdf8",
    principle: "专门瞄准神经细胞膜上的「钠/钾/钙离子城门」或「乙酰胆碱信使座位」——要么把门堵死让肌肉收不到指令，要么把门卡住不让关导致肌肉抽搐累瘫！"
  },
  blood: {
    id: "blood",
    name: "🩸 血液与血管破坏者",
    short: "凝血酶与溶血蛋白",
    color: "#fb7185",
    principle: "大多是大分子酶和蛋白质多肽：有的像剪刀剪破毛细血管壁，有的让红细胞像气球一样破裂（溶血），或者把血液里的凝血原料瞬间耗光！"
  },
  cell: {
    id: "cell",
    name: "🏭 细胞工厂停摆器",
    short: "细胞膜/核糖体/微管",
    color: "#c084fc",
    principle: "潜入细胞内部搞破坏：有的在细胞膜胆固醇上打孔，有的锁死制造蛋白质的核糖体与RNA聚合酶，有的拆掉细胞分裂的微管轨道。"
  },
  enzyme: {
    id: "enzyme",
    name: "🔥 代谢与酶活性劫持者",
    short: "酶抑制与重金属结合",
    color: "#fbbf24",
    principle: "像调皮的胶水粘住身体里勤劳工作的「酶工人」（如解酒酶、神经回收酶），或者像重金属离子一样抓住蛋白质的硫原子(-SH)让它变形失效。"
  },
  physical: {
    id: "physical",
    name: "🛡️ 微型鱼叉与刺胞武器",
    short: "刺丝囊/针晶/酸碱肽",
    color: "#34d399",
    principle: "物理微观结构与化学分子的双重组合：比如水母比子弹启动还快的微型刺丝囊鱼叉，或者天南星里成千上万根显微镜下的草酸钙小针！"
  },
  concept: {
    id: "concept",
    name: "⚖️ 毒理学黄金法则",
    short: "剂量与毒药转化定律",
    color: "#f472b6",
    principle: "理解整本《致命毒物大百科》的总钥匙：任何物质是毒还是药，取决于剂量、进入身体的方式（吃下去还是注射）以及物种差异。"
  }
};

window.STRATEGIES = {
  venom: {
    id: "venom",
    label: "🗡️ Venom 主动注射型",
    chemRule: "多为【大分子蛋白质/多肽酶】——需靠毒牙、毒刺、刺丝囊直接注入血液；若吃进健康胃里，常被胃蛋白酶剪碎！"
  },
  poison: {
    id: "poison",
    label: "🛡️ Poison 被动防御型",
    chemRule: "多为【小分子生物碱/强心苷/环肽】——藏在皮肤、羽毛、叶茎或菌盖里防捕食，分子小且结实，不怕胃酸，误食即吸收！"
  },
  mineral_chem: {
    id: "mineral_chem",
    label: "💎 矿物与环境化学分子",
    chemRule: "来自地壳重金属晶格（汞、砷、铅）或人工合成/环境分子，不会自己分解，重在防护接触与吸入。"
  },
  concept: {
    id: "concept",
    label: "🧭 毒理科学基石",
    chemRule: "科学家衡量毒性强弱、区分毒物与良药的核心标尺。"
  }
};

window.FOOD_CHAINS = [
  {
    title: "🐸 箭毒蛙的「借毒穿衣」秘密",
    flow: ["雨林毒蚂蚁/甲虫", "野生箭毒蛙", "皮肤分泌树蛙毒素"],
    targetId: "ch1-09",
    secret: "动物园人工喂果蝇长大的箭毒蛙宝宝居然完全无毒！因为它们自己不会合成生物碱，而是把吃掉的雨林毒虫分子『搬运』到皮肤腺体里。"
  },
  {
    title: "🐦 会飞的毒鸟：黑头林鵙鹟",
    flow: ["姬花萤科甲虫", "黑头林鵙鹟啄食", "羽毛与皮肤富集同款蛙毒"],
    targetId: "ch1-03",
    secret: "相隔半个地球的新几内亚毒鸟和南美箭毒蛙，身上居然有同一种『树蛙毒素』！科学家顺藤摸瓜，发现它们都爱吃同家族的有毒小甲虫！"
  },
  {
    title: "🐡 河鲀与蓝环章鱼的「细菌盟友」",
    flow: ["海洋弧菌/假单胞菌", "海藻/贝类传递", "河鲀肝脏 & 蓝环章鱼唾液腺"],
    targetId: "ch6-01",
    secret: "大名鼎鼎的河鲀毒素(TTX)其实不是河鲀自己造的，而是海洋细菌的杰作！隔离海洋食物链、吃无毒饲料长大的养殖河鲀几乎测不出毒。"
  },
  {
    title: "🐍 虎斑颈槽蛇的「双武器库」",
    flow: ["捕食中华蟾蜍", "回收蟾蜍耳后腺毒液", "储存在脖子后方的颈腺"],
    targetId: "ch1-04",
    secret: "它不光嘴里有自己的出血性毒牙（Venom），脖子后面还专门演化出『储毒口袋』存放吃蟾蜍攒下的强心甾体毒素（Poison），堪称双修大师！"
  }
];

// 全书 99 个真实目录档案（精选核心档案带 star:true 与深度生化字段）
window.CATALOG_DATA = [
  // ================= 序章 毒的奥秘 (4) =================
  {
    id: "ch0-01", chapter: "ch0", code: "序章 · 档案01", name: "毒的定义", emoji: "📖",
    mech: "concept", strategy: "concept", star: true,
    molecule: "外源性化学干扰分子", formula: "Dose × Target", molSize: "跨尺度（从单个金属原子到十万道尔顿大蛋白）",
    heatNote: "视化学键而定",
    summary: "凡是进入生物体后，通过化学反应扰乱细胞正常工作的物质都可能成为『毒』。毒不是邪恶魔法，而是分子形状刚巧卡住了生命机器的齿轮！",
    biochemDeep: "生命就像一座每秒进行上亿次化学反应的精密城市。当外来分子撞上关键的受体、离子通道或酶，让反应太快或太慢，就会表现为中毒症状。",
    parentTip: "可以问问孩子：氧气和纯净水是毒吗？（提示：潜水员吸纯氧过量会氧中毒，短时间狂喝水也会低钠血症——引出剂量法则！）",
    radar: [60, 60, 60, 50, 95], labLink: "dose"
  },
  {
    id: "ch0-02", chapter: "ch0", code: "序章 · 档案02", name: "致死量是如何确定的", emoji: "⚖️",
    mech: "concept", strategy: "concept", star: true,
    molecule: "半数致死量 LD50 标尺", formula: "mg / kg (毫克/千克体重)", molSize: "定量毒理学核心单位",
    heatNote: "数字越小代表毒性越猛烈",
    summary: "科学家用 LD50（每千克体重需要多少毫克毒素）来给毒物排座次：数字越小，说明哪怕芝麻粒千分之一的量都有巨大威力！",
    biochemDeep: "为什么要除以『千克体重』？因为同样1毫克毒素，放进20克的小鼠体内和放进4000千克的大象体内，血液里的分子浓度相差整整20万倍！",
    parentTip: "带孩子算算数学比例：为什么儿童吃感冒药必须按体重减量，绝不能直接吃大人的药片？这就是最实用的体重浓度原理！",
    radar: [70, 70, 70, 40, 90], labLink: "dose"
  },
  {
    id: "ch0-03", chapter: "ch0", code: "序章 · 档案03", name: "毒的种类与毒性", emoji: "🧬",
    mech: "concept", strategy: "concept", star: false,
    molecule: "生物碱 / 多肽蛋白 / 苷类 / 重金属",
    summary: "按来源分有动植物、菌物与矿物毒；按分子长相分，主动咬人的毒液多为『蛋白质大分子』，防被吃的植物毒多为『生物碱小分子』！"
  },
  {
    id: "ch0-04", chapter: "ch0", code: "序章 · 档案04", name: "毒和药有什么不同", emoji: "💊",
    mech: "concept", strategy: "concept", star: true,
    molecule: "帕拉塞尔苏斯双相法则", formula: "毒 ⇄ 剂量与靶向改造 ⇄ 药", molSize: "现代药理学起点",
    heatNote: "精准控量即可救命",
    summary: "毒理学家帕拉塞尔苏斯说：『万物皆有毒，唯剂量使然。』能精准关闭神经或改变血压的毒物分子，缩小剂量、修剪结构后就是靶向好药！",
    biochemDeep: "普通分子在身体里乱逛没啥反应，而剧毒分子往往拥有极高的『受体亲和力』（一把极其精准的钥匙）。药理学家最爱向大自然里的毒物拜师学艺！",
    parentTip: "切换去【化毒为药工坊】看看书里的尖吻蝮、地纹芋螺和毛地黄是怎么摇身一变成为医院救命药的！",
    radar: [80, 65, 75, 50, 100], labLink: "dose"
  },

  // ================= 第1章 动物毒素篇 (13) =================
  {
    id: "ch1-01", chapter: "ch1", code: "第1章 · 档案01", name: "鸭嘴兽", emoji: "🦫",
    mech: "physical", strategy: "venom", star: true,
    molecule: "防御素样多肽 (DLPs) 与C型利钠肽", formula: "80多种混合活性多肽", molSize: "大分子多肽蛋白（主动注射）",
    heatNote: "蛋白质遇高温变性",
    summary: "极少数带毒的哺乳动物！雄性鸭嘴兽后脚踝长着空心毒刺，繁殖季分泌含80多种多肽的毒液，能直接激活痛觉神经元，连止痛药吗啡都拿它没辙！",
    biochemDeep: "科学家还在鸭嘴兽毒液里发现了超稳定的『GLP-1激素类似物』——正常人体的这种控血糖激素几分钟就被酶分解了，鸭嘴兽版本却不容易分解，正在启发新型糖尿病药物研发！",
    parentTip: "引导孩子观察：鸭嘴兽会生蛋、有鸭嘴、会哺乳、后脚还有爬行动物般的毒距——它是演化树上的活化石拼图！",
    radar: [82, 45, 55, 65, 88], labLink: "synapse"
  },
  {
    id: "ch1-02", chapter: "ch1", code: "第1章 · 档案02", name: "懒猴", emoji: "🐒",
    mech: "enzyme", strategy: "venom", star: true,
    molecule: "肱腺分泌蛋白 + 唾液激活复合物 (BGE蛋白)", formula: "类似猫过敏原 Fel d 1 折叠结构", molSize: "双组分蛋白质毒液",
    heatNote: "热不稳定蛋白",
    summary: "世界上唯一有毒的灵长类动物！它平时没毒，遇到危险时会举起双手舔胳膊内侧的腺体——只有当腺体油状物与唾液混合发生化学反应，才会激活成毒液！",
    biochemDeep: "这种『AB双组分二元化学武器』设计太聪明了：分开存放时不伤自己，混合涂在牙齿上咬敌人才触发剧烈免疫过敏反应与组织损伤！",
    parentTip: "千万提醒：懒猴大眼睛看似萌宠，实则是濒危保护野生动物且携带毒腺，任何野生动物都只可远观保护！",
    radar: [45, 50, 65, 85, 60]
  },
  {
    id: "ch1-03", chapter: "ch1", code: "第1章 · 档案03", name: "黑头林鵙鹟", emoji: "🐦",
    mech: "neuro", strategy: "poison", star: true,
    molecule: "树蛙毒素 (Batrachotoxin, BTX)", formula: "C31H42N2O6", molSize: "小分子甾体生物碱 (538 Da)",
    heatNote: "化学结构较稳定，加热难彻底消除",
    summary: "打破『鸟类无毒』常识的橙黑警戒色怪鸟！它的羽毛和皮肤藏着与南美箭毒蛙一模一样的神经毒素，能把神经细胞钠离子城门强行卡开不让关！",
    biochemDeep: "鸟为什么会有蛙毒？原来它爱吃姬花萤甲虫，并且自己的钠离子通道发生了几个氨基酸突变，练就了『百毒不侵』的金刚之身，还能把毒涂在鸟蛋上防蛇偷吃！",
    parentTip: "点开【神经城门模拟器】选『卡门不让关』模式，看看钠离子疯狂涌入时细胞会发生什么！",
    radar: [96, 25, 30, 75, 65], labLink: "synapse"
  },
  {
    id: "ch1-04", chapter: "ch1", code: "第1章 · 档案04", name: "虎斑颈槽蛇", emoji: "🐍",
    mech: "blood", strategy: "venom", star: false,
    molecule: "出血金属蛋白酶 + 颈腺蟾蜍二烯内酯",
    summary: "既能用后沟牙分泌干扰凝血的毒液（Venom），又能把吃下去的蟾蜍毒素存进脖子后面的颈腺里防身（Poison），一蛇双毒！"
  },
  {
    id: "ch1-05", chapter: "ch1", code: "第1章 · 档案05", name: "尖吻蝮", emoji: "🐍",
    mech: "blood", strategy: "venom", star: true,
    molecule: "蛇毒金属蛋白酶 + 凝血酶样酶 + 血小板聚集抑制肽", formula: "复合酶系蛋白库", molSize: "大分子蛋白质酶群 (20k~100k Da)",
    heatNote: "蛋白质怕高温与强酸，但绝不可用嘴吸伤口",
    summary: "俗称『五步蛇』，它的毒液是一座针对血液系统的精密生化拆迁队：一边剪破毛细血管内壁，一边耗尽血液里的纤维蛋白原，让血无法正常凝固！",
    biochemDeep: "反过来想：既然它能阻止血液结块，能不能用来救脑血栓病人？科学家真的从尖吻蝮毒液中分离纯化出了『尖吻蝮蛇血凝酶/降纤酶』，在医院里帮无数患者化险为夷！",
    parentTip: "对比尖吻蝮（血液毒，伤口剧痛肿胀出血）与眼镜王蛇（神经毒，早期伤口不怎么肿却会呼吸麻痹），理解不同生化靶点的症状差别。",
    radar: [30, 98, 75, 80, 95]
  },
  {
    id: "ch1-06", chapter: "ch1", code: "第1章 · 档案06", name: "眼镜王蛇", emoji: "👑",
    mech: "neuro", strategy: "venom", star: true,
    molecule: "α-神经毒素 (三指毒素家族 3FTx)", formula: "约 60~74 个氨基酸折叠成三根手指状", molSize: "多肽蛋白质 (约 7,000~8,000 Da)",
    heatNote: "高温变性；在健康消化道内可被胃蛋白酶拆解",
    summary: "专门吃其他蛇类的蛇中之王！它的毒蛋白长得像『三根伸出的手指』，精准抢占肌肉细胞上的乙酰胆碱信使座位，让大脑发出的呼吸与运动指令传不过去。",
    biochemDeep: "为什么叫『三指毒素』？因为多肽链由二硫键捆绑折叠出三个环状指头，刚好插进烟碱型乙酰胆碱受体的缝隙里，属于教科书级别的『竞争性拮抗剂』！",
    parentTip: "在【神经城门模拟器】里开启『胃蛋白酶测试』，直观看到为什么注射剧毒的蛇毒蛋白和吃进肚子里的小分子植物毒完全不同（但口腔溃疡破口仍会吸收，切勿尝试）！",
    radar: [97, 45, 50, 55, 86], labLink: "synapse"
  },
  {
    id: "ch1-07", chapter: "ch1", code: "第1章 · 档案07", name: "太攀蛇、虎蛇、南棘蛇", emoji: "⚡",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "太攀蛇毒素 (Taipoxin 突触前神经毒) + 凝血酶原激活物",
    summary: "澳洲陆地毒蛇三巨头！内陆太攀蛇是陆生毒蛇LD50冠军，兼具阻断神经末梢释放信使与引发弥散性凝血的双重生化威力，幸好性格害羞总躲着人类。"
  },
  {
    id: "ch1-08", chapter: "ch1", code: "第1章 · 档案08", name: "角响尾蛇", emoji: "🏜️",
    mech: "blood", strategy: "venom", star: false,
    molecule: "磷脂酶A2 (PLA2) + 出血毒素",
    summary: "沙漠侧行大师！头顶两枚小鳞角能挡风沙，尾巴摇动每秒50次发出警戒声；毒液中的磷脂酶A2专门剪断红细胞和肌肉细胞膜的磷脂双分子层。"
  },
  {
    id: "ch1-09", chapter: "ch1", code: "第1章 · 档案09", name: "箭毒蛙", emoji: "🐸",
    mech: "neuro", strategy: "poison", star: true,
    molecule: "树蛙毒素 (Batrachotoxin) / 蟾毒素生物碱", formula: "C31H42N2O6", molSize: "脂溶性小分子生物碱",
    heatNote: "耐热小分子",
    summary: "披着电光黄、宝石蓝警戒色的雨林小精灵！一只黄金箭毒蛙皮肤上的脂溶性生物碱，能钻进电压门控钠离子通道内部，像木楔子一样把通道死死撑开！",
    biochemDeep: "最神奇的是『自体抗性』：箭毒蛙自己神经细胞钠通道第1584位只要换掉一个氨基酸（天冬酰胺换成苏氨酸），毒素钥匙就插不进自己的锁孔了！大自然只改了一个零件就完美防误伤！",
    parentTip: "和孩子讨论『警戒色 (Aposematism)』：为什么无毒的青蛙穿绿衣躲藏，剧毒的箭毒蛙却穿荧光服生怕别人看不见？",
    radar: [100, 20, 30, 20, 82], labLink: "synapse"
  },
  {
    id: "ch1-10", chapter: "ch1", code: "第1章 · 档案10", name: "红背蜘蛛", emoji: "🕷️",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "α-黑寡妇蜘蛛毒素 (α-Latrotoxin)",
    summary: "腹部有一道醒目红斑！它的毒蛋白反其道而行：在神经末梢膜上打出一个钙离子孔洞，逼着神经元把仓库里所有信号囊泡一口气全倒空，引起剧痛与出汗。"
  },
  {
    id: "ch1-11", chapter: "ch1", code: "第1章 · 档案11", name: "红平甲蛛", emoji: "🕷️",
    mech: "cell", strategy: "venom", star: false,
    molecule: "鞘磷脂酶D (Sphingomyelinase D)",
    summary: "隐居蛛类的近亲，毒液里的『鞘磷脂酶D』会剪掉皮肤细胞膜外层的脂质头，引发局部免疫风暴和皮肤组织坏死。"
  },
  {
    id: "ch1-12", chapter: "ch1", code: "第1章 · 档案12", name: "塔兰托毒蛛", emoji: "🕸️",
    mech: "physical", strategy: "venom", star: false,
    molecule: "捕鸟蛛多肽毒素 + 腹部倒刺刚毛",
    summary: "块头虽大像毛绒玩具，对人的毒液其实只像蜂蜇；它真正的秘密武器是用后腿踢飞肚子上带倒钩的微观毒毛，刺痛捕食者的眼睛和鼻腔！"
  },
  {
    id: "ch1-13", chapter: "ch1", code: "第1章 · 档案13", name: "棒络新妇", emoji: "🕸️",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "JSTX 多胺类谷氨酸受体阻滞剂",
    summary: "花园里织金色大网的常见蜘蛛！它的JSTX毒素专挑昆虫特有的『谷氨酸神经受体』下手，能瞬间麻痹飞虫，对哺乳动物却非常温和，是研究脑科学的宝贝工具分子！"
  },

  // ================= 第2章 昆虫毒素篇 (10) =================
  {
    id: "ch2-01", chapter: "ch2", code: "第2章 · 档案01", name: "胡蜂", emoji: "🐝",
    mech: "blood", strategy: "venom", star: true,
    molecule: "胡蜂激肽 + 肥大细胞脱颗粒肽 + 磷脂酶 + 血清素", formula: "胺类 + 活性肽 + 酶复合鸡尾酒", molSize: "小分子胺 + 多肽混合液",
    heatNote: "毒针光滑无倒钩，可反复蛰刺",
    summary: "昆虫界的重装巡洋舰！大颚能嚼碎猎物，尾部的光滑毒针能连续注射『疼痛鸡尾酒』；最危险的不是毒素本身，而是引发人体免疫系统过度拉警报（过敏性休克）！",
    biochemDeep: "为什么第一次被胡蜂蛰可能只是肿痛，第二次被蛰反而可能更凶险？因为第一次接触后免疫系统记住了蜂毒蛋白并造好IgE抗体，第二次一碰就触发全身肥大细胞瞬间释放组胺！",
    parentTip: "野外遇到单只巡逻胡蜂千万别拍打（拍打会释放报警信息素乙酸戊酯招来蜂群），低头护住头颈安静慢步离开最科学。",
    radar: [60, 78, 70, 45, 55]
  },
  {
    id: "ch2-02", chapter: "ch2", code: "第2章 · 档案02", name: "蜜蜂", emoji: "🍯",
    mech: "cell", strategy: "venom", star: true,
    molecule: "蜂毒肽 (Melittin，占干重50%)", formula: "C131H229N39O31 (26个氨基酸两亲性多肽)", molSize: "两亲性穿膜多肽 (2,846 Da)",
    heatNote: "毒针带倒钩留存皮肤",
    summary: "为了保卫蜂巢不惜牺牲生命的卫士！蜂毒里一半以上是『蜂毒肽』，它一头亲水、一头亲油，像小钻头一样插进细胞膜并围成圆筒孔洞，让细胞漏水肿胀。",
    biochemDeep: "科学纠偏时间：很多人以为蜜蜂毒纯粹是酸性的涂肥皂水就行——其实毒液被注射在真皮深处，表皮涂弱碱根本够不着！正确第一步是用硬卡片平行刮掉还在搏动注毒的毒囊和倒钩刺，再清水冲洗冰敷！",
    parentTip: "科学家正把『蜂毒肽』装进纳米导弹里，研究如何让它只去给癌细胞的细胞膜打孔而不伤好细胞！",
    radar: [45, 70, 82, 35, 80]
  },
  {
    id: "ch2-03", chapter: "ch2", code: "第2章 · 档案03", name: "马蜂", emoji: "🐝",
    mech: "physical", strategy: "venom", star: false,
    molecule: "马蜂激肽 (Polistes kinin) + 组胺 + 5-羟色胺",
    summary: "常在屋檐下用植物纤维嚼成纸浆筑莲蓬状巢的长脚胡蜂亚科成员；毒液富含瞬间激活痛觉受体的生物胺与激肽。"
  },
  {
    id: "ch2-04", chapter: "ch2", code: "第2章 · 档案04", name: "远东褐枯叶蛾", emoji: "🦋",
    mech: "physical", strategy: "venom", star: false,
    molecule: "中空毒刚毛 + 组胺样发炎蛋白",
    summary: "伪装成一片干枯树叶的毛毛虫大师！胸背部藏着成簇蓝黑色毒针毛，连结茧时都会把毒毛织进茧壳表面当防盗铁丝网。"
  },
  {
    id: "ch2-05", chapter: "ch2", code: "第2章 · 档案05", name: "以色列金蝎", emoji: "🦂",
    mech: "neuro", strategy: "venom", star: true,
    molecule: "氯毒素 (Chlorotoxin) + 蝎钠/钾通道神经肽", formula: "36个氨基酸紧凑折叠（4对二硫键）", molSize: "微型刚性多肽 (3,996 Da)",
    heatNote: "4对二硫键使其结构极为结实",
    summary: "金黄色沙漠剧毒蝎！除了麻痹猎物的钠钾通道毒素外，它毒液里的『氯毒素』能不可思议地精准认出脑胶质瘤细胞并贴上去！",
    biochemDeep: "外科医生给『氯毒素』接上一盏近红外荧光小灯，做成了著名的『肿瘤荧光画笔 (Tozuleristide)』——手术中脑肿瘤细胞会自己发亮，帮医生把肿瘤切干净又不伤健康大脑！",
    parentTip: "这是整本书最酷的启发之一：地球上最凶险的蝎子之一，竟然帮外科医生点亮了拯救生命的手术灯！",
    radar: [94, 40, 55, 65, 98], labLink: "synapse"
  },
  {
    id: "ch2-06", chapter: "ch2", code: "第2章 · 档案06", name: "毒蛾", emoji: "🐛",
    mech: "physical", strategy: "poison", star: false,
    molecule: "数十万根微米级毒针毛 + 蛋白酶/组胺",
    summary: "幼虫身上长满肉眼难见的0.1毫米空心毒毛，随风飘落粘在衣服或皮肤上千万别用手搓（越搓刺得越深），用透明胶带轻轻粘走再用肥皂水冲才是妙招！"
  },
  {
    id: "ch2-07", chapter: "ch2", code: "第2章 · 档案07", name: "刺蛾", emoji: "🐛",
    mech: "physical", strategy: "venom", star: false,
    molecule: "刺毛腺细胞毒液（类蜂毒肽与组胺酸液）",
    summary: "树叶背面的荧光绿『洋辣子』！浑身长满带毒液囊的尖刺，一碰刺尖脆断就像微型玻璃安瓿瓶扎入皮肤，带来火辣电击般的痛感。"
  },
  {
    id: "ch2-08", chapter: "ch2", code: "第2章 · 档案08", name: "蜈蚣", emoji: "🐛",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "蜈蚣毒素 Ssm Spooky Toxin (钾通道阻滞肽) + 组胺",
    summary: "第一对脚演化成了威风凛凛的『毒颚』！它的多肽毒素能精准堵住猎物心肌与血管上的KCNQ钾离子通道，让比自己重十几倍的猎物瞬间丧失反抗力。"
  },
  {
    id: "ch2-09", chapter: "ch2", code: "第2章 · 档案09", name: "大蚰蜒", emoji: "🦗",
    mech: "physical", strategy: "venom", star: false,
    molecule: "微量捕食性麻痹肽（对人极微弱）",
    summary: "长着15对超长细腿的家里『益虫猎手』！虽然跑起来飞快有点吓人，但它专门帮人类捕食蟑螂和白蚁，毒颚一般咬不穿人皮，请温柔请它出门就好。"
  },
  {
    id: "ch2-10", chapter: "ch2", code: "第2章 · 档案10", name: "短翅芫菁", emoji: "🪲",
    mech: "cell", strategy: "poison", star: true,
    molecule: "斑蝥素 (Cantharidin)", formula: "C10H12O4", molSize: "单萜酸酐小分子 (196 Da)",
    heatNote: "耐热小分子，不可徒手捏拍",
    summary: "受惊时腿关节会『假死流血』！其实流出的黄色液滴是剧烈起泡毒素『斑蝥素』，它会关掉表皮细胞粘连开关（蛋白磷酸酶2A），让皮肤立刻鼓起大水泡！",
    biochemDeep: "雄性芫菁还会合成斑蝥素当作『结婚彩礼』送给雌虫，雌虫再把它涂在虫卵表面当防蚂蚁化学盾牌！而在皮肤科医生严格稀释控制下，它也被用来点除顽固病毒疣。",
    parentTip: "顺便教孩子一个户外常识：夏天遇到隐翅虫或芫菁落在身上，永远用『吹气吹走』代替『一巴掌拍碎』！",
    radar: [25, 35, 92, 60, 76]
  },

  // ================= 第3章 植物毒素篇 (20) =================
  {
    id: "ch3-01", chapter: "ch3", code: "第3章 · 档案01", name: "乌头", emoji: "💜",
    mech: "neuro", strategy: "poison", star: true,
    molecule: "乌头碱 (Aconitine)", formula: "C34H47NO11", molSize: "二萜类生物碱小分子 (645 Da)",
    heatNote: "长时间数小时煎煮可水解去乙酰基使毒性大减（中药附子炮制原理）",
    summary: "开着紫色骑士头盔般美丽花朵的『植物毒王』！乌头碱专门钻进神经和心肌的钠离子通道，把通道门死死卡在常开状态，导致唇舌发麻与心律大乱。",
    biochemDeep: "纯化学奇迹：乌头碱分子身上挂着一个『乙酰基』和一个『苯甲酰基』小挂件。只要用水蒸汽高温炖煮好几个小时，发生『酯水解反应』摘掉这两个小挂件变成乌头原碱，毒性就会骤降上千倍！这就是古人炮制中药的有机化学秘密（严禁家庭自行尝试）！",
    parentTip: "可以在【分子结构拆解镜】和【神经城门模拟器】里同时看到乌头碱的威力！",
    radar: [98, 40, 45, 75, 78], labLink: "synapse"
  },
  {
    id: "ch3-02", chapter: "ch3", code: "第3章 · 档案02", name: "日本马桑", emoji: "🍒",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "马桑内酯 (Coriamyrtin，倍半萜内酯)",
    summary: "结着由红变黑、甜丝丝假果实的危险灌木！马桑内酯会堵住大脑里的『刹车信号受体（GABA受体）』，没有了刹车，大脑神经元就会过度放电引发惊厥。"
  },
  {
    id: "ch3-03", chapter: "ch3", code: "第3章 · 档案03", name: "毒芹", emoji: "🌿",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "毒芹素 (Cicutoxin，聚炔醇类分子)",
    summary: "长在水边、叶子像芹菜根像白萝卜的伪装大师！毒芹素是一根带三个碳碳三键的直链小分子，同样会封锁中枢神经的GABA抑制通道。"
  },
  {
    id: "ch3-04", chapter: "ch3", code: "第3章 · 档案04", name: "毒参", emoji: "🌱",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "毒参碱 (Coniine，哌啶类生物碱)",
    summary: "古希腊哲学家苏格拉底饮下的就是它！毒参碱是人类历史上第一个完成人工全合成的生物碱(1886年)，能阻断运动神经与肌肉的接头信号。"
  },
  {
    id: "ch3-05", chapter: "ch3", code: "第3章 · 档案05", name: "天南星", emoji: "🌱",
    mech: "physical", strategy: "poison", star: true,
    molecule: "草酸钙针晶束 (Raphides) + 凝集素蛋白", formula: "CaC2O4 · H2O 显微晶针", molSize: "微米级锋利矿物晶体束",
    heatNote: "干热难消，需特定矾姜炮制破坏晶囊",
    summary: "植物界的『自动射针机关盒』！天南星细胞里藏着一捆捆显微镜下像绣花针一样的草酸钙针晶，一旦被动物咬破，粘液吸水膨胀瞬间把几千根微针射进舌头黏膜！",
    biochemDeep: "天南星科植物（包括滴水观音、万年青、生的芋头黏液）全都会这一招！先用物理微针在黏膜上扎出看不见的小孔，再把刺激性蛋白送进去引起火辣肿痛——连恐龙当年都不敢随便啃它！",
    parentTip: "家里如果有滴水观音、绿萝或给芋头削皮手痒，背后的化学元凶就是这种『草酸钙针晶』！削山药芋头戴手套就是物理防御对物理攻击！",
    radar: [25, 20, 65, 70, 60]
  },
  {
    id: "ch3-06", chapter: "ch3", code: "第3章 · 档案06", name: "毛地黄", emoji: "🌺",
    mech: "enzyme", strategy: "poison", star: true,
    molecule: "洋地黄毒苷 / 地高辛 (Digoxin)", formula: "C41H64O14", molSize: "强心甾体糖苷 (780 Da)",
    heatNote: "耐热强心苷",
    summary: "一串串风铃般优雅的园艺名花，也是药理学史上最传奇的『双面女王』！它的强心苷会部分按住心肌细胞膜上的钠钾泵，帮虚弱的心脏跳得更有力，但多一点就会心律失常！",
    biochemDeep: "精妙的连锁齿轮：地高辛抑制『钠钾泵(Na+/K+-ATP酶)』 → 细胞内钠离子变多 → 钠钙交换器偷懒 → 钙离子留在心肌细胞里变多 → 肌动蛋白更有劲地收缩！还记得梵高画里的黄色光晕吗？医学史学家推测可能与他服用毛地黄制剂过量导致的『黄视症』有关！",
    parentTip: "去【帕拉塞尔苏斯剂量天平】亲手拉动毛地黄滑块，体验什么叫『极窄治疗窗』！",
    radar: [75, 65, 50, 70, 99], labLink: "dose"
  },
  {
    id: "ch3-07", chapter: "ch3", code: "第3章 · 档案07", name: "日本欧莨菪", emoji: "🔔",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "莨菪碱 / 阿托品 (Atropine) + 东莨菪碱",
    summary: "根部酷似牛蒡的茄科植物！它含有的『阿托品』能遮住副交感神经的M型乙酰胆碱受体——误食会口干瞳孔放大，但在眼科检查散瞳和有机磷抢救中却是无可替代的一线功臣药！"
  },
  {
    id: "ch3-08", chapter: "ch3", code: "第3章 · 档案08", name: "洋金花", emoji: "🎺",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "东莨菪碱 (Scopolamine) + 阿托品",
    summary: "白色大喇叭花（曼陀罗属），古代华佗『麻沸散』的主角候选人！能穿过血脑屏障阻断胆碱能信号，微克级制成晕车贴片可防晕船，野外误采果实则极其危险。"
  },
  {
    id: "ch3-09", chapter: "ch3", code: "第3章 · 档案09", name: "葱莲", emoji: "🌼",
    mech: "cell", strategy: "poison", star: false,
    molecule: "石蒜碱 (Lycorine)",
    summary: "公园花坛边雨后齐刷刷开白花的小草！叶子像葱、鳞茎像蒜，但石蒜科特有的『石蒜碱』会卡住细胞核糖体合成蛋白质并强烈刺激呕吐中枢，切勿当野葱包饺子！"
  },
  {
    id: "ch3-10", chapter: "ch3", code: "第3章 · 档案10", name: "水仙", emoji: "🌼",
    mech: "cell", strategy: "poison", star: false,
    molecule: "石蒜碱 + 加兰他敏 (Galanthamine) + 草酸钙针晶",
    summary: "春节案头清香扑鼻的凌波仙子，没开花时鳞茎和叶子超像大蒜与韭菜！它含有的『加兰他敏』如今已被开发成帮助阿尔茨海默病爷爷奶奶留住记忆的良药。"
  },
  {
    id: "ch3-11", chapter: "ch3", code: "第3章 · 档案11", name: "秋水仙", emoji: "🌷",
    mech: "cell", strategy: "poison", star: true,
    molecule: "秋水仙碱 (Colchicine)", formula: "C22H25NO6", molSize: "卓酚酮类生物碱 (399 Da)",
    heatNote: "沸水加热无法破坏（不同于鲜黄花菜里易溶水的成分）",
    summary: "秋天开紫粉花朵的球茎花卉！秋水仙碱是细胞里的『铁轨拆迁工』——专门阻止微管蛋白拼接成轨道，让细胞分裂停在半空中！",
    biochemDeep: "这把拆铁轨的扳手有两大神奇用途：① 农业科学家用它处理二倍体西瓜幼苗，造出四倍体再杂交出甜甜的『无籽西瓜』！② 医生用极微剂量阻止免疫白细胞顺着微管跑去痛风关节发炎！",
    parentTip: "告诉孩子：夏天吃的无籽大西瓜，居然和《致命毒物大百科》第3章档案11的秋水仙碱有关！生物化学就是这么奇妙！",
    radar: [35, 45, 96, 80, 96]
  },
  {
    id: "ch3-12", chapter: "ch3", code: "第3章 · 档案12", name: "苏铁", emoji: "🌴",
    mech: "cell", strategy: "poison", star: false,
    molecule: "苏铁苷 (Cycasin)",
    summary: "恐龙时代的裸子植物活化石（铁树）！结出的橘红『凤凰蛋』种子颜值虽高，里面的苏铁苷遇到肠道细菌的糖苷酶剪开后，会释放破坏肝脏DNA的甲基偶氮甲醇。"
  },
  {
    id: "ch3-13", chapter: "ch3", code: "第3章 · 档案13", name: "绣球花", emoji: "💠",
    mech: "enzyme", strategy: "poison", star: false,
    molecule: "绣球花苷 / 常山碱类呕吐成分",
    summary: "会随土壤酸碱度变蓝变粉的『天然酸碱指示剂花朵』（铝离子配位显蓝色）！餐厅绝不能摘绣球花叶摆盘装饰，误食会引发剧烈肠胃呕吐反应。"
  },
  {
    id: "ch3-14", chapter: "ch3", code: "第3章 · 档案14", name: "杜鹃花", emoji: "🌺",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "木藜芦毒素 (Grayanotoxin，二萜类)",
    summary: "漫山红遍的杜鹃家族中，羊踯躅等品种的花蜜都带『木藜芦毒素』（又称疯蜜毒素），和乌头碱一样喜欢扒开钠离子通道不放手，野生蜂蜜千万别乱喝！"
  },
  {
    id: "ch3-15", chapter: "ch3", code: "第3章 · 档案15", name: "铃兰", emoji: "🤍",
    mech: "enzyme", strategy: "poison", star: false,
    molecule: "铃兰毒苷 (Convallatoxin) 等30余种强心苷",
    summary: "洁白小铃铛般的新娘捧花常客，全株（连插过铃兰花瓶里的水！）都溶有比毛地黄还强劲的强心苷，欣赏完花朵记得洗净小手。"
  },
  {
    id: "ch3-16", chapter: "ch3", code: "第3章 · 档案16", name: "常绿钩吻藤", emoji: "🌼",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "钩吻素 (Gelsemine，吲哚生物碱)",
    summary: "金黄色喇叭花朵酷似金银花（断肠草近亲），钩吻生物碱作用于脊髓运动神经元甘氨酸受体，告诉我们路边的野花不要随便泡茶！"
  },
  {
    id: "ch3-17", chapter: "ch3", code: "第3章 · 档案17", name: "夹竹桃", emoji: "🌸",
    mech: "enzyme", strategy: "poison", star: true,
    molecule: "欧夹竹桃苷 (Oleandrin)", formula: "C32H48O9", molSize: "脂溶性强心苷 (576 Da)",
    heatNote: "干枯枝叶与烟雾中仍有残留毒性",
    summary: "马路绿化带的吸尘抗污模范标兵！因为它能吸收汽车尾气二氧化硫才被广泛种植，但它全株乳汁都含强心苷『欧夹竹桃苷』，折枝烤肉或含着花拍照都绝对禁止！",
    biochemDeep: "为什么马路要种有毒的夹竹桃？因为①昆虫不敢啃它所以不用喷农药；②叶片厚革质气孔下陷，净化空气本领一流；③味道极苦不会自己跑来攻击人——只要人类守住『眼看手勿折』的边界，它就是城市绿色卫士！",
    parentTip: "这是一个极好的生态辩证思维话题：植物造毒从来不是为了害人，而是站在原地无法奔跑的植物演化出的防虫盾牌。",
    radar: [70, 68, 55, 82, 45]
  },
  {
    id: "ch3-18", chapter: "ch3", code: "第3章 · 档案18", name: "蓖麻", emoji: "🌰",
    mech: "cell", strategy: "poison", star: true,
    molecule: "蓖麻毒蛋白 (Ricin，A-B双链糖蛋白)", formula: "A链(酶剪刀) + 二硫键 + B链(敲门砖)", molSize: "大分子核糖体失活蛋白 (约 64,000 Da)",
    heatNote: "彻底高温蒸煮压榨后蛋白变性（药用/工业蓖麻油不含水溶性毒蛋白）",
    summary: "种子花纹像漂亮的小甲虫！里面的『蓖麻毒蛋白』是一对分工明确的AB特工：B链负责敲开细胞大门，A链像一把快剪刀，一分钟剪断上千个核糖体RNA零件！",
    biochemDeep: "核糖体是细胞里织蛋白质毛衣的机器。蓖麻毒蛋白A链只要剪掉28S rRNA上的一个腺嘌呤碱基，整台机器就停工了！奇妙的是：蓖麻油是脂质，而蓖麻毒蛋白只溶于水不溶于油，再经高温蒸汽灭活，精炼蓖麻油就成了安全的工业润滑油与药用辅料！",
    parentTip: "从『水溶性蛋白 vs 脂溶性油脂』的溶解度差异，让孩子秒懂化学分离提纯的威力！",
    radar: [25, 40, 100, 75, 72]
  },
  {
    id: "ch3-19", chapter: "ch3", code: "第3章 · 档案19", name: "垂序商陆", emoji: "🍇",
    mech: "cell", strategy: "poison", star: false,
    molecule: "商陆皂苷 (Phytolaccatoxin) + 商陆抗病毒蛋白",
    summary: "一串串紫黑饱满的浆果像极了桑葚或葡萄，捏破手指染成紫红色（以前小孩常拿来当天然红墨水玩，切记不能放进嘴里，皂苷像洗洁精一样会破坏肠胃黏膜细胞）！"
  },
  {
    id: "ch3-20", chapter: "ch3", code: "第3章 · 档案20", name: "尖尾芋", emoji: "🍃",
    mech: "physical", strategy: "poison", star: false,
    molecule: "不溶性草酸钙针晶束 + 海芋素",
    summary: "叶子大如雨伞的热带观叶植物（滴水观音同门师兄弟），叶尖清晨吐出的水珠和茎汁都藏着成束的显微针晶，切勿把野生海芋当普通香芋挖回家！"
  },

  // ================= 第4章 蔬菜毒素篇 (6) =================
  {
    id: "ch4-01", chapter: "ch4", code: "第4章 · 档案01", name: "马铃薯", emoji: "🥔",
    mech: "cell", strategy: "poison", star: true,
    molecule: "α-龙葵碱 (Solanine) 与卡茄碱", formula: "C45H73NO15", molSize: "甾体糖苷生物碱 (868 Da)",
    heatNote: "⚠️ 沸水 100°C 煮不烂（需 200°C 以上才开始分解）",
    summary: "平时温和美味的土豆，一旦晒太阳变绿或发芽，就会紧急启动『护苗化学防线』，在芽眼和绿皮里狂造龙葵碱——既能捅破肠胃细胞膜，又会干扰乙酰胆碱酯酶！",
    biochemDeep: "为什么变绿和龙葵碱总是一起出现？其实绿色是无毒的『叶绿素』，但光照这同一个开关，同时打开了『叶绿素合成基因』和『龙葵碱防御基因』（准备长新苗啦，快防虫鼠啃咬）！所以绿色就是土豆写给人类的诚实警示牌！",
    parentTip: "厨房实验小课堂：避光阴凉存放土豆，和成熟的苹果放在一起（苹果释放乙烯植物激素，能帮土豆休眠抑制发芽）！发芽变绿的土豆果断丢弃。",
    radar: [60, 25, 82, 85, 35], labLink: "molecule"
  },
  {
    id: "ch4-02", chapter: "ch4", code: "第4章 · 档案02", name: "菜豆", emoji: "🫘",
    mech: "blood", strategy: "poison", star: true,
    molecule: "植物血球凝集素 (PHA, Phytohaemagglutinin)", formula: "四聚体糖蛋白", molSize: "怕热大分子蛋白质 (约 115,000 Da)",
    heatNote: "✅ 100°C 彻底沸水炖煮 10~15 分钟以上即可完全拆散灭活！",
    summary: "四季豆、红芸豆没焖熟时含有的『凝集素蛋白』就像有四只手的胶水怪，能抓住肠道绒毛和红细胞表面的糖链黏成一团；但只要沸水彻底煮透，它就散架变成优质营养蛋白质啦！",
    biochemDeep: "千万注意一个反直觉陷阱：如果用慢炖锅低温 80°C 温吞加热红芸豆，温度不够把蛋白拆散，反而让豆子膨胀释放更多活性凝集素，毒性比生豆还高5倍！必须100°C沸腾翻滚彻底焖熟！",
    parentTip: "把【马铃薯龙葵碱（小分子糖苷，煮不烂）】和【菜豆凝集素（大分子蛋白，煮透即安全）】放一起对比，孩子一辈子都忘不了分子结构的力量！",
    radar: [15, 72, 68, 78, 50], labLink: "molecule"
  },
  {
    id: "ch4-03", chapter: "ch4", code: "第4章 · 档案03", name: "西葫芦", emoji: "🥒",
    mech: "cell", strategy: "poison", star: false,
    molecule: "葫芦素 (Cucurbitacin，四环三萜类苦味素)",
    summary: "正常西葫芦清甜无毒，但如果受高温干旱胁迫或与观赏葫芦串粉，偶尔会返祖合成极苦的『葫芦素』——记住黄金铁律：吃到明显发苦的瓜类蔬菜立刻吐掉整盘倒掉！"
  },
  {
    id: "ch4-04", chapter: "ch4", code: "第4章 · 档案04", name: "瓠瓜", emoji: "🍐",
    mech: "cell", strategy: "poison", star: false,
    molecule: "葫芦素 D / E (Cucurbitacin)",
    summary: "注意区分『苦瓜的苦（苦瓜苷，安全）』与『瓠瓜/丝瓜变苦的苦（葫芦素，耐高温细胞毒）』！人类的苦味味蕾演化出来，本来就是为了帮我们第一时间识别这类植物毒素报警器的！"
  },
  {
    id: "ch4-05", chapter: "ch4", code: "第4章 · 档案05", name: "长蒴黄麻", emoji: "🌿",
    mech: "enzyme", strategy: "poison", star: false,
    molecule: "黄麻苷 (Strophanthidin 强心苷，仅存在于种子与成熟豆荚)",
    summary: "嫩叶是埃及名菜『帝王菜』，富含黏多糖营养美味；但开花结荚后的黑色种子里却会合成强心苷防鸟兽吞食——吃叶不吃籽，植物部位分工超分明！"
  },
  {
    id: "ch4-06", chapter: "ch4", code: "第4章 · 档案06", name: "银杏果", emoji: "🍂",
    mech: "enzyme", strategy: "poison", star: true,
    molecule: "4'-甲氧基吡哆醇 (MPN，维生素B6冒牌货)", formula: "C9H13NO3", molSize: "吡啶类小分子 (183 Da)",
    heatNote: "⚠️ 烘烤水煮只能去掉银杏酸，去不掉果仁里的 MPN！",
    summary: "白果软糯，为什么小朋友绝对不能贪吃（幼童几颗就可能中毒）？因为里面的 MPN 长得和『维生素B6』几乎双胞胎一样，会骗过大脑里的酶，让大脑造不出镇静神经的刹车递质！",
    biochemDeep: "教科书级的『反代谢物 (Antimetabolite) 竞争原理』：大脑合成刹车信使 GABA 需要维生素B6当助手；MPN 只比维生素B6多了一个小小的甲基帽(-CH3)，它抢走助手的位置却不干活！医生抢救白果中毒用的解药正是直接补充真正的维生素B6把冒牌货挤走！",
    parentTip: "这个『双胞胎冒牌货抢工位，真维生素B6来救场』的故事，8岁孩子一听就懂什么是竞争性抑制与特效解毒剂！",
    radar: [85, 15, 35, 88, 65]
  },

  // ================= 第5章 蘑菇毒素篇 (14) =================
  {
    id: "ch5-01", chapter: "ch5", code: "第5章 · 档案01", name: "鳞柄白鹅膏", emoji: "🍄",
    mech: "cell", strategy: "poison", star: true,
    molecule: "α-鹅膏毒肽 (α-Amanitin，双环八肽)", formula: "C39H54N10O14S", molSize: "刚性双环八肽 (918 Da)",
    heatNote: "⚠️ 钢铁双环结构：煮沸、油炸、晒干、冷冻统统破坏不了！",
    summary: "外号『毁灭天使』！全身洁白优雅，头戴帽子（菌盖）、腰系裙子（菌环）、脚穿靴子（菌托）。它的双环八肽会精准卡死肝细胞的『RNA聚合酶II』，让细胞复印不出蛋白质图纸！",
    biochemDeep: "为什么普通蛋白质一煮就熟，同样由氨基酸组成的鹅膏毒肽却怎么煮都不坏？因为它只有8个氨基酸，首尾焊成大环，中间还用一道『色氨酸-半胱氨酸硫醚桥』焊成8字双环锁！最狡猾的是它有6~24小时『假愈期』，所以野外白蘑菇一步都不能试错！",
    parentTip: "带孩子去【分子结构拆解镜】看鹅膏毒肽的『8字双环铁锁』，并背熟防毒蘑菇口诀：头上戴帽、腰间系裙、脚上穿靴的白蘑菇绝不碰（其实所有野蘑菇都不采不吃）！",
    radar: [20, 35, 100, 98, 70], labLink: "molecule"
  },
  {
    id: "ch5-02", chapter: "ch5", code: "第5章 · 档案02", name: "亚稀褶黑菇", emoji: "🍄",
    mech: "cell", strategy: "poison", star: false,
    molecule: "环丙-2-烯羧酸 (Cycloprop-2-ene carboxylic acid)",
    summary: "只有4个碳原子组成的超迷你三元张力环小分子毒素！虽然分子小到不可思议，却能触发横纹肌溶解，伤处切开会先变红而不直接变黑。"
  },
  {
    id: "ch5-03", chapter: "ch5", code: "第5章 · 档案03", name: "火焰茸", emoji: "🔥",
    mech: "cell", strategy: "poison", star: true,
    molecule: "单端孢霉烯族真菌毒素 (Trichothecenes / 撒旦菌素)", formula: "大环倍半萜环氧化物", molSize: "高活性环氧化合物",
    heatNote: "耐热，且汁液可经皮肤接触刺激起泡",
    summary: "枯木上伸出的鲜红色『火焰手指』！它是极少数连用手摸汁液都会让皮肤红肿脱皮的蘑菇，其大环单端孢霉烯分子能强行锁死真核细胞的核糖体转肽酶。",
    biochemDeep: "它原本是一种寄生在其他真菌或腐木上的肉座菌目子囊菌，鲜艳如火的珊瑚状子实体是大自然最直白的『高危勿碰』霓虹灯牌！",
    parentTip: "提醒孩子：在森林公园徒步遇到鲜红色像鹿角或胡萝卜一样的菌子，拍照留念就好，连手指都不要去戳它哦。",
    radar: [30, 45, 99, 30, 40]
  },
  {
    id: "ch5-04", chapter: "ch5", code: "第5章 · 档案04", name: "大孢花褶伞", emoji: "🍄",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "裸盖菇素类吲哚生物碱 (Psilocybin)",
    summary: "草坪牛马粪堆旁容易冒出的灰褐色小蘑菇，分子结构酷似大脑里的快乐信使『血清素(5-羟色胺)』，会扰乱大脑视觉与时间感知信号。"
  },
  {
    id: "ch5-05", chapter: "ch5", code: "第5章 · 档案05", name: "红褐斑褶菇", emoji: "🍄",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "5-羟色胺类似物生物碱（笑菌）",
    summary: "日本民间俗称『笑蕈』，因为它的吲哚类小分子会短暂扰乱面部表情神经与情绪回路，让人不由自主傻笑或眩晕。"
  },
  {
    id: "ch5-06", chapter: "ch5", code: "第5章 · 档案06", name: "古巴光盖伞", emoji: "🍄",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "赛洛西宾 (Psilocybin 磷酸酯前体)",
    summary: "受伤处会因酚氧化反应慢慢变蓝绿色的菌类，其分子影响大脑5-HT2A受体，在严格医学监管外属于严禁采食的有毒菌。"
  },
  {
    id: "ch5-07", chapter: "ch5", code: "第5章 · 档案07", name: "日本类脐菇", emoji: "✨",
    mech: "cell", strategy: "poison", star: true,
    molecule: "隐杯伞素 S (Illudin S) + 荧光素发光系统", formula: "C15H20O4", molSize: "倍半萜环丙烷分子 (264 Da)",
    heatNote: "煮熟仍具肠胃毒性",
    summary: "夜晚会在树干上发出幽幽绿光的『月夜蕈』！白天看超像美味的平菇或香菇，切开菌柄基部有一块黑紫色斑块；它的隐杯伞素会损伤肠壁细胞DNA，但科学家正把它改造成抗肿瘤候选分子！",
    biochemDeep: "为什么蘑菇会在黑夜里发光？因为它体内有『真菌荧光素 + 荧光素酶 + 氧气』反应，发出520纳米绿光吸引夜行小昆虫帮它到处传播孢子！",
    parentTip: "生物荧光化学（萤火虫、发光水母、月夜蕈）是引发孩子爱上生物化学最浪漫的切入点！",
    radar: [20, 20, 78, 92, 82]
  },
  {
    id: "ch5-08", chapter: "ch5", code: "第5章 · 档案08", name: "褐盖粉褶菌", emoji: "🍄",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "毒蕈碱 (Muscarine) + 胃肠炎毒素",
    summary: "外貌平平无奇最容易与可食口蘑混淆的『森林路人甲』！含有的毒蕈碱会持续按住副交感神经开关，引起流汗流涎与肠胃翻江倒海。"
  },
  {
    id: "ch5-09", chapter: "ch5", code: "第5章 · 档案09", name: "褐黑口蘑", emoji: "🍄",
    mech: "cell", strategy: "poison", star: false,
    molecule: "胃肠道黏膜刺激三萜皂苷",
    summary: "气味闻起来像面粉一样香，却含有强烈刺激消化道上皮细胞的萜类分子——彻底击碎『闻着香、虫子也吃的蘑菇就无毒』的错误老话！"
  },
  {
    id: "ch5-10", chapter: "ch5", code: "第5章 · 档案10", name: "粘盖拟近香蘑", emoji: "🍄",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "毒蕈碱类胆碱能激动剂",
    summary: "雨后菌盖滑溜溜的小蘑菇，证明光靠颜色朴素（不鲜艳）根本判断不了蘑菇有没有毒！"
  },
  {
    id: "ch5-11", chapter: "ch5", code: "第5章 · 档案11", name: "簇生盔孢伞", emoji: "🍄",
    mech: "cell", strategy: "poison", star: false,
    molecule: "α-鹅膏毒肽 (与白鹅膏同款致命双环八肽！)",
    summary: "长在腐木上成簇的小黄褐蘑菇，酷似金针菇或滑子菇，身体里居然合成了和『鳞柄白鹅膏』一模一样的鹅膏毒肽——不同科的蘑菇演化出了同一张分子配方！"
  },
  {
    id: "ch5-12", chapter: "ch5", code: "第5章 · 档案12", name: "簇生黄韧伞", emoji: "🍄",
    mech: "cell", strategy: "poison", star: false,
    molecule: "韧伞三萜苦味毒素 (Fasciculol)",
    summary: "树桩上成群冒出的硫磺色蘑菇，含有阻断神经钙通道并刺激肠胃的苦味四环三萜。"
  },
  {
    id: "ch5-13", chapter: "ch5", code: "第5章 · 档案13", name: "贝形圆孢侧耳", emoji: "🐚",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "侧耳奇异氨基酸 (Pleurocybellaziridine，氮杂环丙烷氨基酸)",
    summary: "洁白如扇贝的木生菌，含有极为罕见的『三元含氮小环氨基酸』，对肾功能较弱人群的少突胶质细胞有特异性损伤。"
  },
  {
    id: "ch5-14", chapter: "ch5", code: "第5章 · 档案14", name: "墨汁鬼伞", emoji: "🖤",
    mech: "enzyme", strategy: "poison", star: true,
    molecule: "鬼伞素 (Coprine，谷氨酰胺环丙酮衍生物)", formula: "C8H14N2O4", molSize: "前体酶抑制剂小分子 (202 Da)",
    heatNote: "成熟后自溶成黑墨水；毒素耐烹饪加热",
    summary: "单吃做汤没事，可一旦前后几天喝了含酒精的饮料（甚至酒心巧克力），就会瞬间脸红心跳难受！因为它的『鬼伞素』专门绑住肝脏解酒流水线的2号工人！",
    biochemDeep: "这跟『吃头孢不能喝酒（双硫仑样反应）』是一模一样的生物化学原理！肝脏把乙醇变成有毒的乙醛，再靠『乙醛脱氢酶』变成无害的乙酸（醋）。鬼伞素锁死了乙醛脱氢酶的半胱氨酸活性位点，让乙醛瞬间大堵车！",
    parentTip: "马上去【微观生化显微镜 · 肝脏解毒流水线】亲手点一下『加入鬼伞素』，还能顺便教会全家『吃头孢绝不碰酒』的救命知识！",
    radar: [30, 25, 30, 95, 75], labLink: "liver"
  },

  // ================= 第6章 水中生物毒素篇 (18) =================
  {
    id: "ch6-01", chapter: "ch6", code: "第6章 · 档案01", name: "红鳍东方鲀", emoji: "🐡",
    mech: "neuro", strategy: "poison", star: true,
    molecule: "河鲀毒素 (Tetrodotoxin, TTX)", formula: "C11H17N3O8", molSize: "笼状胍基小分子 (319 Da)",
    heatNote: "⚠️ 300°C 以下极难分解，普通炖煮烤炸完全无效！",
    summary: "一生气就鼓成气球的可爱河鲀，肝脏和卵巢里却藏着非蛋白天然毒素顶流——河鲀毒素(TTX)！它的分子正电头就像量身定制的软木塞，精准塞死神经钠离子通道外口！",
    biochemDeep: "分子锁钥奇迹：钠离子(Na+)平时穿一件『水分子外衣』通过通道的选择性滤器；TTX 分子头顶的『正电荷胍基』长得和穿水衣的钠离子一模一样，一头扎进门框跟羧酸根吸住，偏偏屁股后面的金刚烷笼状身体太胖卡在门外——进不去也不出来，把门彻底堵死！",
    parentTip: "必玩【神经城门模拟器】第一关！看 TTX 软木塞如何咔哒一声塞住钠离子通道，这也是现代局部麻醉药研发的重要灵感来源！",
    radar: [100, 15, 20, 75, 92], labLink: "synapse"
  },
  {
    id: "ch6-02", chapter: "ch6", code: "第6章 · 档案02", name: "云斑裸颊虾虎鱼", emoji: "🐟",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "河鲀毒素 (TTX，皮肤与内脏全年高毒)",
    summary: "海边礁石滩很容易钓到的小虎鱼，皮肤黏液和内脏竟含有和河鲀同款的TTX毒素！海钓遇到不认识的小花鱼千万别带回家煮汤。"
  },
  {
    id: "ch6-03", chapter: "ch6", code: "第6章 · 档案03", name: "红鳍赤鲉", emoji: "🐟",
    mech: "physical", strategy: "venom", star: false,
    molecule: "背鳍毒棘热不稳定蛋白毒素",
    summary: "伪装成海底红褐礁石的潜伏大师，背鳍硬棘连着毒腺，被扎到时用40~45°C温热水浸泡（不烫伤前提下）反而能利用『蛋白质怕热变性』原理缓解剧痛并及时就医！"
  },
  {
    id: "ch6-04", chapter: "ch6", code: "第6章 · 档案04", name: "龙须狮子鱼", emoji: "🦁",
    mech: "physical", strategy: "venom", star: false,
    molecule: "蓑鲉毒棘蛋白 + 乙酰胆碱",
    summary: "披着红白条纹华丽羽扇鳍的珊瑚礁明星（海洋馆常客）！飘逸的背鳍条里藏着针管般的毒棘，华丽条纹正是大海里的『请勿触碰』警戒色。"
  },
  {
    id: "ch6-05", chapter: "ch6", code: "第6章 · 档案05", name: "赤魟", emoji: "🛸",
    mech: "physical", strategy: "venom", star: false,
    molecule: "尾刺倒钩 + 5'-核苷酸酶/透明质酸酶毒液",
    summary: "喜欢把自己埋在浅滩沙子里的扁平魔鬼鱼近亲，扁尾巴根部长着带锯齿倒钩的骨质毒刺；在热带浅海涉水采用『拖步走（沙子震动让它提前游走）』就能避免踩到它！"
  },
  {
    id: "ch6-06", chapter: "ch6", code: "第6章 · 档案06", name: "鲤鱼", emoji: "🎏",
    mech: "cell", strategy: "poison", star: true,
    molecule: "鲤醇硫酸酯钠 (5α-Cyprinol sulfate，鱼胆毒素)", formula: "C27H47NaO5S", molSize: "胆汁醇硫酸酯盐 (506 Da)",
    heatNote: "⚠️ 耐高温、耐酒精（煮熟或泡酒鱼胆依然剧毒！）",
    summary: "最熟悉的淡水鱼也有隐藏雷区——『鱼胆』！民间偏方误传生吞鱼胆清火明目，殊不知草鱼、鲤鱼胆汁里的『鲤醇硫酸酯』像强力工业去污剂一样溶解肝肾细胞膜！",
    biochemDeep: "胆汁本来就是帮动物乳化油脂的『生物表面活性剂』。鲤科鱼类特有的27碳鲤醇硫酸酯水溶性和穿透力极强，直接破坏线粒体与肾小管上皮细胞——妈妈杀鱼时小心摘除苦胆不弄破，鱼肉本身就非常安全鲜美啦！",
    parentTip: "超级实用的家庭科学辟谣课：帮爷爷奶奶记住『鱼肉营养好，鱼胆绝不尝』！",
    radar: [20, 40, 90, 88, 25]
  },
  {
    id: "ch6-07", chapter: "ch6", code: "第6章 · 档案07", name: "地纹芋螺", emoji: "🐚",
    mech: "neuro", strategy: "venom", star: true,
    molecule: "芋螺毒素家族 (Conotoxins，上百种二硫键小肽) + 鱼类胰岛素", formula: "α / μ / ω-芋螺毒素组合导弹", molSize: "精密微肽 (10~30个氨基酸)",
    heatNote: "齿舌鱼叉可穿透薄手套",
    summary: "花纹像古老航海地图的美丽鸡心螺！它爬得慢怎么抓快游的鱼？它居然先往水里喷『超快效鱼类胰岛素』让鱼瞬间低血糖头晕游不动，再射出微型鱼叉注入上百种神经微肽！",
    biochemDeep: "药理学宝藏！地纹芋螺的每一种微肽只锁死一种特定的离子通道亚型。科学家把其中的『ω-芋螺毒素 MVIIA』原样合成出来，做成了不具成瘾性的超级镇痛药『齐考诺肽 (Ziconotide)』，还用它的速效胰岛素启发新一代糖尿病速效胰岛素设计！",
    parentTip: "这可能是大自然里最懂生物化学的海螺！去【化毒为药工坊】亲手用芋螺毒素合成超级止痛药吧；海边捡漂亮锥形花纹活海螺也记得千万别揣兜里。",
    radar: [99, 30, 35, 70, 100], labLink: "synapse"
  },
  {
    id: "ch6-08", chapter: "ch6", code: "第6章 · 档案08", name: "蓝环章鱼", emoji: "🐙",
    mech: "neuro", strategy: "venom", star: true,
    molecule: "河鲀毒素 (TTX，由唾液腺共生菌合成主动咬注)", formula: "C11H17N3O8", molSize: "笼状胍基小分子 (319 Da)",
    heatNote: "极耐高温",
    summary: "只有高尔夫球大小，平时米黄色很低调；一旦受惊，皮肤色素囊肌肉在0.3秒内拉开，亮起50多个宝蓝色霓虹光环！它唾液腺装满河鲀毒素，连蟹壳都能咬穿注入！",
    biochemDeep: "注意它的跨界身份：河鲀用TTX当『被动Poison（防被吃）』，而蓝环章鱼把同一种小分子TTX装进唾液腺当『主动Venom（咬猎物或往水里释放）』！蓝光也不是化学发光，而是皮肤底下纳米级鸟嘌呤反射镜片的物理结构色！",
    parentTip: "赶海退潮礁石坑第一铁律：遇到闪着蓝圈的小章鱼、花纹鲜艳的小螃蟹，只拍照绝不伸手抓！",
    radar: [100, 15, 25, 35, 85], labLink: "synapse"
  },
  {
    id: "ch6-09", chapter: "ch6", code: "第6章 · 档案09", name: "花纹爱洁蟹", emoji: "🦀",
    mech: "neuro", strategy: "poison", star: false,
    molecule: "石房蛤毒素 (Saxitoxin, STX) + 河鲀毒素 (TTX)",
    summary: "甲壳光滑如红褐色烤瓷、圆滚滚超像玩具的珊瑚礁毒蟹！通过吃有毒海藻和底栖生物，肌肉与内脏攒下了煮不烂的麻痹性贝类毒素STX与TTX。"
  },
  {
    id: "ch6-10", chapter: "ch6", code: "第6章 · 档案10", name: "喇叭毒棘海胆", emoji: "🟣",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "花萼状叉棘蛋白毒素 (Peditoxin)",
    summary: "乍一看没长尖刺像一朵盛开的海葵小花！其实花瓣全是像三爪抓娃娃机一样的『毒叉棘』，一碰到敌人就咔哒合拢咬住注射麻痹毒素。"
  },
  {
    id: "ch6-11", chapter: "ch6", code: "第6章 · 档案11", name: "刺冠海胆", emoji: "⚫",
    mech: "physical", strategy: "venom", star: false,
    molecule: "中空脆性碳酸钙长棘 + 生物胺色素质",
    summary: "全身长满30厘米细长黑刺，刺表面有微倒刺且脆如铅笔芯，扎入皮肤极易折断残留。"
  },
  {
    id: "ch6-12", chapter: "ch6", code: "第6章 · 档案12", name: "夜海葵", emoji: "🌸",
    mech: "physical", strategy: "venom", star: false,
    molecule: "海葵孔道形成毒素 (Actinoporin) + 钠钾通道肽",
    summary: "白天缩成一团、夜晚张开触手捕食的礁石猎手，触手布满刺丝囊，分泌的多肽能在猎物细胞膜上拼接成圆孔。"
  },
  {
    id: "ch6-13", chapter: "ch6", code: "第6章 · 档案13", name: "僧帽水母", emoji: "🎐",
    mech: "physical", strategy: "venom", star: true,
    molecule: "刺丝囊高压微针 + 僧帽水母穿孔蛋白 (Physalitoxin)", formula: "糖蛋白穿孔复合物", molSize: "超高速生物力学 + 大分子穿孔毒素",
    heatNote: "⚠️ 冲上海滩干瘪的蓝色气囊触手仍可触发自动射针！",
    summary: "海面上飘着的梦幻蓝紫色透明气球！它其实不是一只水母，而是由浮囊体、营养体、生殖体和几十米长的触手组成的『管水母超级殖民舰队』！",
    biochemDeep: "自然界最快的微观动作：触手上的『刺丝囊』内部渗透压高达150个大气压（比汽车轮胎高几十倍）！一碰触发器，微米鱼叉在700纳秒（百万分之0.7秒）内以5万倍重力加速度弹出！千万记住：被海蜇水母蛰伤绝不能浇淡水（淡水低渗透压会让残留刺丝囊集体爆炸射针），应用海水冲洗！",
    parentTip: "『为什么水母蛰伤用海水冲而不能浇矿泉水？』——用中学就要学的『细胞渗透压』原理完美解答，8岁就能建立超棒的物理化学直觉！",
    radar: [72, 65, 85, 60, 50]
  },
  {
    id: "ch6-14", chapter: "ch6", code: "第6章 · 档案14", name: "灯水母", emoji: "🏮",
    mech: "physical", strategy: "venom", star: false,
    molecule: "立方水母族刺丝囊穿孔蛋白",
    summary: "伞体像白色小方灯笼、挂着四根粉红长触手的日本近海常见水母，夏季海滨浴场的隐形刺客。"
  },
  {
    id: "ch6-15", chapter: "ch6", code: "第6章 · 档案15", name: "箱水母", emoji: "🧊",
    mech: "cell", strategy: "venom", star: true,
    molecule: "澳洲箱水母穿孔毒素 CfTX-1 / CfTX-2", formula: "孔道形成糖蛋白", molSize: "大分子蛋白 (约 43,000 Da)",
    heatNote: "45°C 温热与家用食醋（抑制未发射刺丝囊放电）为澳洲海滩标准急救",
    summary: "全身透明如冰块、长着24只眼睛（包含带晶状体和视网膜的真眼睛！）的海洋顶级毒王！它的穿孔蛋白在红细胞膜上打孔后，大量钾离子漏进血液，几分钟就会扰乱心跳电信号！",
    biochemDeep: "科学家用CRISPR基因筛选技术找到了箱水母毒素在人体细胞上的『垫脚石』——它必须先抓住细胞膜上的『胆固醇』才能打孔！于是科学家正在测试用环糊精把胆固醇临时藏起来，研发新一代箱水母解毒喷雾！",
    parentTip: "水母没有大脑，居然长着24只眼睛能避开障碍物游泳！生命演化的多样性太震撼了。",
    radar: [88, 92, 95, 90, 75]
  },
  {
    id: "ch6-16", chapter: "ch6", code: "第6章 · 档案16", name: "棘冠海星", emoji: "⭐",
    mech: "blood", strategy: "venom", star: false,
    molecule: "海星皂苷 (Asterosaponin) + 磷脂酶毒棘蛋白",
    summary: "长着十几条腕足、浑身毒刺的『珊瑚礁大胃王』，表面涂满能溶解红细胞膜的甾体皂苷。"
  },
  {
    id: "ch6-17", chapter: "ch6", code: "第6章 · 档案17", name: "海蛇", emoji: "🌊",
    mech: "neuro", strategy: "venom", star: false,
    molecule: "海蛇短链 α-神经毒素 (Erabutoxin) + 肌肉溶解磷脂酶",
    summary: "尾巴扁平如船桨的海洋爬行动物，毒液比陆地眼镜蛇更浓缩（为了在水里一口留住滑溜的鱼），但性格温顺很少主动咬人。"
  },
  {
    id: "ch6-18", chapter: "ch6", code: "第6章 · 档案18", name: "海毛虫", emoji: "🐛",
    mech: "physical", strategy: "venom", star: false,
    molecule: "空心钙质刚毛 + 扁虫素 (Complanine 季铵盐发炎分子)",
    summary: "海底礁石下长满白色玻璃纤维般漂亮鬃毛的多毛类环节动物，摸一下几百根脆毛就会留在皮肤里。"
  },

  // ================= 第7章 矿物毒素篇 (8) =================
  {
    id: "ch7-01", chapter: "ch7", code: "第7章 · 档案01", name: "辰砂", emoji: "🔴",
    mech: "enzyme", strategy: "mineral_chem", star: true,
    molecule: "硫化汞晶体 (HgS，朱砂)", formula: "HgS (汞离子与硫离子紧密共价晶格)", molSize: "无机矿物晶格",
    heatNote: "⚠️ 绝对不可火烧加热！一烧就会释放剧毒汞蒸气 (HgS + O2 → Hg↑ + SO2)！",
    summary: "中国古画里千年不褪色的绝美正红色矿物颜料『朱砂』！常温下硫化汞晶格锁得很紧极难溶于水，可古人炼仙丹拿火一烧，立刻跑出无色无味的剧毒水银蒸气！",
    biochemDeep: "为什么汞离子(Hg²⁺)和重金属有毒？因为人体里所有干活的『酶蛋白』都靠含硫的半胱氨酸（巯基 -SH）维持形状；汞原子的外号就叫『嗜硫元素（Mercaptan 捕汞者）』，一见到蛋白质上的硫就死死抱住，让全身酶蛋白集体罢工！",
    parentTip: "历史与化学联动：为什么古代皇帝吃炼丹师烧出来的『红丹』反而中毒？用这一个化学方程式就能给8岁孩子讲透科学与迷信的区别！",
    radar: [78, 35, 65, 70, 30], labLink: "molecule"
  },
  {
    id: "ch7-02", chapter: "ch7", code: "第7章 · 档案02", name: "雌黄", emoji: "🟡",
    mech: "enzyme", strategy: "mineral_chem", star: true,
    molecule: "三硫化二砷 (As2S3)", formula: "As2S3 (柠檬黄层状矿物)", molSize: "无机硫砷矿物",
    heatNote: "空气中灼烧氧化会变成剧毒砒霜（三氧化二砷 As2O3）！",
    summary: "成语『信口雌黄』里的本尊！因为古人用黄纸写字，写错了就涂一点金黄色的雌黄粉末盖住（古代修正液）——它既防书虫蛀咬，又含砷元素，所以古人写字绝不能舔笔头！",
    biochemDeep: "更令人拍案叫绝的现代医学反转：雌黄氧化得到的砒霜（三氧化二砷 As2O3），在中国科学家张亭栋、陈竺团队的分子靶向研究下，成了精准降解致癌融合蛋白、治愈『急性早幼粒细胞白血病』的世界级救命神药！",
    parentTip: "跟孩子讲讲成语『信口雌黄』的化学来历，再讲中国科学家把三氧化二砷变成治愈白血病良药的真实故事，民族自豪感与科学精神拉满！",
    radar: [55, 50, 80, 65, 95]
  },
  {
    id: "ch7-03", chapter: "ch7", code: "第7章 · 档案03", name: "砷黄铁矿", emoji: "🪨",
    mech: "enzyme", strategy: "mineral_chem", star: false,
    molecule: "硫砷铁矿 (FeAsS，毒砂)",
    summary: "金属光泽酷似愚人金，用锤子敲击会散发出『大蒜味』的砷蒸气，是矿物学家通过气味识别含砷矿石的经典特征（野外看矿石只看别敲别闻）！"
  },
  {
    id: "ch7-04", chapter: "ch7", code: "第7章 · 档案04", name: "石棉", emoji: "🧵",
    mech: "physical", strategy: "mineral_chem", star: false,
    molecule: "纤维状硅酸盐矿物微针",
    summary: "明明是石头却能纺成烧不着的布（古代火浣布）！但它在显微镜下是比头发丝细千倍的坚硬硅酸盐微针，吸入肺泡后巨噬细胞吞不下也溶不掉，现代建筑已全面禁用。"
  },
  {
    id: "ch7-05", chapter: "ch7", code: "第7章 · 档案05", name: "方铅矿", emoji: "⬛",
    mech: "enzyme", strategy: "mineral_chem", star: false,
    molecule: "硫化铅立方晶体 (PbS)",
    summary: "天生会裂成完美小正方体的银灰色重矿石！铅离子(Pb²⁺)会冒充我们身体里的钙离子(Ca²⁺)和锌离子，影响造血酶与儿童神经发育，所以无铅汽油和洗手习惯功不可没！"
  },
  {
    id: "ch7-06", chapter: "ch7", code: "第7章 · 档案06", name: "辉锑矿", emoji: "🗡️",
    mech: "enzyme", strategy: "mineral_chem", star: false,
    molecule: "三硫化二锑 (Sb2S3)",
    summary: "长成一簇簇银色宝剑般的绝美矿物标本（博物馆网红展品），古埃及人曾磨粉画眼线；与砷同属元素周期表第15族，参观矿物展隔着玻璃欣赏最安全。"
  },
  {
    id: "ch7-07", chapter: "ch7", code: "第7章 · 档案07", name: "钙铀云母", emoji: "🟢",
    mech: "cell", strategy: "mineral_chem", star: false,
    molecule: "含水磷酸铀酰钙 Ca(UO2)2(PO4)2·10-12H2O",
    summary: "紫外灯下会发出震撼霓虹绿荧光的片状晶体！兼具重金属化学毒性与天然放射性电离粒子，必须保存在专业防辐射铅盒或密封展柜中。"
  },
  {
    id: "ch7-08", chapter: "ch7", code: "第7章 · 档案08", name: "晶质铀矿", emoji: "☢️",
    mech: "cell", strategy: "mineral_chem", star: false,
    molecule: "二氧化铀 (UO2，沥青铀矿)",
    summary: "居里夫人当年从几吨沥青铀矿渣里提炼出钋和镭，打开了原子物理学与现代放射医学的大门！"
  },

  // ================= 第8章 生活与环境化学篇 (6) =================
  {
    id: "ch8-01", chapter: "ch8", code: "第8章 · 档案01", name: "香烟", emoji: "🚭",
    mech: "neuro", strategy: "mineral_chem", star: true,
    molecule: "尼古丁 (Nicotine) + 一氧化碳 + 焦油多环芳烃", formula: "C10H14N2", molSize: "吡啶生物碱小分子 (162 Da)",
    heatNote: "燃烧产生数千种副产物",
    summary: "烟草植物原本合成『尼古丁』是为了毒晕啃叶子的害虫！它进入人脑后会强行打开多巴胺奖赏开关让人上瘾，而一氧化碳更会抢走红细胞运氧气的座位！",
    biochemDeep: "为什么叫『烟碱型乙酰胆碱受体』？就是因为科学家最早用烟草里的尼古丁（烟碱）发现了这一类神经受体！一氧化碳(CO)与血红蛋白的结合力更是氧气(O2)的240倍，把氧气挤得没座坐——远离二手烟就是保护全家人的红细胞和肺泡！",
    parentTip: "用『植物原本造尼古丁是为了杀虫』+『一氧化碳抢血红蛋白座位』，比一千句生硬说教更能让孩子从小自觉远离烟草！",
    radar: [85, 78, 82, 60, 15]
  },
  {
    id: "ch8-02", chapter: "ch8", code: "第8章 · 档案02", name: "除草剂", emoji: "🌾",
    mech: "enzyme", strategy: "mineral_chem", star: false,
    molecule: "选择性植物氨基酸合成酶抑制剂等",
    summary: "现代选择性除草剂常瞄准『只有植物有、动物没有的莽草酸代谢通路』——公园草坪刚贴『绿植养护喷药中』告示牌时，别在草地上打滚也别让小狗去舔草哦！"
  },
  {
    id: "ch8-03", chapter: "ch8", code: "第8章 · 档案03", name: "杀菌剂", emoji: "🧼",
    mech: "cell", strategy: "mineral_chem", star: false,
    molecule: "真菌麦角甾醇合成抑制剂 / 家用消毒剂",
    summary: "保护庄稼不发霉的化学盾牌；家里切记『84消毒液（次氯酸钠）绝不能和洁厕灵（盐酸）混用』，否则会发生氧化还原反应冒出刺激性氯气！"
  },
  {
    id: "ch8-04", chapter: "ch8", code: "第8章 · 档案04", name: "杀虫剂", emoji: "🦟",
    mech: "neuro", strategy: "mineral_chem", star: true,
    molecule: "拟除虫菊酯 (Pyrethroids，源自除虫菊花的仿生分子)", formula: "菊酸酯类结构", molSize: "脂溶性小分子",
    heatNote: "哺乳动物肝脏酯酶可快速分解，但猫和鱼缺乏相关酶！",
    summary: "家里电蚊香液的秘密来自一种小白花『除虫菊』！它的仿生分子能卡住蚊子的钠离子通道，人类肝脏有酶能很快分解它，但鱼缸和小猫咪可受不了！",
    biochemDeep: "再一次见证『物种代谢酶差异』：人类和狗狗肝脏有丰富的羧酸酯酶，能迅速把拟除虫菊酯剪成无害小片排出；但鱼类几乎没法代谢它，猫咪肝脏也缺少葡萄糖醛酸转移酶！所以点蚊香要离小鱼缸远远的，绝不能给猫咪用狗狗的驱虫滴剂！",
    parentTip: "家里有养猫或养鱼的小朋友听到这个生化原理都会惊呼『原来如此』，立刻变身家庭小宠物安全官！",
    radar: [82, 15, 20, 50, 65], labLink: "synapse"
  },
  {
    id: "ch8-05", chapter: "ch8", code: "第8章 · 档案05", name: "历史警示化学物", emoji: "🕊️",
    mech: "enzyme", strategy: "mineral_chem", star: false,
    molecule: "《禁止化学武器公约》(OPCW) 全球和平守护",
    summary: "斋藤胜裕教授在书中写下这一节，是为了提醒全人类：化学的使命是理解生命、治疗疾病与创造美好材料，全世界科学家共同签署国际公约，让化学永远只做守护生命的盾牌！"
  },
  {
    id: "ch8-06", chapter: "ch8", code: "第8章 · 档案06", name: "微塑料", emoji: "🌊",
    mech: "physical", strategy: "mineral_chem", star: true,
    molecule: "粒径 < 5毫米的聚合物微粒及吸附污染物", formula: "(C2H4)n / PET / PP 微粒", molSize: "微米至纳米级高分子颗粒",
    heatNote: "不把塑料外卖盒高温微波，少用一次性塑料吸管",
    summary: "全书压轴的未来地球课题！塑料袋与化纤在阳光海浪打磨下碎成比芝麻还小的微粒，本身不易被细菌酶分解，还会像小海绵一样吸附海里的疏水污染物顺着食物链传递！",
    biochemDeep: "为什么自然界细菌能分解树叶木头，却很难分解塑料？因为纤维素和蛋白质是自然界存在了几亿年的聚合物，细菌早就演化出了对应的水解酶钥匙；而合成塑料才诞生一百多年！不过近年来科学家已经发现了能『吃PET塑料』的细菌酶（PETase），未来也许就由新一代小生物化学家来彻底攻克它！",
    parentTip: "把最后一篇升华为给8岁女儿的科学梦想种子：大自然还没解决的分子难题，也许未来就等你来设计新的『超级分解酶』啦！",
    radar: [20, 25, 45, 90, 60]
  }
];
