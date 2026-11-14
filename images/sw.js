// التطبيق اتنقل لـ /modaqqeq-images/ - الملف ده بيشيل نفسه علشان النسخة القديمة ما تفضلش شغالة
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.registration.unregister()
    .then(() => self.clients.matchAll()).then(cs => cs.forEach(c => c.navigate('/modaqqeq-images/'))));
});
