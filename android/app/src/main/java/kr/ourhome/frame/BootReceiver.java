package kr.ourhome.frame;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** 태블릿을 켜면 액자를 띄움 (안드로이드 9 이하. 10부터는 시스템이 막아서 화면 보호기를 씀) */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        String a = i.getAction();
        if (!Intent.ACTION_BOOT_COMPLETED.equals(a) && !"android.intent.action.QUICKBOOT_POWERON".equals(a)) return;
        if (!Web.autoStart(c)) return;
        try {
            c.startActivity(new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        } catch (RuntimeException e) {
            // 시스템이 막으면 조용히 넘어감
        }
    }
}
