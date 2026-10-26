#!/usr/bin/env python3
"""app-src.html + ink.js -> Claude 링크용 파일(pokemon-hangul.html)과 아이패드 홈 화면 앱(pwa/)."""
import hashlib, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(os.path.join(HERE, p), encoding='utf8').read()
src = read('app-src.html')
ink = read('ink.js').strip()
body = src.replace('/*INK*/', ink)

# 1) Claude 링크용
open(os.path.join(HERE, 'pokemon-hangul.html'), 'w', encoding='utf8').write(body)

# 2) 홈 화면 앱: 글꼴을 앱 안에 넣고, 문서 머리말·매니페스트·서비스 워커 추가
FONTS = [('Jua', 400, 'jua'), ('Noto Sans KR', 500, 'noto-500'), ('Noto Sans KR', 700, 'noto-700'), ('Gaegu', 400, 'gaegu'),
         ('Hi Melody', 400, 'hi-melody'), ('Gamja Flower', 400, 'gamja-flower'), ('Nanum Pen Script', 400, 'nanum-pen')]
faces = '\n'.join(f'@font-face {{ font-family: "{f}"; font-weight: {w}; font-style: normal; font-display: swap; src: url("fonts/{n}.woff2") format("woff2"); }}' for f, w, n in FONTS)
app = body.replace("/*BUILD*/'artifact'", "'app'")
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
<meta name="apple-mobile-web-app-title" content="포켓몬 한글">
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
    'name': '포켓몬 한글 모험', 'short_name': '포켓몬 한글', 'lang': 'ko',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'any',
    'background_color': '#CDEEFF', 'theme_color': '#CDEEFF',
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]
}, open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf8'), ensure_ascii=False, indent=2)
assets = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'] + [f'fonts/{n}.woff2' for _, _, n in FONTS]
# 앱 내용이 바뀌면 캐시 이름도 바뀌어서 새 버전으로 교체됨
h = hashlib.sha1()
for a in assets[1:]:
    h.update(open(os.path.join(out, a), 'rb').read())
digest = h.hexdigest()[:10]
sw = read('sw-template.js').replace('__VERSION__', digest).replace('__ASSETS__', json.dumps(assets))
open(os.path.join(out, 'sw.js'), 'w', encoding='utf8').write(sw)
open(os.path.join(out, '.nojekyll'), 'w').write('')
print('built', digest)
