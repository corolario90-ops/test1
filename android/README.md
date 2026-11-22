# 우리집 액자 안드로이드 앱

`photo-frame.html`(액자 페이지)을 앱 안에 넣어, 갤럭시탭에서 전체 화면 앱·화면 보호기로 쓰게 하는 작은 앱입니다.
안드로이드 5.0 이상, 따로 쓰는 라이브러리 없음.

- **전체 화면**: 상태 표시줄·내비게이션 바를 숨김, 잠금 화면 위에도 뜸
- **화면 켜짐**: 충전 중에는 화면이 꺼지지 않음 (페이지 설정의 '화면 꺼짐 방지'를 따름)
- **화면 보호기**: 설정 → 디스플레이 → 화면 보호기 → '우리집 액자', 시작 시기 '충전 중'
- **야간 모드**: 페이지의 야간 모드에 맞춰 실제 화면 밝기도 낮춤
- **부팅 시 실행**: 안드로이드 9 이하

## 만들기

`android/`, `photo-frame.html`, 워크플로 파일이 바뀌어 푸시되면 GitHub Actions(`.github/workflows/frame-apk.yml`)가
APK를 만들어 Releases의 `frame-apk`에 올립니다. 받는 주소는 늘 같습니다:
https://github.com/corolario90-ops/test1/releases/download/frame-apk/ourhome-frame.apk

직접 만들 때 (JDK 17, Android SDK 34):

    python3 android/sync-web.py        # 페이지를 app/src/main/assets/web/frame 으로 복사 (글꼴을 앱 안 글꼴로 바꿈)
    gradle -p android assembleRelease  # Gradle 8.7 이상

`app/frame-debug.keystore`는 직접 설치용 서명 키입니다. 안드로이드 디버그 키처럼 공개된 비밀번호(`android`)를 씁니다.
늘 같은 키로 서명해야 새 버전을 덮어 설치해도 사진·설정이 남습니다. 플레이 스토어용 키가 아닙니다.
글꼴은 SIL Open Font License 1.1 (`app/src/main/assets/web/fonts/OFL-notosanskr.txt`).
