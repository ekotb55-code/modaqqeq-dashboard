// التطبيق اتنقل لـ /modaqqeq-images/ - الملف ده بيشيل نفسه علشان النسخة القديمة ما تفضلش محفوظة
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('modaqqeq-images-') === 0).map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.matchAll()).then(cs => cs.forEach(c => c.navigate('/modaqqeq-images/'))));
});
