package com.cwr.androidnativeutil;

import android.app.AppOpsManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Process;
import android.provider.Settings;
import android.view.accessibility.AccessibilityManager;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.Objects;

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

    @ReactMethod
    public void checkForNotificationPermission(Promise promise) {
        String permission = "android.permission.POST_NOTIFICATIONS";
        int permissionCheck = ContextCompat.checkSelfPermission(NativeModuleContext, permission);
        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void checkForNotificationPolicyAccess(Promise promise) {
        NotificationManager notificationManager = (NotificationManager) NativeModuleContext.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager.isNotificationPolicyAccessGranted()) {
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
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

    @ReactMethod
    public void requestNotificationPermission() {
        Intent intent;
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, NativeModuleContext.getPackageName());
        }else{
            intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + NativeModuleContext.getPackageName()));
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        NativeModuleContext.startActivity(intent);
    }

    @ReactMethod
    public void requestNotificationPolicyAccess(){
        requestSettingsPermission(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
    }
}
