// ============================================
// Webowo v3.0 – Service Worker
// Cache-first for static, network-first for API
// ============================================

const CACHE_NAME = 'webowo-v3-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

const API_CACHE_NAME = 'webowo-v3-api-cache-v1';
const API_ROUTES = ['/api/v2/', '/api/'];

// Install: cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // API requests: stale-while-revalidate
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Revalidate in background
        fetch(request).then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        return response;
      });
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  // Implementation would queue and retry failed form submissions
  console.log('[SW] Syncing contact forms...');
}

// Push notifications (placeholder)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Webowo', {
      body: data.body || 'Nowe powiadomienie',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false
    })
  );
});
