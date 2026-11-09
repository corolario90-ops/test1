// 도형놀이·한글 드라이브·색칠놀이·포켓몬 한글/영어 쓰기 오프라인 지원: 먼저 네트워크, 안 되면 저장된 사본
const CACHE = 'kidsplay-v5';
const SHELL = ['./shape-play.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './word-drive.html', './word-drive.webmanifest', './icons/drive-192.png', './icons/drive-512.png',
  './coloring.html', './coloring.webmanifest', './icons/color-192.png', './icons/color-512.png',
  './hangul-writing.html', './hangul-writing.webmanifest', './icons/write-192.png', './icons/write-512.png',
  './english-writing.html', './english-writing.webmanifest', './icons/abc-192.png', './icons/abc-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 다른 곳의 그림(포켓몬 일러스트 등)은 앱이 직접 줄여서 IndexedDB에 저장하므로 여기서 또 쌓지 않음
  const host = new URL(e.request.url).hostname;
  if (host !== location.hostname && !/(^|\.)(fonts\.googleapis|fonts\.gstatic)\.com$/.test(host)) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
