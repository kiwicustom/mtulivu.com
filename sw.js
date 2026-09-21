const CACHE = "mtulivu-v31";
const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css?v=43",
  "./app.js?v=37",
  "./quotes.js",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./apple-touch-icon.png",
  "./icons/favicon-16.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./gfx-guru-sam/sam-guru-with-kcal-buddy-kcal.lol.png",
  "./gfx-guru-sam/season-summer.jpg",
  "./gfx-guru-sam/season-fall.jpg",
  "./gfx-guru-sam/season-winter.jpg",
  "./gfx-guru-sam/season-spring.jpg",
];

function isPage(request) {
  if (request.mode === "navigate") return true;
  const url = new URL(request.url);
  return url.pathname === "/" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/");
}

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
  if (isPage(event.request) || event.request.url.includes("/sw.js")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((hit) => {
      const fetched = fetch(event.request).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      });
      return hit || fetched;
    }),
  );
});
