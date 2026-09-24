// Service worker for /app: keeps the app shell and viewed images available offline.
const CACHE = "nn-app-v1";
const SHELL = ["/app", "/app.webmanifest", "/app-icon.svg", "/app-icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("nn-app-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages and live data: network first, cached copy when offline.
  if (req.mode === "navigate" || url.pathname === "/api/social") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(CACHE).then((c) => c.put(req.mode === "navigate" ? "/app" : req, copy));
          return res;
        })
        .catch(() => caches.match(req.mode === "navigate" ? "/app" : req))
    );
    return;
  }

  // Static assets, fonts and images: cache first, refresh in the background.
  const cacheable =
    url.origin === self.location.origin ? url.pathname.startsWith("/_next/static/") || /\.(png|svg|jpg|webp)$/.test(url.pathname)
    : /(nitinnabin\.com|ytimg\.com|fonts\.(googleapis|gstatic)\.com)$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok || res.type === "opaque") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
