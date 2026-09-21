const CACHE = "mtulivu-v19";
const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css?v=29",
  "./app.js?v=29",
  "./quotes.js",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./apple-touch-icon.png",
  "./icons/favicon-16.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./gfx-guru-sam/guru-samhilt.png",
  "./gfx-guru-sam/season-summer.jpg",
  "./gfx-guru-sam/season-fall.jpg",
  "./gfx-guru-sam/season-winter.jpg",
  "./gfx-guru-sam/season-spring.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      });
    }),
  );
});
