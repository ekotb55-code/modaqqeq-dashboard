// التطبيق اتنقل لرابط جديد - النسخة القديمة بتمسح نفسها
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('modaqqeq-warehouse-') === 0).map(k => caches.delete(k)))).then(() => self.registration.unregister())));
