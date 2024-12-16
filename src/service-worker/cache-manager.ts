const CACHE_NAME = 'pawcare-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/assets/*'
];

declare const self: ServiceWorkerGlobalScope;

export async function initializeCache(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urlsToCache);
}

export async function cleanupOldCaches(): Promise<void[]> {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    })
  );
}

export async function handleFetch(event: ExtendableEvent & { request: Request }): Promise<Response> {
  if ((event as FetchEvent).request.method !== 'GET') return fetch((event as FetchEvent).request);

  try {
    const response = await fetch((event as FetchEvent).request);
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    const responseToCache = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put((event as FetchEvent).request, responseToCache);

    return response;
  } catch (error) {
    const cachedResponse = await caches.match((event as FetchEvent).request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if ((event as FetchEvent).request.mode === 'navigate') {
      return caches.match('/index.html') as Promise<Response>;
    }
    
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}