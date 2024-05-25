package com.cwr.androidnativeutil;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.os.Process;
import android.provider.Settings;
import android.view.accessibility.AccessibilityManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class PermissionCheck extends MainNativeUtil {
    public PermissionCheck(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName(){
        return "PermissionCheck";
    }
    @ReactMethod
    public void checkWriteSettingsPermission(Promise promise){
        if(!Settings.System.canWrite(NativeModuleContext)){
            promise.resolve(false);
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void checkForAppUsageStatsPermission(Promise promise) {
        AppOpsManager appOps = (AppOpsManager) NativeModuleContext.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), NativeModuleContext.getPackageName());
        if(mode == AppOpsManager.MODE_ALLOWED){
            promise.resolve(true);
        }else{
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void checkForAccessibilityServicePermission(Promise promise) {
        AccessibilityManager accessibilityManager = (AccessibilityManager) NativeModuleContext.getSystemService(Context.ACCESSIBILITY_SERVICE);
        boolean isServiceEnabled = accessibilityManager.isEnabled();
        promise.resolve(isServiceEnabled);
    }

    private void requestSettingsPermission(String permission){
        Intent intent = new Intent(permission);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        NativeModuleContext.startActivity(intent);
    }

    @ReactMethod
    public void requestWriteSettingsPermission() {
        requestSettingsPermission(Settings.ACTION_MANAGE_WRITE_SETTINGS);
    }

    @ReactMethod
    public void requestUsageAccessSettingsPermission() {
        requestSettingsPermission(Settings.ACTION_USAGE_ACCESS_SETTINGS);
    }

    @ReactMethod
    public void requestAccessibilityServicePermission() {
        requestSettingsPermission(Settings.ACTION_ACCESSIBILITY_SETTINGS);
    }
}
