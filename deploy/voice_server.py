#!/usr/bin/env python3
"""
奇妙毒物游乐园 · 小馆长配音云同步轻量服务 (Zero-dependency Python 3 stdlib)
Routes:
  GET    /api/recordings              -> {"ok": true, "items": [{"id","mimeType","duration","updatedAt","size"}]}
  GET    /api/recordings/<archiveId>  -> binary audio (supports iOS/iPadOS Safari HTTP 206 Byte-Range!)
  POST   /api/recordings/<archiveId>  -> save audio binary + metadata JSON
  DELETE /api/recordings/<archiveId>  -> remove audio + metadata JSON
"""

import json
import os
import re
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ARCHIVE_ID_RE = re.compile(r"^ch[0-8]-\d{2}$")
MAX_BYTES = 3_600_000  # 3.6 MB max per 35s clip
ALLOWED_MIMES = {
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
}

DATA_DIR = Path(os.environ.get("DUWU_VOICE_DIR", "/www/wwwroot/duwu-encyclopedia/shared-data/recordings"))
HOST = os.environ.get("DUWU_VOICE_HOST", "127.0.0.1")
PORT = int(os.environ.get("DUWU_VOICE_PORT", "8798"))


def ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def clean_mime(raw: str) -> str:
    base = (raw or "audio/mp4").split(";")[0].strip().lower()
    if base in ALLOWED_MIMES:
        return raw.strip() if len(raw.strip()) < 64 else base
    return "audio/mp4"


class VoiceAPIHandler(BaseHTTPRequestHandler):
    server_version = "DuwuVoiceServer/1.0"

    def log_message(self, fmt, *args):
        pass

    def _send_json(self, code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/recordings":
            ensure_dir()
            items = []
            for meta_file in sorted(DATA_DIR.glob("*.json")):
                try:
                    meta = json.loads(meta_file.read_text("utf-8"))
                    aid = meta.get("id", "")
                    bin_file = DATA_DIR / f"{aid}.bin"
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
            meta_file = DATA_DIR / f"{aid}.json"
            bin_file = DATA_DIR / f"{aid}.bin"
            if not meta_file.exists() or not bin_file.exists():
                return self._send_json(404, {"ok": False, "error": "not_found"})

            meta = json.loads(meta_file.read_text("utf-8"))
            data = bin_file.read_bytes()
            total = len(data)
            mime = meta.get("mimeType", "audio/mp4")

            # Support iOS/iPadOS Safari Range requests (HTTP 206 Partial Content)
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
                    self.send_header("Cache-Control", "no-cache")
                    self.end_headers()
                    self.wfile.write(chunk)
                    return
                except Exception:
                    pass

            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Length", str(total))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(data)
            return

        return self._send_json(404, {"ok": False, "error": "route_not_found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        if not path.startswith("/api/recordings/"):
            return self._send_json(404, {"ok": False, "error": "route_not_found"})

        aid = path.split("/")[-1]
        if not ARCHIVE_ID_RE.match(aid):
            return self._send_json(400, {"ok": False, "error": "invalid_archive_id"})

        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 100 or length > MAX_BYTES:
            return self._send_json(413, {"ok": False, "error": "invalid_payload_size"})

        raw = self.rfile.read(length)
        mime = clean_mime(self.headers.get("Content-Type", "audio/mp4"))
        try:
            dur = max(1, min(60, int(float(self.headers.get("X-Duration-Sec", "5")))))
        except Exception:
            dur = 5

        ensure_dir()
        now_ms = int(time.time() * 1000)
        tmp_bin = DATA_DIR / f"{aid}.bin.tmp"
        tmp_meta = DATA_DIR / f"{aid}.json.tmp"
        tmp_bin.write_bytes(raw)
        tmp_meta.write_text(json.dumps({
            "id": aid,
            "mimeType": mime,
            "duration": dur,
            "updatedAt": now_ms,
            "size": len(raw),
        }, ensure_ascii=False), encoding="utf-8")
        tmp_bin.replace(DATA_DIR / f"{aid}.bin")
        tmp_meta.replace(DATA_DIR / f"{aid}.json")

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
            f = DATA_DIR / f"{aid}.{ext}"
            if f.exists():
                f.unlink()
        return self._send_json(200, {"ok": True, "id": aid})


if __name__ == "__main__":
    ensure_dir()
    srv = ThreadingHTTPServer((HOST, PORT), VoiceAPIHandler)
    print(f"🎙️ Duwu Curator Voice Server listening on http://{HOST}:{PORT} (dir={DATA_DIR})", flush=True)
    srv.serve_forever()
