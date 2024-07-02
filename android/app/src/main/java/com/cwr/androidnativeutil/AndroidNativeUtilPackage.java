package com.cwr.androidnativeutil;

import com.cwr.androidnativeutil.settings.Brightness;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
public class AndroidNativeUtilPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MainNativeUtil(reactContext));
        modules.add(new AppStatisticData(reactContext));
        modules.add(new PermissionCheck(reactContext));
        modules.add(new BackgroundProcess(reactContext));
        modules.add(new Brightness(reactContext));

        return modules;
    }
}
