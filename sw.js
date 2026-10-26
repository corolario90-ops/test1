// 포켓몬 한글 모험: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 아이패드에 보관
const CACHE = 'pokemon-hangul-7413124b37';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "fonts/jua.woff2", "fonts/noto-500.woff2", "fonts/noto-700.woff2", "fonts/gaegu.woff2", "fonts/hi-melody.woff2", "fonts/gamja-flower.woff2", "fonts/nanum-pen.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('pokemon-hangul-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // 화면은 인터넷이 되면 새 버전을, 안 되면 보관한 버전을
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put('index.html', copy));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
