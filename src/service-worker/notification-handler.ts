interface NotificationData {
  title?: string;
  body?: string;
  url?: string;
}

export function handlePushEvent(event: PushEvent) {
  const data: NotificationData = event.data?.json() ?? {};
  const options = {
    body: data.body || 'Time to take care of your pet!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  return self.registration.showNotification(
    data.title || 'PawCare Reminder',
    options
  );
}

export function handleNotificationClick(event: NotificationEvent) {
  event.notification.close();

  if (event.action === 'view') {
    return clients.openWindow(event.notification.data.url);
  }
}