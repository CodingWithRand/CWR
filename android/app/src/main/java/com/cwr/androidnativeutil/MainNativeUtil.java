package com.cwr.androidnativeutil;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.media.AudioManager;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.cwr.androidnativeutil.BackgroundProcess;
import com.cwr.androidnativeutil.AppStatisticData;
import com.cwr.androidnativeutil.PermissionCheck;

import java.util.Objects;

public class MainNativeUtil extends ReactContextBaseJavaModule {

    protected final Context NativeModuleContext;
    protected final ContentResolver NativeModuleContentResolver;
    public MainNativeUtil(ReactApplicationContext context){
        super(context);
        this.NativeModuleContext = context;
        this.NativeModuleContentResolver = context.getContentResolver();
    }

    public MainNativeUtil(Context context){
        this.NativeModuleContext = context;
        this.NativeModuleContentResolver = context.getContentResolver();
    }

    @NonNull
    @Override
    public String getName(){
        return "MainNativeUtil";
    }

    @ReactMethod
    public void initiate(Promise promise){
        /* Test function */
        promise.resolve("Module Initiated (Test)");
    }

}
