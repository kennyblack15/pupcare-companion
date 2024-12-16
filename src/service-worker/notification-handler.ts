/// <reference lib="webworker" />

interface NotificationData {
  title?: string;
  body?: string;
  url?: string;
}

export function handlePushEvent(event: PushEvent): Promise<void> {
  const data: NotificationData = event.data?.json() ?? {};
  const options: NotificationOptions = {
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

export function handleNotificationClick(event: Event): Promise<WindowClient | undefined> {
  if (event instanceof NotificationEvent) {
    event.notification.close();

    if (event.action === 'view') {
      return self.clients.openWindow(event.notification.data.url);
    }
  }
  return Promise.resolve(undefined);
}