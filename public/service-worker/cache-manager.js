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