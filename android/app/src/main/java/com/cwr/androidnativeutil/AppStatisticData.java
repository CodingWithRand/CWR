package com.cwr.androidnativeutil;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppStatisticData extends MainNativeUtil{

    private final UsageStatsManager usageStatsManager;
    private final Calendar calendar;
    public AppStatisticData(ReactApplicationContext context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) NativeModuleContext.getSystemService(Context.USAGE_STATS_SERVICE);
        this.calendar = Calendar.getInstance();
    }

    public AppStatisticData(Context context){
        super(context);
        this.usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        this.calendar = Calendar.getInstance();
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
            long endTime = calendar.getTimeInMillis();
            calendar.add(quantifier, -(timeUnit));
            long startTime = calendar.getTimeInMillis();
            calendar.setTimeInMillis(System.currentTimeMillis());
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

    private String getAppName(String packageName){
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

        for (UsageStats usageStats : stats) {
            String packageName = usageStats.getPackageName();
            if(getAppName(packageName).equals("System Package")) continue;
            long timeInForeground = usageStats.getTotalTimeInForeground();
//            Log.d("AppStatisticData", "Spent " + timeInForeground + " millisecond in " + getAppName(packageName) + " (" + packageName + ")");
            appsForegroundTime.put(getAppName(usageStats.getPackageName()), timeInForeground);
        }

        return appsForegroundTime;

    }
}
