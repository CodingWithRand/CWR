package com.cwr.androidnativeutil;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.WorkManager;

import com.cwr.androidnativeutil.bgprocessworker.BackgroundProcessSchedule;
import com.cwr.androidnativeutil.bgprocessworker.BackgroundProcessWorkers;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.lang.reflect.Array;
import java.util.ArrayList;


public class BackgroundProcess extends MainNativeUtil{
    public BackgroundProcess(ReactApplicationContext context){
        super(context);
    }

    @NonNull
    @Override
    public String getName(){
        return "BackgroundProcess";
    }

    private static final String WORKERS_REGISTERED_FLAG = "247app-management-department-workers";

    private static boolean isInvokerRegistered(Context context){
        SharedPreferences preferences = context.getSharedPreferences(
            PreferenceManager.getDefaultSharedPreferencesName(context),
            Context.MODE_PRIVATE
        );
        return preferences.getBoolean(WORKERS_REGISTERED_FLAG, false);
    }

    private static void setInvokerRegistryState(Context context, boolean state){
        SharedPreferences preferences = context.getSharedPreferences(
            PreferenceManager.getDefaultSharedPreferencesName(context),
            Context.MODE_PRIVATE
        );
        preferences.edit().putBoolean(WORKERS_REGISTERED_FLAG, state).apply();
    }

    private void initiateBackgroundInvoker(@NonNull ReadableArray workersConfigs){
        Data.Builder configConstructor = new Data.Builder();
        for(int i = 0; i < workersConfigs.size(); i++){
            ReadableMap workerConfigsMap = workersConfigs.getMap(i);
            ReadableMapKeySetIterator iterator = workerConfigsMap.keySetIterator();
            String workerName = null;
            while (iterator.hasNextKey()){
                String workerConfigKey = iterator.nextKey();
                String workerConfigValue = workerConfigsMap.getString(workerConfigKey);
                if(workerConfigKey.equals("name")){
                    workerName = workerConfigValue;
                    break;
                }
            }
            assert workerName != null;
            configConstructor.putString(workerName, PackageUtilities.JSON_Stringify(workerConfigsMap));
        }
        Data configsData = configConstructor.build();

        BackgroundProcessSchedule.OneTimeTaskBuilder TriggerInvoker = new
                BackgroundProcessSchedule.OneTimeTaskBuilder(BackgroundProcessWorkers.Invoker.class, NativeModuleContext);
        TriggerInvoker.input(configsData).build();
    }

    @ReactMethod
    public void registerInvoker(ReadableArray workersConfigs) {
        if(!isInvokerRegistered(NativeModuleContext)){
            if(workersConfigs != null) initiateBackgroundInvoker(workersConfigs);
            else initiateBackgroundInvoker(Arguments.createArray());
            setInvokerRegistryState(NativeModuleContext, true);
            Log.i("BackgroundProcess", "Invoker has been registered!");
        }else{
            throw new RuntimeException("Worker has been registered");
        }
    }

    @ReactMethod
    public void revokeInvokerRegistry() {
        if(isInvokerRegistered(NativeModuleContext)){
            WorkManager.getInstance(NativeModuleContext).cancelAllWork();
            setInvokerRegistryState(NativeModuleContext, false);
            Log.i("BackgroundProcess", "All work has been cancelled.");
        }else{
            throw new RuntimeException("Worker hasn't been registered yet");
        }
    }

    @ReactMethod
    public void isRunningOnBackground(Promise promise){
        if(getCurrentActivity() == null) {
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
}