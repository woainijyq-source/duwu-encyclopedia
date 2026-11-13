#!/usr/bin/env python3
"""
生成《奇妙毒物科学游乐园》1080p 高清项目介绍视频 (含豆包语音旁白 + 动态视觉卡片 + 中英重点词放大演示)
输出路径:
  - /Users/mac/projects/毒物大百科/assets/intro_video.mp4
  - /Users/mac/.gemini/antigravity/brain/b6c37e9a-90af-41aa-a970-cad516233c9e/奇妙毒物科学游乐园_项目介绍视频.mp4
"""

import base64
import json
import math
import os
import pathlib
import re
import subprocess
import tempfile
import urllib.request
import uuid
import wave
import struct
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PROJECT_DIR = pathlib.Path("/Users/mac/projects/毒物大百科")
ARTIFACT_DIR = pathlib.Path("/Users/mac/.gemini/antigravity/brain/b6c37e9a-90af-41aa-a970-cad516233c9e")
WORK_DIR = pathlib.Path("/tmp/duwu_intro_video_build")
WORK_DIR.mkdir(parents=True, exist_ok=True)

env_txt = pathlib.Path("/Users/mac/projects/电子宠物/server/.env").read_text("utf-8")
m = re.search(r"^DOUBAO_TTS_API_KEY=(.+)$", env_txt, flags=re.M)
assert m, "DOUBAO_TTS_API_KEY not found"
API_KEY = m.group(1).strip().strip("\"'")

ENDPOINT = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
SPEAKER = "zh_female_xiaohe_uranus_bigtts"
TONE = "请用温暖、欢快、充满感染力的科学游乐园导览姐姐语气，吐字清晰、生动活泼地介绍。"

SCENES = [
    {
        "id": "s1",
        "badge": "01 · 沉浸式全景生态百科",
        "title": "奇妙毒物科学游乐园",
        "subtitle": "99张高清实拍闪卡 · 25套360°真3D分子模型 · 零大段文字墙",
        "bg": PROJECT_DIR / "assets/scenes/panorama.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/photos/ch1-09.jpg",
            PROJECT_DIR / "assets/photos/ch6-08.jpg",
            PROJECT_DIR / "assets/photos/ch3-17.jpg",
            PROJECT_DIR / "assets/photos/ch5-01.jpg",
        ],
        "thumbs_labels": ["🐸 黄金箭毒蛙", "🐙 蓝环章鱼", "🌸 夹竹桃", "🍄 鳞柄白鹅膏"],
        "highlight_card": {
            "title": "🗺️ 全书 9 大章节 · 99 种奇特生物与矿物",
            "lines": [
                "• 点全景画布发光生物，直接看高清真身与旋转 3D 分子",
                "• 每一个生僻字自动标注拼音，8岁小朋友独立畅玩无压力",
                "• 内置「我是小馆长」录音间，录制专属解说自动云同步",
            ],
            "en_box": None,
        },
        "narration": "欢迎来到《奇妙毒物科学游乐园》！这是一座专为小朋友打造的、零文字墙的生物化学互动百科。全书九十九种奇特毒物，全部化身为高清实拍闪卡与三百六十度可旋转的3D分子模型！",
        "captions": [
            "欢迎来到《奇妙毒物科学游乐园》！专为小朋友打造的生物化学互动百科",
            "全书 99 种奇特毒物，全部化身为高清实拍闪卡与 360° 可旋转 3D 分子模型！",
        ],
    },
    {
        "id": "s2",
        "badge": "02 · 全站预置语音 · 0毫秒秒出声",
        "title": "点「🔊 给我讲解」直接出声 · 逐句放大高亮",
        "subtitle": "286条豆包大模型语音全部内置打包 · 波形静音谷精准对齐句子",
        "bg": PROJECT_DIR / "assets/photos/ch6-08.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/photos/ch6-01.jpg",
            PROJECT_DIR / "assets/photos/ch6-07.jpg",
            PROJECT_DIR / "assets/photos/ch6-13.jpg",
            PROJECT_DIR / "assets/photos/ch6-15.jpg",
        ],
        "thumbs_labels": ["🐡 红鳍东方鲀", "🐚 地纹芋螺", "🎐 僧帽水母", "🧊 澳洲箱水母"],
        "highlight_card": {
            "title": "🔊 蓝环章鱼 · 河鲀毒素 (TTX)",
            "lines": [
                "平时米黄色很低调；一旦受惊，0.3秒亮起 50 多个宝蓝色霓虹光环！",
                "🔊 【当前朗读句 1.26倍动态放大 + 黄金呼吸光晕高亮】",
                "⚡ 全站 286 条音频内置进软件 + 四重永久缓存，点击 0 毫秒直接发声！",
            ],
            "en_box": {
                "tag": "🇬🇧 英文×2遍",
                "en_parts": [("Glowing ", False), ("blue", True), (" ", False), ("rings", True), (" mean: take ", False), ("photos", True), (" only!", False)],
                "zh": "闪亮的蓝圈圈在提醒你：只拍照，绝不伸手抓！",
            },
        },
        "narration": "点击给我讲解，全站两百八十六条语音已全部内置进软件，零延迟直接出声音！读到哪一句，哪一句就会动态放大发光，让小朋友一眼看清读到哪里！",
        "captions": [
            "点击「🔊 给我讲解」，全站 286 条语音已全部内置进软件，零延迟直接出声音！",
            "读到哪一句，哪一句就动态放大发光，让小朋友一眼看清读到哪里！",
        ],
    },
    {
        "id": "s3",
        "badge": "03 · 中英文穿插跟读 · 重点词放大",
        "title": "边听百科边学英文 · 英文连读2遍 + 重点词放大",
        "subtitle": "每张卡片精选 1 句地道实用短句 · 核心单词 1.38 倍醒目弹跳高亮",
        "bg": PROJECT_DIR / "assets/photos/ch3-17.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/photos/ch1-01.jpg",
            PROJECT_DIR / "assets/photos/ch3-01.jpg",
            PROJECT_DIR / "assets/photos/ch4-01.jpg",
            PROJECT_DIR / "assets/photos/ch7-01.jpg",
        ],
        "thumbs_labels": ["🦆 鸭嘴兽 mammal", "💜 乌头 helmet", "🥔 马铃薯 sprouted", "🔴 辰砂 fire"],
        "highlight_card": {
            "title": "🌸 夹竹桃 · 马路绿化带的抗污标兵",
            "lines": [
                "能吸收汽车尾气二氧化硫，但全株含强心苷，欣赏花朵绝不折枝触碰！",
                "🔁 讲解穿插地道英文短句，自动连续朗读两遍，第一遍听清、第二遍跟读！",
            ],
            "en_box": {
                "tag": "🇬🇧 英文×2遍 · 重点词放大",
                "en_parts": [("Don't ", False), ("touch", True), (" the ", False), ("bright", True), (" ", False), ("flowers", True), (" by the road!", False)],
                "zh": "别碰马路边那些鲜艳的夹竹桃花朵！",
            },
        },
        "narration": "在讲解过程中，系统为每张卡片精选了一句最适合女儿学习的英文短句。重点单词会醒目放大显示，而且每句英文都会连续朗读两遍：Don't touch the bright flowers! Don't touch the bright flowers! 别碰鲜艳的花朵！",
        "captions": [
            "每张卡片精选 1 句最适合学习的英文短句，核心重点单词醒目放大显示！",
            "英文短句连续朗读两遍：Don't touch the bright flowers! 别碰鲜艳的花朵！",
        ],
    },
    {
        "id": "s4",
        "badge": "04 · 随时语音互动 · DeepSeek + 豆包朗读",
        "title": "点「🎤 随时互动」跟 AI 说话 · 好奇问题秒解答",
        "subtitle": "DOUDOU New API (DeepSeek-V4.1-Flash) + 豆包语音合成实时联动",
        "bg": PROJECT_DIR / "assets/scenes/forest_hunt.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/photos/ch1-06.jpg",
            PROJECT_DIR / "assets/photos/ch2-05.jpg",
            PROJECT_DIR / "assets/photos/ch3-06.jpg",
            PROJECT_DIR / "assets/photos/ch8-04.jpg",
        ],
        "thumbs_labels": ["👑 眼镜王蛇", "🦂 以色列金蝎", "🌺 毛地黄", "🦟 除虫菊酯"],
        "highlight_card": {
            "title": "🎤 正在围绕【夹竹桃】随时语音互动",
            "lines": [
                "👧 女儿提问：“为什么夹竹桃有毒，还要种在马路边呀？”",
                "🤖 AI 解答：“因为它是马路边的超级吸尘器，能大口吃掉汽车尾气净化空气呀！”",
                "🔊 回答自动由豆包语音温柔朗读，同样带逐句放大与英文学习短句！",
            ],
            "en_box": {
                "tag": "🇬🇧 AI 互动顺便教英文",
                "en_parts": [("Look", True), (" with your ", False), ("eyes", True), (", don't ", False), ("touch", True), ("!", False)],
                "zh": "只用眼睛看，不动小手碰！",
            },
        },
        "narration": "听百科时冒出好奇的问题？随时点击随时互动按钮，直接开口跟AI说话！底层调用DeepSeek大模型，结合当前百科卡片秒级回答，并由豆包语音温柔朗读，还会顺便再教一句英文！",
        "captions": [
            "听百科时有任何好奇问题，随时点击「🎤 随时互动」直接开口跟 AI 说话！",
            "DeepSeek 大模型结合当前百科卡秒级解答 + 豆包语音朗读，边聊科学边学英文！",
        ],
    },
    {
        "id": "s5",
        "badge": "05 · 四大微观生化实验室",
        "title": "活体细胞滴管 · 3D分子拆弹 · 食物链借毒养成",
        "subtitle": "100°C 沸水锅 vs 胃蛋白酶剪刀 · 亲手验证蛋白质与小分子的奥秘",
        "bg": PROJECT_DIR / "assets/scenes/cell_bg.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/photos/ch6-01.jpg",
            PROJECT_DIR / "assets/photos/ch1-09.jpg",
            PROJECT_DIR / "assets/photos/ch4-02.jpg",
            PROJECT_DIR / "assets/photos/ch5-14.jpg",
        ],
        "thumbs_labels": ["🔑 河鲀堵城门", "🐸 箭毒蛙借毒", "🍲 四季豆煮熟", "🍄 鬼伞配酒实验"],
        "highlight_card": {
            "title": "🔬 把硬核生物化学变成指尖玩具",
            "lines": [
                "• 活体细胞滴管：亲眼看河鲀毒素堵死钠通道、胃蛋白酶剪碎蛇毒蛋白",
                "• 分子手术台：翻转河鲀钥匙插锁孔、剪掉乌头碱双基团减毒 2000 倍",
                "• 借毒生态缸：喂箭毒蛙宝宝吃毒蚂蚁，揭秘大自然食物链攒毒魔法",
            ],
            "en_box": {
                "tag": "🇬🇧 实验双语总结",
                "en_parts": [("Stomach", True), (" ", False), ("enzymes", True), (" cut it into ", False), ("pieces", True), ("!", False)],
                "zh": "胃里的酶剪刀能把毒蛋白剪成小段！",
            },
        },
        "narration": "在微观生化实验室里，小朋友可以往活体细胞滴加试剂，用100度沸水锅和胃蛋白酶剪刀测试毒物，或者给刚孵化的箭毒蛙宝宝喂食，亲眼见证食物链借毒防身的神奇法则！",
        "captions": [
            "活体细胞滴管 + 3D分子拆弹手术台 + 100°C沸水锅与胃蛋白酶剪刀实验",
            "给刚孵化的箭毒蛙宝宝喂食，亲眼见证大自然食物链「借毒防身」的神奇法则！",
        ],
    },
    {
        "id": "s6",
        "badge": "06 · 化毒为药急诊室 & 王牌对战寻宝",
        "title": "化毒为药救病人 · 99王牌对战 · 四大场景找毒物",
        "subtitle": "crm.truing.top/duwu/ · 守护孩子受用一生的安全常识与科学梦想",
        "bg": PROJECT_DIR / "assets/scenes/picnic_hunt.jpg",
        "thumbs": [
            PROJECT_DIR / "assets/scenes/ocean_hunt.jpg",
            PROJECT_DIR / "assets/scenes/forest_hunt.jpg",
            PROJECT_DIR / "assets/scenes/home_hunt.jpg",
            PROJECT_DIR / "assets/photos/ch1-05.jpg",
        ],
        "thumbs_labels": ["🏖️ 赶海礁石寻宝", "🌲 森林秘境寻宝", "🏠 居家安全寻宝", "💊 蝮蛇化毒为药"],
        "highlight_card": {
            "title": "🏆 科学是最温暖的生命盾牌",
            "lines": [
                "• 化毒为药急诊室：转动帕拉塞尔苏斯剂量旋钮，把蛇毒与芋螺毒变成救命良药",
                "• 99王牌生化对战 & 四大绘本场景 25 处找毒物，全家双人同屏欢乐PK",
                "• 立即体验：https://crm.truing.top/duwu/",
            ],
            "en_box": {
                "tag": "🇬🇧 科学格言 ×2遍",
                "en_parts": [("Science", True), (" can turn ", False), ("poison", True), (" into ", False), ("medicine", True), ("!", False)],
                "zh": "科学能把剧毒改造成为救命的好药！",
            },
        },
        "narration": "从化毒为药急诊室，到九十九张王牌生化对战与四大场景找毒物挑战，让孩子在快乐探索中收获安全常识、流利英文与科学梦想！",
        "captions": [
            "化毒为药急诊室 + 99王牌生化对战 + 四大绘本场景 25 处找毒物大挑战",
            "《奇妙毒物科学游乐园》——在快乐探索中收获安全常识、地道英文与科学梦想！",
        ],
    },
]


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
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


def synth_narration(scene_id: str, text: str) -> pathlib.Path:
    mp3_path = WORK_DIR / f"{scene_id}.mp3"
    wav_path = WORK_DIR / f"{scene_id}.wav"
    if not mp3_path.exists() or mp3_path.stat().st_size < 1000:
        payload = {
            "user": {"uid": "duwu-video"},
            "req_params": {
                "text": text,
                "speaker": SPEAKER,
                "audio_params": {"format": "mp3", "sample_rate": 24000, "speech_rate": -2},
                "additions": json.dumps({"context_texts": [TONE]}, ensure_ascii=False),
            },
        }
        req = urllib.request.Request(
            ENDPOINT,
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "X-Api-Key": API_KEY,
                "X-Api-Resource-Id": "seed-tts-2.0",
                "X-Api-Request-Id": str(uuid.uuid4()),
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=25) as resp:
            raw = resp.read().decode("utf-8")
        chunks = []
        for line in raw.splitlines():
            line = line.strip()
            if not line:
                continue
            if line.startswith("data:"):
                line = line[5:].strip()
            if not line or line == "[DONE]":
                continue
            obj = json.loads(line)
            b64 = obj.get("data")
            if isinstance(b64, str) and b64:
                chunks.append(base64.b64decode(b64))
        mp3_path.write_bytes(b"".join(chunks))

    # Convert to 24000Hz mono WAV with 0.45s tail padding
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(mp3_path),
            "-af", "apad=pad_dur=0.45",
            "-ar", "24000", "-ac", "1",
            str(wav_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return wav_path


def get_wav_duration(wav_path: pathlib.Path) -> float:
    with wave.open(str(wav_path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


def crop_cover(img: Image.Image, target_w: int, target_h: int, zoom: float = 1.0) -> Image.Image:
    w, h = img.size
    scale = max(target_w / w, target_h / h) * zoom
    nw, nh = int(w * scale), int(h * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - target_w) // 2)
    top = max(0, (nh - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h))


def render_scene_keyframe(scene: dict, phase: int) -> Image.Image:
    """
    phase 0: first half of scene (caption 0, subtle zoom 1.02)
    phase 1: second half of scene (caption 1, active bilingual keyword zoom + glow)
    """
    W, H = 1920, 1080
    bg_raw = Image.open(scene["bg"]).convert("RGB")
    bg_zoom = crop_cover(bg_raw, W, H, zoom=1.04 if phase == 0 else 1.08)
    bg_blur = bg_zoom.filter(ImageFilter.GaussianBlur(radius=18))

    # Dark scientific glass overlay
    overlay = Image.new("RGBA", (W, H), (8, 15, 30, 196))
    canvas = Image.alpha_composite(bg_blur.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas, "RGBA")

    f_badge = load_font(26)
    f_title = load_font(54)
    f_sub = load_font(28)
    f_card_h = load_font(34)
    f_card_b = load_font(27)
    f_en_norm = load_font(33)
    f_en_kw = load_font(44 if phase == 1 else 39)
    f_thumb = load_font(23)
    f_cap = load_font(34)

    # Top Header Bar
    draw.rounded_rectangle((70, 42, 460, 94), radius=26, fill=(45, 212, 191, 45), outline=(45, 212, 191, 180), width=2)
    draw.text((96, 52), scene["badge"], font=f_badge, fill=(94, 234, 212, 255))

    draw.rounded_rectangle((1460, 42, 1850, 94), radius=26, fill=(250, 204, 21, 38), outline=(250, 204, 21, 180), width=2)
    draw.text((1490, 52), "🧪 奇妙毒物科学游乐园 v3.7", font=f_badge, fill=(254, 240, 138, 255))

    # Main Title & Subtitle
    draw.text((70, 112), scene["title"], font=f_title, fill=(255, 255, 255, 255))
    draw.text((70, 184), scene["subtitle"], font=f_sub, fill=(148, 163, 184, 255))

    # Left Showcase Hero Image (Framed high-res artwork)
    hero_w, hero_h = 790, 480
    hero_x, hero_y = 70, 245
    hero_img = crop_cover(bg_raw, hero_w, hero_h, zoom=1.0 if phase == 0 else 1.05)
    mask = Image.new("L", (hero_w, hero_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, hero_w, hero_h), radius=28, fill=255)
    canvas.paste(hero_img, (hero_x, hero_y), mask)
    draw.rounded_rectangle((hero_x, hero_y, hero_x + hero_w, hero_y + hero_h), radius=28, outline=(56, 189, 248, 200), width=4)

    # 4 Thumbnail Cards at bottom-left
    tw, th = 182, 165
    for idx, (tp, tlabel) in enumerate(zip(scene["thumbs"], scene["thumbs_labels"])):
        tx = 70 + idx * 202
        ty = 750
        draw.rounded_rectangle((tx, ty, tx + tw, ty + th), radius=20, fill=(15, 23, 42, 230), outline=(71, 85, 105, 180), width=2)
        if tp.exists():
            timg = crop_cover(Image.open(tp).convert("RGB"), tw - 12, th - 48)
            tmask = Image.new("L", (tw - 12, th - 48), 0)
            ImageDraw.Draw(tmask).rounded_rectangle((0, 0, tw - 12, th - 48), radius=14, fill=255)
            canvas.paste(timg, (tx + 6, ty + 6), tmask)
        draw.text((tx + 12, ty + th - 36), tlabel, font=f_thumb, fill=(226, 232, 240, 255))

    # Right Feature Card (Interactive Explanation + Bilingual Keyword Zoom Showcase)
    rx, ry, rw, rh = 900, 245, 950, 670
    draw.rounded_rectangle((rx, ry, rx + rw, ry + rh), radius=30, fill=(15, 23, 42, 235), outline=(45, 212, 191, 190), width=3)

    hc = scene["highlight_card"]
    draw.text((rx + 36, ry + 34), hc["title"], font=f_card_h, fill=(254, 240, 138, 255))

    # Simulated button bar on top-right of card
    draw.rounded_rectangle((rx + rw - 380, ry + 28, rx + rw - 205, ry + 80), radius=24, fill=(45, 212, 191, 235))
    draw.text((rx + rw - 360, ry + 39), "🔊 给我讲解", font=f_badge, fill=(6, 19, 31, 255))
    draw.rounded_rectangle((rx + rw - 190, ry + 28, rx + rw - 28, ry + 80), radius=24, fill=(168, 85, 247, 235))
    draw.text((rx + rw - 172, ry + 39), "🎤 随时互动", font=f_badge, fill=(255, 255, 255, 255))

    cy = ry + 108
    for l_idx, line in enumerate(hc["lines"]):
        is_active_line = (phase == 0 and l_idx == 1)
        if is_active_line:
            draw.rounded_rectangle((rx + 28, cy - 8, rx + rw - 28, cy + 54), radius=16, fill=(250, 204, 21, 55), outline=(250, 204, 21, 220), width=2)
            draw.text((rx + 42, cy), line, font=f_card_b, fill=(254, 240, 138, 255))
            cy += 72
        else:
            draw.text((rx + 38, cy), line, font=f_card_b, fill=(226, 232, 240, 255))
            cy += 64

    # Bilingual Learning Capsule on Right Card
    en_box = hc.get("en_box")
    if en_box:
        bx1, by1, bx2, by2 = rx + 34, ry + 375, rx + rw - 34, ry + 635
        box_fill = (56, 189, 248, 55) if phase == 1 else (30, 58, 95, 160)
        box_outline = (250, 204, 21, 255) if phase == 1 else (56, 189, 248, 190)
        draw.rounded_rectangle((bx1, by1, bx2, by2), radius=24, fill=box_fill, outline=box_outline, width=4 if phase == 1 else 2)

        # Tag pill
        draw.rounded_rectangle((bx1 + 24, by1 + 22, bx1 + 310, by1 + 66), radius=20, fill=(56, 189, 248, 90))
        draw.text((bx1 + 40, by1 + 29), en_box["tag"], font=f_badge, fill=(125, 211, 252, 255))

        if phase == 1:
            draw.rounded_rectangle((bx1 + 326, by1 + 22, bx1 + 630, by1 + 66), radius=20, fill=(236, 72, 153, 210))
            draw.text((bx1 + 344, by1 + 29), "🔊 正在连读第 2 遍 · 重点词放大", font=f_badge, fill=(255, 255, 255, 255))

        # Render English tokens with enlarged key words
        ex = bx1 + 28
        ey = by1 + 92
        for token_txt, is_kw in en_box["en_parts"]:
            if is_kw:
                bbox = draw.textbbox((0, 0), token_txt, font=f_en_kw)
                tw_tok = bbox[2] - bbox[0]
                th_tok = bbox[3] - bbox[1]
                pad_x, pad_y = 14, 8
                pill_fill = (236, 72, 153, 235) if phase == 1 else (244, 114, 182, 160)
                draw.rounded_rectangle(
                    (ex - 4, ey - 8, ex + tw_tok + pad_x * 2 - 4, ey + th_tok + pad_y * 2 + 2),
                    radius=14,
                    fill=pill_fill,
                    outline=(254, 240, 138, 255),
                    width=3,
                )
                draw.text((ex + pad_x - 4, ey - 2), token_txt, font=f_en_kw, fill=(255, 255, 255, 255))
                ex += tw_tok + pad_x * 2 + 6
            else:
                bbox = draw.textbbox((0, 0), token_txt, font=f_en_norm)
                tw_tok = bbox[2] - bbox[0]
                draw.text((ex, ey + 6), token_txt, font=f_en_norm, fill=(253, 224, 71, 255))
                ex += tw_tok

        # Chinese translation below English
        draw.text((bx1 + 28, by1 + 178), f"中文对照：{en_box['zh']}", font=f_card_b, fill=(241, 245, 249, 255))

    # Bottom Subtitle / Narration Bar
    cap_txt = scene["captions"][min(phase, len(scene["captions"]) - 1)]
    draw.rounded_rectangle((70, 955, 1850, 1042), radius=24, fill=(6, 19, 31, 235), outline=(250, 204, 21, 210), width=3)
    draw.text((110, 978), f"🎙️ {cap_txt}", font=f_cap, fill=(254, 240, 138, 255))

    return canvas.convert("RGB")


def main():
    segment_mp4s = []
    for idx, sc in enumerate(SCENES, 1):
        print(f"==> [{idx}/{len(SCENES)}] Synthesizing narration & rendering frames for {sc['id']}...", flush=True)
        wav_path = synth_narration(sc["id"], sc["narration"])
        dur = get_wav_duration(wav_path)
        half1 = round(dur * 0.48, 2)
        half2 = round(max(0.5, dur - half1), 2)

        img0 = render_scene_keyframe(sc, 0)
        img1 = render_scene_keyframe(sc, 1)
        p0 = WORK_DIR / f"{sc['id']}_p0.jpg"
        p1 = WORK_DIR / f"{sc['id']}_p1.jpg"
        img0.save(p0, quality=95)
        img1.save(p1, quality=95)

        seg_mp4 = WORK_DIR / f"seg_{idx:02d}.mp4"
        # Combine p0 (for half1 sec) and p1 (for half2 sec) with smooth crossfade + audio
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-loop", "1", "-t", str(half1 + 0.35), "-i", str(p0),
                "-loop", "1", "-t", str(half2 + 0.35), "-i", str(p1),
                "-i", str(wav_path),
                "-filter_complex",
                f"[0:v]fps=30,format=yuv420p[v0];[1:v]fps=30,format=yuv420p[v1];[v0][v1]xfade=transition=fade:duration=0.35:offset={max(0.2, half1 - 0.15):.2f}[v]",
                "-map", "[v]", "-map", "2:a",
                "-c:v", "libx264", "-preset", "fast", "-crf", "20",
                "-c:a", "aac", "-b:a", "128k",
                "-shortest",
                str(seg_mp4),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        segment_mp4s.append(seg_mp4)

    concat_list = WORK_DIR / "concat.txt"
    concat_list.write_text("\n".join(f"file '{p}'" for p in segment_mp4s) + "\n", encoding="utf-8")

    out_project = PROJECT_DIR / "assets/intro_video.mp4"
    out_artifact = ARTIFACT_DIR / "奇妙毒物科学游乐园_项目介绍视频.mp4"
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
            "-c:v", "libx264", "-preset", "fast", "-crf", "21",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart",
            str(out_project),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    out_artifact.write_bytes(out_project.read_bytes())
    print(f"✅ Intro video generated: {out_project} ({out_project.stat().st_size / 1048576:.2f} MB)")


if __name__ == "__main__":
    main()
