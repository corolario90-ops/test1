// 글자 친구 파닉스: 한 번 열고 나면 인터넷 없이도 열리도록 앱 파일을 기기에 보관
// (진행 상황은 localStorage, 받은 그림·녹음은 IndexedDB. 기기에 저장하지 못한 알파블록스 그림만 여기서 따로 보관)
const CACHE = 'phonics-ead488b464';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/phonics-192.png", "icons/phonics-512.png", "../fonts/jua.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('phonics-') && k !== CACHE && k !== 'phonics-art').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'static.wikia.nocookie.net') {
    // 위키 그림을 주소로만 보여 주는 경우: 한 번 받은 사본을 보관해 인터넷 없이도 보이게
    e.respondWith(caches.open('phonics-art').then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }))));
    return;
  }
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
