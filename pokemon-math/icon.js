// 앱 아이콘 만들기: node icon.js (pokemon-math 폴더에서, Playwright 필요)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const html = size => `<html><head><style>html,body{margin:0}</style></head><body>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#FFF7DC"/>
    <rect y="350" width="512" height="162" fill="#FFCB05"/>
    <circle cx="256" cy="256" r="180" fill="#FFFFFF" stroke="#2B2B2B" stroke-width="22"/>
    <path d="M76 256 A180 180 0 0 1 436 256 Z" fill="#E3350D" stroke="#2B2B2B" stroke-width="22" stroke-linejoin="round"/>
    <rect x="76" y="242" width="360" height="28" fill="#2B2B2B"/>
    <circle cx="256" cy="256" r="92" fill="#FFFFFF" stroke="#2B2B2B" stroke-width="22"/>
    <text x="256" y="292" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="96" fill="#3B4CCA">1+2</text>
  </svg></body></html>`;
  for (const s of [512, 192, 180]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(html(s));
    await p.screenshot({ path: `pwa/icons/icon-${s}.png`, clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
