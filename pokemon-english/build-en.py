#!/usr/bin/env python3
"""english-src.html + ../pokemon-hangul/ink.js -> Claude 링크용 파일(pokemon-english.html)과 아이패드 홈 화면 앱(pwa/, 사이트의 english/)."""
import hashlib, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(os.path.join(HERE, p), encoding='utf8').read()
body = read('english-src.html').replace('/*INK*/', read('../pokemon-hangul/ink.js').strip())
open(os.path.join(HERE, 'pokemon-english.html'), 'w', encoding='utf8').write(body)

# Andika는 예약 이름이 있어서 원본 파일 그대로, 펜 글꼴은 이름을 바꾼 줄인 글꼴
FONTS = [('Jua', 400, 'jua.woff2'), ('Andika', 400, 'andika-400.ttf'), ('Andika', 700, 'andika-700.ttf'), ('Noto Sans KR', 500, 'noto-500.woff2'), ('Noto Sans KR', 700, 'noto-700.woff2'),
         ('Gaegu', 400, 'gaegu.woff2'), ('Patrick Hand', 400, 'patrick-hand.ttf'), ('Gamja Flower', 400, 'gamja-flower.woff2'), ('Pen Script Hand', 400, 'pen-hand.woff2')]
fmt = lambda n: 'woff2' if n.endswith('woff2') else 'truetype'
faces = '\n'.join(f'@font-face {{ font-family: "{f}"; font-weight: {w}; font-style: normal; font-display: swap; src: url("fonts/{n}") format("{fmt(n)}"); }}' for f, w, n in FONTS)
APP_NAME, APP_SHORT = '몬스터 영어 모험', '몬스터 영어'
app = body.replace("/*BUILD*/'artifact'", "'app'").replace('포켓몬 영어 모험', APP_NAME).replace('"Nanum Pen Script"', '"Pen Script Hand"')
title = re.search(r'<title>.*?</title>', app).group(0)
app = re.sub(r'<title>.*?</title>\n', '', app, count=1)
app = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\n', '', app)
app = re.sub(r'<link rel="preconnect"[^>]*>\n', '', app)
app = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>\n', '', app)
head = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
{title}
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="{APP_SHORT}">
<meta name="robots" content="noindex, nofollow, noimageindex, noarchive">
<meta name="theme-color" content="#CDEEFF">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
<style>
{faces}
:root {{ padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }}
body {{ font-size: 14px; }}
img {{ max-width: 100%; }}
</style>
</head>
<body>
'''
out = os.path.join(HERE, 'pwa')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'index.html'), 'w', encoding='utf8').write(head + app + '\n</body>\n</html>\n')
json.dump({
    'name': APP_NAME, 'short_name': APP_SHORT, 'lang': 'ko',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'any',
    'background_color': '#CDEEFF', 'theme_color': '#CDEEFF',
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]
}, open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf8'), ensure_ascii=False, indent=2)
assets = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'] + [f'fonts/{n}' for _, _, n in FONTS]
h = hashlib.sha1()
for a in assets[1:]:
    h.update(open(os.path.join(out, a), 'rb').read())
digest = h.hexdigest()[:10]
open(os.path.join(out, 'sw.js'), 'w', encoding='utf8').write(read('sw-template.js').replace('__VERSION__', digest).replace('__ASSETS__', json.dumps(assets)))
print('built', digest)
