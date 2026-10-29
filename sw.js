// 포켓몬 한글 모험: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 아이패드에 보관
const CACHE = 'pokemon-hangul-693090ee65';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "fonts/jua.woff2", "fonts/noto-500.woff2", "fonts/noto-700.woff2", "fonts/gaegu.woff2", "fonts/hi-melody.woff2", "fonts/gamja-flower.woff2", "fonts/nanum-pen.woff2"];
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
  // 같은 사이트의 숫자 놀이 앱(math/)과 한글 드라이브(drive/)는 그 앱의 서비스 워커가 맡음
  if (['math/', 'drive/'].some(d => url.pathname.startsWith(new URL(d, self.registration.scope).pathname))) return;
  if (req.mode === 'navigate') {
    // 화면은 인터넷이 되면 새 버전을, 안 되면 보관한 버전을
    // 사이트가 내려가서 404가 와도 보관한 앱을 그대로 열도록, 정상 응답일 때만 새 버전으로 바꿈
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
