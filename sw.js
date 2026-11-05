// 도형놀이·한글 드라이브·색칠놀이·주사위 모험·면허 모의시험·그림놀이·농장 가게·숫자 마법 오프라인 지원: 먼저 네트워크, 안 되면 저장된 사본
const CACHE = 'kidsplay-v9';
const SHELL = ['./shape-play.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './word-drive.html', './word-drive.webmanifest', './icons/drive-192.png', './icons/drive-512.png',
  './coloring.html', './coloring.webmanifest', './icons/color-192.png', './icons/color-512.png',
  './poke-board.html', './poke-board.webmanifest', './icons/board-192.png', './icons/board-512.png',
  './license-test.html', './license-test.webmanifest', './license-bank/bank.js', './icons/license-192.png', './icons/license-512.png',
  './draw.html', './draw.webmanifest', './icons/draw-192.png', './icons/draw-512.png',
  './farm-shop.html', './farm-shop.webmanifest', './icons/farm-192.png', './icons/farm-512.png',
  './number-magic.html', './number-magic.webmanifest', './icons/magic-192.png', './icons/magic-512.png'];

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
  // 캐릭터 그림은 앱이 IndexedDB에 따로 저장하므로 여기서는 두 번 담지 않음
  if (/^https:\/\/raw\.githubusercontent\.com\//.test(e.request.url)) return;
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
