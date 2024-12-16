const CACHE_NAME = 'pawcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-health-records') {
    event.waitUntil(syncHealthRecords());
  } else if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});

async function syncHealthRecords() {
  try {
    const records = await getUnsyncedHealthRecords();
    await Promise.all(records.map(record => 
      fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      })
    ));
  } catch (error) {
    console.error('Error syncing health records:', error);
  }
}

async function syncMedications() {
  try {
    const medications = await getUnsyncedMedications();
    await Promise.all(medications.map(medication => 
      fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication)
      })
    ));
  } catch (error) {
    console.error('Error syncing medications:', error);
  }
}

async function getUnsyncedHealthRecords() {
  // Implementation will be added when IndexedDB is set up
  return [];
}

async function getUnsyncedMedications() {
  // Implementation will be added when IndexedDB is set up
  return [];
}

self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() ?? 'New notification from PawCare',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('PawCare', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});