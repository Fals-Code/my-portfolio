// ==========================================
// Falah.dev Service Worker — Cache Strategy
// Cache-First for static assets
// Network-First for API calls
// ==========================================

const CACHE_NAME = 'falah-v1';
const STATIC_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/stack',
  '/contact',
];

// Install: pre-cache key pages
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls: Network-First (fallback to cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (_next/static): Cache-First
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Pages: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        caches.open(CACHE_NAME).then((c) => c.put(request, response.clone()));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});
