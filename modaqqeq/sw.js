// تطبيق مدقق على الويب (آيفون): إشعارات + يفتح من غير نت بآخر نسخة
const CACHE = 'mdq-app-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (u.pathname.endsWith('version.json')) return; // مقياس النت
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) {}
  const d = p.data || {}, n = p.notification || {};
  const target = d.type === 'chat' ? 'chat:' + (d.invoiceId || '') : (d.invoiceId || '');
  e.waitUntil(self.registration.showNotification(n.title || d.title || 'مدقق', {
    body: n.body || d.body || '', icon: 'icons/Icon-192.png', badge: 'icons/Icon-192.png', dir: 'rtl', lang: 'ar',
    tag: d.invoiceId ? 'inv-' + d.invoiceId : undefined, data: { target }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const t = (e.notification.data || {}).target || '';
  const url = './?open=' + encodeURIComponent(t);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const c = list[0];
    if (c) return c.navigate(url).then(w => (w || c).focus()).catch(() => c.focus());
    return self.clients.openWindow(url);
  }));
});
