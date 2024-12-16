importScripts('./service-worker/cache-manager.js');
importScripts('./service-worker/sync-manager.js');

// Cache name for storing assets
const CACHE_NAME = 'pawcare-v1';

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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        'https://pupcare-companion.lovable.app/icons/icon-72x72.png',
        'https://pupcare-companion.lovable.app/icons/icon-96x96.png',
        'https://pupcare-companion.lovable.app/icons/icon-128x128.png',
        'https://pupcare-companion.lovable.app/icons/icon-144x144.png',
        'https://pupcare-companion.lovable.app/icons/icon-152x152.png',
        'https://pupcare-companion.lovable.app/icons/icon-192x192.png',
        'https://pupcare-companion.lovable.app/icons/icon-384x384.png',
        'https://pupcare-companion.lovable.app/icons/icon-512x512.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x72.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x96.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x128.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x144.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x152.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x192.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x384.png',
        'https://pupcare-companion.lovable.app/icons/maskable_icon_x512.png'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches());
  self.clients.claim();
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() ?? 'New notification',
    icon: '/icons/maskable_icon_x192.png',
    badge: '/icons/maskable_icon_x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('PawCare', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// Sync event - handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag.startsWith('sync-')) {
    const storeName = event.tag.replace('sync-', '');
    event.waitUntil(syncData(storeName));
  }
});

// Helper function to sync data
async function syncData(storeName) {
  const records = await syncManager.getUnsynced(storeName);
  
  for (const record of records) {
    try {
      const response = await fetch(`/api/${storeName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record.data)
      });

      if (response.ok) {
        await syncManager.markSynced(storeName, record.id);
      }
    } catch (error) {
      console.error(`Sync failed for ${storeName}:`, error);
    }
  }
}
