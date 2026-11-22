package kr.ourhome.frame;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.BatteryManager;
import android.view.View;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 앱과 화면 보호기가 함께 쓰는 것들.
 * 액자 화면(웹 페이지)은 APK 안 assets/web 에 들어 있고, 인터넷 주소처럼 보이는
 * https://appassets.androidplatform.net/ 으로 열어서 사진 저장소·위치 같은 기능을 그대로 씀.
 * (이 주소는 안드로이드가 앱 안 파일용으로 비워 둔 이름이라 실제 인터넷으로 나가지 않음)
 */
final class Web {
    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/frame/index.html";
    static final String VERSION = "1.0";

    private static final Map<String, String> TYPES = new HashMap<>();
    static {
        TYPES.put("html", "text/html");
        TYPES.put("js", "text/javascript");
        TYPES.put("css", "text/css");
        TYPES.put("json", "application/json");
        TYPES.put("png", "image/png");
        TYPES.put("svg", "image/svg+xml");
        TYPES.put("woff2", "font/woff2");
        TYPES.put("txt", "text/plain");
    }

    private Web() {}

    @SuppressLint("SetJavaScriptEnabled")
    static void setup(WebView w, boolean dream) {
        WebSettings s = w.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setGeolocationEnabled(!dream);
        s.setAllowFileAccess(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(false);
        s.setTextZoom(100); // 태블릿 글자 크기 설정 때문에 화면 배치가 깨지지 않게
        s.setSupportZoom(false);
        w.setBackgroundColor(Color.BLACK);
        w.setOverScrollMode(View.OVER_SCROLL_NEVER);
        w.setVerticalScrollBarEnabled(false);
        w.setHorizontalScrollBarEnabled(false);
    }

    static boolean isOurs(Uri u) {
        return u != null && "https".equals(u.getScheme()) && HOST.equals(u.getHost());
    }

    /** https://appassets.androidplatform.net/… 요청을 assets/web/… 파일로 돌려줌 */
    static WebResourceResponse serve(Context c, Uri u) {
        if (!isOurs(u)) return null;
        String path = u.getPath();
        if (path == null || path.isEmpty()) path = "/";
        if (path.endsWith("/")) path += "index.html";
        if (path.contains("..")) return missing();
        try {
            InputStream in = c.getAssets().open("web" + path);
            String ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
            String type = TYPES.containsKey(ext) ? TYPES.get(ext) : "application/octet-stream";
            boolean text = type.startsWith("text/") || type.endsWith("json") || type.endsWith("javascript");
            WebResourceResponse r = new WebResourceResponse(type, text ? "utf-8" : null, in);
            Map<String, String> h = new HashMap<>();
            h.put("Cache-Control", "no-cache");
            r.setResponseHeaders(h);
            return r;
        } catch (IOException e) {
            return missing();
        }
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, new ByteArrayInputStream(new byte[0]));
    }

    private static Intent battery(Context c) {
        return c.getApplicationContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    static boolean isCharging(Context c) {
        Intent b = battery(c);
        return b != null && b.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) != 0;
    }

    static int batteryPercent(Context c) {
        return percent(battery(c));
    }

    static int percent(Intent b) {
        if (b == null) return -1;
        int level = b.getIntExtra(BatteryManager.EXTRA_LEVEL, -1), scale = b.getIntExtra(BatteryManager.EXTRA_SCALE, 100);
        return level >= 0 && scale > 0 ? level * 100 / scale : -1;
    }

    /* ---------- 앱이 기억하는 설정 (웹 페이지 설정과 별도: 페이지가 열리기 전에도 알아야 하는 것) ---------- */
    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("frame", Context.MODE_PRIVATE);
    }

    static String keepAwake(Context c) {
        return prefs(c).getString("keepAwake", "charging");
    }

    static void setKeepAwake(Context c, String mode) {
        if (!"always".equals(mode) && !"off".equals(mode)) mode = "charging";
        prefs(c).edit().putString("keepAwake", mode).apply();
    }

    static boolean autoStart(Context c) {
        return prefs(c).getBoolean("autoStart", true);
    }

    static void setAutoStart(Context c, boolean on) {
        prefs(c).edit().putBoolean("autoStart", on).apply();
    }
}
