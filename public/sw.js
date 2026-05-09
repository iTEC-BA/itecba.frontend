self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Alguien respondió a tu post anónimo.',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/foro' }
    };
    event.waitUntil(self.registration.showNotification(data.title || 'iTEC Foro', options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
