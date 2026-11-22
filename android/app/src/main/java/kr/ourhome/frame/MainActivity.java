package kr.ourhome.frame;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * 우리집 액자 본 화면: 상태 표시줄·내비게이션 바 없이 전체 화면으로 액자 페이지를 띄우고,
 * 충전 중에는 화면이 꺼지지 않게, 밤에는 화면 밝기를 낮춤. 잠금 화면 위에도 뜸.
 */
public class MainActivity extends Activity implements Bridge.Host {
    private static final int REQ_FILES = 1;
    private static final int REQ_GEO = 2;

    private WebView web;
    private ValueCallback<Uri[]> fileCb;
    private GeolocationPermissions.Callback geoCb;
    private String geoOrigin;
    private final Handler ui = new Handler(Looper.getMainLooper());

    // 충전기를 꽂고 뺄 때, 배터리가 바뀔 때마다 페이지에 알려 줌
    private final BroadcastReceiver batteryRx = new BroadcastReceiver() {
        private Boolean lastCharging;
        private int lastPct = -2;

        @Override
        public void onReceive(Context c, Intent i) {
            boolean charging = i.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) != 0;
            int pct = Web.percent(i);
            if (lastCharging != null && lastCharging == charging && lastPct == pct) return;
            lastCharging = charging;
            lastPct = pct;
            updateKeepOn();
            if (web != null) web.evaluateJavascript("window.frameAppPower&&window.frameAppPower(" + charging + "," + pct + ")", null);
        }
    };

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (Build.VERSION.SDK_INT >= 27) setShowWhenLocked(true);
        else w.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = w.getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            w.setAttributes(lp);
        }

        web = new WebView(this);
        Web.setup(web, false);
        web.addJavascriptInterface(new Bridge(this), "FrameApp");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new Chrome());
        setContentView(web);
        hideSystemUi();
        updateKeepOn();
        registerReceiver(batteryRx, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        web.loadUrl(Web.START);
    }

    /* ---------- 전체 화면 ---------- */
    @SuppressWarnings("deprecation")
    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUi();
    }

    /* ---------- 화면 켜짐 · 밝기 ---------- */
    private void updateKeepOn() {
        String mode = Web.keepAwake(this);
        boolean on = "always".equals(mode) || ("charging".equals(mode) && Web.isCharging(this));
        if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    @Override
    public Context context() {
        return this;
    }

    @Override
    public boolean isDream() {
        return false;
    }

    @Override
    public void keepAwake(String mode) {
        Web.setKeepAwake(this, mode);
        updateKeepOn();
    }

    @Override
    public void night(boolean on, double level) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        // 어둡기 0.3 → 밝기 22%, 0.7 → 10%, 0.92 → 3% (꺼지면 태블릿 밝기 설정을 그대로 따름)
        lp.screenBrightness = on
                ? (float) Math.max(0.01, Math.min(0.3, 0.3 * (1 - level) + 0.01))
                : WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
        getWindow().setAttributes(lp);
    }

    /* ---------- 생명 주기 ---------- */
    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
        hideSystemUi();
        updateKeepOn();
    }

    @Override
    protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        try {
            unregisterReceiver(batteryRx);
        } catch (IllegalArgumentException e) {
            // 이미 풀림
        }
        ui.removeCallbacksAndMessages(null);
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        // 설정 창·도구 막대가 열려 있으면 페이지가 닫고, 아니면 액자를 뒤로 보냄(끄지 않음)
        web.evaluateJavascript("(window.frameAppBack&&window.frameAppBack())?'1':'0'", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) {
                if (!"\"1\"".equals(v)) moveTaskToBack(true);
            }
        });
    }

    /* ---------- 처음 열 때 문제가 생기면 잠시 뒤 다시 ---------- */
    private boolean retrying;

    private void showProblem() {
        if (retrying || web == null) return;
        retrying = true;
        String html = "<html><body style='margin:0;background:#000;color:#ccc;font-family:sans-serif;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center'>"
                + "<div><div style='font-size:22px'>액자를 여는 중이에요</div><div style='font-size:15px;margin-top:10px;color:#888'>잠시 뒤 다시 시도할게요</div></div></body></html>";
        web.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
        ui.postDelayed(new Runnable() {
            public void run() {
                retrying = false;
                if (web != null) web.loadUrl(Web.START);
            }
        }, 5000);
    }

    private final class Client extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
            return Web.serve(MainActivity.this, r.getUrl());
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView v, String url) {
            Uri u = Uri.parse(url);
            if (Web.isOurs(u)) return false;
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, u));
            } catch (ActivityNotFoundException e) {
                // 열 앱이 없음
            }
            return true;
        }

        @SuppressWarnings("deprecation")
        @Override
        public void onReceivedError(WebView v, int code, String desc, String url) {
            if (url != null && Web.isOurs(Uri.parse(url))) showProblem();
        }

        @Override
        public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
            if (r.isForMainFrame() && Web.isOurs(r.getUrl())) showProblem();
        }
    }

    /* ---------- 사진 고르기 · 현재 위치 ---------- */
    private final class Chrome extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
            if (fileCb != null) fileCb.onReceiveValue(null);
            fileCb = cb;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");
            i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            try {
                startActivityForResult(i, REQ_FILES);
            } catch (ActivityNotFoundException e) {
                fileCb = null;
                cb.onReceiveValue(null);
            }
            return true;
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback cb) {
            if (Build.VERSION.SDK_INT < 23 || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                cb.invoke(origin, true, false);
                return;
            }
            geoCb = cb;
            geoOrigin = origin;
            requestPermissions(new String[] { Manifest.permission.ACCESS_COARSE_LOCATION }, REQ_GEO);
        }
    }

    @Override
    protected void onActivityResult(int req, int code, Intent data) {
        super.onActivityResult(req, code, data);
        if (req != REQ_FILES || fileCb == null) return;
        Uri[] out = null;
        if (code == RESULT_OK && data != null) {
            ClipData clip = data.getClipData();
            if (clip != null && clip.getItemCount() > 0) {
                out = new Uri[clip.getItemCount()];
                for (int k = 0; k < out.length; k++) out[k] = clip.getItemAt(k).getUri();
            } else if (data.getData() != null) {
                out = new Uri[] { data.getData() };
            }
        }
        fileCb.onReceiveValue(out);
        fileCb = null;
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] res) {
        if (req == REQ_GEO && geoCb != null) {
            geoCb.invoke(geoOrigin, res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED, false);
            geoCb = null;
        }
    }
}
