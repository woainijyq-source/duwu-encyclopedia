#!/usr/bin/env python3
"""
Pre-synthesizes all v8.0 Full-English texts into Duwu's permanent server-side
SHA-256 TTS cache (/www/wwwroot/duwu-encyclopedia/shared-data/tts-cache/)
using the user's self-hosted zero-cost VoxCPM2 GPU gateway (127.0.0.1:18888).

Zero hardcoded secrets: reads VOXCPM_TTS_ENDPOINT / VOXCPM_TTS_KEY / VOXCPM_TTS_VOICE
directly from /www/wwwroot/duwu-encyclopedia/shared-data/tts.env (or environment).
Resumable, atomic, and 100% key-compatible with deploy/voice_server.py.
"""

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
import uuid
from pathlib import Path

SHARED_ROOT = Path(os.environ.get("DUWU_SHARED_DIR", "/www/wwwroot/duwu-encyclopedia/shared-data"))
TTS_ENV_FILE = SHARED_ROOT / "tts.env"
TTS_DIR = Path(os.environ.get("DUWU_TTS_CACHE_DIR", str(SHARED_ROOT / "tts-cache")))
TTS_MAX_CHARS = 1200

EMOJI_STRIP_RE = re.compile(
    r"[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b00-\u2bff\ufe0f✓✗×➕➖👇👆👈👉➜]+"
)


def load_env():
    if TTS_ENV_FILE.exists():
        for line in TTS_ENV_FILE.read_text("utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            if k and not os.environ.get(k):
                os.environ[k] = v


def normalize_tts_text(raw: str) -> str:
    s = str(raw or "")
    has_zh = bool(re.search(r"[\u4e00-\u9fff]", s))
    if has_zh:
        s = s.replace("+1❤️", "加1颗红心").replace("+1 ❤️", "加1颗红心")
        s = s.replace("°C", "摄氏度").replace("mmHg", "毫米汞柱").replace("BPM", "次每分钟")
    else:
        s = s.replace("°C", " degrees Celsius").replace("mmHg", " millimeters of mercury").replace("BPM", " beats per minute")
        s = s.replace("—", ", ")
    s = EMOJI_STRIP_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"([。！？；，、：”』」）》])\s+", r"\1", s).strip()
    return s[:TTS_MAX_CHARS]


def compute_tts_key(clean_text: str, voice: str) -> str:
    material = f"voxcpm2|{voice}|{clean_text}"
    return hashlib.sha256(material.encode("utf-8")).hexdigest()


def is_valid_mp3(buf: bytes) -> bool:
    if not buf or len(buf) < 512:
        return False
    return buf[:3] == b"ID3" or (buf[0] == 0xFF and (buf[1] & 0xE0) == 0xE0)


def main():
    load_env()
    endpoint = (os.environ.get("VOXCPM_TTS_ENDPOINT") or "http://127.0.0.1:18888/tts/v1/audio/speech").strip()
    api_key = (os.environ.get("VOXCPM_TTS_KEY") or "").strip()
    voice = (os.environ.get("VOXCPM_TTS_VOICE") or "doubao_vivi").strip()
    if not api_key:
        print("ERROR: VOXCPM_TTS_KEY not configured in tts.env or environment!", file=sys.stderr)
        sys.exit(1)

    jobs_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("v8_tts_texts.json")
    max_tier = int(sys.argv[2]) if len(sys.argv) > 2 else 99
    jobs = json.loads(jobs_path.read_text("utf-8"))
    jobs = [j for j in jobs if int(j.get("tier", 1)) <= max_tier]

    ffmpeg_bin = shutil.which("ffmpeg")
    TTS_DIR.mkdir(parents=True, exist_ok=True)

    total = len(jobs)
    hits = 0
    synth = 0
    errors = 0
    t_start = time.time()

    print(f"🎙️ Pre-warming {total} clips via {endpoint} (voice={voice}, ffmpeg={bool(ffmpeg_bin)})", flush=True)

    for idx, j in enumerate(jobs, 1):
        clean = normalize_tts_text(j["text"])
        if not clean:
            continue
        key = compute_tts_key(clean, voice)
        cache_file = TTS_DIR / key[:2] / f"{key}.mp3"
        if cache_file.exists() and cache_file.stat().st_size >= 512:
            hits += 1
            continue

        t0 = time.time()
        try:
            payload = {
                "model": "voxcpm2",
                "input": clean,
                "voice": voice,
                "response_format": "mp3",
                "steps": 10 if len(clean) <= 30 else 8,
                "auto_wake": True,
            }
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw_mp3 = resp.read()
            if not is_valid_mp3(raw_mp3):
                raise RuntimeError("invalid_mp3_bytes")

            cache_file.parent.mkdir(parents=True, exist_ok=True)
            tmp_raw = cache_file.with_suffix(f".{uuid.uuid4().hex[:6]}.raw.mp3")
            tmp_out = cache_file.with_suffix(f".{uuid.uuid4().hex[:6]}.tmp")
            tmp_raw.write_bytes(raw_mp3)

            if ffmpeg_bin:
                subprocess.run(
                    [ffmpeg_bin, "-y", "-v", "error", "-i", str(tmp_raw), "-ac", "1", "-ar", "24000", "-b:a", "64k", str(tmp_out)],
                    check=True,
                )
                tmp_raw.unlink(missing_ok=True)
                tmp_out.replace(cache_file)
            else:
                tmp_raw.replace(cache_file)

            synth += 1
            if synth <= 10 or synth % 20 == 0 or idx == total:
                elapsed = time.time() - t_start
                print(
                    f"  [{idx}/{total}] T{j.get('tier')} {j.get('id')} OK "
                    f"({cache_file.stat().st_size//1024}KB, {time.time()-t0:.1f}s) | "
                    f"cached={hits+synth}/{total} err={errors} elapsed={elapsed/60:.1f}m",
                    flush=True,
                )
        except Exception as exc:
            errors += 1
            print(f"  [{idx}/{total}] ERR {j.get('id')}: {exc}", flush=True)
            time.sleep(2.0)

    print(f"✅ Pre-warm finished! hits={hits}, newly_synthesized={synth}, errors={errors}, total_min={(time.time()-t_start)/60:.1f}m", flush=True)


if __name__ == "__main__":
    main()
