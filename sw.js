// تطبيق الداش بورد: بيشتغل من غير ما يحتاج تنزيل من المتجر
// الصفحة بتتجاب من النت الأول (علشان أي تحديث يظهر على طول)، ولو النت قاطع بتفتح آخر نسخة محفوظة
const CACHE = 'modaqqeq-dash-v1';
const SHELL = ['./', './index.html', './logo_wide.png', './icon.png', './icon-192.png', './icon-512.png', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // السيرفر (جوجل) والخطوط: من النت على طول
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
// الدوس على الإشعار: يفتح التطبيق ويروح للفاتورة / الدردشة
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const c = list[0];
    if (c) { c.postMessage({ type: 'note', data }); return c.focus(); }
    return self.clients.openWindow('./?app=1');
  }));
});
