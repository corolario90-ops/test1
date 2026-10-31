// 알록달록 색칠놀이: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 기기에 보관
// (받은 도안과 칠한 그림은 앱 안의 저장소(IndexedDB)에 따로 있어서 여기서 다루지 않음)
const CACHE = 'coloring-6d25680796';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/color-192.png", "icons/color-512.png", "../fonts/jua.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('coloring-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // 화면은 인터넷이 되면 새 버전을, 안 되면 보관한 버전을 (404면 보관한 앱을 그대로)
    e.respondWith(fetch(req).then(res => {
      if (!res.ok) return caches.match('index.html').then(hit => hit || res);
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put('index.html', copy));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
