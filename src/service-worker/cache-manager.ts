const CACHE_NAME = 'pawcare-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/maskable_icon_x192.png',
  '/icons/maskable_icon_x512.png'
];

export async function initCache(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
}

export async function cleanupOldCaches(): Promise<void> {
  const cacheKeys = await caches.keys();
  await Promise.all(
    cacheKeys.map(key => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })
  );
}

export async function handleFetch(event: FetchEvent): Promise<Response> {
  // Network first, falling back to cache
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
    return caches.match('/offline.html') || new Response('Offline');
  }

  return new Response('Offline content not available', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}