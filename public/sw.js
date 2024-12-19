importScripts('./service-worker/cache-manager.js');
importScripts('./service-worker/sync-manager.js');
importScripts('./service-worker/notification-handler.js');

// Force HTTPS
self.addEventListener('fetch', (event) => {
  // Check if the request is for HTTP
  if (event.request.url.startsWith('http:') && !event.request.url.includes('localhost')) {
    // Create a new request with HTTPS
    const secureUrl = event.request.url.replace('http:', 'https:');
    event.respondWith(
      fetch(new Request(secureUrl, event.request))
    );
    return;
  }

  // Handle other requests normally
  if (event.request.method !== 'GET') return;
  event.respondWith(handleFetch(event));
});

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(initCache());
  self.skipWaiting();
});

// Activate event - cleanup old caches and register periodic sync
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      cleanupOldCaches(),
      // Enable periodic background sync if supported
      (async () => {
        if ('periodicSync' in self.registration) {
          try {
            await self.registration.periodicSync.register('sync-content', {
              minInterval: 24 * 60 * 60 * 1000 // 24 hours
            });
          } catch (error) {
            console.error('Periodic Sync could not be registered:', error);
          }
        }
      })()
    ])
  );
  self.clients.claim();
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-health-records') {
    event.waitUntil(syncHealthRecords());
  } else if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-content') {
    event.waitUntil(syncAllContent());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.waitUntil(handleNotificationClick(event));
});
