// صفحة طباعة الاستيكرات: علشان تتثبت كتطبيق على الموبايل - بتجيب الجديد من النت دايماً، ولو مفيش نت بتفتح آخر نسخة
const C = 'team-print-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) {
      const c = r.clone();
      caches.open(C).then(x => x.put(e.request, c)).catch(() => {});
    }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
