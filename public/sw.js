// Service Worker für Gemilike Website
// Version 1.0.0

const CACHE_NAME = 'gemilike-v1';
const RUNTIME_CACHE = 'gemilike-runtime-v1';

// Ressourcen, die beim Installieren gecacht werden sollen
const PRECACHE_URLS = [
  '/',
  '/shop',
  '/contact',
  '/wissenswertes',
  '/logo.png',
  '/favicon.ico',
];

// Install Event - Cache wichtige Ressourcen
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching static assets');
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('[Service Worker] Failed to precache some assets:', err);
        });
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting();
      })
  );
});

// Activate Event - Alte Caches löschen
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Lösche alte Caches
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      // Übernehme Kontrolle über alle Clients
      return self.clients.claim();
    })
  );
});

// Fetch Event - Cache-First Strategie
self.addEventListener('fetch', (event) => {
  // Nur GET-Requests cachen
  if (event.request.method !== 'GET') {
    return;
  }

  // Externe Ressourcen nicht cachen
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API-Requests nicht cachen (immer fresh)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Cache Hit - verwende gecachte Version
          return cachedResponse;
        }

        // Cache Miss - fetch und cache
        return fetch(event.request)
          .then((response) => {
            // Nur erfolgreiche Responses cachen
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response für Cache
            const responseToCache = response.clone();

            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback für Offline
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#ccc"/><text x="50%" y="50%" text-anchor="middle" fill="#666">Bild nicht verfügbar</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Background Sync für Offline-Aktionen (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[Service Worker] Background sync triggered');
    // Hier können Offline-Aktionen synchronisiert werden
  }
});

// Push Notifications (optional)
self.addEventListener('push', () => {
  console.log('[Service Worker] Push notification received');
  // Push-Benachrichtigungen können hier implementiert werden
});

