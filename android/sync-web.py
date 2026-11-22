#!/usr/bin/env python3
"""액자 페이지(저장소 맨 위의 photo-frame.html)를 앱 안 assets/web/frame/index.html 로 넣음.

인터넷 없이도 같은 모양이 나오도록 Google Fonts 대신 앱에 넣은 글꼴(assets/web/fonts)을 쓰게 바꿈.
APK를 만들기 전에 한 번 실행 (GitHub Actions에서는 자동으로 실행됨):
    python3 android/sync-web.py
"""
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE.parent / 'photo-frame.html'
OUT = HERE / 'app' / 'src' / 'main' / 'assets' / 'web' / 'frame' / 'index.html'

FONT_FACES = '''/* 앱 안에 넣어 둔 글꼴 (얇은 숫자 글꼴은 숫자·기호만 담은 것) */
@font-face{font-family:"Frame Digits";font-weight:200;font-style:normal;font-display:swap;src:url("../fonts/frame-digits-200.woff2") format("woff2")}
@font-face{font-family:"Frame Digits";font-weight:300;font-style:normal;font-display:swap;src:url("../fonts/frame-digits-300.woff2") format("woff2")}
@font-face{font-family:"Noto Sans KR";font-weight:500;font-style:normal;font-display:swap;src:url("../fonts/noto-500.woff2") format("woff2")}
@font-face{font-family:"Noto Sans KR";font-weight:700;font-style:normal;font-display:swap;src:url("../fonts/noto-700.woff2") format("woff2")}
'''


def main():
    s = SRC.read_text(encoding='utf-8')

    def rep(old, new):
        nonlocal s
        if s.count(old) != 1:
            sys.exit('sync-web: photo-frame.html 에서 바꿀 곳을 찾지 못했어요: %r' % old[:70])
        s = s.replace(old, new)

    rep('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@200;300;400;500;600&display=swap" rel="stylesheet">\n', '')
    rep('<style>\n', '<style>\n' + FONT_FACES)
    rep("body{font-family:'IBM Plex Sans KR',system-ui,", "body{font-family:'Noto Sans KR',system-ui,")
    rep('#time{font-weight:200;',
        "#time,#wTemp,.wd{font-family:'Frame Digits','Noto Sans KR',system-ui,sans-serif}\n"
        '#date{margin-top:calc(var(--u) * 2)!important}\n'
        '#time{font-weight:200;')
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(s, encoding='utf-8')
    print('sync-web: %s → %s' % (SRC.name, OUT.relative_to(HERE)))


if __name__ == '__main__':
    main()
