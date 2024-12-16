function handlePushEvent(event) {
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body || 'Time to take care of your pet!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details'
      }
    ]
  };

  return self.registration.showNotification(
    data.title || 'PawCare Reminder',
    options
  );
}

function handleNotificationClick(event) {
  event.notification.close();

  if (event.action === 'view') {
    return self.clients.openWindow(event.notification.data.url);
  }

  // If no action was clicked, open the app
  return self.clients.openWindow('/');
}