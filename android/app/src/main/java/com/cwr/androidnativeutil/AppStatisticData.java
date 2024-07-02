package com.cwr.androidnativeutil;

import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
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
import java.util.Objects;

public class AppStatisticData extends MainNativeUtil{

    private final UsageStatsManager usageStatsManager;
    private final PackageManager packageManager;
    public AppStatisticData(ReactApplicationContext context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) NativeModuleContext.getSystemService(Context.USAGE_STATS_SERVICE);
        this.packageManager = NativeModuleContext.getPackageManager();
    }

    public AppStatisticData(Context context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        this.packageManager = context.getPackageManager();
    }

    @NonNull
    @Override
    public String getName(){
        return "AppStatisticData";
    }

    private static class TimePeriod{
        private static class BeginEndTime{
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
                if (Objects.equals(packageName, NativeModuleContext.getPackageName())) continue;
                long timeInForeground = usageStats.getTotalTimeInForeground();

                /* Real-Time usage data check (not accurate) */

//                UsageEvents.Event lastAppOnForegroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_FOREGROUND, null);
//                UsageEvents.Event lastAppOnBackgroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_BACKGROUND, null);
//                if(lastAppOnForegroundEvent.getTimeStamp() > lastAppOnBackgroundEvent.getTimeStamp()) {
//                    if (usageStats.getPackageName().equals(lastAppOnForegroundEvent.getPackageName())) {
//                        Log.d("AppStatisticData", String.valueOf(lastAppOnForegroundEvent.getTimeStamp()));
//                        Log.d("AppStatisticData", String.valueOf(lastAppOnBackgroundEvent.getTimeStamp()));
//                        long elapsingTime = System.currentTimeMillis() - lastAppOnForegroundEvent.getTimeStamp();
//                      Log.d("AppStatisticData", timeInForeground + "+" + elapsingTime);
//                        if (elapsingTime > 0) timeInForeground += elapsingTime;
//                    }
//                  Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
//                }
//                Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ", Last time use: )" + usageStats.getLastTimeUsed() );

                if(appsForegroundTime.containsKey(getAppName(packageName))){
                    long currentAppTotalUsage = (long) appsForegroundTime.get(getAppName(packageName));
//                    Log.d("AppStatisticData", String.valueOf(currentAppTotalUsage));
                    appsForegroundTime.put(getAppName(usageStats.getPackageName()), currentAppTotalUsage + timeInForeground);
                } else {
                    appsForegroundTime.put(getAppName(usageStats.getPackageName()), timeInForeground);
                }
            }
            Log.d("AppStatisticData", appsForegroundTime.toString());
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

        Log.d("AppStatisticData", beginEndTime.et + " " + beginEndTime.st);
        List<UsageStats> stats = usageStatsManager.queryUsageStats(interval, beginEndTime.st, beginEndTime.et);
        long appForegroundTime = 0L;

        if(stats != null && !stats.isEmpty()) {
            for (UsageStats usageStats : stats) {
                String packageName = usageStats.getPackageName();
                if (getAppName(packageName).equals("System Package")) continue;
                if (Objects.equals(packageName, NativeModuleContext.getPackageName())) continue;
                if (getAppName(packageName).equals(appName)){
                    appForegroundTime += usageStats.getTotalTimeInForeground();

                    /* Real-Time usage data check (not accurate) */

//                    UsageEvents.Event lastAppOnForegroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_FOREGROUND, packageName);
//                    UsageEvents.Event lastAppOnBackgroundEvent = getLastAppEvent(beginEndTime.st, beginEndTime.et, UsageEvents.Event.MOVE_TO_BACKGROUND, packageName);
//                    if(lastAppOnForegroundEvent.getTimeStamp() > lastAppOnBackgroundEvent.getTimeStamp()) {
//                        if (usageStats.getPackageName().equals(lastAppOnForegroundEvent.getPackageName())) {
//                        Log.d("AppStatisticData", String.valueOf(lastAppOnForegroundEvent.getTimeStamp()));
//                        Log.d("AppStatisticData", String.valueOf(lastAppOnBackgroundEvent.getTimeStamp()));
//                            long elapsingTime = System.currentTimeMillis() - lastAppOnForegroundEvent.getTimeStamp();
//                        Log.d("AppStatisticData", appForegroundTime + "+" + elapsingTime);
//                            if (elapsingTime > 0) appForegroundTime += elapsingTime;
//                        }
//                     Log.d("AppStatisticData", "Spent " + appForegroundTime + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
//                    }
//                    Log.d("AppStatisticData", "Spent " + appForegroundTime + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
//                    break;
                }
                // Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
            }
        }
        return appForegroundTime;
    }

    @ReactMethod
    public void getAllInstalledLaunchableAppNames(Promise promise){
        Intent testIntent = new Intent(Intent.ACTION_MAIN);
        testIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> resolveInfos = packageManager.queryIntentActivities(testIntent, 0);
        Map<String, Object> allInstalledAppNamesAndPackages = new HashMap<>();

        for (ResolveInfo resolveInfo : resolveInfos) {
            String packageName = resolveInfo.activityInfo.packageName;
            if (Objects.equals(packageName, NativeModuleContext.getPackageName())) continue;
            String appName = resolveInfo.loadLabel(packageManager).toString();
            allInstalledAppNamesAndPackages.put(appName, appName + " (" + packageName + ")");
        }

        promise.resolve(PackageUtilities.mapToWritableMap(allInstalledAppNamesAndPackages));
    }
}

