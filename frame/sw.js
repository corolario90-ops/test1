// 우리집 액자: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 기기에 보관
// (사진은 IndexedDB, 설정·지난 날씨는 localStorage에 따로 있어서 여기서 다루지 않음. 날씨 요청은 다른 사이트라 건드리지 않음)
const CACHE = 'frame-c5c043b253';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/frame-192.png", "icons/frame-512.png", "../fonts/noto-500.woff2", "../fonts/noto-700.woff2", "../fonts/frame-digits-200.woff2", "../fonts/frame-digits-300.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('frame-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // 화면은 인터넷이 되면 새 버전을, 안 되면 보관한 버전을 (새벽 자동 새로 고침 때 새 버전을 받아 옴)
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
