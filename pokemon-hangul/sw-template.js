// 포켓몬 한글 모험: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 아이패드에 보관
const CACHE = 'pokemon-hangul-__VERSION__';
const ASSETS = __ASSETS__;
// 공식 이미지는 앱을 새 버전으로 바꿔도 지우지 않는 따로 된 보관함에
const ART_CACHE = 'pokemon-art-v1';
const isArt = url => url.origin === 'https://raw.githubusercontent.com' && url.pathname.startsWith('/PokeAPI/sprites/');

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
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (isArt(url)) {
    e.respondWith(caches.open(ART_CACHE).then(c => c.match(req.url).then(hit => hit || fetch(req.url, { mode: 'cors' }).then(res => {
      if (res.ok) c.put(req.url, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;
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
