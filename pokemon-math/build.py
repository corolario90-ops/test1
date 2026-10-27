#!/usr/bin/env python3
"""app-src.html + mon-art.js -> Claude 링크용 파일(pokemon-math.html)과 아이패드 홈 화면 앱(pwa/)."""
import hashlib, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(os.path.join(HERE, p), encoding='utf8').read()
src = read('app-src.html').replace('/*MONART*/', read('mon-art.js').strip())

# 1) Claude 링크용: 문서 머리말은 Claude가 붙여 주므로 내용만
body = re.sub(r'<!doctype html>\s*<html lang="ko">\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', '', src)
body = body.replace('</head>\n<body>\n', '').replace('</body>\n</html>\n', '')
open(os.path.join(HERE, 'pokemon-math.html'), 'w', encoding='utf8').write(body)

# 2) 홈 화면 앱
# 공개 사이트에서는 앱 이름에 상표 '포켓몬'을 쓰지 않음 (게임 안의 포켓몬 이름은 그대로)
APP_NAME, APP_SHORT, COLOR = '몬스터 숫자 놀이', '몬스터 숫자', '#FFF7DC'
app = body.replace("/*BUILD*/'artifact'", "'app'").replace('포켓몬 숫자 놀이', APP_NAME)
title = re.search(r'<title>.*?</title>', app).group(0)
app = re.sub(r'<title>.*?</title>\n', '', app, count=1)
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
<meta name="theme-color" content="{COLOR}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
<style>
:root {{ padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }}
</style>
</head>
<body>
'''
out = os.path.join(HERE, 'pwa')
os.makedirs(os.path.join(out, 'icons'), exist_ok=True)
open(os.path.join(out, 'index.html'), 'w', encoding='utf8').write(head + app + '\n</body>\n</html>\n')
json.dump({
    'name': APP_NAME, 'short_name': APP_SHORT, 'lang': 'ko',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'any',
    'background_color': COLOR, 'theme_color': COLOR,
    'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]
}, open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf8'), ensure_ascii=False, indent=2)
assets = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png']
# 앱 내용이 바뀌면 캐시 이름도 바뀌어서 새 버전으로 교체됨
h = hashlib.sha1()
for a in assets[1:]:
    h.update(open(os.path.join(out, a), 'rb').read())
digest = h.hexdigest()[:10]
sw = read('sw-template.js').replace('__VERSION__', digest).replace('__ASSETS__', json.dumps(assets))
open(os.path.join(out, 'sw.js'), 'w', encoding='utf8').write(sw)
print('built', digest)
