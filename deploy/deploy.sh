#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_HOST="insurance-crm-us"
REMOTE_BASE="/www/wwwroot/duwu-encyclopedia"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)"
REMOTE_REL="${REMOTE_BASE}/releases/${RELEASE_ID}"

echo "==> [1/5] Creating remote release & persistent voice storage directories..."
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_REL}' '${REMOTE_BASE}/shared-data/recordings'"

echo "==> [2/5] Uploading static & PWA bundle (index.html, manifest.webmanifest, sw.js, css, js, assets)..."
tar -C "${PROJECT_DIR}" -czf - index.html manifest.webmanifest sw.js css js assets | ssh "${REMOTE_HOST}" "tar -xzf - -C '${REMOTE_REL}' && chmod -R a+rX '${REMOTE_REL}'"

echo "==> [3/5] Installing Curator Voice Sync API service (127.0.0.1:8798)..."
scp -q "${PROJECT_DIR}/deploy/voice_server.py" "${REMOTE_HOST}:${REMOTE_BASE}/shared-data/voice_server.py"
scp -q "${PROJECT_DIR}/deploy/duwu-voice.service" "${REMOTE_HOST}:/etc/systemd/system/duwu-voice.service"
ssh "${REMOTE_HOST}" "chmod +x '${REMOTE_BASE}/shared-data/voice_server.py' && systemctl daemon-reload && systemctl enable duwu-voice.service && systemctl restart duwu-voice.service"

echo "==> [4/5] Updating current symlink atomically..."
ssh "${REMOTE_HOST}" "ln -sfn '${REMOTE_REL}' '${REMOTE_BASE}/current'"

echo "==> [5/5] Installing Nginx snippet and reloading..."
scp -q "${PROJECT_DIR}/deploy/nginx-duwu.conf" "${REMOTE_HOST}:/etc/nginx/snippets/duwu-encyclopedia.conf"

ssh "${REMOTE_HOST}" 'python3 - << "PY"
import shutil, time
p = "/etc/nginx/sites-available/insurance-crm"
with open(p, "r", encoding="utf-8") as f:
    txt = f.read()

inc = "    # Duwu Encyclopedia (奇妙毒物科学游乐园) static route; preserve on CRM releases.\n    include /etc/nginx/snippets/duwu-encyclopedia*.conf;\n"
target = "    include /etc/nginx/snippets/exploded-manual*.conf;\n"

if "duwu-encyclopedia" not in txt:
    assert txt.count(target) == 2, f"Expected 2 exploded-manual includes, got {txt.count(target)}"
    shutil.copy2(p, f"{p}.bak.{int(time.time())}")
    new_txt = txt.replace(target, target + "\n" + inc)
    with open(p, "w", encoding="utf-8") as f:
        f.write(new_txt)
    print("Added duwu-encyclopedia snippet include to both port 80 and 443 blocks.")
else:
    print("duwu-encyclopedia snippet include already present.")
PY
nginx -t && systemctl reload nginx'

echo "✅ Deployed successfully to: https://crm.truing.top/duwu/"
