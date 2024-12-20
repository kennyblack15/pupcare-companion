// Service Worker for PawCare Companion
const CACHE_NAME = "pawcare-cache-v2";
const OFFLINE_URL = "/pupcare-companion/offline.html";
const urlsToCache = [
  "/pupcare-companion/",
  "/pupcare-companion/index.html",
  "/pupcare-companion/icons/icon-192x192.png",
  "/pupcare-companion/icons/icon-512x512.png",
  "/pupcare-companion/icons/maskable_icon_x192.png",
  "/pupcare-companion/screenshots/home-light.png",
  "/pupcare-companion/screenshots/home-dark.png",
  OFFLINE_URL
];

// Install Event - Cache Static Assets
// Fetch Event - Serve Cached Files or Offline Page
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match(OFFLINE_URL));
    })
  );
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

// Fetch Event - Serve Cached Files or Offline Page
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((response) => {
      return response || caches.match(OFFLINE_URL);
    }))
  );
});

// Background Sync Event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-content") {
    event.waitUntil(syncAllContent());
  }
});

// Periodic Sync Event
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "sync-content") {
    console.log("Periodic Sync: Syncing content...");
    event.waitUntil(syncAllContent());
  }
});

// Push Notification Event
self.addEventListener("push", (event) => {
  const title = "PawCare Notification";
  const options = {
    body: event.data ? event.data.text() : "New updates from PawCare!",
    icon: "/pupcare-companion/icons/icon-192x192.png",
    badge: "/pupcare-companion/icons/icon-192x192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/pupcare-companion/")
  );
});

