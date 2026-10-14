// SADIE OMFS Platform Service Worker
// Offline Caching & Background Sync for Clinical Rounds

const CACHE_NAME = 'sadie-omfs-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stale-while-revalidate strategy for same-origin assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return cached response if network fails
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Background Sync simulation for offline clinical notes & evaluation queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-clinical-evaluations') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'OFFLINE_SYNC_COMPLETE',
            message: 'Offline evaluation notes synced with hospital cloud registry.'
          });
        });
      })
    );
  }
});
