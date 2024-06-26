package com.cwr.planreminder;

import android.accessibilityservice.AccessibilityService;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import com.cwr.androidnativeutil.AppStatisticData;
import com.cwr.androidnativeutil.Notification;
import com.cwr.androidnativeutil.PackageUtilities;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import java.util.Calendar;
import java.util.Objects;

public class TrackForegroundAppOpening extends AccessibilityService {
    private boolean isWithinTenMinutes(Calendar nowTime, Calendar startTime) {
        Calendar tenMinutesBeforeStart = (Calendar) startTime.clone();
        tenMinutesBeforeStart.add(Calendar.MINUTE, -10);
        return nowTime.after(tenMinutesBeforeStart) && nowTime.before(startTime);
    }
    // ฟังก์ชันแจ้งเตือนผู้ใช้

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
                    startTime.set(Calendar.HOUR_OF_DAY, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("fromHour"));
                    startTime.set(Calendar.MINUTE, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("fromMinute"));
                    startTime.set(Calendar.SECOND, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("fromSecond"));
                    Calendar endTime = Calendar.getInstance();
                    endTime.set(Calendar.HOUR_OF_DAY, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("toHour"));
                    endTime.set(Calendar.MINUTE, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("toMinute"));
                    endTime.set(Calendar.SECOND, (int) Objects.requireNonNull(configs.getMap(appName)).getDouble("toSecond"));

                    Log.d("TrackForegroundAppService", String.valueOf(nowTime.after(startTime)));
                    Log.d("TrackForegroundAppService", String.valueOf(nowTime.before(endTime)));
// ฟังก์ชันเพื่อเช็คว่าช่วงที่จะห้ามใช้แอปจะเริ่มขึ้นในอีก 10 นาที
                    Notification notification = new Notification(getApplicationContext());
                    try{
                        notification.createNotificationChannel(
                                "App alert It's not time yet.",
                                "App Do not disobey",
                                "This channel is used for Reminds users that it is not yet time to play."
                        );
                    } catch (Exception e) {
                        Log.e("AppStatisticProcessor", "Unable to create notification channel: " + e.getMessage());
                    }

                    notification.createAndSendNotification(
                            "App alert It's not time yet.",
                            "Master of Time",
                            "Your  + appName +  apps usage has reached limited of " ,
                            "Enough screen time for today, let's have some rest. You should put your phone down and go touch grass",
                            "You've been spending  on the screen already. Come on man, get some break!"

                    );
                    if (nowTime.after(startTime) && nowTime.before(endTime)) {
                        // แจ้งเตือนผู้ใช้ให้หยุดใช้แอป และบอกว่าช่วงที่ห้ามใช้แอปจะหมดอีกเมื่อไรถ้ากดเข้าใช้แอป
                        long remainingTime = endTime.getTimeInMillis() - nowTime.getTimeInMillis();
                        int remainingMinutes = (int) (remainingTime / (1000 * 60));
                        notification.createAndSendNotification(
                                "App alert It's not time yet.",
                                "Master of Time",
                                "กรุณาหยุดใช้แอป ช่วงที่ห้ามใช้แอปจะหมดในอีก"+ remainingMinutes + " นาที",
                                "Enough screen time for today, let's have some rest. You should put your phone down and go touch grass",
                                "You've been spending  on the screen already. Come on man, get some break!"

                        );
                    } else if (isWithinTenMinutes(nowTime, startTime)) {
                        // แจ้งเตือนผู้ใช้ว่าช่วงที่จะห้ามใช้แอปจะเริ่มขึ้นในอีกกี่ () นาที
                        long timeUntilStart = startTime.getTimeInMillis() - nowTime.getTimeInMillis();
                        int minutesUntilStart = (int) (timeUntilStart / (1000 * 60));
                        String message = "ช่วงที่จะห้ามใช้แอปจะเริ่มขึ้นในอีก " + minutesUntilStart + " นาที";
                        notification.createAndSendNotification(
                                "App alert It's not time yet.",
                                "Master of Time",
                                "ช่วงที่จะห้ามใช้แอปจะเริ่มขึ้นในอีก "+ minutesUntilStart + " นาที",
                                "Enough screen time for today, let's have some rest. You should put your phone down and go touch grass",
                                "You've been spending  on the screen already. Come on man, get some break!"

                        );
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
