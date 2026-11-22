package kr.ourhome.frame;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.BatteryManager;
import android.service.dreams.DreamService;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * 화면 보호기: 태블릿 설정 → 디스플레이 → 화면 보호기에서 '우리집 액자'를 고르고 시작 시기를 '충전 중'으로 하면,
 * 충전기를 꽂아 둔 채 화면이 꺼질 시간이 됐을 때 액자가 저절로 뜸. 화면을 누르면 끝남.
 * 사진·설정은 앱과 같은 저장소를 씀.
 */
public class FrameDream extends DreamService implements Bridge.Host {
    private WebView web;

    private final BroadcastReceiver batteryRx = new BroadcastReceiver() {
        @Override
        public void onReceive(Context c, Intent i) {
            boolean charging = i.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) != 0;
            if (web != null) web.evaluateJavascript("window.frameAppPower&&window.frameAppPower(" + charging + "," + Web.percent(i) + ")", null);
        }
    };

    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        setInteractive(false);
        setFullscreen(true);
        setScreenBright(true);
        web = new WebView(this);
        Web.setup(web, true);
        web.addJavascriptInterface(new Bridge(this), "FrameApp");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                return Web.serve(FrameDream.this, r.getUrl());
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, String url) {
                return !Web.isOurs(Uri.parse(url));
            }
        });
        setContentView(web);
        registerReceiver(batteryRx, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        web.loadUrl(Web.START);
    }

    @Override
    public void onDreamingStarted() {
        super.onDreamingStarted();
        if (web != null) web.onResume();
    }

    @Override
    public void onDreamingStopped() {
        if (web != null) web.onPause();
        super.onDreamingStopped();
    }

    @Override
    public void onDetachedFromWindow() {
        try {
            unregisterReceiver(batteryRx);
        } catch (IllegalArgumentException e) {
            // 이미 풀림
        }
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDetachedFromWindow();
    }

    @Override
    public Context context() {
        return this;
    }

    @Override
    public boolean isDream() {
        return true;
    }

    @Override
    public void keepAwake(String mode) {
        // 화면 보호기는 충전 중에 스스로 화면을 켜 둠
        Web.setKeepAwake(this, mode);
    }

    @Override
    public void night(boolean on, double level) {
        setScreenBright(!on);
    }
}
