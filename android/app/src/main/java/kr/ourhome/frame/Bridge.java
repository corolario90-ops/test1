package kr.ourhome.frame;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/** 액자 페이지에서 window.FrameApp 으로 부르는 것들. 페이지 안 코드는 photo-frame.html 의 APP 부분 참고 */
final class Bridge {
    interface Host {
        Context context();
        boolean isDream();
        void keepAwake(String mode);
        void night(boolean on, double level);
    }

    private final Host host;
    private final Handler ui = new Handler(Looper.getMainLooper());

    Bridge(Host host) {
        this.host = host;
    }

    @JavascriptInterface
    public void setKeepAwake(final String mode) {
        ui.post(new Runnable() { public void run() { host.keepAwake(mode); } });
    }

    @JavascriptInterface
    public void setNight(final boolean on, final double level) {
        ui.post(new Runnable() { public void run() { host.night(on, level); } });
    }

    @JavascriptInterface
    public boolean isCharging() {
        return Web.isCharging(host.context());
    }

    @JavascriptInterface
    public int batteryLevel() {
        return Web.batteryPercent(host.context());
    }

    @JavascriptInterface
    public boolean isDream() {
        return host.isDream();
    }

    @JavascriptInterface
    public boolean getAutoStart() {
        return Web.autoStart(host.context());
    }

    @JavascriptInterface
    public void setAutoStart(boolean on) {
        Web.setAutoStart(host.context(), on);
    }

    @JavascriptInterface
    public int sdkInt() {
        return Build.VERSION.SDK_INT;
    }

    @JavascriptInterface
    public String version() {
        return Web.VERSION;
    }

    @JavascriptInterface
    public void openScreensaverSettings() {
        ui.post(new Runnable() {
            public void run() {
                Context c = host.context();
                String[] tries = { Settings.ACTION_DREAM_SETTINGS, Settings.ACTION_DISPLAY_SETTINGS, Settings.ACTION_SETTINGS };
                for (String action : tries) {
                    try {
                        c.startActivity(new Intent(action).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                        if (!Settings.ACTION_DREAM_SETTINGS.equals(action)) {
                            Toast.makeText(c, "디스플레이 → 화면 보호기에서 '우리집 액자'를 골라 주세요", Toast.LENGTH_LONG).show();
                        }
                        return;
                    } catch (ActivityNotFoundException | SecurityException e) {
                        // 다음 화면으로
                    }
                }
            }
        });
    }
}
