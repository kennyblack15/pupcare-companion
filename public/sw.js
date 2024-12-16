importScripts('./service-worker/cache-manager.js');
importScripts('./service-worker/sync-manager.js');
importScripts('./service-worker/notification-handler.js');

// Cache name for storing assets
const CACHE_NAME = 'pawcare-v1';
const PERIODIC_SYNC_TAG = 'periodic-sync';

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://pupcare-companion.lovable.app/icons/icon-192x192.png',
  'https://pupcare-companion.lovable.app/icons/icon-512x512.png'
];

// Dynamic routes to cache
const DYNAMIC_ROUTES = [
  '/health',
  '/medications',
  '/grooming',
  '/profiles',
  '/vets'
];

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
      return cache.addAll([...STATIC_ASSETS, ...DYNAMIC_ROUTES]);
    })
  );
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
            await self.registration.periodicSync.register(PERIODIC_SYNC_TAG, {
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
  if (event.tag.startsWith('sync-')) {
    const storeName = event.tag.replace('sync-', '');
    event.waitUntil(syncData(storeName));
  }
});

// Periodic background sync event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === PERIODIC_SYNC_TAG) {
    event.waitUntil(updateAppContent());
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

// Helper function to update app content
async function updateAppContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update static assets
    await Promise.all(
      STATIC_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.error(`Failed to update ${url}:`, error);
        }
      })
    );

    // Update dynamic routes
    await Promise.all(
      DYNAMIC_ROUTES.map(async (route) => {
        try {
          const response = await fetch(route, { cache: 'no-cache' });
          if (response.ok) {
            await cache.put(route, response);
          }
        } catch (error) {
          console.error(`Failed to update ${route}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('Failed to update app content:', error);
  }
}

// Helper function to handle fetch events
async function handleFetch(event) {
  // Try network first
  try {
    const response = await fetch(event.request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, response.clone());
      return response;
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }

  // Try cache
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page for navigation requests
  if (event.request.mode === 'navigate') {
    return caches.match('/offline.html');
  }

  return new Response('Offline content not available', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}