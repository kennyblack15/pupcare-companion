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
  if (event.tag === 'sync-health_records') {
    event.waitUntil(syncHealthRecords());
  } else if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});

async function syncHealthRecords() {
  const records = await getUnsyncedHealthRecords();
  try {
    await Promise.all(records.map(async record => {
      const response = await fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record.data)
      });
      
      if (response.ok) {
        await markAsSynced('health_records', record.id);
      }
    }));
  } catch (error) {
    console.error('Error syncing health records:', error);
  }
}

async function syncMedications() {
  const medications = await getUnsyncedMedications();
  try {
    await Promise.all(medications.map(async medication => {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication.data)
      });
      
      if (response.ok) {
        await markAsSynced('medications', medication.id);
      }
    }));
  } catch (error) {
    console.error('Error syncing medications:', error);
  }
}

async function getUnsyncedHealthRecords() {
  const db = await openDB();
  return db.getAll('health_records').filter(record => !record.synced);
}

async function getUnsyncedMedications() {
  const db = await openDB();
  return db.getAll('medications').filter(record => !record.synced);
}

async function markAsSynced(storeName, id) {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const record = await store.get(id);
  record.synced = true;
  await store.put(record);
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pawcare-db', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
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