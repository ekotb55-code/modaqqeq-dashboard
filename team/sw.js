// تطبيق مدقق على الويب: بيفتح على طول من النسخة المتخزنة على الموبايل (حتى من غير نت)،
// والنسخة الجديدة بتتنزل في الخلفية وتشتغل المرة الجاية (أو لما يدوس «تحديث»)
// precache.json بيتعمل في البناء: رقم النسخة + بصمة كل ملف
const PTR = 'mdq-ptr', PRE = 'mdq-app-', BOOT = 'mdq-app-boot';
const SCOPE = () => self.registration.scope;
const SKIP = new Set(['version.json', 'precache.json', 'sw.js']);
let cur = null;

async function current() {
  if (cur) return cur;
  try {
    const r = await (await caches.open(PTR)).match('cur');
    if (r) cur = await r.text();
  } catch (e) {}
  return cur;
}
async function readMeta(name) {
  try {
    const r = await (await caches.open(name)).match(new URL('__meta', SCOPE()).href);
    return r ? await r.json() : null;
  } catch (e) { return null; }
}
const lazy = p => p.startsWith('canvaskit/') || p === 'assets/NOTICES';
async function sha16(buf) {
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function inHttpCache(key, h) {
  try {
    const r = await fetch(key, { cache: 'only-if-cached', mode: 'same-origin' });
    return r.ok && await sha16(await r.arrayBuffer()) === h;
  } catch (e) { return false; }
}

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = await current();
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== PTR && k !== BOOT && k !== keep).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// النسخة الجديدة: بتتنزل كلها في كاش لوحدها، ولما تكمل بس بتبقى هي اللي شغالة
// (الصفحة بتطلبها بعد ما التطبيق يفتح، علشان التنزيل ما يزاحمش الفتح)
let checking = null, lastCheck = 0;
function checkUpdate(force) {
  if (checking) return checking;
  if (!force && Date.now() - lastCheck < 20000) return Promise.resolve(false);
  lastCheck = Date.now();
  checking = (async () => {
    const sc = SCOPE();
    try {
      const res = await fetch(new URL('precache.json?t=' + Date.now(), sc), { cache: 'no-store' });
      if (!res.ok) return false;
      const pre = await res.json();
      if (!pre || !pre.v || !pre.files) return false;
      const name = await current();
      const old = name ? await readMeta(name) : null;
      if (old && old.v === pre.v) return false;
      const next = PRE + pre.v;
      await caches.delete(next);
      const nc = await caches.open(next);
      const oc = name ? await caches.open(name) : null;
      const boot = await caches.open(BOOT);
      for (const [p, h] of Object.entries(pre.files)) {
        const key = new URL(p, sc).href;
        // نفس الملف من غير تغيير: ينتقل من الكاش القديم
        const prev = (oc && await oc.match(key)) || null;
        if (prev && old && old.files && old.files[p] === h) { await nc.put(key, prev); continue; }
        // أول مرة بالنظام ده: اللي اتحمّل دلوقتي من النت ينفع
        const fresh = !old ? await boot.match(key) : null;
        if (fresh) { await nc.put(key, fresh); continue; }
        // المحرّك والملفات التقيلة: بتتنزل بس لو كانت متخزنة قبل كده (وإلا أول ما تتطلب)
        if (lazy(p) && !prev && !(await boot.match(key))) {
          // أول مرة: المحرّك اللي المتصفح حمّله لسه بيتخزن من غير ما يتحمّل تاني
          if (old || !(await inHttpCache(key, h))) continue;
        }
        // الأول من كاش المتصفح (غالباً اتحمّل لسه)، ولو البصمة مش مظبوطة من النت
        let r = null, buf = null;
        try {
          r = await fetch(key, { cache: 'force-cache' });
          buf = r.ok ? await r.arrayBuffer() : null;
          if (buf && await sha16(buf) !== h) buf = null;
        } catch (e) { buf = null; }
        if (!buf) {
          r = await fetch(new URL(p + '?h=' + h, sc), { cache: 'no-store' });
          if (!r.ok) throw new Error('fetch ' + p);
          buf = await r.arrayBuffer();
          if (await sha16(buf) !== h) throw new Error('hash ' + p);
        }
        await nc.put(key, new Response(buf, { headers: { 'Content-Type': r.headers.get('Content-Type') || '' } }));
      }
      await nc.put(new URL('__meta', sc).href, new Response(JSON.stringify(pre), { headers: { 'Content-Type': 'application/json' } }));
      await (await caches.open(PTR)).put('cur', new Response(next));
      cur = next;
      for (const k of await caches.keys()) if (k.startsWith(PRE) && k !== next) await caches.delete(k);
      if (old) {
        const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        cs.forEach(c => c.postMessage({ type: 'mdq-updated', v: pre.v }));
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      checking = null;
    }
  })();
  return checking;
}

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type !== 'mdq-check') return;
  const port = e.ports && e.ports[0];
  e.waitUntil(checkUpdate(!!d.force).then(u => { if (port) port.postMessage({ updated: u }); }));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const u = new URL(req.url);
  const sc = SCOPE();
  const sp = new URL(sc).pathname;
  if (req.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(sp)) return;
  let p = decodeURIComponent(u.pathname.slice(sp.length));
  if (SKIP.has(p) || u.searchParams.has('h')) return; // مقياس النت / ملفات التحديث نفسها
  if (p === '') p = 'index.html';
  const key = new URL(p, sc).href;
  const nav = req.mode === 'navigate';
  e.respondWith((async () => {
    const name = await current();
    let hit = name ? await (await caches.open(name)).match(key) : null;
    if (!hit) hit = await (await caches.open(BOOT)).match(key);
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r.ok && (nav || r.type === 'basic')) {
        const c = r.clone();
        e.waitUntil(caches.open(name || BOOT).then(x => x.put(key, c)).catch(() => {}));
      }
      return r;
    } catch (err) {
      const any = await caches.match(key) || (nav ? await caches.match(new URL('index.html', sc).href) : null);
      if (any) return any;
      throw err;
    }
  })());
});

self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) {}
  const d = p.data || {}, n = p.notification || {};
  const target = d.jinv ? 'jinv:' + d.jinv : d.tk ? 'tk:' + d.tk : d.type === 'chat' ? 'chat:' + (d.invoiceId || '') : (d.invoiceId || '');
  // الأيقونة الصغيرة (badge) لازم تبقى أبيض على شفاف عشان أندرويد ما يطلعهاش مربع أبيض
  e.waitUntil(self.registration.showNotification(n.title || d.title || 'مدقق', {
    body: n.body || d.body || 'عندك إشعار جديد - افتح التطبيق', icon: 'icons/Icon-192.png', badge: 'icons/badge-96.png', dir: 'rtl', lang: 'ar',
    tag: d.jinv ? 'jinv-' + d.jinv : d.invoiceId ? 'inv-' + d.invoiceId : d.tk ? 'tk-' + d.tk : d.jr ? 'jr-' + d.jr : undefined, data: { target }
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
