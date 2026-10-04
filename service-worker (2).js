// 修改題目或程式後，把版本號 +1，使用者下次開啟就會更新
const CACHE = "fill-exam-v5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg",
               "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 先抓網路最新版，沒網路時用快取（離線也能刷題）
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then(r => r || caches.match("./index.html")))
  );
});
