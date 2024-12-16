/// <reference lib="webworker" />

const CACHE_NAME = 'pawcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/assets/*'
];

export async function initializeCache(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
}

export async function cleanupOldCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(async (cacheName) => {
      if (cacheName !== CACHE_NAME) {
        await caches.delete(cacheName);
      }
    })
  );
}

export async function handleFetch(event: FetchEvent): Promise<Response> {
  if (event.request.method !== 'GET') {
    return fetch(event.request);
  }

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
      const indexResponse = await caches.match('/index.html');
      return indexResponse || new Response('Network error', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}