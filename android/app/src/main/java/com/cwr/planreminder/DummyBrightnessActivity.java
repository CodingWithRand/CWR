package com.cwr.planreminder;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.provider.Settings;
import android.util.Log;
import android.view.WindowManager;

public class DummyBrightnessActivity extends Activity {

    private static DummyBrightnessActivity instance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent brightnessIntent = this.getIntent();
        float brightness = brightnessIntent.getFloatExtra("brightness value", 0);
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.screenBrightness = brightness;
        lp.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        getWindow().setAttributes(lp);

        getContentResolver().notifyChange(Settings.System.getUriFor(Settings.System.SCREEN_BRIGHTNESS), null);
        Log.d("DummyBrightnessActivity", lp.screenBrightness + " " + brightness);

        instance = this;
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        instance = null;
    }

    public static boolean isActivityRunning(){
        return instance != null;
    }

    public static void finishActivity(){
        if(instance != null){
            instance.finish();
            instance = null;
        }
    }

}