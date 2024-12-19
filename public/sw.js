// Service Worker for PawCare Companion
const CACHE_NAME = "pawcare-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable_icon_x192.png",
  "/screenshots/home-light.png",
  "/screenshots/home-dark.png"
];

// Install Event - Cache Static Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential files...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleanup Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve Cached Files or Fetch Online
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Background Sync Event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-content") {
    event.waitUntil(syncAllContent());
  }
});

// Push Notification Event
self.addEventListener("push", (event) => {
  const title = "PawCare Notification";
  const options = {
    body: event.data ? event.data.text() : "New updates from PawCare!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});
