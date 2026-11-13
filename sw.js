// 奇妙毒物科学游乐园 Service Worker (iPad 离线秒开 & 海外实拍图极速缓存)
const CACHE_NAME = "duwu-playground-v3.5";
const CORE_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/data-catalog.js",
  "./js/data-bilingual.js",
  "./js/data-photos.js",
  "./js/data-molecules3d.js",
  "./js/data-labs.js",
  "./js/data-hunt-scenes.js",
  "./js/visualizers.js",
  "./js/doubao-tts.js",
  "./js/ai-companion.js",
  "./js/upgrade1-ecosystem.js",
  "./js/upgrade2-molsurgery.js",
  "./js/upgrade3-battler.js",
  "./js/upgrade4-voice.js",
  "./js/app.js",
  "./assets/apple-touch-icon.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 录音云同步 API 永远直连网络，不走 SW 缓存
  if (url.pathname.includes("/api/")) return;

  // 图片与静态素材：Cache-First + 后台更新，海外服务器二次打开 0 毫秒！
  if (url.pathname.includes("/assets/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        const netPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || netPromise;
      })
    );
    return;
  }

  // HTML / JS / CSS：Network-First 保证代码更新即时生效，断网自动回退离线缓存！
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
