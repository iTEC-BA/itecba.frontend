// ── Push event: llega cuando el backend envía una notificación ──
// Este código corre en el SW, FUERA del contexto de React.
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: 'iTEC BA', body: event.data.text(), url: '/' }; }

  const options = {
    body:    payload.body   ?? '',
    icon:    payload.icon   ?? '/icons/pwa-192.png',
    badge:   payload.badge  ?? '/icons/pwa-64.png',
    data:    { url: payload.url ?? '/' },
    vibrate: [200, 100, 200],
    // Agrupa notificaciones del mismo source para no saturar
    tag:     payload.source ?? 'itec-general',
    renotify: payload.priority === 'critical',
    actions: [
      { action: 'open',    title: 'Ver' },
      { action: 'dismiss', title: 'Descartar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'iTEC BA', options)
  );
});

// ── Notification click: navega a la URL del payload ────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // Si ya hay una ventana abierta, enfocarla y navegar
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then((c) => c.navigate(url));
      return clients.openWindow(url);
    })
  );
});
