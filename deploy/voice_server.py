#!/usr/bin/env python3
"""
奇妙毒物科学游乐园 · 后端语音服务 (Zero-dependency Python 3 stdlib)
1) 小馆长配音云同步接口:
   GET    /api/recordings              -> {"ok": true, "items": [...]}
   GET    /api/recordings/<archiveId>  -> binary audio (HTTP 206 Byte-Range supported)
   POST   /api/recordings/<archiveId>  -> save audio binary + metadata JSON
   DELETE /api/recordings/<archiveId>  -> delete audio + metadata JSON

2) 豆包大模型语音合成 (Doubao seed-tts-2.0) + 永久磁盘缓存接口:
   GET    /api/tts?t=<text>            -> audio/mpeg (SHA-256 永久磁盘缓存 + 单飞锁防并发重复计费!)
   POST   /api/tts                     -> {"text": "..."} -> audio/mpeg
   GET    /api/tts/stats               -> {"ok": true, "configured": bool, "cachedFiles": int, ...}
"""

import base64
import hashlib
import json
import os
import re
import threading
import time
import urllib.error
import urllib.request
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ARCHIVE_ID_RE = re.compile(r"^ch[0-8]-\d{2}$")
MAX_REC_BYTES = 3_600_000  # 3.6 MB max per 35s curator voice clip
ALLOWED_REC_MIMES = {
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
}

SHARED_ROOT = Path(os.environ.get("DUWU_SHARED_DIR", "/www/wwwroot/duwu-encyclopedia/shared-data"))
REC_DIR = Path(os.environ.get("DUWU_VOICE_DIR", str(SHARED_ROOT / "recordings")))
TTS_DIR = Path(os.environ.get("DUWU_TTS_CACHE_DIR", str(SHARED_ROOT / "tts-cache")))
HOST = os.environ.get("DUWU_VOICE_HOST", "127.0.0.1")
PORT = int(os.environ.get("DUWU_VOICE_PORT", "8798"))

# Doubao / Volcengine seed-tts-2.0 configuration (loaded strictly from env / tts.env, NEVER hardcoded!)
VOLC_TTS_KEY = (
    os.environ.get("VOLC_TTS_KEY")
    or os.environ.get("VOLCENGINE_TTS_API_KEY")
    or os.environ.get("DOUBAO_TTS_API_KEY")
    or ""
).strip()
VOLC_TTS_ENDPOINT = os.environ.get(
    "VOLC_TTS_ENDPOINT", "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
).strip()
VOLC_TTS_RESOURCE_ID = os.environ.get("VOLC_TTS_RESOURCE_ID", "seed-tts-2.0").strip()
VOLC_TTS_SPEAKER = os.environ.get("VOLC_TTS_SPEAKER", "zh_female_xiaohe_uranus_bigtts").strip()
VOLC_TTS_RATE = int(os.environ.get("VOLC_TTS_RATE", "-5"))
VOLC_TTS_TONE = os.environ.get(
    "VOLC_TTS_TONE",
    "请用温柔、生动、充满好奇心的科普姐姐语气，像给8岁小朋友讲自然故事一样吐字清楚地说。",
).strip()

# DOUDOU New API (DeepSeek) configuration for anytime interactive Q&A (loaded from env / tts.env)
AI_BASE = (os.environ.get("AI_BASE") or "https://doudou-newapi.com").strip().rstrip("/")
AI_KEY = (os.environ.get("AI_KEY") or "").strip()
AI_MODEL = (os.environ.get("AI_MODEL") or "DeepSeek-V4.1-Flash").strip()

TTS_MAX_CHARS = 600
TTS_PER_IP_HOUR = int(os.environ.get("TTS_PER_IP_HOUR", "240"))
TTS_PER_DAY = int(os.environ.get("TTS_PER_DAY", "1500"))
CHAT_PER_IP_HOUR = int(os.environ.get("CHAT_PER_IP_HOUR", "120"))
CHAT_PER_DAY = int(os.environ.get("CHAT_PER_DAY", "600"))
STRICT_ORIGIN = os.environ.get("DUWU_STRICT_ORIGIN", "1") == "1"

# Emoji & decorative symbol stripper so Doubao reads pure natural Chinese/science terms
EMOJI_STRIP_RE = re.compile(
    r"[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b00-\u2bff\ufe0f✓✗×➕➖👇👆👈👉➜]+"
)

# Concurrency locks & rate-limit counters (only for uncached MISS synthesis!)
_global_lock = threading.Lock()
_inflight_locks: dict[str, threading.Lock] = {}
_ip_hourly: dict[str, list[float]] = {}
_daily_counter = {"day": "", "count": 0}
_chat_ip_hourly: dict[str, list[float]] = {}
_chat_daily_counter = {"day": "", "count": 0}
_stats = {"hits": 0, "misses": 0, "errors": 0, "chats": 0}


def ensure_dirs():
    REC_DIR.mkdir(parents=True, exist_ok=True)
    TTS_DIR.mkdir(parents=True, exist_ok=True)


def normalize_tts_text(raw: str) -> str:
    s = str(raw or "")
    s = s.replace("+1❤️", "加1颗红心").replace("+1 ❤️", "加1颗红心")
    s = s.replace("°C", "摄氏度").replace("mmHg", "毫米汞柱").replace("BPM", "次每分钟")
    s = EMOJI_STRIP_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s[:TTS_MAX_CHARS]


def compute_tts_key(clean_text: str) -> str:
    material = f"{VOLC_TTS_SPEAKER}|{VOLC_TTS_RATE}|{VOLC_TTS_TONE}|{clean_text}"
    return hashlib.sha256(material.encode("utf-8")).hexdigest()


def tts_cache_path(key: str) -> Path:
    return TTS_DIR / key[:2] / f"{key}.mp3"


def is_valid_mp3(buf: bytes) -> bool:
    if not buf or len(buf) < 512:
        return False
    if buf[:3] == b"ID3":
        return True
    if buf[0] == 0xFF and (buf[1] & 0xE0) == 0xE0:
        return True
    return False


def check_miss_quota(client_ip: str) -> str | None:
    now = time.time()
    day = time.strftime("%Y-%m-%d", time.gmtime(now))
    with _global_lock:
        if _daily_counter["day"] != day:
            _daily_counter["day"] = day
            _daily_counter["count"] = 0
        if _daily_counter["count"] >= TTS_PER_DAY:
            return "daily_tts_quota_reached"

        bucket = [t for t in _ip_hourly.get(client_ip, []) if now - t < 3600]
        if len(bucket) >= TTS_PER_IP_HOUR:
            _ip_hourly[client_ip] = bucket
            return "hourly_ip_quota_reached"

        bucket.append(now)
        _ip_hourly[client_ip] = bucket
        _daily_counter["count"] += 1
    return None


def get_key_lock(key: str) -> threading.Lock:
    with _global_lock:
        lk = _inflight_locks.get(key)
        if lk is None:
            lk = threading.Lock()
            _inflight_locks[key] = lk
        return lk


def release_key_lock(key: str, lk: threading.Lock):
    with _global_lock:
        if _inflight_locks.get(key) is lk and not lk.locked():
            _inflight_locks.pop(key, None)


def synthesize_doubao_mp3(clean_text: str) -> bytes:
    if not VOLC_TTS_KEY:
        raise RuntimeError("tts_key_not_configured")

    req_params: dict = {
        "text": clean_text,
        "speaker": VOLC_TTS_SPEAKER,
        "audio_params": {
            "format": "mp3",
            "sample_rate": 24000,
            "speech_rate": VOLC_TTS_RATE,
        },
    }
    if VOLC_TTS_TONE:
        req_params["additions"] = json.dumps(
            {"context_texts": [VOLC_TTS_TONE]}, ensure_ascii=False
        )

    payload = {
        "user": {"uid": "duwu-encyclopedia"},
        "req_params": req_params,
    }

    req = urllib.request.Request(
        VOLC_TTS_ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "X-Api-Key": VOLC_TTS_KEY,
            "X-Api-Resource-Id": VOLC_TTS_RESOURCE_ID,
            "X-Api-Request-Id": str(uuid.uuid4()),
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=16) as resp:
        raw_body = resp.read().decode("utf-8")

    chunks: list[bytes] = []
    for line in raw_body.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("data:"):
            line = line[5:].strip()
        if not line or line == "[DONE]":
            continue
        item = json.loads(line)
        code = item.get("code")
        if code and int(code) != 20000000:
            raise RuntimeError(f"doubao_code_{code}")
        data_b64 = item.get("data")
        if isinstance(data_b64, str) and data_b64:
            chunks.append(base64.b64decode(data_b64))

    mp3_bytes = b"".join(chunks)
    if not is_valid_mp3(mp3_bytes):
        raise RuntimeError("invalid_mp3_output")
    return mp3_bytes


def check_chat_quota(client_ip: str) -> str | None:
    now = time.time()
    day = time.strftime("%Y-%m-%d", time.gmtime(now))
    with _global_lock:
        if _chat_daily_counter["day"] != day:
            _chat_daily_counter["day"] = day
            _chat_daily_counter["count"] = 0
        if _chat_daily_counter["count"] >= CHAT_PER_DAY:
            return "daily_chat_quota_reached"

        bucket = [t for t in _chat_ip_hourly.get(client_ip, []) if now - t < 3600]
        if len(bucket) >= CHAT_PER_IP_HOUR:
            _chat_ip_hourly[client_ip] = bucket
            return "hourly_chat_ip_quota_reached"

        bucket.append(now)
        _chat_ip_hourly[client_ip] = bucket
        _chat_daily_counter["count"] += 1
    return None


def call_deepseek_chat(question: str, card: dict | None, history: list | None) -> str:
    if not AI_KEY:
        raise RuntimeError("ai_key_not_configured")

    sys_lines = [
        "你是《奇妙毒物科学游乐园》里的百科语音互动伙伴，正在跟一位聪明好奇的8岁小女孩实时对话。",
        "请严格遵守以下规则：",
        "1. 语气温暖亲切、充满童趣和科学好奇心，直接回答孩子的问题。",
        "2. 回答必须简短好听，控制在 55 到 115 个汉字之间（2到3句话），适合直接语音朗读，绝不长篇大论。",
        "3. 在回答中自然穿插 1 句简单地道、适合8岁孩子跟读的英文短句（4~8个单词，以英文句号或感叹号结尾），并紧跟中文意思。",
        "4. 只输出纯文本句子，严禁使用 Markdown 星号(*)、井号(#)、列表符号或表情符号。",
    ]

    if isinstance(card, dict) and card.get("name"):
        c_name = str(card.get("name") or "")[:40]
        c_mol = str(card.get("molecule") or "")[:80]
        c_sum = str(card.get("summary") or "")[:240]
        c_deep = str(card.get("biochemDeep") or "")[:240]
        c_en = str(card.get("en") or "")[:100]
        c_zh = str(card.get("zh") or "")[:100]
        sys_lines.append(
            f"当前孩子正在看的百科卡片是：【{c_name}】，秘密武器分子：{c_mol}。"
            f"卡片讲解：{c_sum} "
            + (f"深层原理：{c_deep} " if c_deep else "")
            + (f"卡片精选英语短句：{c_en} ({c_zh})" if c_en else "")
        )

    messages: list[dict[str, str]] = [{"role": "system", "content": "\n".join(sys_lines)}]

    if isinstance(history, list):
        for turn in history[-4:]:
            if not isinstance(turn, dict):
                continue
            r = turn.get("role")
            c = str(turn.get("content") or "").strip()[:220]
            if r in ("user", "assistant") and c:
                messages.append({"role": r, "content": c})

    messages.append({"role": "user", "content": question.strip()[:200]})

    payload = {
        "model": AI_MODEL,
        "messages": messages,
        "temperature": 0.65,
        "max_tokens": 260,
        "stream": False,
    }

    req = urllib.request.Request(
        f"{AI_BASE}/v1/chat/completions",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {AI_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) DuwuEncyclopedia/3.5",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=22) as resp:
        raw_body = resp.read().decode("utf-8")

    data = json.loads(raw_body)
    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("empty_chat_choices")

    content = (choices[0].get("message") or {}).get("content") or ""
    content = re.sub(r"<think>[\s\S]*?</think>", "", content, flags=re.I)
    content = re.sub(r"[*_#`~>]+", "", content)
    content = EMOJI_STRIP_RE.sub("", content)
    content = re.sub(r"\s+", " ", content).strip()
    if not content:
        raise RuntimeError("empty_chat_reply")
    return content[:320]


def clean_mime(raw: str) -> str:
    base = (raw or "audio/mp4").split(";")[0].strip().lower()
    if base in ALLOWED_REC_MIMES:
        return raw.strip() if len(raw.strip()) < 64 else base
    return "audio/mp4"


class DuwuVoiceAndTTSHandler(BaseHTTPRequestHandler):
    server_version = "DuwuVoiceServer/2.0"

    def log_message(self, fmt, *args):
        pass

    def _client_ip(self) -> str:
        xff = self.headers.get("X-Forwarded-For", "")
        if xff:
            return xff.split(",")[0].strip()
        return self.headers.get("X-Real-IP") or self.client_address[0]

    def _allowed_origin(self) -> bool:
        if not STRICT_ORIGIN:
            return True
        ref = (self.headers.get("Referer") or "").lower()
        orig = (self.headers.get("Origin") or "").lower()
        sec = (self.headers.get("Sec-Fetch-Site") or "").lower()
        if sec == "same-origin":
            return True
        for allowed in ("crm.truing.top", "127.0.0.1", "localhost"):
            if allowed in ref or allowed in orig:
                return True
        return False

    def _send_json(self, code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_audio_bytes(self, data: bytes, mime: str, cache_control: str, extra_headers: dict | None = None):
        total = len(data)
        range_hdr = self.headers.get("Range")
        if range_hdr and range_hdr.startswith("bytes="):
            try:
                start_s, end_s = range_hdr[6:].split("-", 1)
                start = int(start_s) if start_s else 0
                end = int(end_s) if end_s else total - 1
                start = max(0, min(start, total - 1))
                end = max(start, min(end, total - 1))
                chunk = data[start : end + 1]
                self.send_response(206)
                self.send_header("Content-Type", mime)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {start}-{end}/{total}")
                self.send_header("Content-Length", str(len(chunk)))
                self.send_header("Cache-Control", cache_control)
                if extra_headers:
                    for hk, hv in extra_headers.items():
                        self.send_header(hk, hv)
                self.end_headers()
                self.wfile.write(chunk)
                return
            except Exception:
                pass

        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(total))
        self.send_header("Cache-Control", cache_control)
        if extra_headers:
            for hk, hv in extra_headers.items():
                self.send_header(hk, hv)
        self.end_headers()
        self.wfile.write(data)

    def _handle_tts(self, raw_text: str):
        clean_text = normalize_tts_text(raw_text)
        if not clean_text:
            return self._send_json(400, {"ok": False, "error": "empty_text"})

        ensure_dirs()
        key = compute_tts_key(clean_text)
        cache_file = tts_cache_path(key)

        # 1. Fast-path permanent disk cache HIT (zero Doubao API cost!)
        if cache_file.exists():
            data = cache_file.read_bytes()
            if is_valid_mp3(data):
                with _global_lock:
                    _stats["hits"] += 1
                return self._send_audio_bytes(
                    data,
                    "audio/mpeg",
                    "public, max-age=31536000, immutable",
                    {"X-TTS-Cache": "HIT", "X-TTS-Key": key[:16]},
                )

        # 2. Cache MISS: verify origin & quota before spending any API call
        if not VOLC_TTS_KEY:
            return self._send_json(503, {"ok": False, "error": "tts_not_configured"})
        if not self._allowed_origin():
            return self._send_json(403, {"ok": False, "error": "forbidden_origin"})

        # 3. Singleflight lock so concurrent requests for the same text only call Doubao ONCE!
        lk = get_key_lock(key)
        lk.acquire()
        try:
            if cache_file.exists():
                data = cache_file.read_bytes()
                if is_valid_mp3(data):
                    with _global_lock:
                        _stats["hits"] += 1
                    return self._send_audio_bytes(
                        data,
                        "audio/mpeg",
                        "public, max-age=31536000, immutable",
                        {"X-TTS-Cache": "HIT", "X-TTS-Key": key[:16]},
                    )

            quota_err = check_miss_quota(self._client_ip())
            if quota_err:
                return self._send_json(429, {"ok": False, "error": quota_err})

            mp3_bytes = synthesize_doubao_mp3(clean_text)
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            tmp_path = cache_file.with_suffix(f".{uuid.uuid4().hex[:8]}.tmp")
            tmp_path.write_bytes(mp3_bytes)
            tmp_path.replace(cache_file)

            with _global_lock:
                _stats["misses"] += 1

            return self._send_audio_bytes(
                mp3_bytes,
                "audio/mpeg",
                "public, max-age=31536000, immutable",
                {"X-TTS-Cache": "MISS", "X-TTS-Key": key[:16]},
            )
        except Exception as exc:
            with _global_lock:
                _stats["errors"] += 1
            return self._send_json(502, {"ok": False, "error": "tts_synthesis_failed", "detail": str(exc)[:120]})
        finally:
            lk.release()
            release_key_lock(key, lk)

    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()

    def _handle_chat(self, body: dict):
        question = str(body.get("question") or "").strip()
        if not question:
            return self._send_json(400, {"ok": False, "error": "empty_question"})
        if not AI_KEY:
            return self._send_json(503, {"ok": False, "error": "ai_not_configured"})
        if not self._allowed_origin():
            return self._send_json(403, {"ok": False, "error": "forbidden_origin"})

        quota_err = check_chat_quota(self._client_ip())
        if quota_err:
            return self._send_json(429, {"ok": False, "error": quota_err})

        card = body.get("card") if isinstance(body.get("card"), dict) else None
        history = body.get("history") if isinstance(body.get("history"), list) else None
        try:
            reply = call_deepseek_chat(question, card, history)
            with _global_lock:
                _stats["chats"] += 1
            return self._send_json(200, {"ok": True, "reply": reply, "model": AI_MODEL})
        except Exception as exc:
            with _global_lock:
                _stats["errors"] += 1
            return self._send_json(502, {"ok": False, "error": "chat_failed", "detail": str(exc)[:140]})

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/tts/stats":
            ensure_dirs()
            files = list(TTS_DIR.rglob("*.mp3"))
            total_bytes = sum(f.stat().st_size for f in files if f.is_file())
            with _global_lock:
                snap = dict(_stats)
            return self._send_json(200, {
                "ok": True,
                "configured": bool(VOLC_TTS_KEY),
                "speaker": VOLC_TTS_SPEAKER,
                "aiConfigured": bool(AI_KEY),
                "aiModel": AI_MODEL,
                "cachedFiles": len(files),
                "cachedMB": round(total_bytes / 1048576, 2),
                "hits": snap["hits"],
                "misses": snap["misses"],
                "chats": snap["chats"],
                "errors": snap["errors"],
            })

        if path == "/api/tts":
            qs = parse_qs(parsed.query)
            text = (qs.get("t") or qs.get("text") or [""])[0]
            return self._handle_tts(text)

        if path == "/api/recordings":
            ensure_dirs()
            items = []
            for meta_file in sorted(REC_DIR.glob("*.json")):
                try:
                    meta = json.loads(meta_file.read_text("utf-8"))
                    aid = meta.get("id", "")
                    bin_file = REC_DIR / f"{aid}.bin"
                    if ARCHIVE_ID_RE.match(aid) and bin_file.exists():
                        items.append({
                            "id": aid,
                            "mimeType": meta.get("mimeType", "audio/mp4"),
                            "duration": meta.get("duration", 1),
                            "updatedAt": meta.get("updatedAt", 0),
                            "size": bin_file.stat().st_size,
                        })
                except Exception:
                    continue
            return self._send_json(200, {"ok": True, "items": items})

        if path.startswith("/api/recordings/"):
            aid = path.split("/")[-1]
            if not ARCHIVE_ID_RE.match(aid):
                return self._send_json(400, {"ok": False, "error": "invalid_archive_id"})
            meta_file = REC_DIR / f"{aid}.json"
            bin_file = REC_DIR / f"{aid}.bin"
            if not meta_file.exists() or not bin_file.exists():
                return self._send_json(404, {"ok": False, "error": "not_found"})

            meta = json.loads(meta_file.read_text("utf-8"))
            data = bin_file.read_bytes()
            return self._send_audio_bytes(data, meta.get("mimeType", "audio/mp4"), "no-cache")

        return self._send_json(404, {"ok": False, "error": "route_not_found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/tts":
            length = int(self.headers.get("Content-Length", "0") or "0")
            if length <= 0 or length > 8192:
                return self._send_json(400, {"ok": False, "error": "invalid_body"})
            try:
                body = json.loads(self.rfile.read(length).decode("utf-8"))
                text = body.get("text") or body.get("t") or ""
            except Exception:
                return self._send_json(400, {"ok": False, "error": "invalid_json"})
            return self._handle_tts(text)

        if path == "/api/chat":
            length = int(self.headers.get("Content-Length", "0") or "0")
            if length <= 0 or length > 16384:
                return self._send_json(400, {"ok": False, "error": "invalid_body"})
            try:
                body = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception:
                return self._send_json(400, {"ok": False, "error": "invalid_json"})
            return self._handle_chat(body)

        if not path.startswith("/api/recordings/"):
            return self._send_json(404, {"ok": False, "error": "route_not_found"})

        aid = path.split("/")[-1]
        if not ARCHIVE_ID_RE.match(aid):
            return self._send_json(400, {"ok": False, "error": "invalid_archive_id"})

        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 100 or length > MAX_REC_BYTES:
            return self._send_json(413, {"ok": False, "error": "invalid_payload_size"})

        raw = self.rfile.read(length)
        mime = clean_mime(self.headers.get("Content-Type", "audio/mp4"))
        try:
            dur = max(1, min(60, int(float(self.headers.get("X-Duration-Sec", "5")))))
        except Exception:
            dur = 5

        ensure_dirs()
        now_ms = int(time.time() * 1000)
        tmp_bin = REC_DIR / f"{aid}.bin.tmp"
        tmp_meta = REC_DIR / f"{aid}.json.tmp"
        tmp_bin.write_bytes(raw)
        tmp_meta.write_text(json.dumps({
            "id": aid,
            "mimeType": mime,
            "duration": dur,
            "updatedAt": now_ms,
            "size": len(raw),
        }, ensure_ascii=False), encoding="utf-8")
        tmp_bin.replace(REC_DIR / f"{aid}.bin")
        tmp_meta.replace(REC_DIR / f"{aid}.json")

        return self._send_json(200, {"ok": True, "id": aid, "updatedAt": now_ms})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        if not path.startswith("/api/recordings/"):
            return self._send_json(404, {"ok": False, "error": "route_not_found"})

        aid = path.split("/")[-1]
        if not ARCHIVE_ID_RE.match(aid):
            return self._send_json(400, {"ok": False, "error": "invalid_archive_id"})

        for ext in ("bin", "json"):
            f = REC_DIR / f"{aid}.{ext}"
            if f.exists():
                f.unlink()
        return self._send_json(200, {"ok": True, "id": aid})


if __name__ == "__main__":
    ensure_dirs()
    srv = ThreadingHTTPServer((HOST, PORT), DuwuVoiceAndTTSHandler)
    print(
        f"🎙️ Duwu Voice & Doubao TTS Server on http://{HOST}:{PORT} "
        f"(tts={'ON:' + VOLC_TTS_SPEAKER if VOLC_TTS_KEY else 'OFF'}, cache={TTS_DIR})",
        flush=True,
    )
    srv.serve_forever()
