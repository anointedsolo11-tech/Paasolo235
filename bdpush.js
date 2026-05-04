self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  var title = data.title || 'Notification';
  var options = {
    body: data.body || '',
    icon: data.icon || '',
    badge: data.badge || '',
    data: data.url || ''
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
