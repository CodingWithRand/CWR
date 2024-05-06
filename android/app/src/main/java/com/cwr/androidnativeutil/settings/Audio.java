package com.cwr.androidnativeutil.settings;

import android.content.Context;
import android.media.AudioManager;

import androidx.annotation.NonNull;

import com.cwr.androidnativeutil.MainNativeUtil;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class Audio extends MainNativeUtil {

    public Audio(ReactApplicationContext context){
        super(context);
    }

    public Audio(Context context){
        super(context);
    }

    @NonNull
    @Override
    public String getName(){
        return "AudioSetting";
    }

    private final AudioManager audioManager = (AudioManager) NativeModuleContext.getSystemService(Context.AUDIO_SERVICE);
    private final int all = 999;
    private int getStreamType(String streamType){
        return switch (streamType) {
            case "media" -> AudioManager.STREAM_MUSIC;
            case "ringtone" -> AudioManager.STREAM_RING;
            case "notification" -> AudioManager.STREAM_NOTIFICATION;
            case "alarm" -> AudioManager.STREAM_ALARM;
            case "call" -> AudioManager.STREAM_VOICE_CALL;
            case "all" -> all;
            default -> throw new JSApplicationIllegalArgumentException("Unknown sound stream type");
        };
    }

    public void setVolume(String streamType, int Volume){
        int integerStreamType = getStreamType(streamType);
        if(integerStreamType == all){
            String[] allStreamType = { "media", "ringtone", "notification", "alarm", "call" };
            for(String st: allStreamType){
                setVolume(st, Volume);
            }
        }else{
            int maxVolume = audioManager.getStreamMaxVolume(integerStreamType);
            int adjustedVolume = (int) (maxVolume * (Volume / 100.0f));

            audioManager.setStreamVolume(integerStreamType, adjustedVolume, 0);
        }
    }

    @ReactMethod
    public void setVolume(String streamType, int Volume, Promise promise){
        try {
            setVolume(streamType, Volume);
            promise.resolve(true);
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
