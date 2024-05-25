package com.cwr.planreminder;

import android.accessibilityservice.AccessibilityService;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import com.cwr.androidnativeutil.AppStatisticData;
import com.cwr.androidnativeutil.PackageUtilities;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import java.util.Calendar;
import java.util.Objects;

public class TrackForegroundAppOpening extends AccessibilityService {

    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        if(accessibilityEvent.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED){
            SharedPreferences preferences = getApplicationContext().getSharedPreferences(
                    PreferenceManager.getDefaultSharedPreferencesName(getApplicationContext()),
                    Context.MODE_PRIVATE
            );
            String RawConfigs = preferences.getString("tiaoifConfig", "");
            if(RawConfigs.equals("")){
                Log.d("TrackForegroundAppService", "Hasn't setup configs yet");
                return;
            }

            WritableMap configs = PackageUtilities.JSON_Parse(RawConfigs);
            boolean isStrictModeOn = configs.getBoolean("isStrictModeOn");
            ReadableMapKeySetIterator appNames = configs.keySetIterator();
            while (appNames.hasNextKey()) {
                String appName = appNames.nextKey();
                if(appName.equals("isStrictModeOn")) continue;
                AppStatisticData asd = new AppStatisticData(getApplicationContext());
                if(asd.getAppName(accessibilityEvent.getPackageName().toString()).equals(appName)){
                    Calendar nowTime = Calendar.getInstance();
                    Calendar startTime = Calendar.getInstance();
                    startTime.set(Calendar.HOUR_OF_DAY, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("from"));
                    Calendar endTime = Calendar.getInstance();
                    endTime.set(Calendar.HOUR_OF_DAY, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("to"));

                    Log.d("TrackForegroundAppService", String.valueOf(nowTime.after(startTime)));
                    Log.d("TrackForegroundAppService", String.valueOf(nowTime.before(endTime)));

                    if(nowTime.after(startTime) && nowTime.before(endTime)){
                        Log.i("TrackForegroundAppService", "You're using " + appName + " during the prohibited period");
                    }
                }
            }
        }
    }

    @Override
    public void onInterrupt() {
        Log.w("TrackForegroundAppService", "This service has been interrupted, please check for the factor!");
    }
}
