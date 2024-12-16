importScripts('./service-worker/cache-manager.js');
importScripts('./service-worker/sync-manager.js');

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(initCache());
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches());
  self.clients.claim();
});

// Fetch event - handle offline support
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(handleFetch(event));
});

// Sync event - handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag.startsWith('sync-')) {
    const storeName = event.tag.replace('sync-', '');
    event.waitUntil(syncData(storeName));
  }
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