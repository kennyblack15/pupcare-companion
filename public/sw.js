importScripts('/src/service-worker/cache-manager.ts');
importScripts('/src/service-worker/notification-handler.ts');
importScripts('/src/service-worker/sync-manager.ts');

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(initializeCache());
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches());
  self.clients.claim();
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event));
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.waitUntil(handleNotificationClick(event));
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});