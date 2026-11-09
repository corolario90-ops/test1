// 앱 아이콘 만들기: node icon-en.js (pokemon-english 폴더에서)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const html = size => `<html><head><style>@font-face{font-family:Andika;src:url(pwa/fonts/andika-700.ttf)}html,body{margin:0}</style></head><body>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#CDEEFF"/>
    <rect y="330" width="512" height="182" fill="#9ED96E"/>
    <circle cx="256" cy="262" r="178" fill="#FFFFFF" stroke="#22304D" stroke-width="22"/>
    <path d="M78 262 A178 178 0 0 1 434 262 Z" fill="#3E8FD9" stroke="#22304D" stroke-width="22" stroke-linejoin="round"/>
    <rect x="78" y="248" width="356" height="28" fill="#22304D"/>
    <circle cx="256" cy="262" r="84" fill="#FFFDF3" stroke="#22304D" stroke-width="22"/>
    <text x="256" y="302" text-anchor="middle" font-family="Andika" font-weight="700" font-size="104" fill="#22304D">Aa</text>
  </svg></body></html>`;
  for (const s of [512, 192, 180]) {
    await p.setViewportSize({ width: s, height: s });
    require('fs').writeFileSync('icon-tmp.html', html(s));
    await p.goto('file://' + process.cwd() + '/icon-tmp.html');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: `pwa/icons/icon-${s}.png`, clip: { x: 0, y: 0, width: s, height: s } });
  }
  require('fs').unlinkSync('icon-tmp.html');
  await b.close();
})();
