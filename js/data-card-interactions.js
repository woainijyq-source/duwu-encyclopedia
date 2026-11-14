// ============================================================================
// 《奇妙毒物科学游乐园》全书 99 张卡片专属互动实验 & 趣味问答库 (零雷同定制版)
// 每一张毒物闪卡均拥有：
//   - exp1: 专属互动实验 1（针对该毒物的独特生化/物理/生态实验 + 双语跟读）
//   - exp2: 专属互动实验 2（针对该毒物的急救/化毒为药/鉴别实验 + 双语跟读）
//   - quiz: 专属「考考小馆长」二选一互动闯关（答对赢取 ⭐ 星星奖励 + 语音揭秘）
// ============================================================================

window.CARD_INTERACTIONS = {
  "ch0-01": {
    "exp1": {
      "icon": "💧🫧",
      "title": "狂喝10升纯净水实验",
      "sub": "测试无毒的水过量会怎样",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "⚖️💧",
      "msg": "警报响起！短时间狂喝太多纯净水，血液里的钠离子被冲得太淡（低钠血症），连细胞都会吸水胀大！原来哪怕是水，过量也会扰乱细胞工作！",
      "bi": {
        "en": "Even pure water is bad if you drink too much!",
        "zh": "哪怕是纯净水，喝得太多也会伤身体！",
        "kw": [
          "pure",
          "water",
          "much"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🤿🫧",
      "title": "吸高压纯氧潜水实验",
      "sub": "测试生命必需的氧气",
      "tone": "teal",
      "sfx": "sizzle",
      "badge": "🤿⚡",
      "msg": "潜水员如果深海吸高压纯氧太久，身体里会冒出太多活性氧自由基，引发『氧中毒』抽搐！所以毒不是魔法，而是分子浓度超出了细胞的承受力！",
      "bi": {
        "en": "Too much oxygen can also hurt our cells!",
        "zh": "过量的氧气也会伤害我们的细胞！",
        "kw": [
          "oxygen",
          "hurt",
          "cells"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么外来的毒物分子能让身体生病？",
      "a": "因为它的分子形状刚好卡住了细胞机器的齿轮",
      "b": "因为它会施展看不见的黑暗魔法",
      "ans": "a",
      "explain": "太棒啦！所有毒物都是实实在在的化学分子，当它撞上细胞上的受体或酶，就像塞错的钥匙卡住锁孔一样！"
    }
  },
  "ch0-02": {
    "exp1": {
      "icon": "🐭🐘",
      "title": "小鼠 vs 大象同滴1毫克",
      "sub": "对比20克小鼠与4吨大象",
      "tone": "teal",
      "sfx": "chime",
      "badge": "⚖️🐘",
      "msg": "同样1毫克毒素，进到20克小鼠体内浓度极高，进到4000千克大象体内却被稀释了整整20万倍！大象连痒都不觉得，所以必须按『每千克体重』来算致死量！",
      "bi": {
        "en": "Body weight changes the concentration in blood!",
        "zh": "体重会改变分子在血液里的浓度！",
        "kw": [
          "weight",
          "concentration",
          "blood"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "📉🏆",
      "title": "比比 LD50 数字大小",
      "sub": "0.01 和 1000 谁更毒？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "📊⚠️",
      "msg": "反直觉重点来啦！LD50 数字越小，说明只需要极微小的毫克数就能致命——所以 LD50=0.01 的毒素比 LD50=1000 的毒素猛烈十万倍！",
      "bi": {
        "en": "A smaller LD50 number means a stronger poison!",
        "zh": "LD50数字越小，代表毒性越猛烈！",
        "kw": [
          "smaller",
          "stronger",
          "poison"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：小朋友感冒吃药时，为什么不能直接吃大人的整片药？",
      "a": "小朋友体重轻，同样剂量在血液里浓度太高会中毒",
      "b": "大人的药片太苦了小朋友咽不下去",
      "ans": "a",
      "explain": "完全正确！小朋友体重只有大人的几分之一，必须严格按照『毫克/千克体重』减量，这就是LD50教给我们的安全法则！"
    }
  },
  "ch0-03": {
    "exp1": {
      "icon": "🐍🦷",
      "title": "扫描『主动出击型』毒液",
      "sub": "看看毒蛇毒蜂造什么分子",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🗡️🧬",
      "msg": "扫描结果：主动用毒牙、毒刺注射的生物（Venom），最爱合成个头大、结构复杂的『蛋白质与多肽酶』，直接打进猎物血管里一招制胜！",
      "bi": {
        "en": "Venom is injected by fangs or stingers!",
        "zh": "毒液是靠毒牙或毒刺注射进去的！",
        "kw": [
          "Venom",
          "injected",
          "fangs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🌿🛡️",
      "title": "扫描『被动防御型』毒素",
      "sub": "看看植物和毒蘑菇造什么",
      "tone": "purple",
      "sfx": "chime",
      "badge": "🛡️🧪",
      "msg": "扫描结果：不会逃跑的植物和蘑菇（Poison），专门合成个头小、不怕胃酸也不怕煮的『生物碱、强心苷和环肽』，谁敢乱咬一口就会吃苦头！",
      "bi": {
        "en": "Plants make small molecules to stop hungry animals!",
        "zh": "植物合成小分子来阻止贪吃的动物！",
        "kw": [
          "Plants",
          "molecules",
          "animals"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：毒蛇的毒液（蛋白质）和毒蘑菇的毒素（小分子环肽），哪个更容易被胃蛋白酶剪碎？",
      "a": "毒蛇的大分子蛋白质毒液",
      "b": "毒蘑菇的钢铁双环小分子",
      "ans": "a",
      "explain": "答对啦！大分子蛋白质能被胃蛋白酶剪断（但嘴里有破口依然危险），而毒蘑菇的小分子环肽连胃酸和沸水都拿它没办法！"
    }
  },
  "ch0-04": {
    "exp1": {
      "icon": "🎚️💊",
      "title": "把剧毒剂量缩小1000倍",
      "sub": "亲手拨动帕拉塞尔苏斯天平",
      "tone": "green",
      "sfx": "chime",
      "badge": "⚖️✨",
      "msg": "奇迹发生啦！原本会让心脏乱跳或肌肉麻痹的毒素，缩小到微克级并加上靶向导航后，刚好能帮失控的细胞踩刹车，摇身一变成了医院里的救命良药！",
      "bi": {
        "en": "The right dose turns a poison into medicine!",
        "zh": "精准的剂量能把毒物变成良药！",
        "kw": [
          "dose",
          "poison",
          "medicine"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔑🎯",
      "title": "测试『钥匙与锁孔』亲和力",
      "sub": "为什么科学家爱研究毒物",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🔑🧬",
      "msg": "普通小分子在身体里乱逛谁也不理，而天然毒素经过上亿年演化，每一把都是能100%精准插进特定离子通道或受体锁孔的『超级钥匙』，是研发新药的最佳模板！",
      "bi": {
        "en": "Toxins are super precise keys for cell locks!",
        "zh": "毒素是开启细胞锁孔的超精准钥匙！",
        "kw": [
          "Toxins",
          "precise",
          "keys"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：毒理学之父帕拉塞尔苏斯最著名的黄金名言是什么？",
      "a": "万物皆有毒，唯剂量使然",
      "b": "天然植物做成的东西一定百分之百无毒",
      "ans": "a",
      "explain": "太聪明啦！不管是天然的还是人工合成的，决定它是毒还是药的关键，永远是『剂量』和『使用方式』！"
    }
  },
  "ch1-01": {
    "exp1": {
      "icon": "💉⚡",
      "title": "打吗啡止痛针管用吗？",
      "sub": "测试鸭嘴兽毒刺的痛觉肽",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🦫⚡",
      "msg": "普通止痛药吗啡居然失灵啦！因为雄性鸭嘴兽后脚踝毒刺里的80多种多肽，会直接刺激痛觉神经元的离子通道，让人疼上好几个星期！",
      "bi": {
        "en": "Its ankle spur venom causes lasting pain!",
        "zh": "它脚踝毒刺的毒液会引起持久的剧痛！",
        "kw": [
          "spur",
          "venom",
          "pain"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧬💊",
      "title": "提取『超稳固降糖激素』",
      "sub": "鸭嘴兽送给人类的医学礼物",
      "tone": "green",
      "sfx": "chime",
      "badge": "💊✨",
      "msg": "大发现！人体正常的控血糖激素(GLP-1)几分钟就被酶分解了，可鸭嘴兽毒液里的同款激素却像穿了防弹衣一样不易分解，正帮科学家研发长效糖尿病新药！",
      "bi": {
        "en": "Platypus venom inspires new diabetes medicine!",
        "zh": "鸭嘴兽毒液启发了新型糖尿病药物！",
        "kw": [
          "Platypus",
          "venom",
          "medicine"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：鸭嘴兽全身上下，真正的毒刺长在哪里？",
      "a": "雄性鸭嘴兽的后脚踝内侧",
      "b": "扁扁的鸭嘴巴舌头底下",
      "ans": "a",
      "explain": "完全正确！只有雄性鸭嘴兽后脚踝长着空心毒距，繁殖季节用来和情敌比武争领地！"
    }
  },
  "ch1-02": {
    "exp1": {
      "icon": "🙋‍♂️💧",
      "title": "单独测它胳膊上的腺体油",
      "sub": "不混唾液直接测试毒性",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🧪🅰️",
      "msg": "咦，单独涂胳膊内侧的肱腺分泌液，威力还没激活！原来懒猴把化学武器拆成了A、B两个安全零件分开存放，平时理毛才不会毒到自己！",
      "bi": {
        "en": "Two safe parts mix to make active venom!",
        "zh": "两个安全组分混合才激活成毒液！",
        "kw": [
          "parts",
          "mix",
          "venom"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "👅⚡",
      "title": "胳膊腺液 + 唾液混合反应",
      "sub": "还原懒猴举手舔胳膊绝招",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🧪💥",
      "msg": "化学反应启动！当肱腺蛋白遇到唾液瞬间组合成类似猫过敏原(Fel d 1)的强效复合物，涂满齿冠，还能抹在小懒猴宝宝绒毛上防天敌偷袭！",
      "bi": {
        "en": "Slow loris mixes arm oil with saliva!",
        "zh": "懒猴把手臂腺油和唾液混合在一起！",
        "kw": [
          "mixes",
          "oil",
          "saliva"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：懒猴遇到危险时为什么会像投降一样把双手举过头顶？",
      "a": "为了舔胳膊内侧的毒腺，让腺液与唾液混合激活毒液",
      "b": "为了向捕食者求饶讨果子吃",
      "ans": "a",
      "explain": "答对啦！它是世界上唯一有毒的灵长类动物，举起双手是在调配它的『AB双组分二元化学毒液』！"
    }
  },
  "ch1-03": {
    "exp1": {
      "icon": "🪲🍽️",
      "title": "改喂无毒面包虫与水果",
      "sub": "切断它的野生甲虫食谱",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐦🥗",
      "msg": "神奇的事情发生了！不吃野外的姬花萤科毒甲虫后，新长出来的羽毛和皮肤完全测不出树蛙毒素！原来会飞的毒鸟也是从食物链『借毒穿衣』的高手！",
      "bi": {
        "en": "This bird gets its poison from eating beetles!",
        "zh": "这种鸟靠吃甲虫获得身上的毒素！",
        "kw": [
          "bird",
          "poison",
          "beetles"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🥚🛡️",
      "title": "用羽毛蹭一蹭鸟窝里的蛋",
      "sub": "看看毒鸟妈妈怎么护娃",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🥚✨",
      "msg": "高明！黑头林鵙鹟妈妈会把羽毛上的树蛙毒素蹭到洁白的鸟蛋壳上，贪吃的树蛇和巨蜥一舔鸟蛋嘴巴发麻，再也不敢偷吃它的宝宝啦！",
      "bi": {
        "en": "Mother bird rubs toxin on her eggs for safety!",
        "zh": "鸟妈妈把毒素蹭在鸟蛋上保护宝宝！",
        "kw": [
          "Mother",
          "toxin",
          "eggs"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：新几内亚的黑头林鵙鹟羽毛里，为什么会有和南美洲箭毒蛙同款的毒素？",
      "a": "因为它们都爱吃含有同款毒素的甲虫",
      "b": "因为黑头林鵙鹟会飞过太平洋去抓箭毒蛙吃",
      "ans": "a",
      "explain": "完全正确！跨越半个地球的毒鸟和毒蛙，都是通过捕食姬花萤科等有毒小甲虫，把树蛙毒素富集到自己皮肤和羽毛里的！"
    }
  },
  "ch1-04": {
    "exp1": {
      "icon": "🐸🎒",
      "title": "喂它吃一只剧毒中华蟾蜍",
      "sub": "观察它脖子后面的储毒口袋",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🐍🎒",
      "msg": "回收成功！虎斑颈槽蛇自己不怕蟾蜍毒，反而把吃进肚子的蟾蜍强心毒素完好无损地运送到脖子后方的『颈腺』里存起来，当成防身暗器！",
      "bi": {
        "en": "It stores toad poison in its neck glands!",
        "zh": "它把蟾蜍毒素储存在脖子腺体里！",
        "kw": [
          "stores",
          "toad",
          "neck"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦷🛡️",
      "title": "对比嘴里毒牙 vs 脖子毒腺",
      "sub": "揭秘自然界罕见的『双毒蛇』",
      "tone": "purple",
      "sfx": "sizzle",
      "badge": "⚔️🛡️",
      "msg": "一蛇双修！它嘴里的后沟牙能自己合成出血性毒液（Venom）用来抓青蛙；遇到老鹰袭击时则弓起脖子，从颈腺挤出借来的蟾蜍毒（Poison）熏跑天敌！",
      "bi": {
        "en": "This snake has both venom fangs and neck poison!",
        "zh": "这条蛇同时拥有毒牙毒液和颈部防御毒！",
        "kw": [
          "snake",
          "venom",
          "poison"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果虎斑颈槽蛇从小生活在没有蟾蜍的岛上，它脖子后面的颈腺还有毒吗？",
      "a": "没有毒，因为颈腺里的毒是吃蟾蜍攒下来的",
      "b": "照样剧毒，因为颈腺自己会造蟾蜍毒",
      "ans": "a",
      "explain": "答对啦！科学家发现没有蟾蜍分布地区的虎斑颈槽蛇，颈腺里空空如也！你还可以去第2站【借毒养成缸】亲手喂它试试！"
    }
  },
  "ch1-05": {
    "exp1": {
      "icon": "🩸✂️",
      "title": "滴入1微升毒液到血液试管",
      "sub": "观察金属蛋白酶与凝血酶样酶",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🩸💥",
      "msg": "惊人变化！毒液里的『凝血酶样酶』把血液里的纤维蛋白原瞬间乱剪一通全部耗光，接着『出血金属蛋白酶』剪破毛细血管壁，让血液再也凝固不起来！",
      "bi": {
        "en": "Its venom enzymes stop blood from clotting!",
        "zh": "它的毒液酶会让血液无法正常凝固！",
        "kw": [
          "venom",
          "blood",
          "clotting"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🏥💉",
      "title": "纯化微克级『蛇毒血凝酶』",
      "sub": "看看它如何化身手术止血神药",
      "tone": "green",
      "sfx": "chime",
      "badge": "💊🏥",
      "msg": "化毒为药成功！科学家从尖吻蝮毒液中单独提纯出极微量、高纯度的血凝酶成分，在外科手术中帮病人快速止血，或制成降纤酶救治脑血栓患者！",
      "bi": {
        "en": "Doctors use purified snake enzymes to save lives!",
        "zh": "医生用纯化的蛇毒酶来挽救生命！",
        "kw": [
          "Doctors",
          "snake",
          "save"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在野外万一遇到五步蛇（尖吻蝮）被咬伤，绝对不能做下面哪件事？",
      "a": "像古装剧里那样用嘴去吸伤口毒血",
      "b": "保持安静少走动，记住蛇的样子立刻打120去医院打抗蛇毒血清",
      "ans": "a",
      "explain": "完全正确！用嘴吸毒不仅吸不出已经进入淋巴和血液的毒液，一旦口腔有牙龈出血或小溃疡，施救的人也会立刻中毒！"
    }
  },
  "ch1-06": {
    "exp1": {
      "icon": "🖐️🔒",
      "title": "放出『三指蛋白』抢占座位",
      "sub": "模拟α-神经毒素封锁肌肉开关",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "👑🖐️",
      "msg": "座位被抢光啦！眼镜王蛇的毒蛋白由二硫键折成『三根手指』，严丝合缝插进肌肉细胞的乙酰胆碱受体上，大脑发出的运动指令进不去，猎物瞬间瘫软！",
      "bi": {
        "en": "Three-finger toxins block the muscle switches!",
        "zh": "三指毒素堵住了肌肉的信号开关！",
        "kw": [
          "Three-finger",
          "block",
          "muscle"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦸‍♂️💉",
      "title": "注入『抗蛇毒血清抗体』救援",
      "sub": "看看唯一特效解药怎么工作",
      "tone": "green",
      "sfx": "chime",
      "badge": "🛡️💉",
      "msg": "救援成功！抗蛇毒血清里的特异抗体像精准抓捕手铐一样，把三指毒素从受体座位上拽下来捆住，神经信使乙酰胆碱重新坐回座位，呼吸恢复正常啦！",
      "bi": {
        "en": "Antivenom antibodies grab and clear the toxins!",
        "zh": "抗蛇毒血清抗体会抓住并清除毒素！",
        "kw": [
          "Antivenom",
          "grab",
          "toxins"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：眼镜王蛇的名字里有个『王』字，它平时最爱吃的主食是什么？",
      "a": "专门捕食其他种类的蛇（包括毒蛇）",
      "b": "只吃树上的苹果和香蕉",
      "ans": "a",
      "explain": "答对啦！眼镜王蛇学名 Ophiophagus hannah 意思就是『吃蛇者』，它体内自带抗蛇毒蛋白，连其他毒蛇咬它都不怕！"
    }
  },
  "ch1-07": {
    "exp1": {
      "icon": "⚡🛑",
      "title": "测试突触前『太攀蛇毒素』",
      "sub": "看看它怎么让神经末梢断粮",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "⚡🧬",
      "msg": "信号源头被掐断！内陆太攀蛇的毒蛋白不仅堵下游座位，还会直接破坏上游神经末梢释放乙酰胆碱囊泡的机器，是陆生毒蛇里LD50数值最小的冠军！",
      "bi": {
        "en": "Inland taipan has the strongest venom on land!",
        "zh": "内陆太攀蛇拥有陆地上最强的毒液！",
        "kw": [
          "taipan",
          "strongest",
          "land"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🏜️🤫",
      "title": "模拟人类脚步声靠近它",
      "sub": "看看澳洲毒王的真实性格",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐍💨",
      "msg": "嗖的一声溜进石缝躲起来啦！内陆太攀蛇虽然毒液威力惊人（只为了一口制服荒漠鼠类防止猎物反咬），但性格极其害羞隐秘，从不主动招惹人类！",
      "bi": {
        "en": "This shy snake always hides from people!",
        "zh": "这种害羞的蛇总是远远躲开人类！",
        "kw": [
          "shy",
          "snake",
          "hides"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：内陆太攀蛇演化出这么猛烈的毒液，真正的用途是什么？",
      "a": "在干旱荒漠里瞬间制服锋利门牙的老鼠，避免自己受伤",
      "b": "为了追着沙漠里的骆驼和人类跑",
      "ans": "a",
      "explain": "太对啦！荒漠里猎物稀少，而且老鼠被咬痛了会拼命反咬毒蛇，一秒起效的毒液是它生存捕猎的精密工具！"
    }
  },
  "ch1-08": {
    "exp1": {
      "icon": "🔔🎵",
      "title": "高频摇动尾巴角质环",
      "sub": "每秒振动50次会发生什么",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🏜️🔔",
      "msg": "沙沙沙——响亮警戒声响起！角响尾蛇尾巴尖有一串中空互扣的角质环，里面并没有小石子，而是靠环与环每秒碰撞50次空气共振，提醒大型动物『别踩到我』！",
      "bi": {
        "en": "It shakes its hollow tail rings as a warning!",
        "zh": "它摇动中空的尾环发出警告声！",
        "kw": [
          "shakes",
          "tail",
          "warning"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "✂️🫧",
      "title": "观察磷脂酶A2剪细胞膜",
      "sub": "看看响尾蛇毒如何破坏红细胞",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🩸✂️",
      "msg": "咔嚓咔嚓！毒液里的『磷脂酶A2』专门剪断红细胞和肌肉细胞膜双分子层里的一条脂肪酸尾巴，细胞膜像破了洞的肥皂泡一样漏水溶解！",
      "bi": {
        "en": "Venom enzymes cut the outer wall of red cells!",
        "zh": "毒液酶剪破了红细胞的外膜！",
        "kw": [
          "enzymes",
          "cut",
          "cells"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：角响尾蛇在滚烫的沙漠沙地上是怎么移动的？",
      "a": "像弹簧一样横着『侧行』，每次只有两个点接触热沙子",
      "b": "四脚朝天在沙子上一路翻跟头",
      "ans": "a",
      "explain": "完全正确！沙漠正午沙面温度高达60°C，角响尾蛇独创『侧行步』，既不打滑又不会被滚烫的沙子烫伤肚皮！"
    }
  },
  "ch1-09": {
    "exp1": {
      "icon": "🪰🐜",
      "title": "人工果蝇 vs 雨林毒蚂蚁",
      "sub": "揭秘箭毒蛙的『借毒穿衣』术",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐸✨",
      "msg": "真相大白！动物园里从小吃无毒果蝇长大的箭毒蛙宝宝，皮肤0%毒性！只有吃雨林里的毒蚂蚁、毒甲虫和马陆，它才能把生物碱搬运到皮肤腺体里！",
      "bi": {
        "en": "Poison dart frogs borrow toxins from toxic bugs!",
        "zh": "箭毒蛙从有毒昆虫身上借来毒素！",
        "kw": [
          "frogs",
          "borrow",
          "bugs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔩🛡️",
      "title": "检查箭毒蛙自己的神经锁孔",
      "sub": "为什么它自己不会被自己毒倒？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🧬🛡️",
      "msg": "大自然神作！箭毒蛙自己钠离子通道的第1584号零件换了一个氨基酸（天冬酰胺变苏氨酸），树蛙毒素这把木楔子就插不进它自己的锁孔啦！",
      "bi": {
        "en": "One tiny change protects the frog from its own poison!",
        "zh": "一个微小的氨基酸改变保护青蛙不被自己毒倒！",
        "kw": [
          "change",
          "protects",
          "frog"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：普通青蛙穿绿衣服躲在草丛里，剧毒的黄金箭毒蛙为什么穿耀眼的亮黄色衣服？",
      "a": "这是『警戒色』，大方告诉捕食者：我有剧毒，别来惹我！",
      "b": "为了在夜晚当作小夜灯照路",
      "ans": "a",
      "explain": "答对啦！这在生物学上叫『警戒色 (Aposematism)』，让捕食者一眼认出自己，双方都免受伤害！"
    }
  },
  "ch1-10": {
    "exp1": {
      "icon": "🕳️⚡",
      "title": "投放α-黑寡妇毒素到神经末梢",
      "sub": "看它在细胞膜上打钙离子孔洞",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🕷️⚡",
      "msg": "信号大洪水！红背蜘蛛的毒素会直接插进神经末梢膜拼成一个钙离子通道洞，钙离子涌入逼着神经元把所有乙酰胆碱信号包一次性全倒光，导致肌肉剧痛抽搐！",
      "bi": {
        "en": "Spider venom forces nerves to dump all signals!",
        "zh": "蜘蛛毒液逼迫神经一次性倒空所有信号！",
        "kw": [
          "Spider",
          "nerves",
          "signals"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🕸️🔍",
      "title": "对比雌蛛与雄蛛体型",
      "sub": "谁才是真正带毒针的猎手？",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🕷️🔍",
      "msg": "体型差好几倍！只有肚子圆滚滚、背上带鲜红沙漏条纹的雌性红背蜘蛛螯肢才够长，能咬穿人类皮肤；小小的雄蛛连人皮都咬不穿呢！",
      "bi": {
        "en": "The red stripe on her back says stay away!",
        "zh": "它背上的红色条纹在提醒你离远点！",
        "kw": [
          "red",
          "stripe",
          "away"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在车库或旧花盆角落看到结着乱糟糟强韧蛛网、背上有红斑的黑蜘蛛，该怎么做？",
      "a": "绝不伸手去掏暗角，搬旧花盆前先戴厚手套检查",
      "b": "伸手指去戳一戳它背上的红色条纹",
      "ans": "a",
      "explain": "非常正确！红背蜘蛛喜欢躲在干燥阴暗的箱子、花盆边沿下，不把手伸进盲区就绝不会被它咬到！"
    }
  },
  "ch1-11": {
    "exp1": {
      "icon": "✂️🧱",
      "title": "测试『鞘磷脂酶D』剪脂质",
      "sub": "看它如何破坏细胞膜外墙",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🕷️✂️",
      "msg": "外墙脱落！红平甲蛛（及隐居褐蛛）的鞘磷脂酶D会专门剪掉细胞膜上鞘磷脂的极性头，引来体内白细胞过度围攻，造成局部皮肤红肿坏死！",
      "bi": {
        "en": "This enzyme snips the lipid coat of skin cells!",
        "zh": "这种酶会剪坏皮肤细胞的脂质外衣！",
        "kw": [
          "enzyme",
          "lipid",
          "cells"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "👟🧤",
      "title": "露营穿鞋前『倒一倒拍一拍』",
      "sub": "户外防隐居蛛类小妙招",
      "tone": "green",
      "sfx": "chime",
      "badge": "👟✅",
      "msg": "一只害羞的小蜘蛛从鞋筒里掉出来溜走啦！这类蜘蛛白天爱躲在鞋子、手套或木柴堆缝隙里，穿鞋戴手套前抖一抖，就能100%避免挤压被咬！",
      "bi": {
        "en": "Always shake your outdoor shoes before putting them on!",
        "zh": "户外穿鞋前记得先把鞋子倒过来抖一抖！",
        "kw": [
          "shake",
          "shoes",
          "before"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：隐居蛛类为什么会咬人？",
      "a": "往往是因为它躲在衣物或鞋子里，不小心被人类压到了才自卫反咬",
      "b": "因为它会跳起来主动追着人类跑",
      "ans": "a",
      "explain": "答对啦！绝大多数蜘蛛都非常胆小，只要不压迫到它，它根本不愿意浪费宝贵的毒液！"
    }
  },
  "ch1-12": {
    "exp1": {
      "icon": "🦵💨",
      "title": "触发后腿『踢毛防御雨』",
      "sub": "放大1000倍看肚子上的刚毛",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🕸️🔬",
      "msg": "呼啦啦一片毒毛云！美洲塔兰托毒蛛被惹急时不会先用牙咬，而是用后腿飞快刷肚皮，踢出成千上万根长满微观倒刺的刚毛，扎进天敌鼻子和眼睛里奇痒无比！",
      "bi": {
        "en": "It kicks tiny barbed hairs to scare predators away!",
        "zh": "它踢出带倒刺的细毛把捕食者吓跑！",
        "kw": [
          "kicks",
          "barbed",
          "hairs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐝⚖️",
      "title": "对比它的毒液与蜜蜂毒",
      "sub": "大块头捕鸟蛛毒液有多强？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🕸️🐝",
      "msg": "反差萌揭秘！别看塔兰托毒蛛长得比手掌还大、毛茸茸像怪物，其实多数品种对人类的毒液只相当于一只普通蜜蜂蜇伤，真正难受的是它的倒刺刚毛！",
      "bi": {
        "en": "This giant spider is less venomous than it looks!",
        "zh": "这只大蜘蛛的毒液没有外表看起来那么可怕！",
        "kw": [
          "giant",
          "spider",
          "looks"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么有的塔兰托毒蛛屁股后面偶尔会秃一块？",
      "a": "因为遇到危险时它把肚子上的防御刚毛踢出去当暗器用掉了（下次蜕皮会长出新的）",
      "b": "因为它自己拿小剃须刀把毛刮掉了",
      "ans": "a",
      "explain": "太有趣啦！踢掉刚毛后肚子会暂时露出一块小秃斑，等下一次蜕皮换新衣服时，满肚子的防御刚毛又会重新长满！"
    }
  },
  "ch1-13": {
    "exp1": {
      "icon": "🦟⚡",
      "title": "测试JSTX毒素对飞虫 vs 对人类",
      "sub": "精准识别昆虫谷氨酸受体",
      "tone": "green",
      "sfx": "chime",
      "badge": "🕸️🎯",
      "msg": "超精准靶向！棒络新妇的JSTX多胺毒素专门锁死『昆虫肌肉特有的谷氨酸受体』，大蚂蚱一秒麻痹，而对哺乳动物几乎没影响！",
      "bi": {
        "en": "Its venom targets insects without hurting people!",
        "zh": "它的毒液精准针对昆虫而不伤人！",
        "kw": [
          "venom",
          "insects",
          "people"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧠🔬",
      "title": "送进脑科学实验室当探针",
      "sub": "科学家为什么超喜欢这种蜘蛛",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🧠✨",
      "msg": "脑科学神器！因为人脑学习记忆也用到谷氨酸受体，科学家利用棒络新妇毒素做分子探针，帮人类解开了大脑神经元传递记忆信号的奥秘！",
      "bi": {
        "en": "Scientists use spider molecules to study the brain!",
        "zh": "科学家用蜘蛛分子来研究大脑！",
        "kw": [
          "Scientists",
          "spider",
          "brain"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：秋天公园树林间织着金色大圆网、背上有黄黑条纹的棒络新妇，对我们有什么帮助？",
      "a": "它是捕食蚊蝇害虫的花园益虫，只要不伸手抓它就非常安全",
      "b": "它会跳下网来追着小学生跑",
      "ans": "a",
      "explain": "答对啦！棒络新妇是温和的织网捕虫能手，它织的蛛丝韧性极高，静静欣赏它的金色建筑艺术就好！"
    }
  },
  "ch2-01": {
    "exp1": {
      "icon": "🚨🐝",
      "title": "挥手拍打 vs 低头安静走开",
      "sub": "测试胡蜂的报警信息素",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐝🚨",
      "msg": "千万别拍！一旦拍打或捏死胡蜂，它毒囊里会释放气味分子『乙酸戊酯（闻起来有点像香蕉水）』，几百米内的同伴闻到警报会立刻全军出击！低头护住头颈慢步离开才安全！",
      "bi": {
        "en": "Never swat a wasp, just walk away calmly!",
        "zh": "千万别拍打胡蜂，冷静走开就好！",
        "kw": [
          "Never",
          "wasp",
          "calmly"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔬🪡",
      "title": "放大对比：胡蜂毒针 vs 蜜蜂毒针",
      "sub": "为什么胡蜂能连续扎好几下？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🪡🔍",
      "msg": "显微镜下看清啦！蜜蜂毒针长满大倒钩，扎完一次就拔不出来；而胡蜂的毒针光滑笔直像注射器针头，拔出来还能继续连续蛰刺！",
      "bi": {
        "en": "A wasp has a smooth stinger and can sting again!",
        "zh": "胡蜂的毒针很光滑，可以反复蛰刺！",
        "kw": [
          "wasp",
          "smooth",
          "stinger"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么有的人第二次被胡蜂蛰，反应反而比第一次更危险？",
      "a": "因为免疫系统记住了蜂毒蛋白，第二次接触可能触发全身剧烈的过敏性休克",
      "b": "因为第二次遇到的一定是蜂王",
      "ans": "a",
      "explain": "完全正确！这叫IgE介导的超敏反应，被胡蜂蛰伤后如果出现全身起红疹、呼吸困难，必须争分夺秒去医院急救！"
    }
  },
  "ch2-02": {
    "exp1": {
      "icon": "💳🪡",
      "title": "手指捏毒刺 vs 硬卡片平行刮除",
      "sub": "被蜜蜂蛰伤的第一步正确操作",
      "tone": "green",
      "sfx": "chime",
      "badge": "💳✅",
      "msg": "卡片刮除满分！蜜蜂留下的毒针顶端连着还在自动收缩泵毒的『毒囊』，如果用手指去捏，等于亲手把剩下的毒液全挤进皮肤里！用银行卡或尺子贴着皮肤轻轻一刮就掉啦！",
      "bi": {
        "en": "Scrape the bee stinger off with a flat card!",
        "zh": "用平直的卡片把蜜蜂毒刺刮下来！",
        "kw": [
          "Scrape",
          "stinger",
          "card"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎯🦠",
      "title": "装进纳米导弹的『蜂毒肽』",
      "sub": "看看细胞膜打孔王怎么立功",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🍯🧬",
      "msg": "蜂毒肽一头亲水一头亲油，最擅长在细胞膜上打孔。科学家给它装上只认肿瘤细胞的『纳米导航头』，让它专门去扎破坏细胞的膜而不伤好细胞！",
      "bi": {
        "en": "Scientists guide bee peptide to attack bad cells!",
        "zh": "科学家引导蜂毒肽去攻击坏细胞！",
        "kw": [
          "guide",
          "bee",
          "cells"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么蜜蜂不到万不得已绝不轻易蛰人？",
      "a": "因为工蜂毒针带倒钩，蛰进有弹性的哺乳动物皮肤后拔不出来，蜜蜂自己也会牺牲",
      "b": "因为蜜蜂蛰一次要花掉它存的十罐蜂蜜",
      "ans": "a",
      "explain": "答对啦！蜜蜂只有在保卫蜂巢或被压到时才会拼命一搏，平时在花丛采蜜的小蜜蜂根本不想理人类呢！"
    }
  },
  "ch2-03": {
    "exp1": {
      "icon": "🏠🪹",
      "title": "观察马蜂怎么造『莲蓬纸巢』",
      "sub": "昆虫界的造纸建筑师",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🐝🏠",
      "msg": "太巧手啦！马蜂会用大颚刮下枯木纤维，混入唾液嚼成防水纸浆，在屋檐或树枝下建起一座倒挂莲蓬一样的六角形纸蜂巢！",
      "bi": {
        "en": "Paper wasps chew wood fibers to build their nest!",
        "zh": "马蜂嚼碎木纤维来建造纸质蜂巢！",
        "kw": [
          "wasps",
          "wood",
          "nest"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "⚡🧪",
      "title": "分析『疼痛鸡尾酒』配方",
      "sub": "为什么马蜂蛰一下那么疼",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "⚡🧪",
      "msg": "三种分子联手出击！毒液里的『血清素 + 组胺 + 马蜂激肽』组合，专门第一时间打开皮肤痛觉神经并让毛细血管扩张红肿，目的是把偷蜂蛹的鸟和熊痛跑！",
      "bi": {
        "en": "Its venom cocktail sends an instant pain signal!",
        "zh": "它的毒液鸡尾酒会发出瞬间疼痛信号！",
        "kw": [
          "venom",
          "instant",
          "pain"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果发现家里阳台屋檐下筑了一个大马蜂窝，应该怎么办？",
      "a": "关好纱窗别拿竹竿去捅，请穿专业防蜂服的消防员叔叔来处理",
      "b": "拿水枪去滋蜂窝玩",
      "ans": "a",
      "explain": "太正确啦！自己拿竹竿捅蜂窝非常危险，穿全封闭防蜂服的专业人员才能安全摘除！"
    }
  },
  "ch2-04": {
    "exp1": {
      "icon": "🍂🔍",
      "title": "枯叶丛里找一找伪装大师",
      "sub": "点亮远东褐枯叶蛾的隐身衣",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🦋🍂",
      "msg": "一模一样！成虫翅膀连叶脉和枯斑都模仿得惟妙惟肖；而它的幼虫胸背藏着两簇蓝黑色毒针毛，遇到鸟儿偷袭就突然挺胸亮出毒毛刺！",
      "bi": {
        "en": "This moth looks just like a dry autumn leaf!",
        "zh": "这只飞蛾长得跟一片干枯的秋叶一模一样！",
        "kw": [
          "moth",
          "dry",
          "leaf"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧶🛡️",
      "title": "放大看它结的『防盗毒毛茧』",
      "sub": "化蛹睡觉时怎么保护自己？",
      "tone": "purple",
      "sfx": "sizzle",
      "badge": "🧶🛡️",
      "msg": "绝妙防御！毛毛虫吐丝结茧准备变飞蛾时，会故意把自己背上的毒针毛一根根拔下来，竖着织进茧壳外墙里，变成一座带刺的铁丝网堡垒！",
      "bi": {
        "en": "The caterpillar weaves poison hairs into its cocoon!",
        "zh": "毛毛虫把毒毛织进自己的茧壳里！",
        "kw": [
          "caterpillar",
          "hairs",
          "cocoon"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在树林里看到树干上黏着毛茸茸的虫茧，能不能用手去摸？",
      "a": "不能摸！很多枯叶蛾和毒蛾的茧壳表面同样插满了毒针毛",
      "b": "可以随便摸，因为虫子已经在里面睡着了",
      "ans": "a",
      "explain": "答对啦！就算幼虫已经化蛹，织在茧壳上的空心毒毛依然有刺激性，只用眼睛观察最安全！"
    }
  },
  "ch2-05": {
    "exp1": {
      "icon": "🔦🧠",
      "title": "开启『蝎毒肿瘤荧光画笔』",
      "sub": "看氯毒素如何帮脑外科医生导航",
      "tone": "green",
      "sfx": "chime",
      "badge": "🦂🔦",
      "msg": "肿瘤细胞自己亮起来啦！科学家给以色列金蝎的『氯毒素(Chlorotoxin)』挂上近红外荧光灯，它能精准贴在脑胶质瘤细胞表面而不粘正常脑细胞，帮医生看清每一处边界！",
      "bi": {
        "en": "Scorpion peptide lights up tumor cells for doctors!",
        "zh": "蝎毒多肽为医生点亮肿瘤细胞！",
        "kw": [
          "Scorpion",
          "lights",
          "doctors"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🟣✨",
      "title": "关灯打开紫外线手电筒照蝎子",
      "sub": "沙漠黑夜里的荧光奇观",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🦂🟣",
      "msg": "哇！整只金黄色的蝎子在紫外灯下变成了梦幻的青绿色荧光装甲！因为蝎子外骨骼角质层里含有β-咔啉等天然荧光分子！",
      "bi": {
        "en": "Scorpions glow bright green under ultraviolet light!",
        "zh": "蝎子在紫外光下会发出明亮的绿光！",
        "kw": [
          "Scorpions",
          "glow",
          "light"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：以色列金蝎的『氯毒素』为什么结构特别结实不容易散架？",
      "a": "虽然只有36个氨基酸，但内部有4对『二硫键』像铆钉一样把它紧紧锁住",
      "b": "因为它是用沙漠里的石头做的",
      "ans": "a",
      "explain": "太棒啦！4对二硫键让这个迷你多肽无比紧凑结实，才能穿过重重阻碍精准找到目标细胞！"
    }
  },
  "ch2-06": {
    "exp1": {
      "icon": "🩹✨",
      "title": "用手抓挠 vs 用透明胶带轻轻粘",
      "sub": "皮肤沾上0.1毫米毒蛾毛怎么办",
      "tone": "green",
      "sfx": "chime",
      "badge": "🩹✅",
      "msg": "透明胶带立大功！毒蛾的微米级空心毒毛比灰尘还细，用手一搓反而像按图钉一样把几百根毒毛全按进皮肤里！用胶带轻轻粘掉再洗肥皂水才是科学满分操作！",
      "bi": {
        "en": "Use sticky tape to lift off tiny poison hairs!",
        "zh": "用透明胶带把微小的毒毛粘走！",
        "kw": [
          "sticky",
          "tape",
          "hairs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🌬️👕",
      "title": "树下晾衣服防毒毛测试",
      "sub": "为什么没碰到虫子也会痒？",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "🌬️🐛",
      "msg": "破案啦！毒蛾蜕皮或结茧时，数百万根微小的毒针毛会随风飘散，如果把床单衣服晾在闹虫害的树下，毒毛粘在衣服上就会引起皮炎！",
      "bi": {
        "en": "Tiny moth hairs can float in the wind!",
        "zh": "微小的毒蛾毛会随风飘散！",
        "kw": [
          "Tiny",
          "hairs",
          "wind"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：夏天去公园树林玩耍，怎样预防毒蛾毛引起的皮肤红疹？",
      "a": "穿长袖薄衣裤，不在毛毛虫多的树下拍打树枝或摇晃乘凉",
      "b": "看到毛茸茸的虫子就凑上去吹气",
      "ans": "a",
      "explain": "完全正确！物理遮挡加上不摇晃树枝，就能轻松避开随风飘落的微米级毒毛！"
    }
  },
  "ch2-07": {
    "exp1": {
      "icon": "🔬💉",
      "title": "放大看『洋辣子』的玻璃毒刺",
      "sub": "揭秘刺蛾火辣电击痛的原理",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🐛⚡",
      "msg": "显微镜下太精巧了！刺蛾背上每一根尖刺底部都连着一个毒液小泡，刺尖脆得像薄玻璃安瓿瓶——皮肤一碰刺尖立刻折断并把酸辣毒液注入皮肤！",
      "bi": {
        "en": "Each spine acts like a tiny glass syringe!",
        "zh": "每一根尖刺都像一支微型玻璃注射器！",
        "kw": [
          "spine",
          "tiny",
          "syringe"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍃🟢",
      "title": "树叶背面搜寻荧光绿身影",
      "sub": "刺蛾最爱藏在哪里乘凉？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🍃🔍",
      "msg": "找到啦！刺蛾幼虫喜欢趴在果树、行道树的『叶片背面』啃叶肉，一身黄绿荧光色既能融入树叶光影，又是警告鸟类的鲜明记号！",
      "bi": {
        "en": "Look carefully under tree leaves in summer!",
        "zh": "夏天要留心树叶背面的小家伙！",
        "kw": [
          "Look",
          "leaves",
          "summer"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：刺蛾化蛹变成的小罐子『雀瓮』长什么样？",
      "a": "黏在树枝上、圆鼓鼓带斑纹，像一颗袖珍小鸟蛋或小陶罐",
      "b": "长着四条腿会在地上跑",
      "ans": "a",
      "explain": "答对啦！刺蛾的茧叫『雀瓮』，硬邦邦像树枝上的小鸟蛋，等到来年夏天还会像推开小盖子一样羽化飞出来呢！"
    }
  },
  "ch2-08": {
    "exp1": {
      "icon": "🦵🦷",
      "title": "检查蜈蚣的『毒牙』到底是啥",
      "sub": "是嘴里的牙还是第一对脚？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🐛🔍",
      "msg": "演化大揭秘！蜈蚣蛰人的那对大钳子其实不是牙齿，而是由它身体的『第一对步足（脚）』演化变形而成的空心毒颚（颚足）！",
      "bi": {
        "en": "Its front legs evolved into strong venom claws!",
        "zh": "它的第一对脚演化成了强力的毒爪！",
        "kw": [
          "legs",
          "evolved",
          "claws"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔑⚡",
      "title": "测试 Ssm Spooky 钾通道毒素",
      "sub": "小蜈蚣怎么制服大它15倍的猎物",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "⚡🔒",
      "msg": "精准封锁！蜈蚣毒液里的多肽能瞬间堵住猎物血管与心肌上的KCNQ钾离子通道，让猎物血压飙升、肌肉痉挛，短短几秒就失去反抗力！",
      "bi": {
        "en": "Centipede peptide locks potassium channels fast!",
        "zh": "蜈蚣多肽能迅速锁住钾离子通道！",
        "kw": [
          "Centipede",
          "locks",
          "channels"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：所有的蜈蚣都有正好100条腿（百足）吗？",
      "a": "不是！不同种类的蜈蚣腿数从30条到300多条都有，而且永远是『奇数对』！",
      "b": "是的，每一只蜈蚣出厂都严格长着100条腿",
      "ans": "a",
      "explain": "太博学啦！自然界里几乎找不到刚好50对（100条）腿的蜈蚣，它们的步足对数全都是15对、21对、23对这样的奇数！"
    }
  },
  "ch2-09": {
    "exp1": {
      "icon": "🪳🏃",
      "title": "放进一只讨厌的蟑螂试试",
      "sub": "看看大蚰蜒的真实本领",
      "tone": "green",
      "sfx": "chime",
      "badge": "🦗🏆",
      "msg": "闪电出击！大蚰蜒15对长腿像装了涡轮增压一样冲出去，每秒跑40厘米，一口制服蟑螂、白蚁和臭虫！它其实是帮家里除害虫的『暗夜除虫大侠』！",
      "bi": {
        "en": "House centipedes are helpful bug hunters!",
        "zh": "大蚰蜒是帮我们抓害虫的好帮手！",
        "kw": [
          "centipedes",
          "helpful",
          "hunters"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🛡️🖐️",
      "title": "测试它的细小毒颚能咬穿人皮吗",
      "sub": "为什么不用害怕家里的大蚰蜒",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🦗💚",
      "msg": "放心啦！大蚰蜒的颚足非常细弱，只够刺穿蟑螂和飞蛾薄薄的关节膜，一般根本咬不穿人类的皮肤，就算受惊勉强夹一下也比蚊子包还轻！",
      "bi": {
        "en": "It is shy and harmless to humans!",
        "zh": "它很胆小，对人类几乎没有危害！",
        "kw": [
          "shy",
          "harmless",
          "humans"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果家里卫生间经常看到大蚰蜒出没，真正说明了什么问题？",
      "a": "说明家里潮湿而且藏着不少它爱吃的蟑螂或小虫子，打扫干燥后它自然就搬走啦",
      "b": "说明大蚰蜒想来偷吃牙膏",
      "ans": "a",
      "explain": "完全正确！大蚰蜒只去有猎物（蟑螂、衣鱼、白蚁）的地方捕食，保持房间干燥整洁，这位免费的除虫大侠就会自己去别处巡逻啦！"
    }
  },
  "ch2-10": {
    "exp1": {
      "icon": "💨🪲",
      "title": "用嘴轻轻吹走 vs 一巴掌拍碎",
      "sub": "遇到芫菁或隐翅虫停在胳膊上",
      "tone": "green",
      "sfx": "chime",
      "badge": "💨✅",
      "msg": "吹走操作100分！短翅芫菁不会咬人也没毒刺，但一受惊或被拍碎，腿关节就会飙出含『斑蝥素』的黄色血淋巴，沾在皮肤上立刻起大水泡！",
      "bi": {
        "en": "Gently blow the beetle away, never slap it!",
        "zh": "轻轻把甲虫吹走，千万别拍碎它！",
        "kw": [
          "blow",
          "beetle",
          "slap"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎁🥚",
      "title": "观察芫菁爸爸送出的『化学彩礼』",
      "sub": "斑蝥素在昆虫界有什么用？",
      "tone": "purple",
      "sfx": "chime",
      "badge": "🪲🎁",
      "msg": "太浪漫又太硬核了！只有雄性芫菁能合成斑蝥素，求偶时当成『防身大礼包』送给雌虫；雌虫再把斑蝥素涂在虫卵表面，连凶猛的蚂蚁都不敢碰它的宝宝！",
      "bi": {
        "en": "Father beetle gifts toxin to protect the eggs!",
        "zh": "甲虫爸爸赠送毒素来保护虫卵！",
        "kw": [
          "Father",
          "toxin",
          "eggs"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：短翅芫菁受惊时一动不动，腿关节还冒出黄色小水珠，它是在干什么？",
      "a": "『假死 + 反射性流血』，用极苦且起泡的斑蝥素液滴吓退鸟类和蜥蜴",
      "b": "它热得流汗了",
      "ans": "a",
      "explain": "答对啦！昆虫学家把这一招叫做『反射性流血 (Reflex bleeding)』，是最高效的化学防御术之一！"
    }
  },
  "ch3-01": {
    "exp1": {
      "icon": "✂️♨️",
      "title": "高温蒸汽久炖剪掉『双挂件』",
      "sub": "揭秘乌头碱水解脱毒的有机化学",
      "tone": "green",
      "sfx": "sizzle",
      "badge": "💜✂️",
      "msg": "化学脱毒奇迹！乌头碱分子上挂着『乙酰基』和『苯甲酰基』两个毒力挂件，经过数小时高温蒸汽酯水解把它们剪掉变成乌头原碱，毒性立刻暴降上千倍！",
      "bi": {
        "en": "Long steaming cuts off two toxic groups!",
        "zh": "长时间蒸煮剪掉了两个有毒基团！",
        "kw": [
          "steaming",
          "cuts",
          "groups"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🚪🔓",
      "title": "把乌头碱放进心肌钠离子通道",
      "sub": "看看它怎么干扰心脏电信号",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "⚡🫀",
      "msg": "城门被卡死在常开状态！乌头碱像一把拔不出来的木楔子，让钠离子源源不断冲进神经与心肌细胞，导致嘴唇发麻和心跳节律大乱！",
      "bi": {
        "en": "Aconitine wedges the sodium gate wide open!",
        "zh": "乌头碱把钠离子城门死死撑开！",
        "kw": [
          "Aconitine",
          "gate",
          "open"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：乌头开着漂亮的蓝紫色头盔花，它的块根在古代药学中经过严格炮制脱毒后叫什么？",
      "a": "附子（必须在药厂经严格化学检测合格，绝不能自己在家挖野生乌头炖汤！）",
      "b": "普通紫薯",
      "ans": "a",
      "explain": "完全正确！你还可以点上方去第2站【分子手术台 · 关卡B】亲手拿剪刀剪掉乌头碱的两个有毒基团哦！"
    }
  },
  "ch3-02": {
    "exp1": {
      "icon": "🍒🚫",
      "title": "检测甜丝丝的红黑马桑果",
      "sub": "为什么味道甜的野果也有剧毒？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍒⚠️",
      "msg": "警报！日本马桑的果托虽然有甜味（为了吸引不怕马桑毒的鸟类帮它吐核播种），但种子和果肉里的『马桑内酯』对哺乳动物却是强效神经惊厥毒素！",
      "bi": {
        "en": "Sweet wild berries can still be very toxic!",
        "zh": "甜甜的野果依然可能有剧毒！",
        "kw": [
          "Sweet",
          "berries",
          "toxic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🚗🛑",
      "title": "测试马桑内酯拔掉大脑『刹车片』",
      "sub": "看看GABA抑制受体被堵的后果",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🧠🛑",
      "msg": "大脑没有刹车啦！正常大脑既有『油门』又有『GABA刹车系统』；马桑内酯专门堵死GABA氯离子通道，失去刹车的神经元就会过度放电！",
      "bi": {
        "en": "It blocks the brain's natural brake signals!",
        "zh": "它堵住了大脑天然的刹车信号！",
        "kw": [
          "blocks",
          "brain's",
          "brake"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：郊游爬山看到路边长着像桑葚或樱桃一样黑亮诱人的野果，该怎么做？",
      "a": "拍照观察就好，绝不采摘品尝不认识的野生浆果",
      "b": "看小鸟吃了没事，自己也摘一把吃",
      "ans": "a",
      "explain": "太聪明啦！鸟类的消化道和受体结构与人类不同，鸟能吃的野果（如马桑、南天竹）对人类可能非常危险！"
    }
  },
  "ch3-03": {
    "exp1": {
      "icon": "🌿🔍",
      "title": "切开毒芹根部做结构鉴定",
      "sub": "怎么一眼识破野生『假水芹』？",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🌿🔍",
      "msg": "关键线索出现啦！把毒芹肥大的根茎竖着切开，里面有一格一格像竹子一样的『横隔空腔』，还会流出带怪味的黄色油状毒芹素液滴，跟实心的食用蔬菜完全不同！",
      "bi": {
        "en": "Water hemlock roots have hollow chambers inside!",
        "zh": "毒芹的根茎切开里面有竹节般的空腔！",
        "kw": [
          "hemlock",
          "roots",
          "hollow"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧬⚡",
      "title": "放大看『毒芹素』的三键碳链",
      "sub": "认识聚炔醇类分子的厉害",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧬⚡",
      "msg": "分子长矛！毒芹素(Cicutoxin)分子中间排着3个笔直刚硬的碳碳三键(-C≡C-)，能穿过血脑屏障直接关掉中枢神经元的刹车通道！",
      "bi": {
        "en": "Never pick wild celery near streams or marshes!",
        "zh": "千万别去溪边湿地乱挖野生水芹菜！",
        "kw": [
          "Never",
          "wild",
          "celery"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：春天很多人喜欢去河边挖野水芹菜，为什么毒理学家强烈建议只买菜市场种植的芹菜？",
      "a": "因为剧毒的毒芹最爱跟水芹混长在同一片浅水湿地里，没开花时叶子极其相似！",
      "b": "因为河边的水芹菜会游泳跑掉",
      "ans": "a",
      "explain": "完全正确！每年春季误采毒芹当水芹是植物中毒的头号陷阱，菜市场检验合格的蔬菜又香又安全！"
    }
  },
  "ch3-04": {
    "exp1": {
      "icon": "🏛️📜",
      "title": "穿越回古希腊雅典剧场",
      "sub": "揭开苏格拉底毒酒的分子真身",
      "tone": "purple",
      "sfx": "chime",
      "badge": "🏛️🌱",
      "msg": "历史破案！公元前399年哲学家苏格拉底饮下的毒汁，正是伞形科植物『毒参』提取的毒参碱(Coniine)，它会从脚底往上阻断运动神经与肌肉的连接！",
      "bi": {
        "en": "Coniine blocks signals between nerves and muscles!",
        "zh": "毒参碱阻断了神经与肌肉之间的信号！",
        "kw": [
          "Coniine",
          "blocks",
          "muscles"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧪🏆",
      "title": "1886年化学家拉登堡全合成实验",
      "sub": "人类合成的第一个生物碱",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🧪🏆",
      "msg": "化学史里程碑！毒参碱分子结构小巧（一个六元含氮环加一条三碳小尾巴），1886年德国化学家首次在烧瓶里人工合成了它，证明天然生物碱也能由人类用原子拼出来！",
      "bi": {
        "en": "It was the first alkaloid made in a chemistry lab!",
        "zh": "它是人类在实验室里合成的第一个生物碱！",
        "kw": [
          "first",
          "alkaloid",
          "lab"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：毒参的茎秆上有什么明显的特征，让植物学家一眼就能认出它？",
      "a": "空心绿茎上布满了紫红色的斑点，揉碎叶子还有一股难闻的老鼠尿味",
      "b": "茎秆是纯金子做的会叮当作响",
      "ans": "a",
      "explain": "答对啦！英文里毒参也叫 Poison hemlock，茎上的紫红斑点和刺鼻鼠臭味就是它的危险身份证！"
    }
  },
  "ch3-05": {
    "exp1": {
      "icon": "🔬🪡",
      "title": "滴一滴水触发『显微万箭齐发』",
      "sub": "放大1000倍看天南星的针晶囊",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🌱🪡",
      "msg": "嗖嗖嗖——万箭齐发！天南星细胞里装着成捆的『草酸钙针晶』，一旦被咬破遇到口水，囊内胶质吸水膨胀，像弹簧大炮一样把几千根显微细针射进舌头黏膜！",
      "bi": {
        "en": "Microscopic crystal needles shoot out like arrows!",
        "zh": "显微镜下的晶体小针像箭一样射出来！",
        "kw": [
          "crystal",
          "needles",
          "arrows"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧤🍠",
      "title": "给生芋头山药削皮：空手 vs 戴手套",
      "sub": "天南星科亲戚的日常防痒妙招",
      "tone": "green",
      "sfx": "chime",
      "badge": "🧤✅",
      "msg": "戴手套完全不痒啦！芋头、滴水观音、绿萝都和天南星是一家人，黏液里全都有这种草酸钙小针晶，戴上手套就能完美挡住物理微针攻击！",
      "bi": {
        "en": "Wear gloves when peeling raw taro in the kitchen!",
        "zh": "在厨房削生芋头时记得戴上手套！",
        "kw": [
          "gloves",
          "peeling",
          "taro"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么天南星秋天的果穗长成鲜艳的红玉米棒子模样，却不让老鼠和虫子随便啃它的球茎？",
      "a": "草酸钙针晶专门扎退贪吃的哺乳动物，只留给不怕针晶的特定鸟类帮它传播种子",
      "b": "因为它想把果穗留给自己冬天当零食",
      "ans": "a",
      "explain": "太棒啦！鸟类吞果实不嚼碎种子，而老鼠会咬烂种子，所以植物演化出针晶专门防嚼食动物！"
    }
  },
  "ch3-06": {
    "exp1": {
      "icon": "🫀⚙️",
      "title": "微克级『地高辛』给心脏加油",
      "sub": "看看强心苷怎么帮虚弱心脏泵血",
      "tone": "green",
      "sfx": "chime",
      "badge": "🌺🫀",
      "msg": "咚咚！心跳变得有力啦！毛地黄提炼的『地高辛』轻轻按住心肌细胞一半的钠钾泵，让钙离子留在细胞里帮心肌纤维更有劲地收缩，守护心衰病人两百多年！",
      "bi": {
        "en": "A tiny dose helps a weak heart pump stronger!",
        "zh": "极微小的剂量能帮虚弱的心脏更有力地跳动！",
        "kw": [
          "tiny",
          "heart",
          "stronger"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎨🌻",
      "title": "揭秘画家梵高的『黄色星月夜』",
      "sub": "毛地黄过量为什么会看东西发黄？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🎨🌕",
      "msg": "艺术与医学跨界奇闻！如果毛地黄强心苷稍微多一点点，就会干扰视网膜视锥细胞的钠钾泵，让人眼前看什么都笼罩着一层黄绿色光晕（黄视症）！",
      "bi": {
        "en": "Too much foxglove makes everything look yellow!",
        "zh": "毛地黄过量会让眼前的一切看起来发黄！",
        "kw": [
          "foxglove",
          "everything",
          "yellow"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：药理学家把毛地黄强心药称为『窄治疗窗药物』，这是什么意思？",
      "a": "有效救命剂量和中毒剂量离得非常近，必须由医生用毫克千分之一的微克级精准控制",
      "b": "必须在很窄的窗户旁边才能吃药",
      "ans": "a",
      "explain": "完全正确！差之毫厘谬以千里，所以毛地黄绝不能自己采花泡水，只能用医院精确计量的药片！"
    }
  },
  "ch3-07": {
    "exp1": {
      "icon": "👁️🔦",
      "title": "滴一滴超稀释『阿托品』验光",
      "sub": "眼科医院散瞳检查的化学秘密",
      "tone": "teal",
      "sfx": "chime",
      "badge": "👁️✨",
      "msg": "瞳孔慢慢放大啦！日本欧莨菪含有的『阿托品』能暂时挡住瞳孔括约肌上的M型乙酰胆碱受体，让眼睛睫状肌彻底放松，帮眼科医生测出最真实的近视度数！",
      "bi": {
        "en": "Eye doctors use tiny drops to check your vision!",
        "zh": "眼科医生用微量的滴眼液来检查你的视力！",
        "kw": [
          "doctors",
          "drops",
          "vision"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🥕🚫",
      "title": "对比欧莨菪根 vs 食用牛蒡根",
      "sub": "为什么不能在野外乱挖『野牛蒡』",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🔔⚠️",
      "msg": "高危预警！日本欧莨菪地下的肥大块根长得跟做菜吃的牛蒡几乎一模一样，但里面装满了莨菪碱和东莨菪碱，误食会导致口干、发热和胡言乱语！",
      "bi": {
        "en": "Never confuse wild roots with garden vegetables!",
        "zh": "千万别把野外毒根当成菜园里的蔬菜！",
        "kw": [
          "confuse",
          "roots",
          "vegetables"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：除了眼科检查，从莨菪里发现的『阿托品』还在医院急诊室立下了什么大功？",
      "a": "它是抢救有机磷农药中毒和毒蕈碱型蘑菇中毒的头号特效解毒药！",
      "b": "用来给骨折的病人当石膏绑腿",
      "ans": "a",
      "explain": "太厉害啦！当有机磷或毒蕈碱把副交感神经开关死死按住时，阿托品能立刻冲上去挡住受体救命！"
    }
  },
  "ch3-08": {
    "exp1": {
      "icon": "🚢🩹",
      "title": "贴一片微克级『东莨菪碱晕车贴』",
      "sub": "大风大浪坐船为什么不晕了？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🚢✨",
      "msg": "一点都不晕船啦！洋金花（曼陀罗）里的东莨菪碱做成耳朵后面的微克级缓释贴片，能温和拦截内耳前庭传向呕吐中枢的混乱摇晃信号！",
      "bi": {
        "en": "A tiny patch behind the ear stops seasickness!",
        "zh": "耳后的一小片贴剂能止住晕船！",
        "kw": [
          "tiny",
          "patch",
          "seasickness"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎺🌰",
      "title": "识别带刺的『曼陀罗蒴果』",
      "sub": "千万别当成野生秋葵或板栗",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🎺⚠️",
      "msg": "危险识别！洋金花凋谢后会结出全身长刺的小圆果（或幼苗长得像秋葵），整株花、叶、种子都含有高浓度东莨菪碱，路边看到大喇叭花只看别摘！",
      "bi": {
        "en": "Every part of the trumpet flower is poisonous!",
        "zh": "这种大喇叭花全身上下都有毒！",
        "kw": [
          "Every",
          "trumpet",
          "poisonous"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：中国东汉名医华佗发明的全身麻醉汤剂『麻沸散』，现代药理学家推测其中的核心植物很可能就是谁？",
      "a": "洋金花（曼陀罗花，其中的东莨菪碱具有中枢麻醉镇静作用）",
      "b": "蒲公英绒毛",
      "ans": "a",
      "explain": "答对啦！早在两千年前古人就观察到了洋金花对中枢神经的强力作用，如今已被现代精准麻醉剂取代！"
    }
  },
  "ch3-09": {
    "exp1": {
      "icon": "🌧️🌼",
      "title": "给花坛浇一场大雨看『风雨花』",
      "sub": "葱莲为什么总在大雨后齐刷刷开花",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🌧️🌼",
      "msg": "刷——满地洁白花朵同时绽放！葱莲又叫『风雨兰』，久旱后一遇到暴风雨气压与湿度变化，地下的小鳞茎就会在24小时内集体抽莛开花！",
      "bi": {
        "en": "Rain lilies bloom together right after a storm!",
        "zh": "葱莲总是在暴风雨过后齐刷刷开花！",
        "kw": [
          "lilies",
          "bloom",
          "storm"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🥟🚫",
      "title": "断面气味鉴定：葱莲叶 vs 真小葱",
      "sub": "怎么防止把公园葱莲当野葱采",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🌼⚠️",
      "msg": "一闻就破案！真小葱掐断有一股浓郁的葱蒜辛香味（硫化丙烯），而葱莲叶子掐断完全没有葱香味，反而含有催吐伤胃的『石蒜碱』！",
      "bi": {
        "en": "If it has no onion smell, never put it in food!",
        "zh": "如果没有葱蒜味，千万别放进食物里！",
        "kw": [
          "onion",
          "smell",
          "food"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：小区绿化带里种的葱莲没开花时超像小葱，能不能摘回家炒鸡蛋？",
      "a": "绝对不能！绿化带植物不仅含石蒜碱毒素，还经常喷洒园林杀虫剂",
      "b": "洗洗就能炒着吃",
      "ans": "a",
      "explain": "完全正确！绿化带花草只供观赏，石蒜科植物（葱莲、水仙、彼岸花）全都含有石蒜碱，一口都不能吃！"
    }
  },
  "ch3-10": {
    "exp1": {
      "icon": "🧠💡",
      "title": "提取『加兰他敏』守护记忆",
      "sub": "水仙花鳞茎里的脑科学良药",
      "tone": "green",
      "sfx": "chime",
      "badge": "🌼🧠",
      "msg": "温暖的医学发明！水仙属植物含有的『加兰他敏(Galanthamine)』能温和抑制大脑里的乙酰胆碱酯酶，帮阿尔茨海默病的爷爷奶奶留住宝贵的记忆信号！",
      "bi": {
        "en": "Daffodil molecules help protect grandparents' memory!",
        "zh": "水仙分子帮助守护爷爷奶奶的记忆！",
        "kw": [
          "Daffodil",
          "protect",
          "memory"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧄🚫",
      "title": "水仙球茎 vs 大蒜头大比拼",
      "sub": "春节家里养水仙的头号安全提醒",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧄⚠️",
      "msg": "千万分清！水仙球茎剥开也是一层层白鳞片，长出绿叶又像韭菜，但里面同时藏着『石蒜碱 + 草酸钙针晶』，家里养水仙千万别放在厨房大蒜筐旁边！",
      "bi": {
        "en": "Keep daffodil bulbs far away from kitchen garlic!",
        "zh": "把水仙球茎放在远离厨房大蒜的地方！",
        "kw": [
          "daffodil",
          "bulbs",
          "garlic"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：怎么一秒钟区分没开花的水仙球茎和真大蒜？",
      "a": "真大蒜有一瓣一瓣的蒜瓣且蒜味浓烈；水仙球茎像洋葱一样是一圈圈套起来的且没有蒜味",
      "b": "看谁长胡子多",
      "ans": "a",
      "explain": "观察力太敏锐啦！水仙是层状鳞茎而且没有大蒜味，记住这一招就绝不会认错！"
    }
  },
  "ch3-11": {
    "exp1": {
      "icon": "🍉🧬",
      "title": "滴一滴秋水仙碱培育『无籽西瓜』",
      "sub": "看看细胞微管拆迁工怎么种西瓜",
      "tone": "green",
      "sfx": "chime",
      "badge": "🍉✨",
      "msg": "农业大魔术！普通西瓜是2倍体，科学家用秋水仙碱拆掉西瓜幼苗细胞分裂时的微管牵引绳，让染色体翻倍变成4倍体妈妈，再跟2倍体爸爸杂交，就结出没有种子的3倍体无籽甜西瓜啦！",
      "bi": {
        "en": "Colchicine helps farmers grow seedless watermelons!",
        "zh": "秋水仙碱帮助农民培育无籽大西瓜！",
        "kw": [
          "Colchicine",
          "seedless",
          "watermelons"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦶🧯",
      "title": "阻止白细胞去痛风关节『打群架』",
      "sub": "0.5毫克秋水仙碱的消炎绝活",
      "tone": "teal",
      "sfx": "chime",
      "badge": "💊🦶",
      "msg": "关节消肿不疼啦！痛风发作是因为免疫白细胞顺着微管轨道冲进关节围攻尿酸结晶；微克级秋水仙碱拆掉微管铁轨，白细胞跑不动，炎症风暴就平息啦！",
      "bi": {
        "en": "It stops white blood cells from rushing to joints!",
        "zh": "它阻止白细胞冲向关节引起发炎！",
        "kw": [
          "stops",
          "cells",
          "joints"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：用秋水仙碱培育出来的无籽西瓜，瓜瓤里面还含有秋水仙碱毒素吗？",
      "a": "完全没有！秋水仙碱只在几十年前培育第一代四倍体母本种子时用过极微量，长出的西瓜100%安全甜美",
      "b": "有，吃无籽西瓜等于吃秋水仙",
      "ans": "a",
      "explain": "答对啦！这就好比造船时用过扳手，船造好下水后船上早就没有那把扳手啦，放心大口吃无籽西瓜吧！"
    }
  },
  "ch3-12": {
    "exp1": {
      "icon": "🦕🌴",
      "title": "穿越回侏罗纪看恐龙吃铁树",
      "sub": "为什么苏铁要在种子里造毒？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🦕🌴",
      "msg": "两亿年的防身盾牌！苏铁（铁树）从恐龙时代就活在地球上，为了防止巨大的食草恐龙和哺乳动物把它的种子嚼碎，专门在红艳艳的种子里装满了『苏铁苷』！",
      "bi": {
        "en": "Cycads have lived since the age of dinosaurs!",
        "zh": "苏铁从恐龙时代起就生活在地球上了！",
        "kw": [
          "Cycads",
          "lived",
          "dinosaurs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦠✂️",
      "title": "观察肠道细菌剪开『苏铁苷』",
      "sub": "原本安静的前体分子怎么变凶的",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧬⚠️",
      "msg": "前体毒素揭秘！苏铁苷自己本来挺安静，可一旦吃进肚子，肠道细菌里的『β-葡萄糖苷酶』把它的糖帽子一剪掉，立刻释放出破坏肝脏和神经的甲基偶氮甲醇！",
      "bi": {
        "en": "Never eat the bright red seeds of a sago palm!",
        "zh": "千万别吃铁树结出的鲜红种子！",
        "kw": [
          "Never",
          "red",
          "seeds"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：铁树开花结果时，树心窝里一窝红彤彤像大鸽子蛋一样的果实『凤凰蛋』能不能捡来烤着吃？",
      "a": "绝对不能！铁树种子富含苏铁苷，加热烤熟也去不掉毒性",
      "b": "烤熟了就能当板栗吃",
      "ans": "a",
      "explain": "完全正确！『铁树开花』虽然少见好看，但结出的红种子只可远观拍照，千万不能当坚果吃！"
    }
  },
  "ch3-13": {
    "exp1": {
      "icon": "🧪🎨",
      "title": "往土壤里加酸 vs 加碱变色实验",
      "sub": "看看绣球花怎么变身天然pH试纸",
      "tone": "teal",
      "sfx": "chime",
      "badge": "💠🎨",
      "msg": "花朵变魔术啦！当土壤呈酸性(pH<5.5)时，铝离子(Al³⁺)溶出来钻进绣球花瓣，花朵变成梦幻宝石蓝；当土壤呈碱性锁住铝离子，花朵就变成温柔少女粉！",
      "bi": {
        "en": "Hydrangea flowers change color with soil acid!",
        "zh": "绣球花会随着土壤酸碱度改变颜色！",
        "kw": [
          "Hydrangea",
          "change",
          "color"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍽️🚫",
      "title": "餐厅摆盘检查：撤掉绣球花叶！",
      "sub": "为什么不能拿绣球花叶垫盘子？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍽️⚠️",
      "msg": "食品安全红线！日本曾发生过多起客人把餐盘里装饰的绿色绣球花叶当紫苏叶吃掉，结果被里面的『绣球花苷/常山碱』折腾得上吐下泻！所有观赏花叶都别往菜盘里摆！",
      "bi": {
        "en": "Pretty garden leaves do not belong on dinner plates!",
        "zh": "漂亮的花园叶片可不能摆在餐盘里吃！",
        "kw": [
          "garden",
          "leaves",
          "plates"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：跟常见的紫甘蓝酸碱指示剂（酸红碱蓝）比起来，绣球花的变色规律有什么特别之处？",
      "a": "它刚好反过来，是『酸蓝碱粉』（因为酸性土壤帮它吸收铝离子显蓝色）！",
      "b": "它在任何土里都是黑色的",
      "ans": "a",
      "explain": "太腻害啦！记住绣球花『酸蓝碱粉』的铝离子配位小秘密，你就是花坛里的化学小达人！"
    }
  },
  "ch3-14": {
    "exp1": {
      "icon": "🐝🍯",
      "title": "检测野生『疯蜜』里的木藜芦毒素",
      "sub": "为什么路边野蜂巢的蜜不能乱喝",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🌺🍯",
      "msg": "检出木藜芦毒素(Grayanotoxin)！如果蜜蜂采了羊踯躅（黄杜鹃）或雷公藤的花蜜，酿出的野生蜂蜜就会把人的钠离子通道卡开，引起头晕、心率变慢和低血压！",
      "bi": {
        "en": "Wild honey from toxic flowers can make you dizzy!",
        "zh": "采自毒花的野生蜂蜜会让人头晕中毒！",
        "kw": [
          "Wild",
          "honey",
          "dizzy"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🌸👅",
      "title": "打破谣言：能吸杜鹃花芯的花蜜吗？",
      "sub": "春游赏花安全必修课",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🌺🚫",
      "msg": "千万别吸！杜鹃花家族里有上千个品种，其中黄色、白色的羊踯躅等品种全株和花蜜都含高浓度二萜毒素，园艺杜鹃花只用鼻子闻香、绝不用嘴尝！",
      "bi": {
        "en": "Enjoy the bright azalea flowers with your eyes only!",
        "zh": "只用眼睛欣赏鲜艳的杜鹃花就好！",
        "kw": [
          "Enjoy",
          "azalea",
          "eyes"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么正规超市卖的槐花蜜、百花蜜很安全，而深山里来路不明的野生土蜂蜜反而有风险？",
      "a": "正规蜂蜜经过花源控制与严格出厂毒素检测，而深山野蜂可能采集了毒杜鹃或钩吻花蜜",
      "b": "因为超市的蜜蜂上过小学",
      "ans": "a",
      "explain": "完全正确！正规蜂蜜经过多重食品安全检验，既美味又安心！"
    }
  },
  "ch3-15": {
    "exp1": {
      "icon": "🏺💧",
      "title": "检测插过铃兰花的『花瓶水』",
      "sub": "水溶性强心苷会跑到水里吗？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🤍🏺",
      "msg": "警报响起！铃兰全株含有30多种水溶性强心苷（如铃兰毒苷），连插过铃兰花的花瓶水里都会溶出毒素！家里插铃兰花一定要放在小宝宝和小猫够不着的高处！",
      "bi": {
        "en": "Even the water in a lily of the valley vase is toxic!",
        "zh": "连插过铃兰花的花瓶水也是有毒的！",
        "kw": [
          "water",
          "vase",
          "toxic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🌿🔍",
      "title": "春天叶片鉴定：铃兰 vs 熊葱(野韭菜)",
      "sub": "欧洲春季头号误采植物对比",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🤍🔍",
      "msg": "闻味立判！铃兰宽宽的绿叶跟可食用的熊葱（野蒜）长得像双胞胎，但铃兰叶子揉碎完全没有葱蒜香，而且秋后还会结出有毒的小红果！",
      "bi": {
        "en": "Wash your hands after touching these white bell flowers!",
        "zh": "摸完这些白色小铃铛花后要记得洗手！",
        "kw": [
          "Wash",
          "hands",
          "flowers"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：铃兰花长得像一串洁白的小铃铛，香气迷人，摸过它的花茎后第一件事该干嘛？",
      "a": "用肥皂和流动清水洗干净小手，不揉眼睛也不拿零食吃",
      "b": "直接拿手去抓薯片吃",
      "ans": "a",
      "explain": "太棒啦！养成接触观赏植物后立刻洗手的习惯，任何植物强心苷都伤不到你！"
    }
  },
  "ch3-16": {
    "exp1": {
      "icon": "🌼🔎",
      "title": "火眼金睛：断肠草(钩吻) vs 真金银花",
      "sub": "找出3处最关键的外观差别",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🌼🔍",
      "msg": "三招拆穿伪装！①真金银花一蒂两花、花丝伸出花冠外且初开白色后变黄；②钩吻从头到尾全是纯黄色小喇叭；③真金银花枝条有细绒毛，钩吻藤光滑无毛！",
      "bi": {
        "en": "Never pick wild yellow vines to make herbal tea!",
        "zh": "千万别摘野外的黄花藤蔓来泡凉茶！",
        "kw": [
          "Never",
          "yellow",
          "tea"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "⚡🛑",
      "title": "测试钩吻素干扰脊髓甘氨酸受体",
      "sub": "为什么它被称为『断肠草』",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🌼⚡",
      "msg": "并非真的把肠子咬断，而是钩吻生物碱会强烈抑制脑干与脊髓的运动神经元，引起剧烈腹痛与呼吸肌麻痹！",
      "bi": {
        "en": "Its alkaloids block nerve signals for breathing!",
        "zh": "它的生物碱会阻断控制呼吸的神经信号！",
        "kw": [
          "alkaloids",
          "block",
          "breathing"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：想喝清凉的金银花露或凉茶时，最安全的做法是什么？",
      "a": "从正规药店或超市购买经过专业品种鉴定的金银花，绝不在野外自己采黄花泡水",
      "b": "去山上随便揪一把黄色喇叭花煮水",
      "ans": "a",
      "explain": "100分！野外常绿钩吻藤常与金银花缠绕生长，连根系都可能挨在一起，只用正规渠道药材才绝对安全！"
    }
  },
  "ch3-17": {
    "exp1": {
      "icon": "🚗🌿",
      "title": "给夹竹桃喷汽车尾气二氧化硫",
      "sub": "为什么马路边到处都种夹竹桃？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🌸🌳",
      "msg": "环保超人登场！普通树苗吸了浓浓的汽车尾气和粉尘早就枯萎了，可夹竹桃厚厚的革质叶片不仅能大口吸收二氧化硫，还自带欧夹竹桃苷防害虫，一年四季常绿开花！",
      "bi": {
        "en": "Oleander trees clean dirty air along city roads!",
        "zh": "夹竹桃树能帮城市马路净化脏空气！",
        "kw": [
          "Oleander",
          "clean",
          "air"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔥🚫",
      "title": "测试：能折夹竹桃树枝串肉烧烤吗？",
      "sub": "干树枝和烟雾里还有毒吗",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🔥⚠️",
      "msg": "绝对禁止！欧夹竹桃苷非常耐热，就算树枝晒干了、拿火烧，强心苷不仅不会消失，还会渗进烤肉里并随着黑烟飘出来！",
      "bi": {
        "en": "Never use oleander branches for campfires or forks!",
        "zh": "千万别用夹竹桃树枝生火或串食物！",
        "kw": [
          "Never",
          "oleander",
          "branches"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：拍照时把漂亮的粉色夹竹桃花叼在嘴唇上摆造型，这样做安全吗？",
      "a": "非常危险！花柄折断处会流出含强心苷的白色乳汁，直接接触嘴唇黏膜会引起中毒呕吐",
      "b": "只要不咽下去就没事",
      "ans": "a",
      "explain": "完全正确！和夹竹桃相处的黄金口诀就是：『远看花儿美，感谢它吸灰，拍照手莫折，绝不碰小嘴』！"
    }
  },
  "ch3-18": {
    "exp1": {
      "icon": "🕵️‍♂️✂️",
      "title": "拆解蓖麻毒蛋白『AB双特工』",
      "sub": "B链敲门 + A链快剪刀怎么配合",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🌰✂️",
      "msg": "分工太狡猾了！B链像一把万能钥匙，抓住细胞表面的半乳糖敲开大门；把A链送进细胞后，A链每分钟能咔嚓剪断1500个核糖体零件，让细胞织不出蛋白质！",
      "bi": {
        "en": "Chain B opens the door and Chain A cuts ribosomes!",
        "zh": "B链负责开门，A链负责剪断核糖体！",
        "kw": [
          "opens",
          "door",
          "ribosomes"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🫗♨️",
      "title": "水油分离 + 高温蒸汽精炼蓖麻油",
      "sub": "为什么药用/工业蓖麻油没毒了？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🫗✅",
      "msg": "化学溶解度立功啦！『蓖麻毒蛋白』是水溶性的，一点都不溶于油脂！压榨出油后，毒蛋白全留在水渣饼里，再经过高温蒸汽彻底变性灭活，精炼蓖麻油就变安全啦！",
      "bi": {
        "en": "The toxic protein stays in water, not in the oil!",
        "zh": "有毒蛋白留在水相里，不会溶进油里！",
        "kw": [
          "protein",
          "water",
          "oil"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：蓖麻种子表面有漂亮的大理石花纹，像一颗小花豆，能不能捡来串手链戴或剥开咬？",
      "a": "不能！完整种皮虽然包着毒蛋白，但一旦咬破或钻孔破裂，极微量的蓖麻毒蛋白都非常危险",
      "b": "可以剥开当花生米尝尝",
      "ans": "a",
      "explain": "答对啦！蓖麻籽外壳虽然好看，但绝不能放进嘴里咬破，也不要拿来做手工串珠！"
    }
  },
  "ch3-19": {
    "exp1": {
      "icon": "🍇🫧",
      "title": "把商陆果汁滴进水里摇一摇",
      "sub": "看看『商陆皂苷』为什么像洗洁精",
      "tone": "purple",
      "sfx": "sizzle",
      "badge": "🍇🫧",
      "msg": "咕嘟咕嘟冒出好多持久的肥皂泡！因为『皂苷 (Saponin)』的意思就是肥皂苷，它能像洗洁精一样融化肠胃细胞膜的脂质层，吃下去肚子会剧痛呕吐！",
      "bi": {
        "en": "Pokeweed berries make soapy bubbles in water!",
        "zh": "商陆浆果在水里会摇出肥皂泡！",
        "kw": [
          "berries",
          "soapy",
          "bubbles"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔍🍇",
      "title": "对比紫黑商陆果 vs 真紫葡萄/桑葚",
      "sub": "怎么一眼认出路边的假桑葚",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🍇🔍",
      "msg": "看果序和茎秆！垂序商陆长着粗壮的紫红色草本茎，一长串扁圆的小黑果像烤肉串一样一粒粒分开排列（不是桑葚那样挤成一团），捏破汁水紫红如墨水！",
      "bi": {
        "en": "Purple pokeweed ink is not grape juice!",
        "zh": "紫红色的商陆汁可不是葡萄汁！",
        "kw": [
          "Purple",
          "ink",
          "grape"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果在荒地边看到一串串紫黑色的小果子把手指染成了紫红色，应该怎么做？",
      "a": "马上用清水和肥皂洗干净手，千万别舔手指或把紫果子当野葡萄吃",
      "b": "拿来给舌头涂口红玩",
      "ans": "a",
      "explain": "完全正确！垂序商陆全株（尤其是根和果实）都含商陆皂苷，洗干净手就没事啦！"
    }
  },
  "ch3-20": {
    "exp1": {
      "icon": "💧🌿",
      "title": "检测『滴水观音』叶尖清晨的水珠",
      "sub": "叶子吐出来的水珠是纯净水吗？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍃💧",
      "msg": "别碰那滴水！尖尾芋（滴水观音同属）在湿度大时会从叶尖吐水，水珠和白色茎汁里都携带着海芋素与成束的草酸钙针晶，碰到眼睛或嘴巴会火辣红肿！",
      "bi": {
        "en": "Water drops on giant taro leaves are irritating!",
        "zh": "海芋大叶子上的水珠也是有刺激性的！",
        "kw": [
          "Water",
          "drops",
          "leaves"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍲🚫",
      "title": "野生海芋块茎拿沸水煮2小时",
      "sub": "煮熟了能变成香喷喷的荔浦芋头吗",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🍃⚠️",
      "msg": "煮再久也不能吃！野生尖尾芋（海芋）和菜市场买的食用芋头虽然叶片很像，但海芋块茎里的针晶和毒素就算炖煮也无法变成安全食材，一口咬下去舌头立刻麻肿！",
      "bi": {
        "en": "Never dig up wild elephant ear plants to cook!",
        "zh": "千万别挖野生的海芋回家做菜！",
        "kw": [
          "Never",
          "wild",
          "cook"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在南方公园散步看到叶子比雨伞还大的『滴水观音/尖尾芋』，下雨天能不能摘一片大叶子顶在头上当雨伞？",
      "a": "不能！折断叶柄流出的汁液顺着雨水流到脸和眼睛里，会被草酸钙针晶扎伤红肿",
      "b": "可以，像龙猫一样扛着大叶子跑",
      "ans": "a",
      "explain": "太有生活智慧啦！动画片里顶的荷叶没有毒针晶，但滴水观音/海芋叶柄汁液刺激性极强，千万别折下来顶头上！"
    }
  },
  "ch4-01": {
    "exp1": {
      "icon": "☀️🥔",
      "title": "拿强光晒土豆 vs 避光加1颗苹果",
      "sub": "厨房保存土豆不发芽的科学妙招",
      "tone": "green",
      "sfx": "chime",
      "badge": "🥔🍎",
      "msg": "苹果保鲜法大获全胜！阳光会同时打开土豆的『变绿叶绿素开关』和『龙葵碱造毒开关』；而避光阴凉存放并放一颗成熟苹果，苹果释放的乙烯能哄土豆乖乖睡觉不发芽！",
      "bi": {
        "en": "Store potatoes in a dark place with a ripe apple!",
        "zh": "把土豆和成熟苹果一起放在避光处保鲜！",
        "kw": [
          "Store",
          "potatoes",
          "apple"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍲🔥",
      "title": "把发芽绿土豆丢进100°C沸水煮",
      "sub": "煮熟能去掉龙葵碱吗？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🥔⚠️",
      "msg": "100°C沸水完全拿它没办法！龙葵碱的分解温度高达200°C以上，普通水煮、炖汤根本破坏不了它！所以看到明显变绿、长芽的土豆，直接整颗请进垃圾桶！",
      "bi": {
        "en": "Throw away potatoes that turn green or sprout!",
        "zh": "变绿或发芽的土豆要果断丢掉！",
        "kw": [
          "Throw",
          "green",
          "sprout"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：土豆表皮变绿的那层绿色物质本身是什么？它为什么代表危险？",
      "a": "绿色本身是无毒的叶绿素，但它像报警灯一样说明土豆已经晒太阳启动了『龙葵碱毒素合成』！",
      "b": "因为绿巨人摸过这颗土豆",
      "ans": "a",
      "explain": "完全正确！绿色叶绿素和无色的龙葵碱由同一个光照信号触发，所以看到土豆变绿、尝着发苦发麻就绝不能吃！"
    }
  },
  "ch4-02": {
    "exp1": {
      "icon": "🌡️⚠️",
      "title": "80°C慢炖锅温吞煮生红芸豆",
      "sub": "揭开最反直觉的厨房温度陷阱",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🫘🚨",
      "msg": "惊天陷阱！80°C的温吞水不仅拆不散『植物血球凝集素』四聚体大蛋白，反而让豆子吸水膨胀、把凝集素全激发出来，毒性比生豆子还高出整整5倍！",
      "bi": {
        "en": "Low heat at eighty degrees makes raw beans more toxic!",
        "zh": "80度的低温加热反而会让生豆子毒性更高！",
        "kw": [
          "Low",
          "heat",
          "beans"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍲✅",
      "title": "100°C沸水翻滚彻底焖煮15分钟",
      "sub": "看大分子凝集素如何变身营养",
      "tone": "green",
      "sfx": "sizzle",
      "badge": "🫘✅",
      "msg": "咕嘟咕嘟——彻底解毒成功！在100°C沸腾高温下焖熟到四季豆失去生绿色、咬起来软糯无豆腥味，四聚体毒蛋白完全散架，变成100%安全的优质植物蛋白啦！",
      "bi": {
        "en": "Boil green beans thoroughly until they are soft and safe!",
        "zh": "把四季豆彻底煮熟焖软就非常安全啦！",
        "kw": [
          "Boil",
          "beans",
          "safe"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：炒四季豆时，怎么判断它已经彻底熟透、没有凝集素残留了？",
      "a": "先焯水再焖炒，豆角由翠绿变成暗绿、吃起来软熟没有生豆腥味",
      "b": "只要下油锅翻炒10秒钟保持脆生生的就行",
      "ans": "a",
      "explain": "太棒啦！四季豆绝不能图脆嫩生炒，彻底焖熟就能安心享受美味（还可以去第2站分子手术台关卡C看双锅对比哦）！"
    }
  },
  "ch4-03": {
    "exp1": {
      "icon": "👅🚨",
      "title": "启动舌尖『苦味味蕾报警器』",
      "sub": "吃到发苦的西葫芦该怎么办？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🥒🚨",
      "msg": "滴滴滴——味蕾拉响最高警报！正常西葫芦是清甜的，一旦尝到明显苦味，说明它受高温干旱刺激返祖合成了剧毒『葫芦素』！请立刻吐掉漱口，整盘菜连汤一起倒掉！",
      "bi": {
        "en": "Spit it out at once if zucchini tastes bitter!",
        "zh": "如果西葫芦尝起来发苦，立刻吐掉！",
        "kw": [
          "Spit",
          "zucchini",
          "bitter"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔥🧱",
      "title": "测试高温爆炒能破坏苦葫芦素吗",
      "sub": "四环三萜分子的耐热性",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🥒🔥",
      "msg": "爆炒、煲汤统统拆不掉！葫芦素是非常顽固的四环三萜小分子，耐高温又耐胃酸；切菜下锅前用舌尖极小心地舔一下生瓜片，不苦再炒最保险！",
      "bi": {
        "en": "Cooking cannot destroy the bitter toxin in squash!",
        "zh": "烹饪加热破坏不了西葫芦里的苦味毒素！",
        "kw": [
          "Cooking",
          "destroy",
          "bitter"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么我们人类的舌头上会演化出二十多种专门尝『苦味』的受体？",
      "a": "为了在吃进肚子前第一时间识别出植物生物碱和葫芦素等天然毒素，立刻吐掉保命！",
      "b": "为了专门品尝黑咖啡",
      "ans": "a",
      "explain": "完全正确！苦味觉是演化送给我们的随身化学毒物报警器，除苦瓜外的瓜类（西葫芦、丝瓜、瓠瓜、甜瓜）一旦发苦绝不能吃！"
    }
  },
  "ch4-04": {
    "exp1": {
      "icon": "🥒⚖️",
      "title": "对比：苦瓜的苦 vs 苦瓠瓜的苦",
      "sub": "同样是苦味，分子到底差在哪？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🍐🔬",
      "msg": "化学鉴定书出炉！苦瓜的苦来自『苦瓜苷』，温和无毒；而瓠瓜、丝瓜变苦来自『葫芦素D/E』，会猛烈攻击肠胃黏膜细胞和毛细血管，千万不能当苦瓜去火吃！",
      "bi": {
        "en": "Bitter bottle gourd has a dangerous toxin inside!",
        "zh": "发苦的瓠瓜里面藏着危险的毒素！",
        "kw": [
          "Bitter",
          "gourd",
          "toxin"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐝🌸",
      "title": "追踪瓠瓜变苦的『串粉』案发现场",
      "sub": "好好的甜瓠瓜怎么变苦了？",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🐝🌸",
      "msg": "破案啦！如果菜园旁边种了用来做瓢的观赏苦葫芦，蜜蜂采蜜时把苦葫芦的花粉传给了甜瓠瓜，或者生长期遇到暴晒干旱，结出的瓠瓜就会启动造毒基因！",
      "bi": {
        "en": "Never eat any gourd or loofah that tastes bitter!",
        "zh": "任何尝起来发苦的瓠瓜或丝瓜都千万别吃！",
        "kw": [
          "Never",
          "gourd",
          "bitter"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：爷爷炒了一盘瓠瓜汤，尝了一口说『哎呀今天这瓠瓜怎么跟黄连一样苦，别浪费把肉挑出来吃吧』，你该怎么劝爷爷？",
      "a": "立刻拦住爷爷！苦瓠瓜的葫芦素已经溶进整盘汤和肉里了，必须整盘倒掉并刷洗锅铲！",
      "b": "加两勺白糖盖住苦味继续吃",
      "ans": "a",
      "explain": "你真是家里的食品安全小卫士！葫芦素毒性极强且溶于汤汁，加糖只是骗过舌头，整锅倒掉才最安全！"
    }
  },
  "ch4-05": {
    "exp1": {
      "icon": "🍃👑",
      "title": "品尝古埃及名菜『嫩叶帝王菜』",
      "sub": "长蒴黄麻的嫩叶为什么那么滑嫩",
      "tone": "green",
      "sfx": "chime",
      "badge": "🌿🍲",
      "msg": "滑溜溜超营养！长蒴黄麻的年轻嫩叶不含毒素，反而富含黏多糖、钙和膳食纤维，切碎煮汤像秋葵一样顺滑，是埃及和地中海传承几千年的健康蔬菜！",
      "bi": {
        "en": "Young leaves are safe and healthy to cook!",
        "zh": "年轻的嫩叶做菜既安全又健康！",
        "kw": [
          "Young",
          "leaves",
          "safe"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🫘🚫",
      "title": "检测开花结荚后的『黑色小种子』",
      "sub": "为什么植物要在种子里藏强心苷",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🌿⚠️",
      "msg": "警报！一旦长蒴黄麻长大开花结出豆荚，它就会在黑色种子和老茎里合成强心苷『黄麻苷 (Strophanthidin)』，防止食草动物把它的下一代种子嚼碎！",
      "bi": {
        "en": "Eat the tender leaves, but never eat the seeds!",
        "zh": "只吃鲜嫩的叶子，千万别吃它的种子！",
        "kw": [
          "leaves",
          "never",
          "seeds"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：长蒴黄麻『嫩叶无毒可食、成熟种子含剧毒强心苷』的现象，体现了植物的什么生存智慧？",
      "a": "把化学防御武器精准集中在最宝贵的繁殖种子里，好钢用在刀刃上！",
      "b": "植物忘记给嫩叶发武器了",
      "ans": "a",
      "explain": "太有科学头脑啦！就像苹果肉甜美而苹果核含微量氰苷一样，植物对种子的保护总是最严密的！"
    }
  },
  "ch4-06": {
    "exp1": {
      "icon": "👯‍♂️🕵️",
      "title": "对比『真维生素B6』与白果冒牌货",
      "sub": "看看MPN分子怎么骗过大脑的酶",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍂🕵️",
      "msg": "双胞胎替身破案！银杏果里的毒素 MPN 跟人体必需的维生素B6长得99%相似（只多了一个小小的甲氧基帽），它抢占大脑造刹车信使(GABA)的酶工位却干不了活！",
      "bi": {
        "en": "Ginkgo toxin is a fake twin of vitamin B6!",
        "zh": "银杏毒素是维生素B6的冒牌双胞胎！",
        "kw": [
          "Ginkgo",
          "fake",
          "vitamin"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🥊💊",
      "title": "召唤真身『维生素B6』进场救援",
      "sub": "竞争性抑制的特效解毒法",
      "tone": "green",
      "sfx": "chime",
      "badge": "💊🥊",
      "msg": "真身大胜！当医院给银杏果中毒的患者补充足量的真『维生素B6』时，真维生素B6凭借人数优势把冒牌货MPN从酶工位上挤走，大脑立刻恢复合成镇静信使GABA！",
      "bi": {
        "en": "Real vitamin B6 pushes the fake toxin away!",
        "zh": "真正的维生素B6把冒牌毒素挤走了！",
        "kw": [
          "Real",
          "vitamin",
          "pushes"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在公园银杏树下捡掉落的臭白果（外种皮），为什么不能直接用光手去捏？",
      "a": "白果肉质外种皮含有『银杏酸』，光手揉搓会引起严重的接触性皮炎（红肿水泡奇痒），而且小朋友也不宜吃白果仁",
      "b": "因为白果外皮会粘住手指一辈子掉不下来",
      "ans": "a",
      "explain": "完全正确！捡金黄的银杏树叶做书签很安全，但掉在地上的银杏果外皮含银杏酸、果仁含耐热的MPN，小朋友不捡也不吃最安全！"
    }
  },
  "ch5-01": {
    "exp1": {
      "icon": "👒👗",
      "title": "启动『毁灭天使』三合一特征扫描",
      "sub": "头上戴帽、腰间系裙、脚上穿靴",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍄🚨",
      "msg": "高危特征全中！鳞柄白鹅膏全身雪白干净，同时具备①菌盖（帽）、②菌环（裙子）、③菌托（靴子）三大鹅膏菌标志！野外看到穿裙穿靴的白蘑菇，一秒远离！",
      "bi": {
        "en": "Never touch a white mushroom with a ring and cup!",
        "zh": "千万别碰长着菌环和菌托的白蘑菇！",
        "kw": [
          "Never",
          "white",
          "mushroom"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "♾️🔒",
      "title": "200°C油炸『8字双环八肽』测试",
      "sub": "为什么鹅膏毒肽怎么煮都不坏？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🍄🔒",
      "msg": "完全煮不烂！普通蛋白是一条长毛线，一煮就散；而α-鹅膏毒肽只有8个氨基酸，首尾焊成圆环，中间还加了一道硫醚桥焊成『8字钢铁双环』，锁死肝细胞RNA聚合酶II！",
      "bi": {
        "en": "Its double ring lock survives boiling and frying!",
        "zh": "它的双环铁锁结构不怕水煮也不怕油炸！",
        "kw": [
          "double",
          "ring",
          "survives"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：白鹅膏最阴险的『假愈期』是什么意思？",
      "a": "误食上吐下泻一天后症状好像突然好转了，其实毒素正在悄悄攻击肝脏，必须立刻住院抢救一刻不能回家！",
      "b": "吃下去睡一觉病就真的全好了",
      "ans": "a",
      "explain": "记住这一点能救命！预防毒蘑菇唯一100%靠谱的铁律就是：任何野生蘑菇，不采、不买、不吃！"
    }
  },
  "ch5-02": {
    "exp1": {
      "icon": "🔪🔴",
      "title": "切开菌肉观察『先变红、不变黑』",
      "sub": "分辨亚稀褶黑菇与可食红菇",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🍄🔴",
      "msg": "变色鉴定！亚稀褶黑菇切开或受伤后，白色的菌肉会慢慢变成淡红色或火炭红色，而不会像稀褶黑菇那样先变红再变黑！",
      "bi": {
        "en": "The cut mushroom flesh turns red like burning coal!",
        "zh": "切开的菌肉会变成像火炭一样的红色！",
        "kw": [
          "cut",
          "flesh",
          "red"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "📐💥",
      "title": "放大看只有4个碳的『三元张力环』",
      "sub": "全书个头最小的致命蘑菇毒素",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "🧬📐",
      "msg": "小身材大破坏！它的毒素『环丙-2-烯羧酸』只有区区4个碳原子，但3个碳硬挤成一个60度三角形加上双键，像拉满的弹弓一样极不稳定，会引发横纹肌溶解！",
      "bi": {
        "en": "A tiny triangle carbon ring causes muscle damage!",
        "zh": "一个微小的三角形碳环会引发肌肉损伤！",
        "kw": [
          "tiny",
          "triangle",
          "muscle"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：老乡常说『长在松树下、颜色灰扑扑像炭一样的火炭菌我都吃了几十年了』，为什么还是经常有人中毒？",
      "a": "因为剧毒的亚稀褶黑菇和可食的稀褶黑菇长在同一片树林里，外形极其相似，连老手光凭肉眼都会认错！",
      "b": "因为蘑菇半夜会自己换衣服",
      "ans": "a",
      "explain": "完全正确！毒蘑菇和可食菌常常混生在同一座山上，凭经验认野蘑菇是最危险的事！"
    }
  },
  "ch5-03": {
    "exp1": {
      "icon": "🔥🖐️",
      "title": "模拟手指触碰『火焰茸』汁液",
      "sub": "唯一连摸一下都会伤皮肤的毒菌",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🔥🚫",
      "msg": "红色最高警报！火焰茸含有的大环单端孢霉烯（撒旦菌素）穿透力极强，是极少数连用光手去捏或者沾到汁液，都会让皮肤红肿、起泡、脱皮的恐怖毒真菌！",
      "bi": {
        "en": "Never touch this bright red coral fungus with bare hands!",
        "zh": "千万别用光手去碰这种鲜红的珊瑚状真菌！",
        "kw": [
          "Never",
          "touch",
          "red"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🪵🔍",
      "title": "枯木珊瑚鹿角 vs 药用灵芝/虫草",
      "sub": "森林徒步如何识别火焰茸",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🪵🔥",
      "msg": "认准它的危险模样：夏秋季长在枯死硬木树干根部，像一排从地下伸出来的鲜橙红色手指或红珊瑚，表面光滑没有菌伞，远远看到拍照就好，绝不伸手戳！",
      "bi": {
        "en": "It looks like red fingers growing on dead wood!",
        "zh": "它看起来就像枯木上长出的红色手指！",
        "kw": [
          "red",
          "fingers",
          "wood"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：火焰茸全身鲜红如火，它在细胞里搞破坏的靶点是什么？",
      "a": "强行锁死真核细胞的『核糖体转肽酶』，让细胞完全无法合成蛋白质",
      "b": "把细胞染成红色",
      "ans": "a",
      "explain": "答对啦！火焰茸的鲜红色就是大自然最醒目的『高危勿碰』警示牌！"
    }
  },
  "ch5-04": {
    "exp1": {
      "icon": "🧠🎭",
      "title": "对比『裸盖菇素』与大脑血清素",
      "sub": "为什么它会弄乱大脑的视觉信号",
      "tone": "purple",
      "sfx": "sizzle",
      "badge": "🍄🧠",
      "msg": "分子撞脸啦！大孢花褶伞里的吲哚生物碱，跟我们大脑里负责情绪和感知的信使『血清素(5-羟色胺)』长得像双胞胎，会乱按大脑视觉皮层的开关！",
      "bi": {
        "en": "Its molecule mimics the brain's serotonin messenger!",
        "zh": "它的分子模仿了大脑里的血清素信使！",
        "kw": [
          "mimics",
          "brain's",
          "messenger"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐄🌱",
      "title": "草坪与牧场雨后小蘑菇排查",
      "sub": "公园草地上冒出的小灰伞能摘吗",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🌱🚫",
      "msg": "公园草坪下雨后常会一夜冒出这种细长腿、灰褐色钟形帽的小蘑菇（花褶伞属），虽然个头小不起眼，却含有神经毒素，遛狗和玩耍时都别去采摘！",
      "bi": {
        "en": "Leave little lawn mushrooms alone after the rain!",
        "zh": "雨后草坪上冒出的小蘑菇可别去碰！",
        "kw": [
          "Leave",
          "lawn",
          "mushrooms"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：花褶伞的名字里为什么有个『花』字？",
      "a": "因为成熟时深浅不一的孢子分布在菌褶上，让菌褶看起来像斑驳的花纹一样",
      "b": "因为它会开出玫瑰花",
      "ans": "a",
      "explain": "知识渊博！菌褶上有黑灰斑驳花纹正是花褶伞属（Panaeolus）的标志特征！"
    }
  },
  "ch5-05": {
    "exp1": {
      "icon": "😆😵",
      "title": "揭秘日本古典奇闻『笑蕈事件』",
      "sub": "为什么误食的人会控制不住傻笑",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🍄😆",
      "msg": "原来不是开心，是神经信号乱套啦！红褐斑褶菇的吲哚类神经毒素会短暂劫持大脑控制面部表情肌和情绪的神经回路，导致面部肌肉不由自主抽动发笑并伴随眩晕！",
      "bi": {
        "en": "The toxin tricks brain nerves into forced laughing!",
        "zh": "这种毒素会欺骗脑神经让人不由自主发笑！",
        "kw": [
          "toxin",
          "tricks",
          "laughing"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🪵🍂",
      "title": "秋季阔叶林枯木桩排查",
      "sub": "不认识的黄褐色木生菌别碰",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🪵⚠️",
      "msg": "红褐斑褶菇喜欢在秋天一丛丛长在腐烂的阔叶树桩上，橙黄褐色的菌盖看起来挺敦实，但里面含有的神经毒素耐热，炖汤炒菜都不会消失！",
      "bi": {
        "en": "Wild orange mushrooms on tree stumps are unsafe!",
        "zh": "树桩上的野生橙黄色蘑菇是不安全的！",
        "kw": [
          "Wild",
          "orange",
          "unsafe"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：《今昔物语集》里记载古人误食『舞茸/笑茸』后手舞足蹈大笑不止，从现代生物化学看属于什么类型中毒？",
      "a": "神经精神型毒蘑菇中毒（吲哚类生物碱干扰中枢5-羟色胺受体）",
      "b": "蘑菇里藏着搞笑漫画书",
      "ans": "a",
      "explain": "完全正确！古人以为是山神恶作剧，现代生物化学一眼就看穿了分子与大脑受体的把戏！"
    }
  },
  "ch5-06": {
    "exp1": {
      "icon": "🤏🔵",
      "title": "捏一捏菌柄观察『伤变蓝绿色』",
      "sub": "酚氧化酶变色反应实验",
      "tone": "teal",
      "sfx": "sizzle",
      "badge": "🍄🔵",
      "msg": "变蓝啦！古巴光盖伞受到按压受伤接触空气后，菌体内的酶会把赛洛西宾脱磷酸并氧化聚合，在几分钟内变成深邃的蓝绿色！",
      "bi": {
        "en": "Bruised stems turn blue when exposed to air!",
        "zh": "受损的菌柄接触空气后会变成蓝色！",
        "kw": [
          "Bruised",
          "stems",
          "blue"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "⚖️🏥",
      "title": "严格医学研究 vs 野外严禁采食",
      "sub": "认识赛洛西宾的双重管理边界",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "⚖️🚫",
      "msg": "法律与科学红线：含有赛洛西宾的野生光盖伞属于严格管控的有毒致幻菌，野外私自采摘食用不仅会导致严重感知错乱发生意外，而且违反法律法规！",
      "bi": {
        "en": "Wild blue-bruising mushrooms are strictly forbidden!",
        "zh": "野外伤变蓝的毒蘑菇严禁采摘食用！",
        "kw": [
          "Wild",
          "mushrooms",
          "forbidden"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：是不是所有切开会变蓝的蘑菇（比如某些牛肝菌和光盖伞）都能随便吃？",
      "a": "绝对不是！很多伤变蓝的野生菌含有神经毒素或胃肠炎毒素，野生菌一概不采不吃最安全",
      "b": "变蓝色说明它是蓝莓味蘑菇",
      "ans": "a",
      "explain": "答对啦！『红伞伞白杆杆，切开变蓝也别尝』，超市里人工培育的平菇、香菇、金针菇才是最放心的美味！"
    }
  },
  "ch5-07": {
    "exp1": {
      "icon": "🌙✨",
      "title": "关上灯！看520纳米暗夜翡翠绿光",
      "sub": "揭秘『月夜蕈』为什么会在夜里发光",
      "tone": "green",
      "sfx": "chime",
      "badge": "✨🌙",
      "msg": "哇，菌褶在黑暗里亮起了幽幽绿光！原来日本类脐菇体内有『真菌荧光素 + 荧光素酶 + 氧气』化学发光系统，特意在夜晚亮起绿灯，吸引夜行小甲虫来帮它传孢子！",
      "bi": {
        "en": "This mushroom glows green in the dark forest!",
        "zh": "这种蘑菇在漆黑的森林里会发出绿光！",
        "kw": [
          "mushroom",
          "glows",
          "green"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔪🟣",
      "title": "白天切开菌柄找『黑紫色胎记』",
      "sub": "怎么区分剧毒月夜蕈与美味平菇",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍄🔪",
      "msg": "关键鉴别点！白天不发光时，日本类脐菇长得跟野生平菇（侧耳）几乎一模一样；但只要把菌柄基部竖着切开，里面有一大块明显的『黑紫色斑块』，而且含隐杯伞素剧毒！",
      "bi": {
        "en": "A dark purple spot hides inside its stem base!",
        "zh": "它的菌柄基部里面藏着一块黑紫色斑块！",
        "kw": [
          "dark",
          "purple",
          "stem"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：科学家正在把月夜蕈里的『隐杯伞素 S (Illudin S)』改造成什么新药？",
      "a": "利用它破坏DNA螺旋的特性，改造成专门攻击顽固肿瘤细胞的抗癌候选药（Irofulven）",
      "b": "做成晚上写作业用的荧光笔墨水",
      "ans": "a",
      "explain": "太棒啦！虽然月夜蕈误食会引起剧烈胃肠中毒，但科学家改造它的分子结构后，又为抗击癌症添了一把新武器！"
    }
  },
  "ch5-08": {
    "exp1": {
      "icon": "🎭🍄",
      "title": "森林撞脸大赛：褐盖粉褶菌 vs 口蘑",
      "sub": "击碎『颜色朴素就没毒』的谣言",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍄🎭",
      "msg": "打假成功！谁说只有鲜艳的蘑菇才有毒？褐盖粉褶菌一身低调的灰褐色，长得就像菜市场最普通的白口蘑，却是日本和东亚每年引发最多中毒事件的『伪装王』之一！",
      "bi": {
        "en": "Plain brown mushrooms can be very poisonous too!",
        "zh": "长相朴素的褐色蘑菇也可能剧毒无比！",
        "kw": [
          "Plain",
          "brown",
          "poisonous"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "💦⚡",
      "title": "测试『毒蕈碱』按住流汗流泪开关",
      "sub": "副交感神经被持续激活会怎样",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "💦⚡",
      "msg": "开关卡住啦！它含有的『毒蕈碱 (Muscarine)』会死死按住副交感神经的M受体，而且不会被胆碱酯酶拆掉，导致全身大汗淋漓、流口水、肚子剧痛！",
      "bi": {
        "en": "Muscarine keeps the nerve switch pressed on!",
        "zh": "毒蕈碱会把神经开关一直按在开启状态！",
        "kw": [
          "Muscarine",
          "nerve",
          "switch"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：褐盖粉褶菌成熟时，菌盖底下的菌褶和孢子印是什么颜色的？",
      "a": "变成淡淡的肉粉色（所以叫『粉褶菌』），而普通口蘑孢子是白色的",
      "b": "变成彩虹七彩色",
      "ans": "a",
      "explain": "观察入微！粉褶菌成熟后菌褶带肉粉色，不过普通人肉眼很难100%分清，所以坚持不采野蘑菇才最安全！"
    }
  },
  "ch5-09": {
    "exp1": {
      "icon": "👃🍞",
      "title": "闻一闻它的『香甜面粉气味』",
      "sub": "闻着香喷喷的蘑菇就一定无毒吗？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍄👃",
      "msg": "粉碎谣言第1弹！褐黑口蘑闻起来有一股新鲜面粉和黄瓜般的清香，一点臭味都没有，但吃一口里面的三萜皂苷就会让肠胃剧烈呕吐腹泻！闻着香绝不等于无毒！",
      "bi": {
        "en": "A nice smell does not mean a mushroom is safe!",
        "zh": "气味好闻并不代表蘑菇是安全的！",
        "kw": [
          "smell",
          "mushroom",
          "safe"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐛🍽️",
      "title": "观察鼻涕虫和小虫子大口啃毒蘑菇",
      "sub": "虫子敢吃的蘑菇人类也能吃吗？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🐛🚫",
      "msg": "粉碎谣言第2弹！森林里的覃蚊幼虫和蛞蝓（鼻涕虫）经常把褐黑口蘑和白鹅膏啃得满是虫眼——因为虫子的肠胃和解毒酶跟人类完全不同，虫能吃人可不能吃！",
      "bi": {
        "en": "Bugs can eat toxic mushrooms that hurt humans!",
        "zh": "虫子能吃那些会伤害人类的毒蘑菇！",
        "kw": [
          "Bugs",
          "toxic",
          "humans"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：民间流传『跟大蒜或银勺子一起煮，不变黑的野蘑菇就没毒』，这个说法科学吗？",
      "a": "完全错误！无论是鹅膏毒肽还是褐黑口蘑的三萜毒素，都不会和银勺子或大蒜发生变黑反应！",
      "b": "很科学，银勺子有魔法",
      "ans": "a",
      "explain": "100分！银针试毒只对古代含硫化物（如不纯的砒霜）有效，对所有蘑菇毒素统统无效，快把这个科学知识告诉爷爷奶奶吧！"
    }
  },
  "ch5-10": {
    "exp1": {
      "icon": "🌧️💧",
      "title": "雨后摸摸它滑溜溜的粘液菌盖",
      "sub": "粘盖拟近香蘑的外观特征",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🍄🌧️",
      "msg": "表面滑溜溜！下雨后它的灰褐色菌盖表面会分泌一层黏液，长在落叶堆里看起来就像普通炖小鸡吃的野蘑菇，实则暗藏毒蕈碱！",
      "bi": {
        "en": "Its cap becomes slimy and wet after rain!",
        "zh": "雨后它的菌盖会变得湿滑黏腻！",
        "kw": [
          "cap",
          "slimy",
          "rain"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "💊🛡️",
      "title": "模拟急诊室『阿托品解毒对抗赛』",
      "sub": "毒蕈碱中毒怎么用植物药解救？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🏥💊",
      "msg": "以毒攻毒的药理杰作！粘盖拟近香蘑的『毒蕈碱』死死按住M受体让人流汗腹痛；医生用第3章欧莨菪里提取的『阿托品』刚好把毒蕈碱挡在门外，症状很快缓解！",
      "bi": {
        "en": "Doctors use atropine to block muscarine toxin!",
        "zh": "医生用阿托品来阻断毒蕈碱毒素！",
        "kw": [
          "atropine",
          "block",
          "toxin"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：万一有人误食了野生蘑菇出现恶心不舒服，去医院时除了带病人，最好还带上什么？",
      "a": "把吃剩的生蘑菇或拍下的蘑菇清晰照片一起带给医生，帮疾控专家最快鉴定出是哪种毒素！",
      "b": "带上炒菜用的铁锅",
      "ans": "a",
      "explain": "非常实用！保留剩余蘑菇样本或照片，能让医生第一时间判断是胃肠炎型、神经型还是最危险的鹅膏肝损型！"
    }
  },
  "ch5-11": {
    "exp1": {
      "icon": "🧬🔍",
      "title": "检测它体内的毒素分子身份证",
      "sub": "小黄蘑菇里怎么会有白鹅膏的毒？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍄🧬",
      "msg": "震惊发现！簇生盔孢伞和白鹅膏明明是不同科的远房亲戚，可它身体里合成的居然是完完全全同款的『α-鹅膏毒肽』双环八肽，毒性同样极其猛烈！",
      "bi": {
        "en": "This little brown mushroom carries the deadly ring peptide!",
        "zh": "这种褐色小蘑菇携带着致命的环肽毒素！",
        "kw": [
          "brown",
          "deadly",
          "peptide"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🪵🍲",
      "title": "对比簇生盔孢伞 vs 野生金针菇",
      "sub": "深秋枯木上的高危替身",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🍄⚠️",
      "msg": "千万别认错！簇生盔孢伞一丛丛长在腐木上，黄褐色的伞盖细长的柄，超像野生的金针菇（冬菇）或滑子菇，但它的菌柄下半截偏暗褐且带有小鳞片！",
      "bi": {
        "en": "Never mistake wild wood mushrooms for enoki!",
        "zh": "千万别把腐木上的野蘑菇当成金针菇！",
        "kw": [
          "mistake",
          "wood",
          "enoki"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：超市里白白嫩嫩的金针菇和海鲜菇是怎么种出来的？",
      "a": "在无菌恒温菇房里用纯化菌种培育的，绝对不会混入野外的簇生盔孢伞，可以100%放心吃！",
      "b": "去深山老林里随便捡来的",
      "ans": "a",
      "explain": "完全正确！现代工厂化培育的食用菌菌种纯净、营养丰富，好吃又安全！"
    }
  },
  "ch5-12": {
    "exp1": {
      "icon": "👅😖",
      "title": "测试『韧伞三萜 (Fasciculol)』苦味",
      "sub": "为什么它连闻起来都透着苦劲",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "🍄😖",
      "msg": "苦到皱眉头！簇生黄韧伞富含四环三萜苦味毒素『韧伞素』，不仅味道奇苦无比，煮熟后苦味毒素依然还在，会引发剧烈呕吐并干扰神经钙离子通道！",
      "bi": {
        "en": "Sulfur tuft mushrooms are super bitter and toxic!",
        "zh": "簇生黄韧伞超级苦而且有毒！",
        "kw": [
          "Sulfur",
          "bitter",
          "toxic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🪵🟡",
      "title": "紫外灯照射菌褶看荧光黄绿",
      "sub": "硫磺色小蘑菇的光学特征",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🍄✨",
      "msg": "发出黄绿色荧光啦！簇生黄韧伞因为菌盖呈鲜亮的硫磺黄色（英文叫 Sulfur tuft），在紫外线照射下菌褶会呈现出独特的亮黄绿色光泽！",
      "bi": {
        "en": "They grow in bright yellow clusters on old stumps!",
        "zh": "它们在老树桩上长成鲜黄色的菌簇！",
        "kw": [
          "bright",
          "yellow",
          "stumps"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果把极苦的簇生黄韧伞泡在水里反复洗、再用酱油重口味红烧盖住苦味，还能吃吗？",
      "a": "绝对不能！调料只能掩盖舌头的苦味感觉，里面的韧伞三萜毒素一丁点都没减少！",
      "b": "加足辣椒酱就能把毒素辣跑",
      "ans": "a",
      "explain": "答对啦！重口味调料盖不住化学毒素，腐木上成簇的小黄蘑菇只看别采！"
    }
  },
  "ch5-13": {
    "exp1": {
      "icon": "🐚🌲",
      "title": "对比贝形圆孢侧耳 vs 白色平菇",
      "sub": "长在针叶树腐木上的纯白小扇子",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🐚🍄",
      "msg": "颜值虽高藏暗器！它长在松树、杉树等针叶树枯木上，薄薄纯白像精致的白色小扇贝（日语叫天使之翼），过去曾被误以为可食，直到科学家揪出了它的罕见毒素！",
      "bi": {
        "en": "Angel wing mushrooms hide a rare toxic amino acid!",
        "zh": "这种像天使翅膀的白蘑菇藏着罕见的毒氨基酸！",
        "kw": [
          "Angel",
          "rare",
          "toxic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔬📐",
      "title": "放大看『氮杂环丙烷』三元小环",
      "sub": "认识奇异氨基酸 Pleurocybellaziridine",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧬⚠️",
      "msg": "化学家破案！2004年日本科学家终于从它体内抓到了真凶——一种带三元含氮小环的奇异氨基酸，尤其对肾脏功能较弱的老人大脑少突胶质细胞有严重毒性！",
      "bi": {
        "en": "Scientists solved this mushroom mystery in 2004!",
        "zh": "科学家在2004年解开了这种蘑菇的毒理之谜！",
        "kw": [
          "Scientists",
          "solved",
          "mystery"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：贝形圆孢侧耳的故事告诉我们什么科学道理？",
      "a": "哪怕以前民间老书上以为能吃的野蘑菇，现代分子毒理学也可能发现隐藏的慢性和特定人群毒性，所以野蘑菇一概不吃最稳妥！",
      "b": "长成扇贝形状的东西都归大海管",
      "ans": "a",
      "explain": "太有科学精神啦！科学总是在不断进步，用最新的分子证据保护家人健康才是最酷的！"
    }
  },
  "ch5-14": {
    "exp1": {
      "icon": "🖤💧",
      "title": "快进12小时：看蘑菇自己化成黑墨水",
      "sub": "墨汁鬼伞的『自溶』传播奇招",
      "tone": "purple",
      "sfx": "chime",
      "badge": "🖤💧",
      "msg": "滴答滴答变成真墨水啦！墨汁鬼伞成熟后，菌盖会分泌几丁质酶把自己从边缘往上慢慢消化融化成乌黑的汁液，黑色的孢子顺着墨汁滴落随雨水传向远方！",
      "bi": {
        "en": "Inky cap mushrooms melt into black ink when ripe!",
        "zh": "墨汁鬼伞成熟后会自己融化成黑墨水！",
        "kw": [
          "Inky",
          "melt",
          "black"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍺🛑",
      "title": "蘑菇汤 + 一口啤酒（或吃头孢喝酒）",
      "sub": "测试『鬼伞素』锁死肝脏解酒2号酶",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍺🚨",
      "msg": "肝脏解酒流水线大堵车！单吃幼嫩墨汁鬼伞本来没事，可它的『鬼伞素』会把肝脏里的2号工人（乙醛脱氢酶）绑起来好几天；一旦喝酒，有毒的乙醛排不出去，人立刻满脸通红心跳加速！",
      "bi": {
        "en": "Coprine blocks the liver enzyme that clears alcohol!",
        "zh": "鬼伞素会锁死肝脏里负责分解酒精的酶！",
        "kw": [
          "Coprine",
          "blocks",
          "liver"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：墨汁鬼伞锁死『乙醛脱氢酶』的原理，跟医院里医生千叮咛万嘱咐的哪条用药铁律一模一样？",
      "a": "吃头孢类抗生素前后一周内，绝对不能喝酒（包括酒心巧克力和藿香正气水）！",
      "b": "吃感冒药不能看电视",
      "ans": "a",
      "explain": "100分！『头孢配酒，说走就走』的双硫仑样反应，和墨汁鬼伞配酒是完完全全相同的生物化学机制（还可以去第2站第4个游乐场亲手做这个实验哦）！"
    }
  },
  "ch6-01": {
    "exp1": {
      "icon": "🔌🔒",
      "title": "把TTX『正电软木塞』塞进钠通道",
      "sub": "看河鲀毒素如何1对1堵死神经城门",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐡🔒",
      "msg": "咔哒一声严丝合缝！河鲀毒素(TTX)头顶带正电的『胍基』伪装成穿水衣的钠离子钻进通道口，结果后面胖乎乎的笼状身体卡在门框上——钠离子一个都进不去，神经信号瞬间中断！",
      "bi": {
        "en": "Tetrodotoxin plugs the nerve gate like a cork!",
        "zh": "河鲀毒素像软木塞一样把神经城门堵死！",
        "kw": [
          "plugs",
          "nerve",
          "cork"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦠🍽️",
      "title": "隔离海洋细菌喂养『无毒养殖河鲀』",
      "sub": "河鲀毒素到底是河鲀自己造的吗？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐡✨",
      "msg": "惊天反转！在过滤纯净海水里、从小吃无毒饲料长大的河鲀，肝脏里居然测不出河鲀毒素！原来TTX根本不是河鲀自己合成的，而是海洋弧菌造出来、顺着海星贝类食物链攒进河鲀体内的！",
      "bi": {
        "en": "Pufferfish actually get their toxin from ocean bacteria!",
        "zh": "河鲀其实是从海洋细菌那里借来的毒素！",
        "kw": [
          "Pufferfish",
          "toxin",
          "bacteria"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：把野生河鲀放到100°C高压锅里炖煮2个小时，里面的河鲀毒素(TTX)能被煮坏吗？",
      "a": "完全煮不坏！TTX是极结实的笼状小分子（不是蛋白质），300°C以下都很难分解，千万不能自己在家烧野生河鲀！",
      "b": "煮半小时就变成普通鱼汤了",
      "ans": "a",
      "explain": "完全正确！你还可以点上方去第2站【分子插锁孔】和【借毒养成缸】亲手玩转河鲀毒素哦！"
    }
  },
  "ch6-02": {
    "exp1": {
      "icon": "🎣🔬",
      "title": "检测礁石滩小虾虎鱼的『皮肤黏液』",
      "sub": "为什么不能随便把海钓小杂鱼带回家",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐟⚠️",
      "msg": "滴——TTX强阳性！云斑裸颊虾虎鱼不仅内脏有毒，连全身滑溜溜的皮肤黏液里都装满了和河鲀一模一样的河鲀毒素(TTX)，而且一年四季都有剧毒！",
      "bi": {
        "en": "This little goby fish carries pufferfish toxin in its skin!",
        "zh": "这条小虾虎鱼的皮肤里携带着河鲀毒素！",
        "kw": [
          "goby",
          "toxin",
          "skin"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐟🔍",
      "title": "对比云斑裸颊虾虎鱼 vs 普通小食用鱼",
      "sub": "认准它身上的圆斑与大脑袋",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🐟🔍",
      "msg": "特征锁定：它体长只有5~10厘米，头大嘴钝，身上有不规则的黑褐色云朵状大斑块，喜欢趴在浅海礁石和珊瑚丛里，赶海或海钓遇到它拍张照放生就好！",
      "bi": {
        "en": "Never cook unknown small fish caught on the reef!",
        "zh": "在礁石滩钓到不认识的小鱼千万别煮着吃！",
        "kw": [
          "Never",
          "unknown",
          "fish"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：云斑裸颊虾虎鱼为什么要在皮肤黏液里涂满河鲀毒素？",
      "a": "大鱼一口咬住它时，嘴唇立刻被黏液里的TTX麻得发苦发木，只好赶紧把它吐出来！",
      "b": "为了让自己在海里游得比潜艇还快",
      "ans": "a",
      "explain": "答对啦！把毒素涂在皮肤黏液最外层，捕食者刚咬进嘴还没咽下去就会识趣地吐掉它，真是保命奇招！"
    }
  },
  "ch6-03": {
    "exp1": {
      "icon": "🪨👀",
      "title": "开启海底热成像找出『石头伪装者』",
      "sub": "红鳍赤鲉躲在礁石缝里看得见吗？",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🐟🪨",
      "msg": "差点踩到它！红鳍赤鲉全身长满红褐色斑纹与皮瓣，趴在长满海藻的礁石上一动不动就像一块真石头，背上却竖着一排带毒腺的硬棘！",
      "bi": {
        "en": "This fish hides like a rock with sharp venom spines!",
        "zh": "这种鱼像石头一样伪装，背上却长着毒刺！",
        "kw": [
          "hides",
          "rock",
          "spines"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "♨️🦶",
      "title": "被鱼刺扎伤：敷冰块 vs 泡45°C温热水",
      "sub": "利用『毒蛋白怕热变性』科学急救",
      "tone": "green",
      "sfx": "sizzle",
      "badge": "♨️✅",
      "msg": "45°C温热水急救立大功！红鳍赤鲉、石头鱼和狮子鱼的毒棘毒液都是『对热极其敏感的不稳定蛋白质』，立即把伤处泡在不烫伤皮肤的40~45°C温热水里，毒蛋白就会受热变性失效，疼痛大减（同时去医院）！",
      "bi": {
        "en": "Warm water helps break down fish spine venom protein!",
        "zh": "温热水有助于分解鱼刺里的毒蛋白！",
        "kw": [
          "Warm",
          "water",
          "venom"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：去海边礁石滩赶海捉小螃蟹时，怎样防止被伪装的红鳍赤鲉扎到手脚？",
      "a": "穿厚底防滑胶鞋，绝不光脚下礁石水坑，也不伸手去摸水底像石头一样的东西",
      "b": "闭着眼睛光脚在水坑里乱踩",
      "ans": "a",
      "explain": "完全正确！穿好厚底涉水鞋、看清再下脚，礁石隐身刺客就伤不到你！"
    }
  },
  "ch6-04": {
    "exp1": {
      "icon": "🦁🎏",
      "title": "观察龙须狮子鱼展开『华丽羽扇鳍』",
      "sub": "海洋里的红白警戒条纹",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🦁🌊",
      "msg": "优雅又威严！龙须狮子鱼游动时从不慌张逃跑，而是大方展开红白相间的长长胸鳍和背鳍——在大海里，越是游得慢条斯理、打扮得花枝招展的鱼，越是在警告你『我有毒刺别碰我』！",
      "bi": {
        "en": "Its beautiful fan fins hide sharp venomous needles!",
        "zh": "它美丽的扇形鱼鳍里藏着锋利的毒针！",
        "kw": [
          "beautiful",
          "fins",
          "needles"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔬🪡",
      "title": "放大看背鳍硬棘上的『血槽导毒管』",
      "sub": "没有肌肉挤压它怎么把毒射出去？",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🪡🔬",
      "msg": "精密机械设计！狮子鱼的13根背鳍硬棘表面有两条深沟，沟里包着毒腺并套着一层薄皮鞘；一旦敌人压迫刺尖，薄皮鞘往下退缩，毒液就顺着凹槽自动注入伤口！",
      "bi": {
        "en": "Pressure on the spine pushes venom into the wound!",
        "zh": "按压毒刺就会把毒液推进伤口里！",
        "kw": [
          "Pressure",
          "spine",
          "venom"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：狮子鱼背鳍的毒蛋白和上一张卡片的红鳍赤鲉一样，万一被扎到，去医院前用什么温度的水泡伤口能缓解剧痛？",
      "a": "用40~45°C的温热水浸泡（让怕热的毒棘蛋白变性失活）",
      "b": "用零下20度的冰块冻住",
      "ans": "a",
      "explain": "学以致用太棒啦！鲉科鱼类（石头鱼、狮子鱼、赤鲉）的毒棘蛋白都怕热，45°C温热水浸泡是国际公认的现场急救第一步！"
    }
  },
  "ch6-05": {
    "exp1": {
      "icon": "🦶🌊",
      "title": "浅海沙滩『拖步走』vs『大步踩』测试",
      "sub": "海边涉水防踩赤魟的黄金步法",
      "tone": "green",
      "sfx": "chime",
      "badge": "🛸🦶",
      "msg": "拖步走(Stingray Shuffle)满分过关！脚掌贴着沙面轻轻往前蹭着走，扬起的沙子和震动会提前通知埋在沙里的赤魟，胆小的赤魟就会扇动胸鳍游走；大步抬脚往下踩才容易踩中它！",
      "bi": {
        "en": "Shuffle your feet in shallow sand to warn stingrays!",
        "zh": "在浅滩沙地拖步走可以提前提醒赤魟游开！",
        "kw": [
          "Shuffle",
          "feet",
          "stingrays"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🗡️🔍",
      "title": "放大看赤魟尾巴根部的『双向锯齿刺』",
      "sub": "为什么它的尾刺像鱼叉一样难拔",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🗡️⚠️",
      "msg": "骨质倒钩鱼叉！赤魟扁平的尾巴像鞭子，尾根长着一根带双向倒钩锯齿的硬骨刺，外面包着分泌5'-核苷酸酶与透明质酸酶的毒腺组织！",
      "bi": {
        "en": "A serrated tail spine hides near the base of its tail!",
        "zh": "在它尾巴根部藏着一根带锯齿的毒刺！",
        "kw": [
          "serrated",
          "spine",
          "tail"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在海洋馆触摸池里看到温和游动的魔鬼鱼/赤魟，为什么工作人员会让大家放心摸它的背部翅膀？",
      "a": "因为赤魟不会主动攻击人，而且触摸池里的赤魟通常由专业兽医定期修剪掉了尾部的骨刺（就像剪指甲一样不疼）",
      "b": "因为海洋馆的赤魟是塑料做的玩具",
      "ans": "a",
      "explain": "答对啦！赤魟的尾刺和人类指甲一样会不断生长，海洋馆兽医定期帮它修剪后就非常安全啦，但在野外海滩可一定要『拖步走』哦！"
    }
  },
  "ch6-06": {
    "exp1": {
      "icon": "🔪🎏",
      "title": "厨房杀鱼挑战：完整摘除『苦胆』",
      "sub": "为什么妈妈杀鱼时最怕弄破那个小绿球",
      "tone": "green",
      "sfx": "chime",
      "badge": "🎏✅",
      "msg": "摘除成功！鲤鱼、草鱼、青鱼肚子里的深绿色小囊就是『鱼胆』，只要完整摘掉扔进垃圾桶，洗净的鱼肉清蒸红烧都鲜美无比、100%安全营养！",
      "bi": {
        "en": "Fish meat is delicious, just remove the bitter gall sac!",
        "zh": "鱼肉非常美味，只要把苦胆完整摘除就行！",
        "kw": [
          "Fish",
          "delicious",
          "remove"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍲🍶",
      "title": "测试：把鱼胆煮熟或泡白酒能解毒吗？",
      "sub": "粉碎『鱼胆明目清火』的危险偏方",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🎏🚨",
      "msg": "大错特错！鱼胆里的『鲤醇硫酸酯钠』既不怕100°C高温煮沸，也不怕高度白酒浸泡！它像强力工业去污剂一样专门溶解肝脏和肾小管细胞膜，无论生吞、熟吃还是泡酒都剧毒！",
      "bi": {
        "en": "Never swallow raw or cooked fish gallbladders!",
        "zh": "无论生的还是熟的鱼胆，都绝对不能吞食！",
        "kw": [
          "Never",
          "swallow",
          "gallbladders"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果杀鱼时不小心弄破了鱼胆，胆汁沾到了鱼肉上发苦，该怎么处理？",
      "a": "如果只是沾到一点点表皮，立即用小苏打水或酒反复搓洗冲净；如果生吞整颗鱼胆则绝对禁止！",
      "b": "把破掉的鱼胆皮捡起来吃掉",
      "ans": "a",
      "explain": "完全正确！帮家里长辈彻底破除『生吞鱼胆清火明目』的民间误传，你就是全家人的健康科学顾问！"
    }
  },
  "ch6-07": {
    "exp1": {
      "icon": "🌫️🐟",
      "title": "第1招：往水里喷『超快效胰岛素云』",
      "sub": "慢吞吞的海螺怎么抓快游的小鱼？",
      "tone": "teal",
      "sfx": "sizzle",
      "badge": "🐚🌫️",
      "msg": "太科幻了！地纹芋螺爬得那么慢，居然先往周围海水里释放『超速效鱼类胰岛素』，小鱼通过鱼鳃一吸进去，几秒钟就低血糖头晕游不动了，接着芋螺再射出毒鱼叉！",
      "bi": {
        "en": "Cone snails release fast insulin to make fish dizzy!",
        "zh": "芋螺释放速效胰岛素让小鱼头晕游不动！",
        "kw": [
          "snails",
          "insulin",
          "dizzy"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "💉💊",
      "title": "第2招：提炼1000倍止痛神药『齐考诺肽』",
      "sub": "ω-芋螺毒素MVIIA的医院奇迹",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐚💊",
      "msg": "化毒为药巅峰之作！地纹芋螺鱼叉里有上百种微肽，其中ω-芋螺毒素能精准关掉脊髓痛觉神经的N型钙通道，做成的止痛针『齐考诺肽』威力是吗啡的1000倍，而且完全不会成瘾！",
      "bi": {
        "en": "Cone snail peptide makes a powerful painkiller!",
        "zh": "芋螺微肽能制成强效止痛良药！",
        "kw": [
          "snail",
          "peptide",
          "painkiller"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在热带海滩浮潜或赶海时，看到花纹像精致大理石地图一样的活体锥形海螺，能不能捡起来装进泳裤口袋？",
      "a": "绝对不能！活的地纹芋螺能从壳口伸出长长的吻部射出毒齿舌鱼叉，连薄手套和泳衣都能刺穿！",
      "b": "可以揣进兜里带回家当哨子吹",
      "ans": "a",
      "explain": "答对啦！海滩上活的锥形花纹海螺（鸡心螺/芋螺）只可远观拍照，千万别用手抓或装口袋！"
    }
  },
  "ch6-08": {
    "exp1": {
      "icon": "⚡🔵",
      "title": "轻轻靠近：0.3秒点亮50个宝蓝霓虹环",
      "sub": "看纳米鸟嘌呤反射镜片的物理结构色",
      "tone": "teal",
      "sfx": "sizzle",
      "badge": "🐙🔵",
      "msg": "唰——全身50多个宝蓝色光环瞬间闪耀！蓝环章鱼平时是伪装的米黄色，一旦受惊，皮肤色素囊肌肉在0.3秒内拉开，露出底下的纳米级鸟嘌呤多层反射镜，发出强烈的蓝色警戒光！",
      "bi": {
        "en": "Flashing blue rings mean danger, do not touch!",
        "zh": "闪烁的蓝色光环代表高危，千万别碰！",
        "kw": [
          "Flashing",
          "blue",
          "danger"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🦷🦠",
      "title": "检查它的唾液腺：怎么也是河鲀毒素？",
      "sub": "把被动Poison改造成主动Venom的跨界王",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐙🦷",
      "msg": "跨界高手！河鲀把TTX存在肝脏里防被吃（Poison），而蓝环章鱼在『后唾液腺』里养了一群共生弧菌帮它造TTX，再用锋利的鹦鹉嘴咬穿蟹壳主动注射进去（Venom）！",
      "bi": {
        "en": "It uses pufferfish toxin as an active bite weapon!",
        "zh": "它把河鲀毒素当成主动咬注的武器！",
        "kw": [
          "pufferfish",
          "toxin",
          "weapon"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：有时候退潮的小水坑或买回家的杂海鲜里偶尔会混入高尔夫球大小、带圆圈花纹的小章鱼，该怎么做？",
      "a": "一眼认出它的圆环标志，绝不用手去抓，也绝不下锅煮食（因为TTX高温煮不烂）！",
      "b": "放在手心里逗它变色拍视频",
      "ans": "a",
      "explain": "100分！蓝环章鱼体型只有高尔夫球大，但全身和唾液腺都含耐高温的河鲀毒素，认准圆环标志远远避开最聪明！"
    }
  },
  "ch6-09": {
    "exp1": {
      "icon": "🦀🍲",
      "title": "把花纹爱洁蟹放进高压锅蒸熟",
      "sub": "蒸熟的毒螃蟹能变安全吗？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🦀🚨",
      "msg": "蒸煮完全无效！花纹爱洁蟹全身肌肉和内脏里富集了『石房蛤毒素(STX)』和『河鲀毒素(TTX)』，这两种小分子都是超级耐热王，蒸熟煲汤照样剧毒无比！",
      "bi": {
        "en": "Boiling cannot remove the toxins in this reef crab!",
        "zh": "煮沸也无法去除这种珊瑚礁螃蟹体内的毒素！",
        "kw": [
          "Boiling",
          "remove",
          "crab"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎨🦀",
      "title": "鉴定珊瑚礁『红褐烤瓷玩具蟹』",
      "sub": "为什么颜色鲜艳光滑的礁石蟹不能吃",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🦀🔍",
      "msg": "认准它的模样：甲壳光滑得像上了釉的红褐色瓷器，上面印着对称的米黄色花纹，大钳子尖端乌黑——在珊瑚礁海域，凡是这种壳厚光滑、色彩鲜艳的扇蟹科螃蟹统统不能吃！",
      "bi": {
        "en": "Brightly patterned coral crabs are never for eating!",
        "zh": "花纹鲜艳的珊瑚礁螃蟹绝对不能吃！",
        "kw": [
          "Brightly",
          "coral",
          "crabs"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：花纹爱洁蟹体内的石房蛤毒素和河鲀毒素是从哪儿来的？",
      "a": "通过吃海底的有毒微藻、海绵和共生海洋细菌，在自己体内层层富集攒下来的",
      "b": "它去海底药店买来的",
      "ans": "a",
      "explain": "完全正确！这就是海洋食物链的『生物富集作用』，所以只吃菜市场常见的梭子蟹、青蟹、大闸蟹最放心！"
    }
  },
  "ch6-10": {
    "exp1": {
      "icon": "🌸🕹️",
      "title": "放大看『小花瓣』：居然是三爪抓娃娃机！",
      "sub": "揭秘海胆界的伪装冠军",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🟣🕹️",
      "msg": "不是花瓣是钳子！喇叭毒棘海胆把硬刺缩得很短，全身铺满几千个像盛开小花一样的『球形叉棘』；一旦敌人碰到花心触发器，三片带毒牙的钙质颚片咔哒一声合拢咬住注毒！",
      "bi": {
        "en": "Its flower-like claws snap shut to inject venom!",
        "zh": "它花朵般的小钳子会咔哒合拢注入毒液！",
        "kw": [
          "flower-like",
          "claws",
          "venom"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐚☂️",
      "title": "看它捡贝壳碎珊瑚当『遮阳帽』",
      "sub": "喇叭毒棘海胆的萌系隐身术",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🟣🐚",
      "msg": "太聪明啦！白天阳光强烈时，它会用细长的管足吸盘捡起海底的空贝壳、碎珊瑚片和海草顶在背上，既能防紫外线晒伤，又能把自己藏起来！",
      "bi": {
        "en": "It carries shells on its back like a little umbrella!",
        "zh": "它把贝壳顶在背上当小遮阳伞！",
        "kw": [
          "carries",
          "shells",
          "umbrella"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在珊瑚礁潜水看到一团顶着贝壳、浑身开满粉白色小喇叭花的圆球，能不能摘掉手套去摸它的『小花瓣』？",
      "a": "绝对不能！那些小花瓣全是带神经蛋白毒素的毒叉棘，一碰就会咬进皮肤里",
      "b": "可以摸，因为它没有长长的黑刺",
      "ans": "a",
      "explain": "答对啦！没有长黑刺不代表安全，喇叭毒棘海胆正是海胆家族里毒性最强的成员！"
    }
  },
  "ch6-11": {
    "exp1": {
      "icon": "✏️💥",
      "title": "测试30厘米黑长刺的『脆性倒钩』",
      "sub": "为什么刺冠海胆的刺像自动铅笔芯",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "⚫✏️",
      "msg": "咔嚓断在里面啦！刺冠海胆的黑刺又细又长，其实内部是中空的网状碳酸钙，表面还长满朝向刺尖的微倒刺，一扎进皮肤就脆断，还会释放紫黑色素把伤口染黑！",
      "bi": {
        "en": "Its hollow black spines are brittle like pencil lead!",
        "zh": "它中空的黑刺像铅笔芯一样容易脆断！",
        "kw": [
          "hollow",
          "spines",
          "brittle"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐟🏨",
      "title": "看小虾鱼躲进海胆长刺里当『保镖房』",
      "sub": "珊瑚礁里的互利共生小社区",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐟⚫",
      "msg": "天然防盗公寓！细长的海龙、虾鱼和小丑鱼苗最喜欢躲在刺冠海胆密密麻麻的长刺缝隙里，大鱼不敢靠近，小鱼还能顺便帮海胆清理身上的杂物！",
      "bi": {
        "en": "Tiny reef fish hide safely between the long spines!",
        "zh": "小小的珊瑚礁鱼儿安全地躲在长刺之间！",
        "kw": [
          "Tiny",
          "fish",
          "spines"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：刺冠海胆没有像人一样的眼睛，为什么你的手刚靠近它上方，它所有的长刺就会齐刷刷转向对准你？",
      "a": "因为它全身棘刺和表皮都有感光细胞，整只海胆就像一只巨大的复眼，能感知光影晃动！",
      "b": "因为它戴了隐形眼镜",
      "ans": "a",
      "explain": "太神奇啦！刺冠海胆通过全身感光细胞察觉黑影靠近，立刻把长矛阵对准阴影方向防守！"
    }
  },
  "ch6-12": {
    "exp1": {
      "icon": "🌞🌙",
      "title": "切换白天 vs 夜晚模式观察夜海葵",
      "sub": "礁石上的昼伏夜出猎手",
      "tone": "purple",
      "sfx": "chime",
      "badge": "🌸🌙",
      "msg": "白天它缩成一颗灰褐色的小肉球贴在礁石缝里毫不起眼；一旦夜幕降临，它就充水伸展开60多条半透明触手，顶端小球装满刺丝囊等待小鱼小虾经过！",
      "bi": {
        "en": "It opens its stinging tentacles when night falls!",
        "zh": "夜幕降临时它会张开带刺胞的触手！",
        "kw": [
          "opens",
          "tentacles",
          "night"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍩🔬",
      "title": "观察『海葵穿孔蛋白』在细胞膜拼圆环",
      "sub": "Actinoporin 是怎么给细胞打孔的",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🌸🍩",
      "msg": "分子甜甜圈打孔术！夜海葵的穿孔蛋白会认准猎物细胞膜上的鞘磷脂，由4个或8个蛋白分子手拉手围成一个圆筒通道插穿细胞膜，让细胞瞬间漏气漏水！",
      "bi": {
        "en": "Sea anemone proteins form tiny holes in cell walls!",
        "zh": "海葵蛋白会在细胞膜上拼成微小的孔洞！",
        "kw": [
          "anemone",
          "proteins",
          "holes"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么小丑鱼可以在某些海葵触手中间钻来钻去睡大觉，却不会被海葵的刺丝囊射中？",
      "a": "因为小丑鱼体表涂有一层特殊的糖蛋白黏液，海葵以为它是自己触手的一部分，就不会发射刺丝囊！",
      "b": "因为小丑鱼会给海葵讲笑话",
      "ans": "a",
      "explain": "完全正确！小丑鱼靠这层『化学隐身衣』黏液与海葵互利共生，成了海洋里最温暖的搭档！"
    }
  },
  "ch6-13": {
    "exp1": {
      "icon": "🌊🚰",
      "title": "被蛰急救测试：浇矿泉水 vs 浇海水",
      "sub": "细胞渗透压物理化学大考验",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🎐🌊",
      "msg": "千万别浇矿泉水（淡水）！粘在皮肤上的触手还有成千上万个没发射的刺丝囊，一旦浇上低渗透压的淡水，水分子疯狂涌入囊内，会让残留刺丝囊集体爆炸射针！用海水冲洗才对！",
      "bi": {
        "en": "Rinse jellyfish stings with seawater, never fresh water!",
        "zh": "用海水冲洗水母蛰伤，千万别用淡水！",
        "kw": [
          "Rinse",
          "seawater",
          "fresh"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "⚡🚀",
      "title": "慢镜头回放700纳秒『5万G微米鱼叉』",
      "sub": "自然界速度最快的生物力学弹射",
      "tone": "teal",
      "sfx": "sizzle",
      "badge": "🎐🚀",
      "msg": "比子弹启动还快！刺丝囊内部攒着150个大气压的超高渗透压，一碰触发纤毛，小盖子弹开，微米鱼叉在百万分之0.7秒内以5万倍重力加速度射穿猎物外壳！",
      "bi": {
        "en": "Its micro-harpoon fires faster than a speeding bullet!",
        "zh": "它的微型鱼叉发射速度比出膛子弹还快！",
        "kw": [
          "micro-harpoon",
          "faster",
          "bullet"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：海滩沙子上躺着一个被海浪冲上岸、看起来像蓝紫色塑料泡泡糖袋一样的僧帽水母，能光脚去踩破它吗？",
      "a": "绝对不能！就算僧帽水母已经搁浅干瘪了，触手上的刺丝囊遇到机械按压依然会自动发射毒针！",
      "b": "可以像踩气泡膜一样踩着玩",
      "ans": "a",
      "explain": "太重要啦！刺丝囊是半自动物理化学机关，脱离水母身体好多天还能触发射针，海滩上看到蓝色气囊一定要绕着走！"
    }
  },
  "ch6-14": {
    "exp1": {
      "icon": "🏮🌊",
      "title": "开启深色背景灯寻找『透明方灯笼』",
      "sub": "为什么夏季海滨浴场很难看清它",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🏮🔍",
      "msg": "几乎全透明！灯水母身体95%以上都是水分，伞体像一个四四方方的透明小灯笼，四个角垂下四根粉红色长触手，在水里像隐形刺客一样难被泳客发觉！",
      "bi": {
        "en": "This clear lantern jellyfish is hard to spot in water!",
        "zh": "这种透明的灯水母在水里很难被看清！",
        "kw": [
          "clear",
          "lantern",
          "water"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍶🩹",
      "title": "用『食用醋 (乙酸)』钝化未发射刺丝囊",
      "sub": "立方水母纲的海滩急救良方",
      "tone": "green",
      "sfx": "chime",
      "badge": "🍶✅",
      "msg": "未发射的刺丝囊被锁住啦！灯水母和箱水母同属『立方水母纲』，家用食醋（3%~5%乙酸）能改变刺丝囊壁蛋白构象，阻止还没发射的刺丝囊继续放电射针！",
      "bi": {
        "en": "Vinegar helps stop cube jellyfish tentacles from firing!",
        "zh": "食醋能阻止立方水母的触手继续发射毒针！",
        "kw": [
          "Vinegar",
          "stop",
          "firing"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：去海滨浴场游泳时，怎样有效预防被灯水母等夏季水母蛰伤？",
      "a": "在圈有防鲨防蜇网的安全泳区游泳，穿长袖防晒水母衣（莱卡潜水服能挡住绝大部分刺丝囊微针！）",
      "b": "在身上涂满草莓果酱",
      "ans": "a",
      "explain": "满分！一件薄薄的长袖防晒水母衣不仅防晒伤，更是阻挡水母微米级刺丝囊的物理神装！"
    }
  },
  "ch6-15": {
    "exp1": {
      "icon": "👁️🧊",
      "title": "数一数箱水母身上的『24只眼睛』",
      "sub": "没有大脑的水母怎么看清珊瑚礁障碍物？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🧊👁️",
      "msg": "演化奇迹！澳洲箱水母四个边角的感官盒里一共长着24只眼睛，其中有4只还是带晶状体、视网膜和角膜的『真眼睛』，能看清360度障碍物并主动拐弯追鱼！",
      "bi": {
        "en": "Box jellyfish have twenty-four eyes to see around!",
        "zh": "箱水母长着24只眼睛来观察四周！",
        "kw": [
          "twenty-four",
          "eyes",
          "see"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🛡️🧬",
      "title": "用环糊精把细胞膜『胆固醇垫脚石』藏起来",
      "sub": "CRISPR基因筛选发现的解毒新思路",
      "tone": "green",
      "sfx": "chime",
      "badge": "🧬✨",
      "msg": "找不到着力点啦！科学家用CRISPR技术发现，箱水母毒素CfTX必须先踩住人体细胞膜上的『胆固醇』才能打孔；用安全分子把胆固醇临时遮住，毒素就打不了孔啦！",
      "bi": {
        "en": "Scientists found how to block its pore-forming toxin!",
        "zh": "科学家找到了阻断它打孔毒素的新方法！",
        "kw": [
          "Scientists",
          "block",
          "toxin"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么澳洲北部的海滩急救箱里，总是常备着一瓶大大的『白醋』？",
      "a": "一旦有人被箱水母蛰伤，立即倒满白醋30秒，能让黏在皮肤上数百万个未发射的刺丝囊彻底失活，防止取触手时二次注毒！",
      "b": "为了让游客在海边拌凉菜吃",
      "ans": "a",
      "explain": "完全正确！澳洲海滩急救箱里的白醋拯救了无数被箱水母蛰伤的泳客生命！"
    }
  },
  "ch6-16": {
    "exp1": {
      "icon": "⭐🫧",
      "title": "检测棘冠海星表面的『海星皂苷』",
      "sub": "为什么摸它和被扎都会红肿剧痛",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "⭐⚠️",
      "msg": "化学+物理双重装甲！棘冠海星不仅长着十几条布满毒刺的手臂，全身皮肤和刺表面还涂满了像肥皂一样的『海星皂苷』，能直接溶解红细胞膜引发溶血肿痛！",
      "bi": {
        "en": "Crown-of-thorns starfish is covered in venomous spines!",
        "zh": "棘冠海星全身布满了有毒的尖刺！",
        "kw": [
          "starfish",
          "venomous",
          "spines"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎺🐚",
      "title": "召唤珊瑚礁护卫队『大法螺』登场",
      "sub": "谁敢吃浑身毒刺的棘冠海星？",
      "tone": "green",
      "sfx": "chime",
      "badge": "🐚🦸",
      "msg": "珊瑚礁救星驾到！棘冠海星爱把胃翻出来消化珊瑚虫，幸好自然界有它的天敌『大法螺（凤尾螺）』——大法螺根本不怕海星皂苷和毒刺，专门帮珊瑚礁控制棘冠海星数量！",
      "bi": {
        "en": "Giant triton snails protect coral reefs from this starfish!",
        "zh": "大法螺保护珊瑚礁免受这种海星的破坏！",
        "kw": [
          "triton",
          "protect",
          "coral"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果有人想通过『把棘冠海星切成两半扔回海里』来消灭它，结果会发生什么？",
      "a": "再生超能力启动！被切开的海星只要带有中心盘，反而可能长成两只完整的棘冠海星！",
      "b": "它会变成两条小鱼",
      "ans": "a",
      "explain": "太懂海洋生态啦！海星拥有极强的再生能力，如今潜水员都用专门的食醋/胆汁盐注射器在水下科学清理泛滥的棘冠海星！"
    }
  },
  "ch6-17": {
    "exp1": {
      "icon": "🌊🚣",
      "title": "对比海蛇的『船桨尾巴』与陆地蛇尾巴",
      "sub": "演化如何帮它适应大海生活",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🌊🐍",
      "msg": "天生游泳健将！陆地蛇的尾巴是圆锥形的，而海蛇的尾巴左右压扁，长得像一片宽宽的船桨，轻轻一摆就能在珊瑚礁里灵活穿梭，鼻孔还有自动防水阀门呢！",
      "bi": {
        "en": "Sea snakes have flat paddle tails for swimming!",
        "zh": "海蛇长着扁平如船桨的尾巴用来游泳！",
        "kw": [
          "snakes",
          "paddle",
          "swimming"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "💧🎯",
      "title": "为什么海蛇毒液比陆地眼镜蛇更浓缩？",
      "sub": "海底捕鱼的快准狠法则",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🐍🎯",
      "msg": "海底没有二次机会！陆地毒蛇咬完老鼠还能顺着气味慢慢找；可在三维大海里，小鱼如果不一秒麻痹就会钻进珊瑚洞逃走，所以海蛇演化出了超高浓度的短链神经毒素！",
      "bi": {
        "en": "Its concentrated venom stops fast fish in seconds!",
        "zh": "它高度浓缩的毒液能在几秒内制服快游的鱼！",
        "kw": [
          "concentrated",
          "venom",
          "seconds"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：潜水员在水下偶尔遇到海蛇游过来好奇地看一眼，应该怎么做？",
      "a": "保持冷静悬停不动、不去抓打它，海蛇性格非常温顺，看完就会自己游走换气啦",
      "b": "伸手去拽它的扁尾巴",
      "ans": "a",
      "explain": "完全正确！海蛇毒牙很短且性格温和，只要不去抓握或踩踏它，它几乎从不主动咬潜水员！"
    }
  },
  "ch6-18": {
    "exp1": {
      "icon": "🔬🧶",
      "title": "放大看海毛虫的『空心玻璃纤维鬃毛』",
      "sub": "海底礁石下的带刺毛毯",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐛🔬",
      "msg": "一碰就扎满手！海毛虫身体两侧长着一排排银白色、像仙人掌芒刺一样的空心钙质刚毛，里面装着发炎毒素『扁虫素(Complanine)』，一摸几百根脆毛就会断在皮肤里！",
      "bi": {
        "en": "Bristle worms have hollow spines that break off easily!",
        "zh": "海毛虫长着极易折断的中空刚毛刺！",
        "kw": [
          "Bristle",
          "hollow",
          "spines"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🩹🍶",
      "title": "海毛虫刚毛扎手：胶带粘毛 + 食醋溶解",
      "sub": "碳酸钙刚毛的化学克星",
      "tone": "green",
      "sfx": "chime",
      "badge": "🩹✅",
      "msg": "化学加物理双管齐下！先用透明胶带把露在皮肤外的刚毛轻轻粘走（千万别揉搓），因为海毛虫的刚毛主要成分是碳酸钙，再敷一点家用白醋就能帮残留微刺软化分解！",
      "bi": {
        "en": "Sticky tape and vinegar help with bristle worm stings!",
        "zh": "透明胶带和白醋能帮我们处理海毛虫刺伤！",
        "kw": [
          "tape",
          "vinegar",
          "stings"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在海边翻开潮湿的礁石找螃蟹时，看到一条长着漂亮银白毛簇的扁平虫子，该怎么做？",
      "a": "只用眼睛看，赶海翻石头一定要戴厚防割手套，绝不光手去摸礁石背面的毛虫",
      "b": "用手指去顺一顺它银白色的毛",
      "ans": "a",
      "explain": "答对啦！戴好赶海手套、不摸不明海洋多毛类动物，就能开心安全地探索潮间带！"
    }
  },
  "ch7-01": {
    "exp1": {
      "icon": "🎨📜",
      "title": "常温水泡：千年古画『朱砂红』不褪色",
      "sub": "为什么常温下的辰砂晶格很难溶进水里",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🔴🎨",
      "msg": "晶格锁得超紧！辰砂是硫化汞(HgS)，汞原子和硫原子手拉手结成极其牢固的共价晶格，常温下在水里的溶解度几乎为零，所以故宫红墙和千年古画用它做颜料永不褪色！",
      "bi": {
        "en": "Cinnabar red pigment stays bright for a thousand years!",
        "zh": "辰砂红颜料历经千年依然鲜艳明亮！",
        "kw": [
          "Cinnabar",
          "pigment",
          "bright"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔥☠️",
      "title": "放进炼丹炉大火灼烧！(HgS + O₂)",
      "sub": "揭开古代炼丹师仙丹中毒的化学真相",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🔴🔥",
      "msg": "危险化学反应发生！一旦把辰砂放进火里高温灼烧，硫被氧气抢走变成二氧化硫，原本锁住的汞立刻变成无色无味的剧毒『水银蒸气(Hg↑)』跑出来，吸进去就会重金属中毒！",
      "bi": {
        "en": "Never heat red cinnabar rock in a fire!",
        "zh": "千万别把红色的辰砂矿石放进火里烧！",
        "kw": [
          "Never",
          "heat",
          "cinnabar"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：重金属汞离子(Hg²⁺)进入身体后，最喜欢抱住酶蛋白上的哪一个原子不放手，导致酶蛋白罢工？",
      "a": "最爱抱住半胱氨酸上的『硫原子（巯基 -SH）』，所以汞的外号叫嗜硫元素！",
      "b": "抱住空气里的氦气原子",
      "ans": "a",
      "explain": "化学功底太扎实啦！正因为汞和硫天生最爱抱团，它在矿石里是硫化汞，进了身体也会去抢蛋白质上的硫！"
    }
  },
  "ch7-02": {
    "exp1": {
      "icon": "📜✏️",
      "title": "用金黄雌黄涂改古书黄纸错字",
      "sub": "体验成语『信口雌黄』的古代修正液",
      "tone": "amber",
      "sfx": "chime",
      "badge": "🟡📜",
      "msg": "错别字瞬间隐形啦！古代书卷用黄檗染成黄色防虫，写错字时涂上金黄色的三硫化二砷（雌黄）粉末，颜色跟黄纸一模一样还能防书虫，这就是『信口雌黄』的来历！",
      "bi": {
        "en": "Ancient writers used yellow orpiment to fix mistakes!",
        "zh": "古代写字的人用金黄的雌黄来涂改错字！",
        "kw": [
          "Ancient",
          "yellow",
          "mistakes"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🏥🏆",
      "title": "现代医学奇迹：三氧化二砷治愈白血病",
      "sub": "中国科学家如何让剧毒变世界级救命药",
      "tone": "green",
      "sfx": "chime",
      "badge": "🟡💊",
      "msg": "致敬中国科学家！张亭栋、陈竺等科学家发现，极微量的三氧化二砷能精准绑定并降解『急性早幼粒细胞白血病』的致癌融合蛋白(PML-RARα)，让这种曾最凶险的白血病成为可治愈疾病！",
      "bi": {
        "en": "Chinese scientists turned arsenic into a leukemia cure!",
        "zh": "中国科学家把砷化合物变成了治愈白血病的良药！",
        "kw": [
          "Chinese",
          "scientists",
          "cure"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：古人用雌黄改错字或者用朱砂画画时，为什么绝对不能养成『用舌头舔毛笔尖』的习惯？",
      "a": "因为雌黄含砷、朱砂含汞，舔笔尖会把重金属矿物粉末直接吃进肚子里引起慢性中毒！",
      "b": "因为舌头会变成金色和红色",
      "ans": "a",
      "explain": "完全正确！无论画水彩、国画还是做矿物标本观察，永远记住笔尖不进嘴、画完先洗手！"
    }
  },
  "ch7-03": {
    "exp1": {
      "icon": "🔨🧄",
      "title": "模拟地质锤敲击：冒出『大蒜味火花』",
      "sub": "矿物学家怎么区分毒砂与真黄金",
      "tone": "rose",
      "sfx": "sizzle",
      "badge": "🪨🧄",
      "msg": "一股浓烈的大蒜臭味！砷黄铁矿（毒砂 FeAsS）外表金光闪闪像黄金，但用铁锤一敲击摩擦发热，里面的砷就会挥发氧化，散发出刺鼻的大蒜味毒烟（野外看矿石千万别敲别闻）！",
      "bi": {
        "en": "Striking this rock releases a garlic smell of arsenic!",
        "zh": "敲击这块矿石会释放出带大蒜味的砷气味！",
        "kw": [
          "Striking",
          "rock",
          "garlic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "👑⚖️",
      "title": "测试硬度：毒砂 vs 真黄金",
      "sub": "无损鉴定『愚人金』的物理方法",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🪨🔍",
      "msg": "物理测试最安全！真黄金质地很软，用小刀就能划出印子且延展性好；而砷黄铁矿硬度高达5.5~6，又硬又脆，条痕是灰黑色的！",
      "bi": {
        "en": "Real gold is soft, while this mineral is hard and brittle!",
        "zh": "真黄金很软，而这种矿石又硬又脆！",
        "kw": [
          "gold",
          "soft",
          "brittle"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：温泉水从地下流过含砷黄铁矿的地层时，为什么野外有些未经检测的天然野温泉水绝对不能喝？",
      "a": "因为高温地下水可能溶解了地层矿石里的砷等重金属离子，野温泉水只可外泡绝不能当饮用水喝！",
      "b": "因为温泉水是地球的洗澡水",
      "ans": "a",
      "explain": "太有地质化学头脑啦！天然野泉水可能溶解了地下含砷、含氟矿物，饮用水一定要喝经过检测达标的自来水或矿泉水！"
    }
  },
  "ch7-04": {
    "exp1": {
      "icon": "🔥🧵",
      "title": "拿1000°C火焰喷枪烧『石棉布』",
      "sub": "揭秘古代西域奇宝『火浣布』",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🧵🔥",
      "msg": "居然一点都烧不着！《列子》里记载弄脏了丢进火里一烧反而变白净的『火浣布』，其实就是用天然纤维状硅酸盐矿石——石棉织成的！因为它是石头，当然不怕火烧！",
      "bi": {
        "en": "Asbestos is a rock that can be spun into fireproof threads!",
        "zh": "石棉是一种能纺成防火丝线的石头！",
        "kw": [
          "Asbestos",
          "rock",
          "fireproof"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🔬🫁",
      "title": "放大10000倍看『纳米级岩石微针』",
      "sub": "为什么现代建筑全面禁止使用石棉？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧵🚨",
      "msg": "肺泡警报！石棉纤维劈开后比人类头发丝还要细上千倍，飘在空气里肉眼看不见；一旦吸入肺部，身体的免疫巨噬细胞既吞不下这根坚硬的石头长针，也融化不了它！",
      "bi": {
        "en": "Tiny rock fibers are dangerous if breathed into lungs!",
        "zh": "微小的岩石纤维一旦吸入肺部非常危险！",
        "kw": [
          "Tiny",
          "fibers",
          "lungs"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：石棉的毒性跟河鲀毒素那样的化学分子毒有什么本质区别？",
      "a": "石棉主要是『物理微观形态致毒』——不溶于水的微米级坚硬硅酸盐针状纤维长期扎在肺泡里引发慢性损伤！",
      "b": "石棉会在肚子里变成大石头",
      "ans": "a",
      "explain": "一针见血！现在科学家已经研发出了安全的玻璃纤维和岩棉替代材料，让房子既防火又健康！"
    }
  },
  "ch7-05": {
    "exp1": {
      "icon": "🎲⬛",
      "title": "放大看方铅矿天然的『完美小魔方』",
      "sub": "氯化钠型立方晶系的几何之美",
      "tone": "teal",
      "sfx": "chime",
      "badge": "⬛🎲",
      "msg": "大自然的几何强迫症！方铅矿(PbS)里的铅离子和硫离子按正方体网格整整齐齐排列，就算碎裂也会沿着三个垂直方向裂成一层层闪着银光的小正方体阶梯！",
      "bi": {
        "en": "Galena crystals naturally form shiny silver cubes!",
        "zh": "方铅矿晶体天生会形成闪亮的银色小正方体！",
        "kw": [
          "Galena",
          "shiny",
          "cubes"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🎭🦴",
      "title": "揪出伪装成『钙离子(Ca²⁺)』的铅离子",
      "sub": "为什么铅元素会影响造血和神经",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "⬛⚠️",
      "msg": "抓获冒牌货！铅离子(Pb²⁺)带2个正电荷，最喜欢冒充人体必需的钙离子(Ca²⁺)、铁离子(Fe²⁺)和锌离子(Zn²⁺)，混进骨骼、神经突触和造血酶里捣乱！",
      "bi": {
        "en": "Lead ions pretend to be calcium in our body!",
        "zh": "铅离子在身体里会冒充钙离子捣乱！",
        "kw": [
          "Lead",
          "pretend",
          "calcium"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：小学生每天写字用的『铅笔』芯，含铅吗？咬铅笔会铅中毒吗？",
      "a": "铅笔芯是无毒的『石墨（碳元素）+ 黏土』做的，根本不含金属铅！但铅笔外面的彩色油漆皮不能咬，所以依然别养成咬笔杆习惯哦！",
      "b": "铅笔芯全是用方铅矿做的",
      "ans": "a",
      "explain": "太聪明啦！400年前人们刚发现石墨矿时误以为它是方铅矿的一种才叫『铅笔』，其实笔芯是碳，但摸完矿石标本和彩笔后一定要洗手！"
    }
  },
  "ch7-06": {
    "exp1": {
      "icon": "🗡️✨",
      "title": "360度欣赏博物馆『银色宝剑晶簇』",
      "sub": "辉锑矿为什么是矿物收藏界的明星",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🗡️✨",
      "msg": "太酷炫了！中国湖南锡矿山和江西产出的辉锑矿(Sb₂S₃)，一根根修长挺拔、泛着冷冽钢灰金属光泽，就像武侠小说里插在岩石上的百柄银色宝剑！",
      "bi": {
        "en": "Stibnite grows into clusters of shiny silver swords!",
        "zh": "辉锑矿会长成一簇簇闪亮的银色宝剑！",
        "kw": [
          "Stibnite",
          "silver",
          "swords"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🕯️💧",
      "title": "测试辉锑矿的超低熔点 + 元素周期表查户口",
      "sub": "砷(As)楼下的亲弟弟锑(Sb)",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🗡️🧪",
      "msg": "周期表破案！打开元素周期表第15族（氮族），磷(P)下面是砷(As)，砷正下方就是锑(Sb)！因为同族元素化学脾气很像，三硫化二锑同样会结合蛋白质巯基，必须隔着展柜欣赏！",
      "bi": {
        "en": "Antimony sits right below arsenic on the periodic table!",
        "zh": "在元素周期表上，锑就坐在砷的正下方！",
        "kw": [
          "Antimony",
          "below",
          "arsenic"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：在自然博物馆看到辉锑矿、辰砂或雌黄晶簇展品时，最科学的参观方式是什么？",
      "a": "隔着密封玻璃展柜欣赏它们的晶体几何之美，如果在矿物体验区摸了原石，出馆立刻用肥皂洗手",
      "b": "用指甲去抠一块矿石粉带回家",
      "ans": "a",
      "explain": "满分小馆长！只要不把矿物粉尘吃进嘴或吸进鼻子，隔着展柜欣赏矿物晶体是100%安全的科学享受！"
    }
  },
  "ch7-07": {
    "exp1": {
      "icon": "🟣🟢",
      "title": "打开紫外灯：激发铀酰离子霓虹绿光",
      "sub": "为什么钙铀云母会发出外星宝石般的光",
      "tone": "green",
      "sfx": "chime",
      "badge": "🟢🟣",
      "msg": "震撼的霓虹荧光！钙铀云母晶格里的『铀酰离子(UO₂²⁺)』吸收紫外线能量后，外层电子跳上跳下，释放出波长约520纳米的耀眼黄绿色荧光！",
      "bi": {
        "en": "Uranium ions glow neon green under UV light!",
        "zh": "铀酰离子在紫外灯下会发出霓虹绿光！",
        "kw": [
          "Uranium",
          "neon",
          "green"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "📦🛡️",
      "title": "盖上厚铅玻璃密封罩 + 开启盖革计数器",
      "sub": "如何安全封存放射性矿物标本",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🟢🛡️",
      "msg": "滴…滴…读数归零安全啦！钙铀云母除了会风化掉粉，还会衰变释放α、β粒子和氡气；把它锁进密封的有机玻璃与铅屏蔽盒里，就能在博物馆里安全展示！",
      "bi": {
        "en": "Sealed protective boxes keep radioactive rocks safe!",
        "zh": "密封防护盒能让放射性矿石保持安全！",
        "kw": [
          "Sealed",
          "protective",
          "safe"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：钙铀云母放出的主要粒子『α粒子（氦原子核）』，穿透力有多强？",
      "a": "α粒子个头大，一张白纸或几厘米空气就能挡住它；最怕的是矿石粉末掉下来被吸进肺里或吃进肚子里（内照射）！",
      "b": "α粒子能穿透十座大山",
      "ans": "a",
      "explain": "物理学霸就是你！α粒子外照射很容易被玻璃罩挡住，密封防尘不吸入才是防护钙铀云母的核心！"
    }
  },
  "ch7-08": {
    "exp1": {
      "icon": "👩‍🔬🏆",
      "title": "重返居里夫人的简陋木棚实验室",
      "sub": "从几吨沥青铀矿渣里提炼0.1克氯化镭",
      "tone": "teal",
      "sfx": "chime",
      "badge": "☢️👩‍🔬",
      "msg": "向科学巨匠致敬！玛丽·居里发现晶质铀矿（沥青铀矿）的放射性比纯铀还要强好几倍，经过四年艰苦提炼，终于从中发现了两个全新元素——『钋(Po)』和『镭(Ra)』，连获两次诺贝尔奖！",
      "bi": {
        "en": "Marie Curie discovered radium in pitchblende ore!",
        "zh": "居里夫人在沥青铀矿中发现了镭元素！",
        "kw": [
          "Marie",
          "Curie",
          "radium"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "⚛️🏥",
      "title": "看现代核医学与核电如何驯服原子能",
      "sub": "从矿石发现到造福人类的清洁能源",
      "tone": "green",
      "sfx": "chime",
      "badge": "⚛️✨",
      "msg": "科学之光！正是从研究晶质铀矿开始，人类解开了原子核内部巨大能量的秘密，不仅建起了零碳排放的核电站，还发明了医院精准消灭肿瘤的放射治疗技术！",
      "bi": {
        "en": "Atomic science helps doctors and powers clean energy!",
        "zh": "原子科学既能帮助医生治病，又能提供清洁能源！",
        "kw": [
          "Atomic",
          "doctors",
          "energy"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：居里夫人发现的第一个新元素『钋 (Polonium)』，是以什么名字命名的？",
      "a": "为了纪念她热爱却当时被瓜分的祖国——波兰 (Poland)！",
      "b": "以她家小狗的名字命名的",
      "ans": "a",
      "explain": "太令人感动啦！居里夫人不仅把放射性科学奉献给全人类（连镭的提炼专利都没申请，无偿公开给全世界医院），还把祖国的名字写进了元素周期表！"
    }
  },
  "ch8-01": {
    "exp1": {
      "icon": "🌿🐛",
      "title": "还原烟草植物造『尼古丁』的初心",
      "sub": "烟草原本为什么要合成尼古丁？",
      "tone": "amber",
      "sfx": "sizzle",
      "badge": "🚭🐛",
      "msg": "真相揭晓！烟草植物合成尼古丁，原本是用来麻痹啃咬烟叶的毛毛虫和甲虫的『天然杀虫剂』！人类吸进肺里，它却跑去乱按大脑多巴胺奖赏按钮让人上瘾！",
      "bi": {
        "en": "Tobacco plants make nicotine to fight off bugs!",
        "zh": "烟草植物制造尼古丁原本是为了对付害虫！",
        "kw": [
          "Tobacco",
          "nicotine",
          "bugs"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🫁🚗",
      "title": "红细胞抢座赛：一氧化碳 vs 氧气",
      "sub": "看看烟雾里的一氧化碳有多霸道",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🫁🚨",
      "msg": "氧气被挤下车啦！烟草不完全燃烧产生的一氧化碳(CO)，跟红细胞血红蛋白的结合力比氧气(O₂)强整整240倍！它霸占着运氧小火车不下来，全身器官就会缺氧！",
      "bi": {
        "en": "Say no to smoke and keep your lungs fresh and pink!",
        "zh": "对烟雾说不，让肺泡保持清新粉嫩！",
        "kw": [
          "smoke",
          "lungs",
          "fresh"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么我们不仅自己长大不吸烟，在室内看到有人抽烟也要礼貌远离或请他去室外？",
      "a": "因为飘在空气里的『二手烟』和残留在衣物家具上的『三手烟』同样含有一氧化碳、尼古丁和焦油，会伤害小朋友发育中的肺泡！",
      "b": "因为烟味会把墙壁熏成蓝色",
      "ans": "a",
      "explain": "完全正确！做家里的『无烟环境小宣传员』，帮爸爸爷爷戒烟，就是守护全家人的心肺健康！"
    }
  },
  "ch8-02": {
    "exp1": {
      "icon": "🌿🎯",
      "title": "测试『莽草酸通路』靶向选择性",
      "sub": "为什么有些除草剂只除草、不伤动物细胞？",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🌾🎯",
      "msg": "靶向生物化学！植物制造色氨酸等芳香族氨基酸必须经过一条叫『莽草酸途径』的流水线，而人类和动物身体里根本没有这条流水线（我们靠吃饭获取）！所以抑制这条酶通路就能精准除杂草！",
      "bi": {
        "en": "Smart herbicides target enzymes that only plants have!",
        "zh": "聪明的除草剂专门瞄准只有植物才有的酶！",
        "kw": [
          "herbicides",
          "target",
          "plants"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐕🪧",
      "title": "公园草坪看到『刚喷药养护中』告示牌",
      "sub": "遛狗和野餐时的安全守则",
      "tone": "amber",
      "sfx": "bonk",
      "badge": "🪧⚠️",
      "msg": "绕行大拇指！刚喷洒过园林药剂的草坪上，药液还没干透降解，这时候千万别在草地上打滚，也要牵好小狗别让它去啃草或舔脚掌！",
      "bi": {
        "en": "Stay off the grass when you see a spray warning sign!",
        "zh": "看到喷药警示牌时，请不要进入草坪！",
        "kw": [
          "Stay",
          "grass",
          "sign"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：从超市买回来的新鲜草莓、生菜和苹果，吃之前怎么做就能轻松去除表面可能残留的微量农用助剂？",
      "a": "在流动的清水中冲洗30秒以上（可配合果蔬清洗或削皮），既洗掉灰尘又洗掉水溶性残留！",
      "b": "对着苹果吹三口气",
      "ans": "a",
      "explain": "生活小能手！流动清水搓洗是去除果蔬表面微尘与残留最简单有效的方法！"
    }
  },
  "ch8-03": {
    "exp1": {
      "icon": "🧴🚨",
      "title": "高危化学测试：84消毒液 + 洁厕灵",
      "sub": "家庭卫生间绝对禁止的混用实验",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🧼🚨",
      "msg": "嘟嘟嘟——毒气警报！84消毒液的主要成分是『次氯酸钠(NaClO)』，洁厕灵的主要成分是『盐酸(HCl)』；两者一倒在一起，瞬间发生氧化还原反应冒出刺鼻的黄绿色剧毒『氯气(Cl₂↑)』！",
      "bi": {
        "en": "Never mix bleach with toilet cleaner at home!",
        "zh": "在家里千万别把84消毒液和洁厕灵混在一起用！",
        "kw": [
          "Never",
          "mix",
          "bleach"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍄🛡️",
      "title": "农业杀菌剂保护麦穗不长霉菌毒素",
      "sub": "其实发霉粮食里的天然黄曲霉毒素更毒！",
      "tone": "green",
      "sfx": "chime",
      "badge": "🌾🛡️",
      "msg": "辩证科学视角：如果不保护庄稼和花生，霉菌长出来的天然『黄曲霉毒素』和『麦角毒素』毒性比人工杀菌剂猛烈成千上万倍！科学规范使用低毒杀菌剂正是为了保护粮食安全！",
      "bi": {
        "en": "Clean dry grain keeps dangerous mold toxins away!",
        "zh": "干净干燥的粮食能远离危险的霉菌毒素！",
        "kw": [
          "Clean",
          "grain",
          "mold"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：如果发现家里有一颗花生或玉米发霉变苦了，应该怎么办？",
      "a": "立刻吐掉并把同一包受潮发霉的坚果丢弃，因为发霉产生的黄曲霉毒素连200°C高温都煮不死！",
      "b": "放在微波炉里转一圈继续吃",
      "ans": "a",
      "explain": "完全正确！记住两条家庭黄金化学法则：①84消毒液绝不混洁厕灵；②发霉变苦的花生坚果一颗都不吃！"
    }
  },
  "ch8-04": {
    "exp1": {
      "icon": "🌼🦟",
      "title": "从白色『除虫菊花』提取仿生驱蚊分子",
      "sub": "电蚊香液里的拟除虫菊酯从哪来",
      "tone": "green",
      "sfx": "chime",
      "badge": "🦟🌼",
      "msg": "向植物学艺！科学家发现菊科小白花『除虫菊』能合成天然除虫菊素，于是模仿它的结构造出更稳定的『拟除虫菊酯』，专门卡住蚊子神经的钠离子通道！",
      "bi": {
        "en": "Mosquito repellent was inspired by daisy flowers!",
        "zh": "驱蚊液的灵感来自美丽的除虫菊小花！",
        "kw": [
          "Mosquito",
          "inspired",
          "flowers"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🐱🐠",
      "title": "物种代谢酶比拼：人类小狗 vs 小猫金鱼",
      "sub": "为什么点蚊香要远离小猫和鱼缸？",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🐱🚨",
      "msg": "宠物安全大揭秘！人类和狗狗肝脏里有充足的酯酶，能飞快把拟除虫菊酯剪碎排出；但『小猫咪』肝脏天生缺少葡萄糖醛酸转移酶，『鱼类』更是极易吸收中毒！所以养猫家庭选驱蚊产品要避开高浓菊酯，喷杀虫剂时一定要盖好鱼缸！",
      "bi": {
        "en": "Keep mosquito sprays away from pet cats and fish tanks!",
        "zh": "让杀虫喷雾远离家里的宠物猫咪和鱼缸！",
        "kw": [
          "sprays",
          "cats",
          "fish"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：家里同时养了小狗和小猫咪，能把狗狗专用的大剂量除虫菊酯驱虫滴剂直接滴在小猫脖子上吗？",
      "a": "绝对不能！猫咪缺乏分解拟除虫菊酯的肝脏酶，错用狗狗滴剂会让小猫严重神经中毒！",
      "b": "可以，猫狗都是一家人",
      "ans": "a",
      "explain": "你真是小猫咪的救命恩人！不同物种的肝脏代谢酶工具箱不同（就像小狗不能吃巧克力、小猫不能碰高浓菊酯一样），科学养宠太重要啦！"
    }
  },
  "ch8-05": {
    "exp1": {
      "icon": "🕊️🌍",
      "title": "点亮全球193国《禁止化学武器公约》",
      "sub": "OPCW 荣获2013年诺贝尔和平奖",
      "tone": "green",
      "sfx": "chime",
      "badge": "🕊️🌍",
      "msg": "和平之盾点亮！全世界几乎所有国家共同签署并销毁历史遗留化学武器，监督全球化工厂只生产治病救人的医药、化肥和环保新材料！",
      "bi": {
        "en": "Chemistry is for healing lives and protecting peace!",
        "zh": "化学的使命是治愈生命与守护和平！",
        "kw": [
          "Chemistry",
          "healing",
          "peace"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🧬🌱",
      "title": "同一元素的两面：氮气变化肥养活地球",
      "sub": "科学家的选择决定分子的使命",
      "tone": "teal",
      "sfx": "chime",
      "badge": "🌾✨",
      "msg": "原子的力量！同样的化学合成技术，当科学家用来把空气里的氮气变成农业化肥、把植物生物碱变成手术室良药时，就养活并拯救了地球上数十亿人口！",
      "bi": {
        "en": "Scientists use molecules to make the world better!",
        "zh": "科学家用分子让世界变得更美好！",
        "kw": [
          "Scientists",
          "molecules",
          "better"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：斋藤胜裕教授在《致命毒物大百科》里写下化学篇的核心愿望是什么？",
      "a": "希望小朋友从小懂得分子的科学原理，长大后用生物化学去治愈疾病、保护地球生态环境！",
      "b": "让大家背诵枯燥的字典",
      "ans": "a",
      "explain": "完全正确！懂得毒物的原理，我们才不会盲目害怕，而是成为驾驭分子、化毒为药的小科学家！"
    }
  },
  "ch8-06": {
    "exp1": {
      "icon": "🦠♻️",
      "title": "投放『吃塑料超级细菌酶 PETase』",
      "sub": "看2016年科学家发现的塑料分解酶",
      "tone": "green",
      "sfx": "chime",
      "badge": "🦠♻️",
      "msg": "塑料分子链被剪开啦！科学家发现了一种叫 Ideonella sakaiensis 的细菌，它演化出了『PET水解酶(PETase)』，能像剪刀一样把饮料瓶塑料剪回原本的小分子单体循环再生！",
      "bi": {
        "en": "Special bacterial enzymes can recycle plastic bottles!",
        "zh": "特殊的细菌酶可以分解回收塑料瓶！",
        "kw": [
          "bacterial",
          "enzymes",
          "plastic"
        ],
        "pos": "end"
      }
    },
    "exp2": {
      "icon": "🍱🔥",
      "title": "测试：塑料外卖盒直接进微波炉高温加热",
      "sub": "日常生活如何减少摄入微塑料",
      "tone": "rose",
      "sfx": "bonk",
      "badge": "🍱⚠️",
      "msg": "快停下！把普通一次性塑料袋或非微波专用塑料盒直接高温加热，或是用塑料杯装滚烫开水，会让成百上千万颗微米/纳米塑料颗粒脱落进食物里！换用陶瓷碗或玻璃杯加热最健康！",
      "bi": {
        "en": "Use glass or ceramic bowls when heating hot food!",
        "zh": "加热滚烫食物时请使用玻璃或陶瓷碗！",
        "kw": [
          "glass",
          "ceramic",
          "hot"
        ],
        "pos": "end"
      }
    },
    "quiz": {
      "q": "🤔 考考小馆长：为什么大海里的微塑料颗粒不仅自己难消化，还会成为海洋污染物的『顺风车』？",
      "a": "因为微塑料表面疏水亲油，像小海绵一样把海水里的油溶性污染物吸在身上，顺着小鱼吃虾米进入食物链！",
      "b": "因为微塑料长着小螺旋桨",
      "ans": "a",
      "explain": "全书通关大满贯！少用一次性塑料吸管、出门带自己的水杯，也许未来设计出下一代『超级环保分解酶』的科学家就是你哦！"
    }
  }
};
