const CACHE_NAME = 'pawcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add more static assets to cache
  '/src/assets/*',
  '/offline.html'
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

// Enhanced fetch event handler for better offline support
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

        return fetch(event.request.clone())
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
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Return default offline response for other requests
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});

// Enhanced background sync for health records
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-health_records') {
    event.waitUntil(syncHealthRecords());
  } else if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  } else if (event.tag === 'sync-grooming_tasks') {
    event.waitUntil(syncGroomingTasks());
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

async function syncGroomingTasks() {
  const tasks = await getUnsyncedGroomingTasks();
  try {
    await Promise.all(tasks.map(async task => {
      const response = await fetch('/api/grooming-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task.data)
      });
      
      if (response.ok) {
        await markAsSynced('grooming_tasks', task.id);
      }
    }));
  } catch (error) {
    console.error('Error syncing grooming tasks:', error);
  }
}

// IndexedDB helper functions
async function getUnsyncedHealthRecords() {
  const db = await openDB();
  return db.getAll('health_records').filter(record => !record.synced);
}

async function getUnsyncedMedications() {
  const db = await openDB();
  return db.getAll('medications').filter(record => !record.synced);
}

async function getUnsyncedGroomingTasks() {
  const db = await openDB();
  return db.getAll('grooming_tasks').filter(record => !record.synced);
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
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('health_records')) {
        db.createObjectStore('health_records', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('medications')) {
        db.createObjectStore('medications', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('grooming_tasks')) {
        db.createObjectStore('grooming_tasks', { keyPath: 'id' });
      }
    };
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

// Add share target handler
self.addEventListener('fetch', event => {
  if (event.request.url.endsWith('/share-target') && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const mediaFiles = formData.getAll('photos');
        const text = formData.get('text') || '';
        const title = formData.get('title') || '';
        const url = formData.get('url') || '';

        // Store the shared data in IndexedDB for offline access
        const db = await openDB();
        const tx = db.transaction('shared_content', 'readwrite');
        const store = tx.objectStore('shared_content');
        await store.add({
          title,
          text,
          url,
          timestamp: new Date().toISOString(),
          mediaFiles: mediaFiles.length > 0 ? await Promise.all(
            mediaFiles.map(async file => ({
              name: file.name,
              type: file.type,
              data: await file.arrayBuffer()
            }))
          ) : []
        });

        // Redirect to the main app after handling the share
        return Response.redirect('/', 303);
      })()
    );
  }
});
