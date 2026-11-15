// تطبيق تحضير المخزن: الصفحة بتتجاب من النت الأول (علشان أي تحديث يظهر على طول)، ولو النت قاطع بتفتح آخر نسخة محفوظة
const CACHE = 'modaqqeq-warehouse-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', '/modaqqeq-dashboard/icon-192.png', '/modaqqeq-dashboard/logo_wide.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('modaqqeq-warehouse-') === 0 && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
