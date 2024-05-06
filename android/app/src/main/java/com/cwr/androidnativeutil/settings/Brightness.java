package com.cwr.androidnativeutil.settings;

import android.content.Context;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.cwr.androidnativeutil.MainNativeUtil;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;

public class Brightness extends MainNativeUtil {
    public Brightness(ReactApplicationContext context){
        super(context);
    }

    public Brightness(Context context){
        super(context);
    }

    @NonNull
    @Override
    public String getName(){
        return "BrightnessSetting";
    }

    @ReactMethod
    public void getScreenBrightness(Promise promise){
        try {
            int brightnessUnit = Settings.System.getInt(NativeModuleContentResolver, Settings.System.SCREEN_BRIGHTNESS);
            promise.resolve(brightnessUnit);
        } catch (Exception e) {
            promise.reject("Error: ", e);
        }
    }

    @ReactMethod
    public void setScreenBrightness(int brightnessVolume){
        float brightnessRatio = brightnessVolume / 255.0f;
        int normalizedBrightness = (int) (brightnessRatio * 255);
        Settings.System.putInt(NativeModuleContentResolver, Settings.System.SCREEN_BRIGHTNESS, normalizedBrightness);
    }

    @ReactMethod
    public void setScreenBrightnessAdjustmentMode(String mode, Promise promise){
        if(Objects.equals(mode, "manual")) {
            Settings.System.putInt(NativeModuleContentResolver, Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL);
        } else if(Objects.equals(mode, "auto")) {
            Settings.System.putInt(NativeModuleContentResolver, Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC);
        } else {
            promise.reject("Error: ", "Unknown brightness adjustment mode provided");
        }
    }
}
