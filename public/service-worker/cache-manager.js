const CACHE_NAME = 'pawcare-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

async function initCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
}

async function cleanupOldCaches() {
  const cacheKeys = await caches.keys();
  await Promise.all(
    cacheKeys.map(key => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })
  );
}

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