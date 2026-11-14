#!/usr/bin/env python3
"""
生成《奇妙毒物科学游乐园》全书 99 种毒物专属「攻击猎物 / 施放毒素」短视频 (assets/videos/<id>.mp4)
特点：
  - 每个视频约 5.0 秒 (24fps, 640x380 H.264 MP4 + AAC 音效轨)，短小精悍、秒开播放
  - 左侧：高清实拍真身动态特写（随攻击蓄力、突进、震动、发光）
  - 右侧主舞台：10 大类定制 2D 动态矢量施毒动画（毒牙扑咬注射、毒针刺击、超高速鱼叉弹射、
    背鳍毒棘穿刺、万箭齐发针晶/毒毛、警戒闪光毒衣反击、神经通道堵门/卡门、细胞工厂锁死、
    代谢酶工位劫持、矿物晶格灼烧毒雾/辐射粒子）
  - 底部：三阶段实时战术动作字幕（蓄力锁定 -> 施毒瞬间 -> 靶点生效）
"""

import json
import math
import multiprocessing as mp
import os
import pathlib
import re
import struct
import subprocess
import tempfile
import wave
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PROJECT_DIR = pathlib.Path("/Users/mac/projects/毒物大百科")
PHOTOS_DIR = PROJECT_DIR / "assets/photos"
OUT_DIR = PROJECT_DIR / "assets/videos"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 640, 380
FPS = 24
DURATION = 5.0
TOTAL_FRAMES = int(FPS * DURATION)


def load_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size=size, index=0)
            except Exception:
                pass
    return ImageFont.load_default()


# 为 99 张卡片定制施毒动作模式与三阶段解说文案
# mode: fang_strike | stinger_jab | harpoon_shoot | spine_pierce | needle_barrage |
#       skin_shield | neuro_gate_lock | cell_factory_halt | enzyme_hijack | mineral_vapor
ACTION_SPECS = {
    # 序章
    "ch0-01": ("neuro_gate_lock", "分子卡死细胞齿轮", "生命细胞锁孔", (244, 114, 182),
               "1. 外源化学分子进入体液循环", "2. 分子形状刚好卡进细胞受体锁孔！", "3. 细胞机器齿轮卡停，产生中毒反应"),
    "ch0-02": ("enzyme_hijack", "剂量浓度决定毒性", "血液分子浓度", (56, 189, 248),
               "1. 同样毫克数毒素进入不同体重生物", "2. 小鼠体内高浓度分子瞬间占满靶点！", "3. 按每千克体重(LD50)衡量真实毒力"),
    "ch0-03": ("fang_strike", "主动毒牙 vs 被动防身", "血管与消化道", (192, 132, 252),
               "1. 毒液动物亮出空心毒牙与毒刺", "2. 大分子蛋白直接注入猎物血管！", "3. 植物小分子则藏在叶茎防动物啃食"),
    "ch0-04": ("neuro_gate_lock", "微克控量·化毒为药", "病变失控细胞", (74, 222, 128),
               "1. 将剧毒分子剂量精准缩小上千倍", "2. 像精准钥匙一样温和按住失控受体！", "3. 剧毒分子摇身变为医院靶向救命药"),

    # 第1章 动物篇
    "ch1-01": ("stinger_jab", "后脚踝空心毒距刺击", "痛觉神经元", (56, 189, 248),
               "1. 雄性鸭嘴兽抬起后脚踝空心角质毒刺", "2. 猛力夹击刺入！注射80多种活性多肽", "3. 直接激活痛觉神经通道，触发剧痛"),
    "ch1-02": ("skin_shield", "举手舔胳膊·双组分合体", "天敌口腔与免疫", (251, 191, 36),
               "1. 懒猴举起双手舔胳膊内侧肱腺油", "2. 腺体分泌物与唾液混合激活成毒液！", "3. 涂满齿冠咬击敌人，引发剧烈过敏"),
    "ch1-03": ("skin_shield", "毒羽毛与毒皮反击", "捕食者钠通道", (251, 113, 133),
               "1. 啄食毒甲虫将树蛙毒素攒入羽毛皮肤", "2. 天敌一咬羽毛，生物碱瞬间渗入口腔！", "3. 强行卡开捕食者钠离子通道将其麻痹"),
    "ch1-04": ("fang_strike", "后沟毒牙+颈腺双武器", "猎物凝血与心脏", (74, 222, 128),
               "1. 嘴里后沟牙咬住青蛙注入出血蛋白酶", "2. 遇天敌时弓起脖子挤出颈腺蟾蜍毒！", "3. 主动毒牙+被动储毒袋双管齐下"),
    "ch1-05": ("fang_strike", "长管牙闪电扑咬注毒", "毛细血管与凝血", (251, 113, 133),
               "1. 尖吻蝮颊窝热成像锁定温血猎物", "2. 长管牙弹出刺入，高压注入金属蛋白酶！", "3. 剪破血管壁并耗光凝血因子"),
    "ch1-06": ("fang_strike", "三指神经毒素封锁", "肌肉乙酰胆碱受体", (56, 189, 248),
               "1. 眼镜王蛇昂首锁定猎物闪电扑咬", "2. 毒牙注入『三指毒素』多肽军团！", "3. 精准抢占肌肉信使座位，阻断呼吸运动"),
    "ch1-07": ("fang_strike", "突触前神经阻断连击", "神经末梢与凝血", (251, 191, 36),
               "1. 内陆太攀蛇荒漠极速连咬荒漠鼠", "2. 注入太攀蛇毒素切断神经信号释放！", "3. 猎物数秒内麻痹失去反咬能力"),
    "ch1-08": ("fang_strike", "响尾警告+磷脂酶攻击", "红细胞磷脂双分子层", (251, 113, 133),
               "1. 尾尖角质环每秒50次高频振动警告", "2. 管牙瞬时出击注入磷脂酶A2毒液！", "3. 剪碎红细胞与肌肉细胞外膜"),
    "ch1-09": ("skin_shield", "皮肤分泌树蛙毒素", "天敌电压门控钠通道", (250, 204, 21),
               "1. 捕食雨林毒蚁将生物碱运至皮肤毒腺", "2. 捕食者刚咬住，皮肤立刻飙出毒液！", "3. 像木楔子死死撑开天敌钠离子城门"),
    "ch1-10": ("fang_strike", "螯肢注入打孔毒素", "神经末梢钙通道", (251, 113, 133),
               "1. 红背蜘蛛螯肢咬穿猎物外壳", "2. α-黑寡妇毒素在神经末梢膜上打孔！", "3. 钙离子涌入逼迫神经元倒空全部信号"),
    "ch1-11": ("fang_strike", "鞘磷脂酶D剪除脂质", "皮肤细胞膜外墙", (192, 132, 252),
               "1. 红平甲蛛受压自卫咬注毒液", "2. 鞘磷脂酶D剪掉细胞膜外层脂质头！", "3. 触发局部强烈免疫炎症与组织损伤"),
    "ch1-12": ("needle_barrage", "后腿踢飞倒刺毒刚毛", "天敌眼睛与鼻黏膜", (251, 191, 36),
               "1. 塔兰托毒蛛高举前肢威胁警告", "2. 后腿飞快刷腹部，踢出万根倒刺刚毛！", "3. 微观倒钩毒毛刺入天敌眼鼻使其落荒而逃"),
    "ch1-13": ("fang_strike", "蛛网缠绕+JSTX麻痹", "昆虫谷氨酸神经受体", (56, 189, 248),
               "1. 飞虫撞上金色蛛网被丝线捆绑", "2. 棒络新妇冲上前咬注JSTX多胺毒素！", "3. 精准锁死昆虫谷氨酸受体令飞虫瞬间麻痹"),

    # 第2章 昆虫篇
    "ch2-01": ("stinger_jab", "光滑毒针连续刺击", "痛觉神经与肥大细胞", (251, 113, 133),
               "1. 胡蜂亮出尾部光滑无倒钩的长毒针", "2. 连续多次刺入！注入激肽与磷脂酶鸡尾酒", "3. 激活剧痛并诱发肥大细胞释放组胺风暴"),
    "ch2-02": ("stinger_jab", "倒钩毒针+蜂毒肽打孔", "真皮层细胞膜", (250, 204, 21),
               "1. 蜜蜂保卫蜂巢刺入带倒钩的毒针", "2. 留存的毒囊持续收缩泵入『蜂毒肽』！", "3. 两亲性蜂毒肽在细胞膜上钻出漏水圆孔"),
    "ch2-03": ("stinger_jab", "马蜂激肽瞬时致痛", "外周痛觉感受器", (251, 191, 36),
               "1. 护巢马蜂俯冲刺出尾端毒针", "2. 注入高浓度血清素、组胺与马蜂激肽！", "3. 瞬间拉响痛觉神经警报吓退入侵者"),
    "ch2-04": ("needle_barrage", "挺胸弹出蓝黑毒针毛", "捕食鸟类与皮肤", (192, 132, 252),
               "1. 伪装枯叶的幼虫遇袭突然弯曲挺胸", "2. 胸背裂缝翻出两簇尖锐中空毒刚毛！", "3. 毒毛扎入敌人皮肤释放发炎蛋白"),
    "ch2-05": ("stinger_jab", "尾钩凌空毒刺注入", "钠钾通道与肿瘤靶点", (250, 204, 21),
               "1. 以色列金蝎双钳固定猎物，高举尾刺", "2. 尾端毒腺闪电刺入，注入紧凑神经多肽！", "3. 麻痹猎物神经（其氯毒素还能点亮脑肿瘤）"),
    "ch2-06": ("needle_barrage", "数十万微米毒毛飘散", "接触皮肤表皮层", (251, 113, 133),
               "1. 毒蛾幼虫体表布满0.1毫米中空毒针毛", "2. 随风飘落或触碰时成百上千根微毛扎入！", "3. 管内组胺与蛋白酶流出引起红肿奇痒"),
    "ch2-07": ("needle_barrage", "玻璃安瓿毒刺脆断注液", "皮肤痛觉神经末梢", (74, 222, 128),
               "1. 荧光绿刺蛾浑身竖起带毒液泡的尖刺", "2. 一触即断！刺尖像微型玻璃管扎入皮肤", "3. 毒囊压力将酸辣毒液注入真皮层"),
    "ch2-08": ("stinger_jab", "第一对步足毒颚钳咬", "猎物心肌钾离子通道", (251, 113, 133),
               "1. 蜈蚣闪电冲刺，张开第一对变形大毒颚", "2. 双钩钳穿猎物注入Ssm钾通道阻滞肽！", "3. 猎物血管与肌肉瞬间痉挛丧失反抗力"),
    "ch2-09": ("stinger_jab", "15对长腿极速扑咬害虫", "蟑螂与白蚁神经节", (56, 189, 248),
               "1. 大蚰蜒在暗夜以每秒40厘米高速追上蟑螂", "2. 细小颚足精准刺穿蟑螂关节膜注入麻痹肽！", "3. 瞬间制服家庭害虫（对人类温和无害）"),
    "ch2-10": ("skin_shield", "腿关节反射流血起泡", "表皮细胞连接蛋白", (250, 204, 21),
               "1. 短翅芫菁受惊立刻收腿假死不动", "2. 腿关节主动渗出含『斑蝥素』的黄色液滴！", "3. 关掉表皮细胞粘连开关，令皮肤鼓起水泡"),

    # 第3章 植物篇
    "ch3-01": ("neuro_gate_lock", "乌头碱死死撑开钠通道", "心肌与神经钠通道", (192, 132, 252),
               "1. 乌头全株与块根暗藏高浓度二萜乌头碱", "2. 乌头碱钻进钠离子通道内部当『木楔子』！", "3. 城门卡在常开状态，钠离子狂涌扰乱心跳"),
    "ch3-02": ("neuro_gate_lock", "马桑内酯拔掉大脑刹车", "中枢GABA抑制受体", (251, 113, 133),
               "1. 甜味假果实里藏着倍半萜马桑内酯", "2. 分子穿过血脑屏障堵死GABA刹车通道！", "3. 失去刹车的神经元过度放电引发惊厥"),
    "ch3-03": ("neuro_gate_lock", "三键长矛封锁抑制通道", "中枢神经GABA通道", (74, 222, 128),
               "1. 竹节空腔根茎流出黄色油状毒芹素", "2. 刚性三键碳链分子直奔中枢神经受体！", "3. 封锁抑制性氯离子通道导致神经风暴"),
    "ch3-04": ("neuro_gate_lock", "毒参碱切断神经肌肉接头", "运动神经烟碱受体", (56, 189, 248),
               "1. 紫斑空心茎与果实释放哌啶类毒参碱", "2. 毒参碱拦截运动神经传向肌肉的信使！", "3. 从下肢向上逐渐阻断肌肉收缩信号"),
    "ch3-05": ("needle_barrage", "吸水弹射草酸钙显微针晶", "口腔与舌头黏膜", (251, 113, 133),
               "1. 天南星细胞被咬破，针晶囊接触唾液水分", "2. 囊内胶质瞬间膨胀，万根草酸钙微针齐射！", "3. 微针扎穿黏膜并送入刺激蛋白引发火辣肿痛"),
    "ch3-06": ("enzyme_hijack", "强心苷按住心肌钠钾泵", "心肌细胞膜钠钾泵", (244, 114, 182),
               "1. 毛地黄叶片释放甾体强心苷分子", "2. 精准结合并抑制心肌细胞膜上的钠钾泵！", "3. 改变胞内钙离子浓度（微量强心，过量乱跳）"),
    "ch3-07": ("neuro_gate_lock", "莨菪碱遮挡副交感受体", "M型乙酰胆碱受体", (56, 189, 248),
               "1. 欧莨菪根茎释放阿托品与东莨菪碱", "2. 分子像盾牌一样盖住M型乙酰胆碱受体！", "3. 阻断副交感信号（医用可散瞳与抢救中毒）"),
    "ch3-08": ("neuro_gate_lock", "东莨菪碱跨过血脑屏障", "中枢胆碱能突触", (250, 204, 21),
               "1. 洋金花喇叭花与刺果释放东莨菪碱", "2. 脂溶性小分子穿过血脑屏障拦截神经信使！", "3. 抑制中枢与呕吐反射（微克级可制防晕贴）"),
    "ch3-09": ("cell_factory_halt", "石蒜碱卡住核糖体与催吐", "细胞核糖体与呕吐中枢", (192, 132, 252),
               "1. 酷似小葱的葱莲叶与鳞茎释放石蒜碱", "2. 石蒜碱卡住细胞核糖体翻译蛋白质齿轮！", "3. 同时强烈激活延髓化学感受区引发呕吐"),
    "ch3-10": ("needle_barrage", "针晶刺伤+石蒜碱双防线", "消化道黏膜与胆碱酯酶", (250, 204, 21),
               "1. 水仙鳞茎汁液射出草酸钙针晶刺痛口腔", "2. 石蒜碱引发强烈催吐阻止动物继续吞食！", "3. 所含加兰他敏经提纯可护脑留住记忆"),
    "ch3-11": ("cell_factory_halt", "秋水仙碱拆掉微管铁轨", "细胞微管蛋白轨道", (192, 132, 252),
               "1. 秋水仙碱潜入正在分裂或移动的细胞", "2. 抱住微管蛋白单体，阻止它们拼成铁轨！", "3. 细胞分裂停摆（可育无籽西瓜及止痛风）"),
    "ch3-12": ("cell_factory_halt", "肠道酶剪开苏铁苷释放毒弹", "肝细胞DNA双螺旋", (251, 113, 133),
               "1. 鲜红铁树种子里的苏铁苷进入消化道", "2. 肠道菌糖苷酶剪掉糖帽，激活甲基偶氮甲醇！", "3. 活性分子攻击肝细胞核酸与蛋白质"),
    "ch3-13": ("enzyme_hijack", "绣球花苷刺激肠胃受体", "消化道黏膜感受器", (56, 189, 248),
               "1. 吸收土壤铝离子变蓝的绣球花叶含常山碱类", "2. 误食后分子强烈刺激胃肠迷走神经末梢！", "3. 触发保护性剧烈呕吐与腹痛反应"),
    "ch3-14": ("neuro_gate_lock", "木藜芦毒素扒开钠通道", "心肌与迷走神经通道", (251, 113, 133),
               "1. 毒杜鹃花蜜中的木藜芦毒素进入体液", "2. 结合在钠离子通道内侧阻止通道关闭！", "3. 引起持续去极化，导致眩晕与心率减慢"),
    "ch3-15": ("enzyme_hijack", "30种铃兰强心苷锁钠钾泵", "心肌细胞钠钾ATP酶", (250, 204, 21),
               "1. 铃兰全株及花瓶水溶出高活性铃兰毒苷", "2. 强力结合心肌细胞膜上的钠钾泵工位！", "3. 扰乱心肌钙钠离子平衡与心律电信号"),
    "ch3-16": ("neuro_gate_lock", "钩吻素封锁脊髓甘氨酸受体", "脊髓运动神经元", (251, 191, 36),
               "1. 断肠草吲哚生物碱钩吻素进入神经系统", "2. 抢占脊髓运动神经元的甘氨酸抑制受体！", "3. 阻断呼吸肌神经指令传递"),
    "ch3-17": ("enzyme_hijack", "白色乳汁欧夹竹桃苷防卫", "心肌钠钾泵工位", (244, 114, 182),
               "1. 折断夹竹桃枝叶流出含欧夹竹桃苷乳汁", "2. 脂溶性强心苷快速穿过黏膜锁定钠钾泵！", "3. 苦味与强心毒性共同构成防虫防啃护盾"),
    "ch3-18": ("cell_factory_halt", "AB双特工：B链开门A链剪RNA", "细胞核糖体28S rRNA", (251, 113, 133),
               "1. 蓖麻毒蛋白B链抓住细胞表面半乳糖开门", "2. A链潜入胞内，每分钟剪断1500个核糖体！", "3. 蛋白质合成工厂彻底停工（榨油可分离灭活）"),
    "ch3-19": ("cell_factory_halt", "商陆皂苷像洗洁精溶膜", "胃肠道上皮细胞膜", (192, 132, 252),
               "1. 紫黑商陆浆果破裂释放高浓度商陆皂苷", "2. 皂苷两亲分子插入胃肠黏膜脂质双分子层！", "3. 像洗洁精起泡一样破坏细胞膜完整性"),
    "ch3-20": ("needle_barrage", "海芋茎汁弹射成束晶针", "皮肤与口腔黏膜细胞", (74, 222, 128),
               "1. 尖尾芋叶尖滴水与折断茎汁含针晶囊", "2. 接触黏膜瞬间射出成束不溶性草酸钙长针！", "3. 物理微孔配合海芋素引发剧烈麻痛肿胀"),

    # 第4章 蔬菜篇
    "ch4-01": ("cell_factory_halt", "绿皮芽眼龙葵碱打孔+抑酶", "胃肠细胞膜胆固醇", (74, 222, 128),
               "1. 土豆受光照变绿发芽，紧急合成α-龙葵碱", "2. 龙葵碱抓住细胞膜上的胆固醇拼成漏水孔！", "3. 同时抑制胆碱酯酶，引发舌麻与胃肠剧痛"),
    "ch4-02": ("cell_factory_halt", "四聚体凝集素胶水粘红细胞", "肠绒毛与红细胞糖链", (251, 113, 133),
               "1. 未焖熟四季豆释放大分子『植物血球凝集素』", "2. 四只抓手抓住肠壁细胞与红细胞糖链粘成团！", "3. 引发呕吐（但100°C沸水彻底煮熟即散架变营养）"),
    "ch4-03": ("cell_factory_halt", "返祖葫芦素触发苦味警报", "苦味受体与肠壁细胞", (250, 204, 21),
               "1. 变异苦西葫芦合成耐高温四环三萜葫芦素", "2. 极苦分子第一时间拉响舌尖苦味味蕾警报！", "3. 若吞入则破坏细胞微丝骨架与毛细血管"),
    "ch4-04": ("cell_factory_halt", "葫芦素D/E破坏细胞骨架", "消化道上皮与微血管", (251, 191, 36),
               "1. 串粉或干旱导致苦瓠瓜合成剧毒葫芦素", "2. 耐沸水小分子直接攻击胃肠黏膜上皮细胞！", "3. 记住铁律：发苦的瓜类一口吐掉整盘倒掉"),
    "ch4-05": ("enzyme_hijack", "成熟黑种子藏黄麻强心苷", "捕食者心肌钠钾泵", (74, 222, 128),
               "1. 长蒴黄麻嫩叶无毒美味，结荚后种子造毒", "2. 黑色种子中的黄麻苷精准锁住心肌钠钾泵！", "3. 保护下一代种子不被鸟兽嚼碎吞食"),
    "ch4-06": ("enzyme_hijack", "冒牌维生素B6抢占大脑工位", "大脑GABA合成辅酶位", (250, 204, 21),
               "1. 银杏果中的MPN分子伪装成双胞胎维生素B6", "2. 抢占大脑谷氨酸脱羧酶工位却不干活！", "3. 大脑造不出刹车信使GABA（真维生素B6可解救）"),

    # 第5章 蘑菇篇
    "ch5-01": ("cell_factory_halt", "8字双环铁锁卡死RNA聚合酶", "肝细胞RNA聚合酶II", (251, 113, 133),
               "1. 白鹅膏释放煮不烂的『α-鹅膏毒肽』双环八肽", "2. 顺着转运通道钻入肝细胞核内部！", "3. 像8字铁锁死死卡住RNA聚合酶II，令蛋白停产"),
    "ch5-02": ("cell_factory_halt", "4碳三元张力环溶解肌细胞", "横纹肌细胞膜与线粒体", (251, 113, 133),
               "1. 亚稀褶黑菇释放超迷你4碳『环丙-2-烯羧酸』", "2. 高张力三元小环分子在肌细胞内引爆损伤！", "3. 导致横纹肌溶解（切开菌肉先变红是其标志）"),
    "ch5-03": ("cell_factory_halt", "接触皮肤即锁死核糖体", "表皮与全身细胞核糖体", (251, 113, 133),
               "1. 鲜红火焰茸汁液含高活性单端孢霉烯毒素", "2. 哪怕手指触碰汁液也会穿透皮肤屏障！", "3. 强行锁死真核细胞核糖体转肽酶引起脱皮炎症"),
    "ch5-04": ("neuro_gate_lock", "冒充大脑快乐信使血清素", "大脑视觉皮层5-HT受体", (192, 132, 252),
               "1. 大孢花褶伞吲哚生物碱进入中枢神经", "2. 酷似5-羟色胺的分子乱按大脑5-HT2A开关！", "3. 导致视觉信号与时间空间感知彻底错乱"),
    "ch5-05": ("neuro_gate_lock", "扰乱面部表情与情绪神经回路", "中枢情绪与运动神经", (250, 204, 21),
               "1. 红褐斑褶菇释放5-羟色胺类似物毒素", "2. 劫持控制面部表情肌与情绪的神经突触！", "3. 引发不由自主的怪笑抽动与剧烈眩晕"),
    "ch5-06": ("neuro_gate_lock", "脱磷酸变身激活脑受体", "中枢神经5-HT2A受体", (56, 189, 248),
               "1. 菌体受伤氧化变蓝，体内含赛洛西宾前体", "2. 进入体内脱去磷酸基团变成高活性分子！", "3. 强烈干扰大脑皮层神经信号传递"),
    "ch5-07": ("cell_factory_halt", "暗夜发绿光+隐杯伞素伤DNA", "昆虫复眼与肠壁细胞DNA", (74, 222, 128),
               "1. 夜晚荧光素酶发光吸引小虫传播孢子", "2. 若误食，倍半萜环丙烷『隐杯伞素S』出击！", "3. 烷基化锁住细胞DNA链（经改造可研发抗癌药）"),
    "ch5-08": ("neuro_gate_lock", "毒蕈碱死死按住流汗开关", "副交感神经M受体", (251, 191, 36),
               "1. 酷似普通口蘑的褐盖粉褶菌释放毒蕈碱", "2. 毒蕈碱牢牢结合副交感神经M型乙酰胆碱受体！", "3. 胆碱酯酶拆不掉它，引发大汗淋漓与腹痛"),
    "ch5-09": ("cell_factory_halt", "面粉清香下的三萜皂苷攻击", "胃肠道黏膜上皮层", (192, 132, 252),
               "1. 褐黑口蘑散发面粉清香掩护体内三萜毒素", "2. 三萜皂苷分子猛烈刺激并损伤消化道壁！", "3. 证明闻着香、虫子吃的野蘑菇照样有毒"),
    "ch5-10": ("neuro_gate_lock", "粘盖毒蕈碱持续激动神经", "平滑肌与腺体M受体", (56, 189, 248),
               "1. 雨后滑溜溜的粘盖拟近香蘑释放胆碱能毒素", "2. 持续按住腺体与肠道平滑肌开关不放手！", "3. 引发流涎流泪与胃肠痉挛（医院可用阿托品解救）"),
    "ch5-11": ("cell_factory_halt", "腐木小黄菇暗藏同款双环八肽", "肝细胞RNA聚合酶II", (251, 113, 133),
               "1. 酷似野生金针菇的簇生盔孢伞含鹅膏毒肽", "2. 同款8字双环八肽潜入肝细胞核内部！", "3. 卡死RNA聚合酶II，证明不同科毒菌也有同款配方"),
    "ch5-12": ("neuro_gate_lock", "韧伞三萜苦味素阻断钙通道", "胃肠黏膜与神经钙通道", (250, 204, 21),
               "1. 树桩硫磺色菌簇含奇苦的四环三萜韧伞素", "2. 耐高温苦味毒素刺激肠壁并阻断钙离子通道！", "3. 引发剧烈呕吐与神经传导受阻"),
    "ch5-13": ("cell_factory_halt", "三元氮杂环氨基酸损伤胶质细胞", "大脑少突胶质细胞", (56, 189, 248),
               "1. 纯白扇贝状菌体藏着奇异三元含氮小环氨基酸", "2. 尤其在肾功能较弱时积聚并穿过血脑屏障！", "3. 特异性损伤包裹神经纤维的少突胶质细胞"),
    "ch5-14": ("enzyme_hijack", "鬼伞素给肝脏解酒2号酶上锁", "肝脏乙醛脱氢酶(ALDH2)", (192, 132, 252),
               "1. 墨汁鬼伞中的鬼伞素进入肝脏代谢转化为活性物", "2. 死死抱住解酒2号工人『乙醛脱氢酶』的硫原子！", "3. 一旦喝酒，有毒乙醛排不出导致满脸通红心跳加速"),

    # 第6章 水中生物篇
    "ch6-01": ("neuro_gate_lock", "TTX正电软木塞堵死钠通道", "神经电压门控钠通道外口", (56, 189, 248),
               "1. 河鲀受惊鼓成气球，体内含海洋菌造的TTX", "2. TTX头顶正电胍基伪装成钠离子钻进通道口！", "3. 胖笼状身体卡在门框上，把钠通道100%堵死"),
    "ch6-02": ("skin_shield", "皮肤黏液TTX麻翻捕食大鱼", "大鱼口腔神经钠通道", (56, 189, 248),
               "1. 云斑裸颊虾虎鱼在全身皮肤黏液涂满河鲀毒素", "2. 凶猛大鱼刚一口咬住它，嘴唇立刻发木发麻！", "3. 大鱼吓得赶紧松口吐出，小虾虎鱼毫发无损游走"),
    "ch6-03": ("spine_pierce", "礁石隐身+背鳍毒棘穿刺", "足部血管与痛觉神经", (251, 113, 133),
               "1. 红鳍赤鲉伪装成褐红礁石潜伏海底", "2. 受踩压瞬间竖起背鳍硬棘，皮鞘退缩注毒！", "3. 注入怕热的剧痛蛋白（45°C温热水浸泡可灭活缓解）"),
    "ch6-04": ("spine_pierce", "红白警戒羽扇+血槽毒针反击", "捕食者与触碰者皮肤", (251, 113, 133),
               "1. 龙须狮子鱼展开华丽红白条纹胸鳍发出警告", "2. 13根背鳍毒棘受压时顺着凹槽自动泵出毒液！", "3. 毒棘蛋白与乙酰胆碱引发火烧般剧痛"),
    "ch6-05": ("spine_pierce", "沙底潜伏+双向锯齿尾刺鞭击", "涉水者脚踝组织", (250, 204, 21),
               "1. 赤魟扁平身体埋在浅滩细沙下隐身", "2. 若被踩踏，长尾如鞭子甩起，锯齿尾刺扎入！", "3. 尾刺毒腺释放透明质酸酶（浅滩拖步走可防踩）"),
    "ch6-06": ("cell_factory_halt", "鱼胆鲤醇硫酸酯像去污剂溶膜", "肝细胞与肾小管细胞膜", (74, 222, 128),
               "1. 鲤鱼深绿色苦胆囊内含耐高温『鲤醇硫酸酯钠』", "2. 强力表面活性剂分子直接冲向肝肾细胞膜！", "3. 像强效洗洁精一样溶解细胞膜与线粒体（摘胆吃肉才安全）"),
    "ch6-07": ("harpoon_shoot", "先喷速效胰岛素+再射毒鱼叉", "小鱼血糖与N型钙通道", (56, 189, 248),
               "1. 地纹芋螺先往水里喷出『速效鱼类胰岛素云』", "2. 小鱼低血糖头晕游不动，芋螺闪电射出齿舌鱼叉！", "3. 注入上百种芋螺微肽瞬间麻痹（启发1000倍止痛神药）"),
    "ch6-08": ("skin_shield", "0.3秒闪耀50蓝环+鹦鹉嘴注TTX", "螃蟹与猎物神经钠通道", (56, 189, 248),
               "1. 蓝环章鱼受惊0.3秒拉开色素囊，闪耀50个宝蓝环", "2. 锋利鹦鹉嘴咬穿蟹壳，后唾液腺泵出河鲀毒素！", "3. 将被动TTX化为主动咬注武器瞬间制服猎物"),
    "ch6-09": ("neuro_gate_lock", "双料耐热麻痹毒素封锁通道", "运动神经钠离子通道", (251, 113, 133),
               "1. 花纹爱洁蟹吃毒藻攒下石房蛤毒素STX与TTX", "2. 高温蒸煮不坏的毒素进入体液直扑神经通道！", "3. 双重软木塞严密封死钠离子城门"),
    "ch6-10": ("harpoon_shoot", "数千朵『三爪抓娃娃机』毒叉棘合拢", "触碰者神经与皮肤", (192, 132, 252),
               "1. 喇叭毒棘海胆全身铺满像小花一样的球形叉棘", "2. 一碰触发器，三片带毒牙的颚片咔哒合拢咬住！", "3. 同时注入蛋白毒素Peditoxin麻痹对手"),
    "ch6-11": ("spine_pierce", "30厘米感光黑长刺齐刷刷转向穿刺", "入侵者皮肤组织", (56, 189, 248),
               "1. 刺冠海胆全身感光细胞察觉黑影靠近，长刺齐转向", "2. 中空带倒刺的碳酸钙长棘扎入皮肤并脆断！", "3. 释放紫黑色素与生物胺引起红肿刺痛"),
    "ch6-12": ("harpoon_shoot", "暗夜张开触手+打孔蛋白拼圆环", "小鱼小虾细胞膜鞘磷脂", (244, 114, 182),
               "1. 夜海葵在夜晚伸展60多条布满刺丝囊的触手", "2. 触手射出微针并释放『海葵穿孔蛋白』！", "3. 多个蛋白在猎物细胞膜上拼成圆筒孔洞使其漏水"),
    "ch6-13": ("harpoon_shoot", "150大气压刺丝囊700纳秒5万G弹射", "猎物外壳与红细胞膜", (56, 189, 248),
               "1. 僧帽水母长触手上的刺丝囊攒足150个大气压", "2. 一碰纤毛，微米鱼叉在700纳秒内以5万G射穿目标！", "3. 注入穿孔毒素（被蛰切勿浇淡水，应用海水冲）"),
    "ch6-14": ("harpoon_shoot", "透明方灯笼隐身触手弹射刺丝囊", "泳客皮肤与细胞膜", (251, 113, 133),
               "1. 95%水分的全透明灯水母在海水中隐身漂浮", "2. 四根粉红长触手一擦过皮肤即万针齐发射入毒液！", "3. 穿孔蛋白攻击细胞膜（食醋可锁定未发射刺丝囊）"),
    "ch6-15": ("harpoon_shoot", "24眼视觉锁定+踩胆固醇打孔", "红细胞与心肌电信号", (56, 189, 248),
               "1. 澳洲箱水母用24只眼睛看清猎物主动游动靠近", "2. 触手刺丝囊弹射注入CfTX穿孔毒素！", "3. 踩住细胞膜胆固醇打孔漏出钾离子，扰乱心跳"),
    "ch6-16": ("spine_pierce", "十几条毒刺腕足+海星皂苷溶血", "珊瑚虫与触碰者红细胞", (251, 191, 36),
               "1. 棘冠海星舒展十几条布满长刺的腕足", "2. 毒刺扎入同时释放表面涂满的『海星皂苷』！", "3. 甾体皂苷溶解红细胞膜引发剧烈红肿溶血"),
    "ch6-17": ("fang_strike", "船桨尾极速追击+高浓缩神经毒", "快游海鱼神经肌肉接头", (56, 189, 248),
               "1. 海蛇摆动扁平船桨尾巴在珊瑚礁缝隙闪电出击", "2. 短毒牙注入高浓缩短链α-神经毒素！", "3. 鱼儿在数秒内麻痹，无法逃入珊瑚洞"),
    "ch6-18": ("needle_barrage", "中空钙质玻璃鬃毛断入皮肤", "触碰者皮肤表皮层", (250, 204, 21),
               "1. 海毛虫身体两侧竖起一簇簇银白色空心钙质刚毛", "2. 一碰即断！数百根带倒刺脆毛留在皮肤里", "3. 释放发炎分子『扁虫素』（可用胶带粘毛+白醋软化）"),

    # 第7章 矿物篇
    "ch7-01": ("mineral_vapor", "高温火烧晶格破裂→释放汞蒸气", "人体酶蛋白巯基(-SH)", (251, 113, 133),
               "1. 常温下辰砂(HgS)共价晶格稳固，做颜料千年不褪", "2. 一旦放进火炉灼烧，晶格断裂跑出无色水银蒸气！", "3. 汞原子死死抱住人体酶蛋白的硫原子(-SH)令酶罢工"),
    "ch7-02": ("mineral_vapor", "雌黄灼烧氧化→转化三氧化二砷", "细胞酶与白血病致癌蛋白", (250, 204, 21),
               "1. 金黄层状雌黄(As2S3)在古书黄纸上防虫改错字", "2. 高温空气氧化生成三氧化二砷(As2O3)分子！", "3. 中国科学家将其精准改造成降解白血病融合蛋白的良药"),
    "ch7-03": ("mineral_vapor", "铁锤敲击摩擦→挥发大蒜味砷雾", "呼吸系统与细胞代谢酶", (251, 191, 36),
               "1. 酷似黄金的砷黄铁矿(FeAsS)受到铁锤猛烈敲击", "2. 局部高温使砷元素挥发氧化，冒出大蒜味毒雾！", "3. 野外鉴矿只看外观硬度，绝不猛敲深闻"),
    "ch7-04": ("needle_barrage", "纳米级烧不着的岩石微针飘浮", "肺泡巨噬细胞", (56, 189, 248),
               "1. 石棉矿石劈裂成比头发丝细千倍的坚硬硅酸盐微针", "2. 1000°C烈火也烧不化，微针随粉尘飘入空气！", "3. 若吸入肺泡，巨噬细胞吞不下也溶不掉（现代已禁用）"),
    "ch7-05": ("enzyme_hijack", "铅离子冒充钙锌离子混入造血酶", "造血酶与神经突触钙通道", (192, 132, 252),
               "1. 正方体方铅矿(PbS)若粉尘进入体内释放铅离子(Pb2+)", "2. 带2个正电的铅离子伪装成钙离子(Ca2+)与锌离子！", "3. 抢占造血酶与神经通道工位（勤洗手防铅超关键）"),
    "ch7-06": ("mineral_vapor", "银剑晶簇释放锑离子锁蛋白质巯基", "细胞含硫代谢酶", (56, 189, 248),
               "1. 辉锑矿(Sb2S3)长成银色宝剑晶簇，与砷同属第15族", "2. 若矿粉进入体内，锑离子同样寻找蛋白质硫原子！", "3. 结合巯基干扰酶活性（隔着博物馆玻璃欣赏最安全）"),
    "ch7-07": ("mineral_vapor", "紫外激发霓虹绿光+释放电离粒子", "防辐射铅盒与细胞DNA", (74, 222, 128),
               "1. 钙铀云母中的铀酰离子在紫外灯下发出耀眼霓虹绿光", "2. 原子核衰变持续弹出高速α粒子与β粒子！", "3. 锁进密封有机玻璃与铅盒即可安全阻挡内照射"),
    "ch7-08": ("mineral_vapor", "沥青铀矿原子核衰变释放巨能", "居里夫人提炼钋与镭", (56, 189, 248),
               "1. 晶质铀矿(UO2)内部不断发生天然放射性衰变", "2. 居里夫人从数吨矿渣中成功分离出新元素钋和镭！", "3. 开启现代核医学精准放疗与清洁核电时代"),

    # 第8章 化学篇
    "ch8-01": ("enzyme_hijack", "一氧化碳240倍吸力抢走氧气座位", "红细胞血红蛋白与脑受体", (251, 113, 133),
               "1. 香烟燃烧释放尼古丁（烟草防虫剂）与一氧化碳", "2. 一氧化碳以240倍强吸力霸占红细胞血红蛋白座位！", "3. 氧气被挤得没座坐（远离二手烟守护粉嫩肺泡）"),
    "ch8-02": ("enzyme_hijack", "精准锁住植物独有的莽草酸酶通路", "杂草氨基酸合成酶", (74, 222, 128),
               "1. 选择性除草剂分子进入杂草叶片细胞", "2. 精准卡住只有植物有、动物没有的『莽草酸通路酶』！", "3. 杂草造不出氨基酸枯萎（公园喷药期请勿踩草坪）"),
    "ch8-03": ("mineral_vapor", "84消毒液混洁厕灵→反应冒出毒氯气", "家庭清洁安全红线", (251, 113, 133),
               "1. 次氯酸钠(84消毒液)一旦与盐酸(洁厕灵)倒在一起", "2. 瞬间发生剧烈氧化还原反应，冒出黄绿色氯气(Cl2)！", "3. 记住家庭铁律：两种清洁剂永远单独使用绝不混倒"),
    "ch8-04": ("neuro_gate_lock", "仿生除虫菊酯卡住蚊子钠通道", "蚊虫神经钠通道 vs 猫鱼", (56, 189, 248),
               "1. 源自除虫菊花的『拟除虫菊酯』飘向偷袭的花斑蚊", "2. 精准卡住蚊子神经钠离子通道令蚊子瞬间击倒！", "3. 人类肝脏酶能快速分解它，但要注意远离猫咪和鱼缸"),
    "ch8-05": ("neuro_gate_lock", "全球公约锁死危险化学物·化作和平盾牌", "OPCW全球和平守护", (74, 222, 128),
               "1. 全球193国共同签署《禁止化学武器公约》", "2. 严密锁死并销毁危险制剂，将合成技术用于医药与环保！", "3. 让生物化学永远只做治愈生命、守护地球的科学盾牌"),
    "ch8-06": ("enzyme_hijack", "微塑料吸附污染物 vs 超级酶PETase拆解", "海洋食物链与环保分解酶", (56, 189, 248),
               "1. <5毫米微塑料颗粒在海水中像海绵一样吸附疏水污染物", "2. 科学家派出『吃塑料细菌酶 PETase』精准剪断塑料长链！", "3. 少用一次性塑料，未来等你设计新一代超级环保酶"),
}


def load_catalog_map() -> dict:
    txt = (PROJECT_DIR / "js/data-catalog.js").read_text("utf-8")
    items = {}
    for m in re.finditer(
        r'id:\s*"(?P<id>ch\d-\d{2})".*?code:\s*"(?P<code>[^"]+)".*?name:\s*"(?P<name>[^"]+)".*?emoji:\s*"(?P<emoji>[^"]+)".*?molecule:\s*"(?P<mol>[^"]+)"',
        txt,
        flags=re.S,
    ):
        items[m.group("id")] = {
            "id": m.group("id"),
            "code": m.group("code"),
            "name": m.group("name"),
            "emoji": m.group("emoji"),
            "molecule": m.group("mol"),
        }
    return items


def find_photo_path(cid: str) -> pathlib.Path:
    for ext in (".jpg", ".png", ".jpeg", ".webp"):
        p = PHOTOS_DIR / f"{cid}{ext}"
        if p.exists():
            return p
    return PROJECT_DIR / "assets/scenes/panorama.jpg"


def generate_sfx_wav(wav_path: pathlib.Path, mode: str, seed_num: int):
    """合成与5秒施毒动作完美同步的立体声科学音效轨 (蓄力 -> 突击发射 -> 命中靶点 -> 完成提示)"""
    sr = 24000
    n_samples = int(sr * DURATION)
    buf = []

    base_freq = 220 + (seed_num % 7) * 28

    for i in range(n_samples):
        t = i / sr
        val = 0.0

        # 1) 0.25s - 0.9s: 蓄力扫描音 (rising whoosh)
        if 0.25 <= t < 0.90:
            p = (t - 0.25) / 0.65
            freq = base_freq * (0.8 + 0.9 * p)
            env = math.sin(p * math.pi) * 0.14
            val += math.sin(2 * math.pi * freq * t) * env

        # 2) 1.15s - 1.65s: 施毒发射/扑咬瞬间音效 (strike / harpoon / spray)
        if 1.15 <= t < 1.70:
            p = (t - 1.15) / 0.55
            env = (1.0 - p) ** 1.6 * 0.28
            if mode in ("fang_strike", "stinger_jab", "spine_pierce"):
                freq = 520 - 360 * p
                val += (math.sin(2 * math.pi * freq * t) + 0.5 * math.sin(2 * math.pi * freq * 2.1 * t)) * env
            elif mode in ("harpoon_shoot", "needle_barrage"):
                freq = 880 - 540 * p
                val += math.sin(2 * math.pi * freq * t + 12 * math.sin(90 * t)) * env
            else:
                freq = 360 + 240 * math.sin(p * math.pi * 3)
                val += math.sin(2 * math.pi * freq * t) * env

        # 3) 2.2s - 3.3s: 毒素分子命中靶点脉动音 (target pulse)
        if 2.20 <= t < 3.30:
            p = (t - 2.20) / 1.10
            pulse = 0.5 + 0.5 * math.sin(2 * math.pi * 6.5 * t)
            env = math.sin(p * math.pi) * 0.15 * pulse
            val += math.sin(2 * math.pi * (base_freq * 1.5) * t) * env

        # 4) 3.65s - 4.45s: 靶点锁定清脆完成和弦 (chime)
        notes = [523.25, 659.25, 783.99]
        for idx, nf in enumerate(notes):
            t0 = 3.65 + idx * 0.09
            if t0 <= t < t0 + 0.45:
                p = (t - t0) / 0.45
                env = ((1.0 - p) ** 2.0) * 0.14
                val += math.sin(2 * math.pi * nf * t) * env

        s = max(-32000, min(32000, int(val * 32000)))
        buf.append(struct.pack("<hh", s, s))

    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(b"".join(buf))


def draw_rounded_rect(draw: ImageDraw.ImageDraw, xy, radius: int, fill=None, outline=None, width: int = 1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def render_action_stage(draw: ImageDraw.ImageDraw, mode: str, t: float, accent: tuple, seed_num: int,
                        font_sub=None, weapon_short: str = "", target_name: str = ""):
    """
    在右侧舞台区 (x: 235..618, y: 66..288) 绘制高帧率定制施毒与攻击猎物动态矢量场景
    t: 0.0 -> 5.0 秒
    """
    ax0, ay0, ax1, ay1 = 236, 68, 618, 286
    cx = (ax0 + ax1) // 2
    cy = (ay0 + ay1) // 2

    # 舞台深色科技网格背景
    draw_rounded_rect(draw, (ax0, ay0, ax1, ay1), 18, fill=(8, 17, 32), outline=(38, 62, 92), width=2)
    for gx in range(ax0 + 28, ax1, 34):
        draw.line([(gx, ay0 + 2), (gx, ay1 - 2)], fill=(15, 29, 50), width=1)
    for gy in range(ay0 + 24, ay1, 34):
        draw.line([(ax0 + 2, gy), (ax1 - 2, gy)], fill=(15, 29, 50), width=1)

    # 攻击进度参数:
    # charge_p (0.0..1.1s), strike_p (1.1..2.8s), lock_p (2.8..5.0s)
    charge_p = max(0.0, min(1.0, t / 1.1))
    strike_p = max(0.0, min(1.0, (t - 1.1) / 1.6))
    effect_p = max(0.0, min(1.0, (t - 2.4) / 2.2))

    # 右侧猎物/靶点中心坐标
    tx = 535
    ty = cy + 6
    hit_shake = int(math.sin(t * 48) * 6 * (1.0 - effect_p)) if 1.35 <= t <= 3.4 else 0
    tx_s = tx + hit_shake

    if mode == "fang_strike":
        # 左侧：动态扑咬的毒蛇/蜘蛛上颚与空心毒牙；右侧：猎物血管与神经受体
        lunge = int(math.sin(min(1.0, max(0.0, (t - 0.9) / 0.5)) * math.pi) * 68) if t >= 0.9 else int(-10 * charge_p)
        jx = 300 + lunge
        jy = cy - 6

        # 绘制猎物血管与红细胞
        draw.rounded_rectangle((tx_s - 48, ty - 58, tx_s + 42, ty + 58), radius=22,
                               fill=(45, 16, 32) if effect_p > 0.2 else (28, 38, 62),
                               outline=accent if effect_p > 0.1 else (70, 95, 130), width=3)
        for idx in range(5):
            ang = t * (1.5 if effect_p < 0.3 else 0.3) + idx * 1.25
            rx = tx_s - 4 + int(math.cos(ang) * (18 + effect_p * 12))
            ry = ty + int(math.sin(ang) * (26 + effect_p * 10))
            cell_col = (180, 50, 80) if effect_p > 0.4 else (239, 68, 68)
            draw.ellipse((rx - 9, ry - 7, rx + 9, ry + 7), fill=cell_col, outline=(255, 180, 190))

        # 绘制毒牙与张开的上下颚
        jaw_open = 24 + int(16 * math.sin(min(1.0, t / 1.3) * math.pi))
        draw.polygon([(jx - 48, jy - 12), (jx + 18, jy - jaw_open), (jx + 6, jy - 4)], fill=(45, 212, 191), outline=(200, 255, 245))
        draw.polygon([(jx - 48, jy + 12), (jx + 16, jy + jaw_open), (jx + 6, jy + 4)], fill=(30, 160, 145), outline=(200, 255, 245))
        # 两根弯曲空心长管毒牙
        fang_tip_x = jx + 36
        fang_tip_y = jy - jaw_open + 28
        draw.polygon([(jx + 10, jy - jaw_open + 2), (jx + 22, jy - jaw_open + 4), (fang_tip_x, fang_tip_y)],
                     fill=(255, 255, 255), outline=accent)
        # 毒液喷射粒子流
        if strike_p > 0.05:
            for k in range(8):
                prog = (strike_p * 1.4 - k * 0.11) % 1.0
                if 0.0 <= prog <= 1.0:
                    vx = int(fang_tip_x + (tx_s - fang_tip_x) * prog)
                    vy = int(fang_tip_y + (ty - fang_tip_y) * prog + math.sin(prog * 9 + k) * 6)
                    r = 6 - (k % 3)
                    draw.ellipse((vx - r, vy - r, vx + r, vy + r), fill=accent, outline=(255, 255, 255))

    elif mode == "stinger_jab":
        # 蝎尾/胡蜂/蜜蜂/鸭嘴兽毒刺 + 搏动毒囊泵毒
        jab = int(math.sin(min(1.0, max(0.0, (t - 1.0) / 0.45)) * math.pi) * 75) if t >= 1.0 else 0
        sx = 310 + jab
        sy = cy

        # 右侧真皮组织与神经靶点
        draw.rounded_rectangle((tx_s - 46, ty - 56, tx_s + 44, ty + 56), radius=18,
                               fill=(42, 24, 38) if strike_p > 0.2 else (24, 38, 58),
                               outline=accent if strike_p > 0.2 else (80, 100, 135), width=3)
        # 神经元树突线条
        for k in range(6):
            a = k * math.pi / 3 + t * 0.8
            nx = tx_s + int(math.cos(a) * 28)
            ny = ty + int(math.sin(a) * 32)
            col = (255, 230, 90) if strike_p > 0.3 else (100, 140, 180)
            draw.line([(tx_s, ty), (nx, ny)], fill=col, width=3)
        draw.ellipse((tx_s - 12, ty - 12, tx_s + 12, ty + 12), fill=accent)

        # 搏动的毒液囊 + 锋利毒针
        sac_pulse = int(math.sin(t * 14) * 4)
        draw.ellipse((sx - 56 - sac_pulse, sy - 24 - sac_pulse, sx - 8 + sac_pulse, sy + 24 + sac_pulse),
                     fill=accent, outline=(255, 255, 255), width=2)
        draw.polygon([(sx - 10, sy - 11), (sx - 10, sy + 11), (sx + 54, sy)],
                     fill=(248, 250, 252), outline=accent)
        # 注入的脉冲毒液环
        if strike_p > 0.1:
            for k in range(6):
                p = (strike_p * 1.5 - k * 0.14) % 1.0
                px = int((sx + 48) + (tx_s - sx - 48) * p)
                py = int(sy + (ty - sy) * p)
                draw.ellipse((px - 5, py - 5, px + 5, py + 5), fill=(255, 240, 100), outline=accent)

    elif mode == "harpoon_shoot":
        # 超高速刺丝囊 / 芋螺鱼叉弹射（带螺旋牵引丝线 + 胰岛素迷雾）
        # 左侧高压发射囊
        draw.rounded_rectangle((256, cy - 34, 332, cy + 34), radius=24,
                               fill=(20, 48, 76), outline=(56, 189, 248), width=3)
        draw.ellipse((272, cy - 18, 316, cy + 18), fill=accent)

        # 右侧游动小鱼 / 猎物细胞
        fish_y = ty + (int(math.sin(t * 4) * 14) if strike_p < 0.25 else 0)
        draw.ellipse((tx_s - 34, fish_y - 20, tx_s + 26, fish_y + 20),
                     fill=(56, 189, 248) if effect_p < 0.3 else (148, 163, 184),
                     outline=(255, 255, 255), width=2)
        draw.polygon([(tx_s + 22, fish_y), (tx_s + 44, fish_y - 16), (tx_s + 44, fish_y + 16)],
                     fill=(56, 189, 248) if effect_p < 0.3 else (148, 163, 184))

        # 鱼叉弹射动画
        if t >= 0.9:
            hp = min(1.0, (t - 0.9) / 0.55)
            hx = int(330 + (tx_s - 28 - 330) * hp)
            hy = int(cy + (fish_y - cy) * hp)
            # 波浪牵引导管丝
            pts = []
            for s in range(16):
                u = s / 15.0
                ux = int(330 + (hx - 330) * u)
                uy = int(cy + (hy - cy) * u + math.sin(u * 12 + t * 18) * 7 * (1.0 - hp * 0.6))
                pts.append((ux, uy))
            if len(pts) > 1:
                draw.line(pts, fill=accent, width=3)
            # 倒刺微型鱼叉头
            draw.polygon([(hx + 16, hy), (hx - 6, hy - 9), (hx - 2, hy), (hx - 6, hy + 9)],
                         fill=(255, 255, 255), outline=accent)

    elif mode == "spine_pierce":
        # 海底伪装潜伏 + 背鳍/尾刺竖起穿刺注毒
        # 底部礁石/沙层与竖起的5根带槽毒棘
        draw.rounded_rectangle((260, ay1 - 54, 590, ay1 - 14), radius=14,
                               fill=(45, 38, 52), outline=accent, width=2)
        erect = min(1.0, max(0.25, (t - 0.6) / 0.7))
        for idx in range(5):
            bx = 305 + idx * 52
            by = ay1 - 46
            tip_x = bx + int((idx - 2) * 8 * erect)
            tip_y = by - int((95 + (idx % 2) * 18) * erect)
            draw.polygon([(bx - 9, by), (bx + 9, by), (tip_x, tip_y)],
                         fill=(245, 245, 250), outline=accent)
            # 沿毒棘血槽向上喷射的毒液珠
            if strike_p > 0.1:
                vp = (strike_p * 1.6 + idx * 0.18) % 1.0
                vx = int(bx + (tip_x - bx) * vp)
                vy = int(by + (tip_y - by) * vp)
                draw.ellipse((vx - 5, vy - 5, vx + 5, vy + 5), fill=accent, outline=(255, 255, 255))

    elif mode == "needle_barrage":
        # 万箭齐发：草酸钙显微针晶束 / 毒蛾空心毒毛 / 塔兰托踢毛扇形齐射
        draw.ellipse((254, cy - 38, 326, cy + 38), fill=(30, 45, 68), outline=accent, width=3)
        for idx in range(11):
            ang = (idx - 5) * 0.13
            fly_p = ((t - 0.75 + idx * 0.07) / 1.2) if t >= 0.75 else 0.0
            fly_p = max(0.0, min(1.0, fly_p))
            dist = 25 + fly_p * 215
            nx0 = 290 + int(math.cos(ang) * dist)
            ny0 = cy + int(math.sin(ang) * dist)
            nx1 = 290 + int(math.cos(ang) * (dist + 28))
            ny1 = cy + int(math.sin(ang) * (dist + 28))
            draw.line([(nx0, ny0), (nx1, ny1)], fill=(255, 255, 255), width=3)
            draw.ellipse((nx1 - 3, ny1 - 3, nx1 + 3, ny1 + 3), fill=accent)

        # 右侧被万针扎中的黏膜靶区
        draw.rounded_rectangle((tx_s - 32, ty - 62, tx_s + 36, ty + 62), radius=16,
                               fill=(68, 22, 42) if strike_p > 0.3 else (28, 42, 64),
                               outline=accent, width=3)

    elif mode == "skin_shield":
        # 警戒闪光 + 皮肤/羽毛/关节毒腺喷射生物碱护盾弹开捕食者
        pulse_r = 46 + int(math.sin(t * 12) * 8)
        gx, gy = 325, cy
        # 多层霓虹警戒光环
        for ring in range(3):
            rr = pulse_r + int(((t * 55 + ring * 26) % 75))
            draw.ellipse((gx - rr, gy - rr, gx + rr, gy + rr), outline=accent, width=2)
        draw.ellipse((gx - 38, gy - 38, gx + 38, gy + 38), fill=accent, outline=(255, 255, 255), width=3)

        # 皮肤分泌的毒液球飞向右侧捕食者嘴巴并将其弹退
        recoil = int(max(0.0, (t - 1.5) * 32)) if t >= 1.5 else int(-28 * charge_p)
        recoil = min(55, recoil)
        px = 505 + recoil
        draw.polygon([(px - 35, ty - 28), (px + 38, ty - 42), (px + 38, ty - 6)], fill=(148, 163, 184), outline=(255, 255, 255))
        draw.polygon([(px - 35, ty + 28), (px + 38, ty + 42), (px + 38, ty + 6)], fill=(100, 116, 139), outline=(255, 255, 255))
        if t >= 1.0:
            for k in range(7):
                a = (k - 3) * 0.22
                dp = ((t - 1.0 + k * 0.1) % 1.1) / 1.1
                dx = int(gx + 36 + math.cos(a) * dp * 145)
                dy = int(gy + math.sin(a) * dp * 95)
                draw.ellipse((dx - 6, dy - 6, dx + 6, dy + 6), fill=(250, 204, 21), outline=accent)

    elif mode == "neuro_gate_lock":
        # 神经细胞膜离子通道城门被毒素软木塞堵死 / 木楔卡死
        # 绘制细胞膜双分子层与中央通道门框
        gate_x = 455
        draw.rectangle((260, cy - 68, 595, cy - 36), fill=(30, 58, 95), outline=(56, 189, 248), width=2)
        draw.rectangle((260, cy + 36, 595, cy + 68), fill=(30, 58, 95), outline=(56, 189, 248), width=2)
        # 离子通道门柱
        draw.rounded_rectangle((gate_x - 42, cy - 76, gate_x - 14, cy + 76), radius=10, fill=(56, 189, 248), outline=(255, 255, 255), width=2)
        draw.rounded_rectangle((gate_x + 14, cy - 76, gate_x + 42, cy + 76), radius=10, fill=(56, 189, 248), outline=(255, 255, 255), width=2)

        # 毒素钥匙从左侧飞入并咔哒锁死通道口
        plug_p = min(1.0, max(0.0, (t - 0.8) / 1.1))
        kx = int(285 + (gate_x - 285) * plug_p)
        ky = cy - int(math.sin(plug_p * math.pi) * 24)
        draw.regular_polygon((kx, ky, 22), n_sides=6, rotation=int(t * 60), fill=accent, outline=(255, 255, 255))
        if plug_p >= 0.95:
            # 锁死闪电火花
            for k in range(8):
                a = k * math.pi / 4 + t * 6
                sx = gate_x + int(math.cos(a) * 38)
                sy = cy + int(math.sin(a) * 38)
                draw.line([(gate_x, cy), (sx, sy)], fill=(250, 204, 21), width=2)

    elif mode == "cell_factory_halt":
        # 潜入细胞内部：双环铁锁/打孔蛋白卡停核糖体齿轮与细胞膜
        draw.ellipse((355, cy - 78, 575, cy + 78), fill=(26, 22, 48), outline=accent, width=3)
        # 两个咬合旋转的细胞核糖体/聚合酶齿轮（被锁后停止旋转）
        rot = t * 95 if strike_p < 0.65 else 1.45 * 95
        for g_idx, (gx, gy, gr) in enumerate([(445, cy - 16, 30), (495, cy + 20, 24)]):
            draw.regular_polygon((gx, gy, gr), n_sides=8, rotation=int(rot * (1 if g_idx == 0 else -1)),
                                 fill=(74, 222, 128) if strike_p < 0.65 else (239, 68, 68),
                                 outline=(255, 255, 255))
            draw.ellipse((gx - 9, gy - 9, gx + 9, gy + 9), fill=(15, 23, 42))

        # 毒素特工从左侧穿膜潜入并夹住两个齿轮交界处
        in_p = min(1.0, max(0.0, (t - 0.7) / 1.1))
        mx = int(275 + (468 - 275) * in_p)
        my = cy
        draw.ellipse((mx - 18, my - 12, mx + 2, my + 12), fill=accent, outline=(255, 255, 255), width=2)
        draw.ellipse((mx - 2, my - 12, mx + 18, my + 12), fill=accent, outline=(255, 255, 255), width=2)

    elif mode == "enzyme_hijack":
        # 冒牌分子/抑制剂抢占酶或血红蛋白的活性座位
        # 绘制大型酶/血红蛋白凹槽工位
        seat_x, seat_y = 485, cy + 10
        draw.arc((seat_x - 58, seat_y - 58, seat_x + 58, seat_y + 58), start=35, end=325, fill=(56, 189, 248), width=16)
        draw.ellipse((seat_x - 28, seat_y - 28, seat_x + 28, seat_y + 28), outline=(148, 163, 184), width=2)

        # 毒素分子抢先一步坐进工位，把正常底物弹开
        hj_p = min(1.0, max(0.0, (t - 0.75) / 1.0))
        tx_mol = int(280 + (seat_x - 280) * hj_p)
        draw.regular_polygon((tx_mol, seat_y, 22), n_sides=5, rotation=int(t * 45), fill=accent, outline=(255, 255, 255))
        # 被挤走的正常底物小绿球
        norm_x = int(seat_x - 15 - hj_p * 95)
        norm_y = int(seat_y - 48 - hj_p * 18)
        draw.ellipse((norm_x - 13, norm_y - 13, norm_x + 13, norm_y + 13), fill=(74, 222, 128), outline=(255, 255, 255))

    else:  # mineral_vapor
        # 矿物晶格受热/敲击释放毒蒸气与辐射粒子攻击含硫酶
        # 左侧几何矿物晶格
        cx_rock, cy_rock = 310, cy + 22
        draw.regular_polygon((cx_rock, cy_rock, 36), n_sides=6, rotation=15, fill=accent, outline=(255, 255, 255))
        # 底部火焰灼烧动画
        for f_idx in range(5):
            fx = cx_rock - 28 + f_idx * 14
            fh = 16 + int(math.sin(t * 18 + f_idx) * 8)
            draw.polygon([(fx - 7, cy_rock + 46), (fx + 7, cy_rock + 46), (fx, cy_rock + 46 - fh)],
                         fill=(251, 146, 60))

        # 升腾释放的毒蒸气/粒子飞向右侧蛋白质(-SH)靶点
        draw.rounded_rectangle((tx_s - 42, ty - 48, tx_s + 42, ty + 48), radius=18,
                               fill=(45, 22, 48) if strike_p > 0.3 else (25, 38, 60),
                               outline=accent, width=3)
        for k in range(8):
            vp = ((t * 0.75 + k * 0.13) % 1.0)
            vx = int(cx_rock + 25 + (tx_s - cx_rock - 25) * vp)
            vy = int(cy_rock - 10 + (ty - cy_rock + 10) * vp - math.sin(vp * math.pi) * 32)
            draw.ellipse((vx - 7, vy - 7, vx + 7, vy + 7), fill=accent, outline=(255, 255, 255))

    # 攻击波冲击光环 (当 strike_p 命中靶点时)
    if 0.45 <= strike_p <= 1.0:
        ring_r = int((strike_p - 0.45) * 125)
        draw.ellipse((tx_s - ring_r, ty - ring_r, tx_s + ring_r, ty + ring_r), outline=accent, width=2)

    # 舞台内部图例标签（零Emoji方框，全中文清晰标注施毒方与猎物靶点）
    if font_sub is not None:
        draw_rounded_rect(draw, (ax0 + 10, ay0 + 8, ax0 + 186, ay0 + 32), 7, fill=(14, 28, 48), outline=accent, width=1)
        draw.text((ax0 + 18, ay0 + 11), f"施毒：{weapon_short[:10]}", font=font_sub, fill=(226, 232, 240))

        draw_rounded_rect(draw, (ax1 - 188, ay1 - 32, ax1 - 10, ay1 - 8), 7, fill=(14, 28, 48), outline=(70, 100, 140), width=1)
        draw.text((ax1 - 180, ay1 - 29), f"猎物/靶点：{target_name[:8]}", font=font_sub, fill=accent)

        if 1.35 <= t <= 3.35:
            draw_rounded_rect(draw, (tx_s - 48, ay0 + 8, tx_s + 52, ay0 + 32), 7, fill=(65, 18, 32), outline=(251, 113, 133), width=1)
            draw.text((tx_s - 40, ay0 + 11), "★ 毒素命中靶点", font=font_sub, fill=(254, 205, 211))
        elif t > 3.35:
            draw_rounded_rect(draw, (tx_s - 48, ay0 + 8, tx_s + 52, ay0 + 32), 7, fill=(14, 48, 36), outline=(74, 222, 128), width=1)
            draw.text((tx_s - 40, ay0 + 11), "✓ 毒素作用完成", font=font_sub, fill=(187, 247, 208))


def clean_mol_short(mol_str: str) -> str:
    base = mol_str.split("(")[0].split("（")[0].split("/")[0].strip()
    return base[:11] if base else mol_str[:11]


def make_single_video(args):
    cid, item, spec = args
    out_mp4 = OUT_DIR / f"{cid}.mp4"
    mode, weapon_title, target_name, accent, step1, step2, step3 = spec
    seed_num = int(cid[-2:])
    mol_short = clean_mol_short(item["molecule"])

    font_title = load_font(19)
    font_sub = load_font(13)
    font_tag = load_font(13)
    font_cap = load_font(16)

    # 加载实拍照片并裁切为正方形缩略图
    photo_path = find_photo_path(cid)
    try:
        raw_img = Image.open(photo_path).convert("RGB")
    except Exception:
        raw_img = Image.new("RGB", (300, 300), (20, 35, 60))

    pw, ph = raw_img.size
    side = min(pw, ph)
    crop_img = raw_img.crop(((pw - side) // 2, (ph - side) // 2, (pw + side) // 2, (ph + side) // 2))

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = pathlib.Path(tmpdir)
        wav_path = tmp_path / "sfx.wav"
        generate_sfx_wav(wav_path, mode, seed_num)

        cmd = [
            "/Users/mac/.homebrew/bin/ffmpeg",
            "-y",
            "-loglevel", "error",
            "-f", "rawvideo",
            "-vcodec", "rawvideo",
            "-s", f"{W}x{H}",
            "-pix_fmt", "rgb24",
            "-r", str(FPS),
            "-i", "-",
            "-i", str(wav_path),
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-crf", "24",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "96k",
            "-movflags", "+faststart",
            "-shortest",
            str(out_mp4),
        ]

        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

        for f_idx in range(TOTAL_FRAMES):
            t = f_idx / FPS
            frame = Image.new("RGB", (W, H), (9, 15, 28))
            draw = ImageDraw.Draw(frame)

            # 1) 顶部战术标题栏
            draw_rounded_rect(draw, (14, 12, W - 14, 56), 14, fill=(15, 25, 45), outline=(45, 75, 110), width=1)
            draw_rounded_rect(draw, (22, 19, 76, 49), 8, fill=accent)
            draw.text((29, 25), "施毒实况", font=font_sub, fill=(6, 18, 30))
            draw.text((86, 21), f"{item['name']} · {weapon_title}", font=font_title, fill=(248, 250, 252))

            # 2) 左侧实拍真身动态特写框 (随攻击突进与发光)
            lunge_x = int(math.sin(min(1.0, max(0.0, (t - 1.0) / 0.5)) * math.pi) * 14) if 1.0 <= t <= 1.6 else 0
            zoom = 1.0 + 0.08 * math.sin(t * 2.2)
            box_w, box_h = 198, 218
            bx0, by0 = 20 + lunge_x, 68

            zoomed_size = int(200 * zoom)
            p_resized = crop_img.resize((zoomed_size, zoomed_size), Image.Resampling.BILINEAR)
            off = (zoomed_size - 190) // 2
            p_cropped = p_resized.crop((off, off, off + 190, off + 176))

            draw_rounded_rect(draw, (bx0, by0, bx0 + box_w, by0 + box_h), 18,
                              fill=(18, 30, 52), outline=accent if 1.1 <= t <= 3.6 else (60, 90, 130), width=3)
            frame.paste(p_cropped, (bx0 + 4, by0 + 4))
            draw.text((bx0 + 12, by0 + 186), f"武器：{mol_short}", font=font_tag, fill=(226, 232, 240))

            # 3) 右侧定制 2D 动态施毒攻击舞台
            render_action_stage(draw, mode, t, accent, seed_num, font_sub, mol_short, target_name)

            # 4) 底部三阶段实时解说字幕条 + 进度条
            if t < 1.55:
                cap_txt = step1
                phase_badge = "蓄力锁定"
                badge_col = (56, 189, 248)
            elif t < 3.35:
                cap_txt = step2
                phase_badge = "施毒瞬间"
                badge_col = (251, 113, 133)
            else:
                cap_txt = step3
                phase_badge = "毒素生效"
                badge_col = (74, 222, 128)

            draw_rounded_rect(draw, (14, 298, W - 14, 366), 14, fill=(15, 25, 45), outline=badge_col, width=2)
            draw_rounded_rect(draw, (24, 309, 104, 337), 8, fill=badge_col)
            draw.text((34, 314), phase_badge, font=font_tag, fill=(6, 18, 30))
            draw.text((116, 311), cap_txt, font=font_cap, fill=(254, 249, 195))

            # 底部播放时间进度条
            prog_w = int((W - 48) * (t / DURATION))
            draw.rectangle((24, 349, W - 24, 355), fill=(30, 45, 70))
            if prog_w > 0:
                draw.rectangle((24, 349, 24 + prog_w, 355), fill=accent)

            proc.stdin.write(frame.tobytes())

        proc.stdin.close()
        proc.wait()

    return cid, out_mp4.stat().st_size


def main():
    catalog = load_catalog_map()
    tasks = []
    for cid, spec in sorted(ACTION_SPECS.items()):
        item = catalog[cid]
        tasks.append((cid, item, spec))

    print(f"Generating {len(tasks)} action videos with multiprocessing...")
    with mp.Pool(processes=min(8, os.cpu_count() or 4)) as pool:
        results = pool.map(make_single_video, tasks)

    total_kb = sum(sz for _, sz in results) / 1024.0
    print(f"Done! Generated {len(results)} videos in {OUT_DIR} (Total: {total_kb / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
