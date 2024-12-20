importScripts('/service-worker/cache-manager.js');

self.addEventListener('install', (event) => {
  event.waitUntil(initCache());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(cleanupOldCaches());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event));
});