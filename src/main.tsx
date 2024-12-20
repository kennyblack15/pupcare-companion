// Register the Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/pupcare-companion/sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);

        // Check for Periodic Sync Capability
        if ("periodicSync" in registration) {
          registration.periodicSync
            .register("sync-content", {
              minInterval: 24 * 60 * 60 * 1000 // 24 hours
            })
            .then(() => console.log("Periodic Sync Registered"))
            .catch((error) => {
              console.error("Periodic Sync Registration Failed:", error.message);
            });
        } else {
          console.log("Periodic Sync not supported in this browser.");
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error.message);
      });
  });
}



