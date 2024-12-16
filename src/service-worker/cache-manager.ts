const CACHE_NAME = 'pawcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/assets/*'
];

export async function initializeCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
}

export async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
}

export async function handleFetch(event: FetchEvent) {
  if (event.request.method !== 'GET') return;

  try {
    const response = await fetch(event.request);
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    const responseToCache = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(event.request, responseToCache);

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (event.request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}