#!/bin/zsh
cd "$(dirname "$0")"
PORT=8892
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "========================================================"
echo "🧬 奇妙毒物科学馆 · 分子探索站 已启动！"
echo ""
echo "💻 电脑浏览器访问："
echo "   http://localhost:${PORT}"
echo ""
echo "📱 平板 (iPad) 局域网访问（连同一个家里 Wi-Fi）："
echo "   http://${LOCAL_IP}:${PORT}"
echo "   （在 iPad Safari 打开后，点右上角分享 -> 添加到主屏幕，即可全屏畅玩！）"
echo "========================================================"

open "http://localhost:${PORT}"
python3 -m http.server ${PORT} --bind 0.0.0.0
