package com.cwr.androidnativeutil;

import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppStatisticData extends MainNativeUtil{

    private final UsageStatsManager usageStatsManager;
    public AppStatisticData(ReactApplicationContext context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) NativeModuleContext.getSystemService(Context.USAGE_STATS_SERVICE);
    }

    public AppStatisticData(Context context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
    }

    @NonNull
    @Override
    public String getName(){
        return "AppStatisticData";
    }

    private class TimePeriod{
        private class BeginEndTime{
            long st;
            long et;
        }
        private BeginEndTime getPeriod(int quantifier, int timeUnit){
            Calendar calendar = Calendar.getInstance();
            long endTime = calendar.getTimeInMillis();
            calendar.add(quantifier, -(timeUnit));
            long startTime = calendar.getTimeInMillis();

            return new BeginEndTime() {{
                st = startTime;
                et = endTime;
            }};
        }
        private BeginEndTime oneDayPeriod(){
            return getPeriod(Calendar.DAY_OF_WEEK, 1);
        }
        private BeginEndTime oneWeekPeriod(){
            return getPeriod(Calendar.DAY_OF_MONTH, 7);
        }
        private BeginEndTime oneMonthPeriod(){
            return getPeriod(Calendar.MONTH, 1);
        }
        private BeginEndTime oneYearPeriod(){
            return getPeriod(Calendar.YEAR, 1);
        }
    }

    public String getAppName(String packageName){
        PackageManager packageManager = NativeModuleContext.getPackageManager();
        try {
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, 0);
            if((applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0 && (applicationInfo.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) == 0){
                Intent launchIntent = packageManager.getLaunchIntentForPackage(packageName);
                if(launchIntent == null) return "System Package";
            }
            return (String) packageManager.getApplicationLabel(applicationInfo);
        } catch (PackageManager.NameNotFoundException e) {
            throw new IllegalArgumentException("Invalid package name");
        }
    }

    @ReactMethod
    public void getTotalAppsUsage(String trackingPeriod, Promise promise){
        try {
            promise.resolve(getTotalAppsUsage(trackingPeriod));
        } catch (IllegalArgumentException e){
            promise.reject("Error: ", e);
        }
    }

    private UsageEvents.Event getLastAppEvent(long beginTime, long endTime, int eventType, String packageName){
        UsageEvents.Event currentEvent;
        UsageEvents.Event lastEvent = null;
        List<UsageEvents.Event> allEvents = new ArrayList<>();

        UsageEvents usageEvents = usageStatsManager.queryEvents(beginTime, endTime);

        while (usageEvents.hasNextEvent()){
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            if(currentEvent.getEventType() == eventType) allEvents.add(currentEvent) ;
        }

        Collections.reverse(allEvents);

        for (int i = 0; i < allEvents.size(); i++){
            if(getAppName(allEvents.get(i).getPackageName()).equals("System Package")) continue;
            if(packageName == null || allEvents.get(i).getPackageName().equals(packageName)){
                lastEvent = allEvents.get(i);
                break;
            }
        }

        return lastEvent;
    }
    HashMap<String, Integer> getTimeSpent(Context context, String packageName, long beginTime, long endTime) {
        UsageEvents.Event currentEvent;
        List<UsageEvents.Event> allEvents = new ArrayList<>();
        HashMap<String, Integer> appUsageMap = new HashMap<>();

        UsageStatsManager usageStatsManager = (UsageStatsManager)context.getSystemService(Context.USAGE_STATS_SERVICE);
        UsageEvents usageEvents = usageStatsManager.queryEvents(beginTime, endTime);

        while (usageEvents.hasNextEvent()) {
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            if(currentEvent.getPackageName().equals(packageName) || packageName == null) {
                if (currentEvent.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED
                        || currentEvent.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED) {
                    allEvents.add(currentEvent);
                    String key = currentEvent.getPackageName();
                    appUsageMap.putIfAbsent(key, 0);
                }
            }
        }

        for (int i = 0; i < allEvents.size() - 1; i++) {
            UsageEvents.Event E0 = allEvents.get(i);
            UsageEvents.Event E1 = allEvents.get(i + 1);

            if (E0.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED
                    && E1.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED
                    && E0.getClassName().equals(E1.getClassName())) {
                int diff = (int)(E1.getTimeStamp() - E0.getTimeStamp());
                diff /= 1000;
                Integer prev = appUsageMap.get(E0.getPackageName());
                if(prev == null) prev = 0;
                appUsageMap.put(E0.getPackageName(), prev + diff);
            }
        }

        UsageEvents.Event lastEvent = allEvents.get(allEvents.size() - 1);
        if(lastEvent.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
            int diff = (int)System.currentTimeMillis() - (int)lastEvent.getTimeStamp();
            diff /= 1000;
            Integer prev = appUsageMap.get(lastEvent.getPackageName());
            if(prev == null) prev = 0;
            appUsageMap.put(lastEvent.getPackageName(), prev + diff);
        }

        return appUsageMap;
    }

    public Map<String, Object> getTotalAppsUsage(String trackingPeriod){
        TimePeriod timePeriod = new TimePeriod();
        TimePeriod.BeginEndTime beginEndTime = switch (trackingPeriod) {
            case "daily" -> timePeriod.oneDayPeriod();
            case "weekly" -> timePeriod.oneWeekPeriod();
            case "monthly" -> timePeriod.oneMonthPeriod();
            case "yearly" -> timePeriod.oneYearPeriod();
            default -> throw new IllegalArgumentException("Invalid time length or not specified");
        };

        final int interval = switch (trackingPeriod) {
            case "daily" -> UsageStatsManager.INTERVAL_DAILY;
            case "weekly" -> UsageStatsManager.INTERVAL_WEEKLY;
            case "monthly" -> UsageStatsManager.INTERVAL_MONTHLY;
            case "yearly" -> UsageStatsManager.INTERVAL_YEARLY;
            default -> throw new IllegalArgumentException("Invalid time length or not specified");
        };

        List<UsageStats> stats = usageStatsManager.queryUsageStats(interval, beginEndTime.st, beginEndTime.et);
        Map<String, Object> appsForegroundTime = new HashMap<>();

        if(stats != null && !stats.isEmpty()) {
            for (UsageStats usageStats : stats) {
                String packageName = usageStats.getPackageName();
                if (getAppName(packageName).equals("System Package")) continue;
                long timeInForeground = usageStats.getTotalTimeInForeground();

                UsageEvents.Event lastAppOnForegroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_FOREGROUND, null);
                UsageEvents.Event lastAppOnBackgroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_BACKGROUND, null);
                if(lastAppOnForegroundEvent.getTimeStamp() > lastAppOnBackgroundEvent.getTimeStamp()) {
                    if (usageStats.getPackageName().equals(lastAppOnForegroundEvent.getPackageName())) {
//                      Log.d("AppStatisticData", lastAppEvent.getPackageName());
                        long elapsingTime = System.currentTimeMillis() - lastAppOnForegroundEvent.getTimeStamp();
//                      Log.d("AppStatisticData", timeInForeground + "+" + elapsingTime);
                        if (elapsingTime > 0) timeInForeground += elapsingTime;
                    }
//                  Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
                }
                appsForegroundTime.put(getAppName(usageStats.getPackageName()), timeInForeground);
            }
        }
        return appsForegroundTime;
    }

    public long getOneAppUsage(String trackingPeriod, String appName){
        TimePeriod timePeriod = new TimePeriod();
        TimePeriod.BeginEndTime beginEndTime = switch (trackingPeriod) {
            case "daily" -> timePeriod.oneDayPeriod();
            case "weekly" -> timePeriod.oneWeekPeriod();
            case "monthly" -> timePeriod.oneMonthPeriod();
            case "yearly" -> timePeriod.oneYearPeriod();
            default -> throw new IllegalArgumentException("Invalid time length or not specified");
        };

        final int interval = switch (trackingPeriod) {
            case "daily" -> UsageStatsManager.INTERVAL_DAILY;
            case "weekly" -> UsageStatsManager.INTERVAL_WEEKLY;
            case "monthly" -> UsageStatsManager.INTERVAL_MONTHLY;
            case "yearly" -> UsageStatsManager.INTERVAL_YEARLY;
            default -> throw new IllegalArgumentException("Invalid time length or not specified");
        };

        List<UsageStats> stats = usageStatsManager.queryUsageStats(interval, beginEndTime.st, beginEndTime.et);
        long appForegroundTime = 0L;

        if(stats != null && !stats.isEmpty()) {
            for (UsageStats usageStats : stats) {
                String packageName = usageStats.getPackageName();
                if (getAppName(packageName).equals("System Package")) continue;
                if (getAppName(packageName).equals(appName)){
                    appForegroundTime = usageStats.getTotalTimeInForeground();
                    break;
                }
                // Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
            }
        }
        return appForegroundTime;
    }
}
