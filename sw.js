const CACHE = "roto-tanks-v19";
const CORE = [
  "./",
  "./index.html",
  "./products.html",
  "./water-tank-prices-kenya.html",
  "./css/site.min.css",
  "./css/hero-logo.css",
  "./js/app.min.js",
  "./js/products.min.js",
  "./js/buyer-tools.js",
  "./data/products.min.js",
  "./images/hero/roto-tanks-logo-hero.jpeg",
  "./images/icons/icon.svg",
  "./images/icons/apple-touch-icon.png",
  "./images/icons/whatsapp.svg",
  "./images/icons/telephone-fill.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (isSameOrigin && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (isSameOrigin && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
