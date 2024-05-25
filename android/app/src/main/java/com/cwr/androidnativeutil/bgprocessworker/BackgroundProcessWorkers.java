package com.cwr.androidnativeutil.bgprocessworker;

import android.app.ActivityManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.cwr.androidnativeutil.AppStatisticData;
import com.cwr.androidnativeutil.Notification;
import com.cwr.androidnativeutil.PackageUtilities;
import com.cwr.androidnativeutil.settings.Audio;
import com.cwr.androidnativeutil.settings.Brightness;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class BackgroundProcessWorkers {

    public static class Retriever extends Worker {
        private final Context backgroundContext;
        public Retriever(@NonNull Context context, @NonNull WorkerParameters params) {
            super(context, params);
            this.backgroundContext = context;
        }

        @NonNull
        @Override
        public Result doWork () {
            Log.i("Retriever", "Observing and retrieving data according to the configs...");

            String RawRetrieverConfigs = getInputData().getString("Retriever");
            if(RawRetrieverConfigs == null){
                Log.i("Retriever",  "Unprovided configs. Nothing to observe, aborting...");
                return Result.success();
            }
            WritableMap RetrieverConfigs = PackageUtilities.JSON_Parse(RawRetrieverConfigs);

            Map<String, Object> appStatisticData = null;
            ReadableMapKeySetIterator retrieverConfigKeys = RetrieverConfigs.keySetIterator();
            while (retrieverConfigKeys.hasNextKey()){
                String retrieverConfigKey = retrieverConfigKeys.nextKey();
                switch (retrieverConfigKey){
                    case "retrieveTotalAppsStatistic":
                        if(RetrieverConfigs.getBoolean("retrieveTotalAppsStatistic")){
                            appStatisticData = new AppStatisticData(backgroundContext)
                                .getTotalAppsUsage(Objects.requireNonNullElse(RetrieverConfigs.getString("appStatisticInterval"), "daily"));
                        }
                        break;
                    case "retrieveOneAppsStatistic":
                        // TODO: (later) Properly deal with one app statistic data retrieval. Create new method in AppStatisticData.java
                        if(RetrieverConfigs.getBoolean("retrieveOneAppsStatistic")){
                            appStatisticData = new AppStatisticData(backgroundContext)
                                    .getTotalAppsUsage(Objects.requireNonNullElse(RetrieverConfigs.getString("appStatisticInterval"), "daily"));
                        }
                        break;
                }
            }

            Data.Builder retrievedDataConstructor = new Data.Builder();
            if(appStatisticData != null) {
                retrievedDataConstructor.putString("appStatisticData", PackageUtilities.JSON_Stringify(appStatisticData));
            } else {
                Log.i("Retriever",  "Nothing was observed, passing work to processor...");
            }
            retrievedDataConstructor.putString("Processor", getInputData().getString("Processor"));
            Data retrievedData = retrievedDataConstructor.build();
            Log.i("Retriever", "Successfully retrieving data, passing it to the processor");

            BackgroundProcessSchedule.OneTimeTaskBuilder ProcessorExecutionTask = new
                    BackgroundProcessSchedule.OneTimeTaskBuilder(Processor.class, backgroundContext);
            ProcessorExecutionTask.input(retrievedData).build();

            return Result.success();
        }
    }

    public static class Invoker extends Worker {
        private final Context backgroundContext;
        public Invoker(@NonNull Context context, @NonNull WorkerParameters params) {
            super(context, params);
            this.backgroundContext = context;
        }

        @NonNull
        @Override
        public Result doWork(){
            Log.i("WorkersStatus","In execution...");
            BackgroundProcessSchedule.OneTimeTaskBuilder ReinvokeInvokerTask = new
                    BackgroundProcessSchedule.OneTimeTaskBuilder(this.getClass(), backgroundContext);
            ReinvokeInvokerTask.delay(1).input(getInputData()).build();

            BackgroundProcessSchedule.OneTimeTaskBuilder ReinvokeRetrieverTask = new
                    BackgroundProcessSchedule.OneTimeTaskBuilder(Retriever.class, backgroundContext);
            ReinvokeRetrieverTask.delay(1).input(getInputData()).build();
            Log.i("WorkersStatus","Scheduled re-execution in the next minute");
            return Result.success();
        }
    }

    public static class Processor extends Worker {
        private final Context backgroundContext;
        public Processor(@NonNull Context context, @NonNull WorkerParameters params){
            super(context, params);
            this.backgroundContext = context;
        }

        private static class BasicConfigsPrep{
            private final int uri;
            private final long c;
            private final String unit;

            private BasicConfigsPrep(@NonNull ReadableMap configs){
                this.uri = configs.getInt("restrictedPeriod");
                this.unit = configs.getString("inUnit");
                assert unit != null;
                try {
                    this.c = getRestrictedPeriod(unit);
                } catch (IllegalArgumentException ie){
                    throw new IllegalArgumentException(ie);
                }
            }

            private long getRestrictedPeriod(@NonNull String unit){
                return switch (unit) {
                    case "minute" -> 1000L * 60L;
                    case "hour" -> 1000L * 60L * 60L;
                    case "day" -> 1000L * 60L * 60L * 7L;
                    default -> throw new IllegalArgumentException("Invalid time length or not specified");
                };
            }
        }

        private void trackAllLaunchableAppUsage(@NonNull ReadableMap configs, @NonNull String RawAppUsageStatisticData){
            BasicConfigsPrep bcp = new BasicConfigsPrep(configs);
            int usageRestrictionIntervalValue = bcp.uri;
            String intervalUnit = bcp.unit;
            long comparator = bcp.c;
            try {
                Map<String, Object> RetrievedAppUsageStatisticData = PackageUtilities.JSON_Map_Parse(RawAppUsageStatisticData);
                long TotalAppsUsageInPeriod = 0L;
                for (Object TotalAppUsageInPeriod : RetrievedAppUsageStatisticData.values()) {
                    TotalAppsUsageInPeriod += ((Number) TotalAppUsageInPeriod).longValue();
                }
                if (TotalAppsUsageInPeriod >= (usageRestrictionIntervalValue * comparator)) {
                    Brightness brightnessSetting = new Brightness(backgroundContext);
                    Audio audioSetting = new Audio(backgroundContext);
                    Notification notification = new Notification(backgroundContext);
                    if (configs.hasKey("isIntenselyStricted") && configs.getBoolean("isIntenselyStricted")) {
                        brightnessSetting.setScreenBrightness(0);
                        audioSetting.setVolume("all", 0);
                    }

                    try{
                        notification.createNotificationChannel(
                                "AppUsageStatisticDataAlert",
                                "App Usage Alert",
                                "This channel is used for notifying user about their app usage compare to the custom limit"
                        );
                    } catch (Exception e) {
                        Log.e("AppStatisticProcessor", "Unable to create notification channel: " + e.getMessage());
                    }

                    notification.createAndSendNotification(
                            "AppUsageStatisticDataAlert",
                            "Master of Time",
                            "Your " + configs.getString("watchInterval") + " total apps usage has reached limited of " + usageRestrictionIntervalValue + " " + intervalUnit,
                            "Enough screen time for today, let's have some rest. You should put your phone down and go touch grass",
                            "You've been spending " + usageRestrictionIntervalValue + " " + intervalUnit + " on the screen already. Come on man, get some break!"
                    );
                    Log.i("AppStatisticProcessor", "You've spent " + TotalAppsUsageInPeriod + " milliseconds screen. Go touch grass now man.");
                } else {
                    Log.i("AppStatisticProcessor", "You've spent " + TotalAppsUsageInPeriod + " milliseconds on screen");
                }
            } catch (JSONException je) {
                throw new RuntimeException(je);
            }
        }

        private void trackOneLaunchableApp(@NonNull ReadableMap configs, @NonNull String RawAppUsageStatisticData){
            BasicConfigsPrep bcp = new BasicConfigsPrep(configs);
            int usageRestrictionIntervalValue = bcp.uri;
            String intervalUnit = bcp.unit;
            long comparator = bcp.c;
            try {
                Map<String, Object> RetrievedAppUsageStatisticData = PackageUtilities.JSON_Map_Parse(RawAppUsageStatisticData);

            } catch (JSONException je){
                throw new RuntimeException(je);
            }

            // This method may be merged with trackTotalLaunchableApp method.
        }

        @NonNull
        @Override
        public Result doWork(){
            String RawProcessorConfigs = getInputData().getString("Processor");
            String RawRetrievedAppUsageStatisticData = getInputData().getString("appStatisticData");
            assert RawProcessorConfigs != null;
            WritableMap ProcessorConfigs = PackageUtilities.JSON_Parse(RawProcessorConfigs);
            ReadableMapKeySetIterator processorConfigKeys = ProcessorConfigs.keySetIterator();
            while(processorConfigKeys.hasNextKey()) {
                String processorConfigKey = processorConfigKeys.nextKey();
                if (processorConfigKey.equals("jobs")) {
                    ReadableMap jobs = Objects.requireNonNull(ProcessorConfigs.getMap("jobs"));
                    ReadableMapKeySetIterator jobNames = jobs.keySetIterator();
                    while (jobNames.hasNextKey()) {
                        String jobName = jobNames.nextKey();
                        switch (jobName) {
                            case "totalAppUsageRestriction":
                                ReadableMap totalAppUsageStrictJobConfig = Objects.requireNonNull(jobs.getMap("totalAppUsageRestriction"));
                                trackAllLaunchableAppUsage(totalAppUsageStrictJobConfig, RawRetrievedAppUsageStatisticData);

                                // TODO: App usage data from retriever, accumulate the spent time of all app, then compare to the restriction. (Done)
                            case "oneAppUsageRestriction":
                                ReadableMap oneAppUsageRestrictionJobConfig = Objects.requireNonNull(jobs.getMap("oneAppUsageRestriction"));
                                trackOneLaunchableApp(oneAppUsageRestrictionJobConfig, RawRetrievedAppUsageStatisticData);

                        }
                    }
                }
            }
            return Result.success();
        }
    }
}