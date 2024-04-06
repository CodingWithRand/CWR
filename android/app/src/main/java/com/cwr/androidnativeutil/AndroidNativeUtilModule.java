package com.cwr.androidnativeutil;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;

public class AndroidNativeUtilModule extends ReactContextBaseJavaModule {
    AndroidNativeUtilModule(ReactApplicationContext context){
        super(context);
    }
    @NonNull
    @Override
    public String getName(){
        return "AndroidNativeUtil";
    }

    @ReactMethod
    public void initiate(Promise promise){
        /* Test function */
        promise.resolve("Module Initiated (Test)");
    }

    private final Context reactContext = getReactApplicationContext();
    private final ContentResolver reactContentResolver = reactContext.getContentResolver();

    @ReactMethod
    public void checkWriteSettingsPermission(Promise promise){
        if(!Settings.System.canWrite(reactContext)){
            promise.resolve(false);
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void requestWriteSettingsPermission(){
        Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    /* Brightness */

    @ReactMethod
    public void getScreenBrightness(Promise promise){
        try {
            int brightnessUnit = Settings.System.getInt(reactContentResolver, Settings.System.SCREEN_BRIGHTNESS);
            promise.resolve(brightnessUnit);
        } catch (Exception e) {
            promise.reject("Error: ", e);
        }
    }

    @ReactMethod
    public void setScreenBrightness(int brightnessVolume){
        float brightnessRatio = brightnessVolume / 255.0f;
        int normalizedBrightness = (int) (brightnessRatio * 255);
        Settings.System.putInt(reactContentResolver, Settings.System.SCREEN_BRIGHTNESS, normalizedBrightness);
    }

    @ReactMethod
    public void setScreenBrightnessAdjustmentMode(String mode, Promise promise){
        if(Objects.equals(mode, "manual")) {
            Settings.System.putInt(reactContentResolver, Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL);
        } else if(Objects.equals(mode, "auto")) {
            Settings.System.putInt(reactContentResolver, Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC);
        } else {
            promise.reject("Error: ", "Unknown brightness adjustment mode provided");
        }
    }

    /* Audio */

    private final AudioManager audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
    private int getStreamType(String streamType){
        return switch (streamType) {
            case "media" -> AudioManager.STREAM_MUSIC;
            case "ringtone" -> AudioManager.STREAM_RING;
            case "notification" -> AudioManager.STREAM_NOTIFICATION;
            case "alarm" -> AudioManager.STREAM_ALARM;
            case "call" -> AudioManager.STREAM_VOICE_CALL;
            default -> throw new IllegalArgumentException("Unknown sound stream type");
        };
    }

    @ReactMethod
    public void setVolume(String streamType, int Volume, Promise promise){
        try {
            int integerStreamType = getStreamType(streamType);
            int maxVolume = audioManager.getStreamMaxVolume(integerStreamType);
            int adjustedVolume = (int) (maxVolume * (Volume / 100.0f));

            audioManager.setStreamVolume(integerStreamType, adjustedVolume, 0);
            promise.resolve( true);
        } catch (IllegalArgumentException e) {
            promise.reject("Error: ", e.getMessage());
        }
    }

    @ReactMethod
    public void getVolume(String streamType, Promise promise){
        try {
            int integerStreamType = getStreamType(streamType);
            int currentVolume = audioManager.getStreamVolume(integerStreamType);
            int maxVolume = audioManager.getStreamMaxVolume(integerStreamType);
            double volumePercentage = (currentVolume / (double) maxVolume) * 100;
            promise.resolve(volumePercentage);
        } catch (IllegalArgumentException e){
            promise.reject("Error: ", e.getMessage());
        }
    }
}
