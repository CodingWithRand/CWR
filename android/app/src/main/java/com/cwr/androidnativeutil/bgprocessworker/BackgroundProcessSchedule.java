package com.cwr.androidnativeutil.bgprocessworker;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;

import java.util.concurrent.TimeUnit;

public class BackgroundProcessSchedule {
    public static PeriodicWorkRequest schedulePeriodicTask(Worker worker, Context context, int interval){
        PeriodicWorkRequest periodicWorkRequest = new PeriodicWorkRequest.Builder(
                worker.getClass(),
                interval,
                TimeUnit.MINUTES
        ).build();
        WorkManager.getInstance(context).enqueue(periodicWorkRequest);
        return periodicWorkRequest;
    }

    public static void crowdedlySchedulePeriodicTask(Worker worker, Context context, Activity activity, int interval){
        if(interval > 0 && interval < 15){
            OneTimeWorkRequest oneTimeWorkRequest = new OneTimeWorkRequest
                    .Builder(worker.getClass())
                    .setInitialDelay(interval, TimeUnit.MINUTES)
                    .build();
            WorkManager.getInstance(context).enqueue(oneTimeWorkRequest);
            if(activity != null){
                Log.d("Activity", "present");
                activity.runOnUiThread(() -> {
                    Log.d("UIThread", "running");
                    WorkManager.getInstance(context).getWorkInfoByIdLiveData(oneTimeWorkRequest.getId())
                            .observeForever(workInfo -> {
                                Log.d("WorkInfoExistence", workInfo != null ? "yes" : "no");
                        if (workInfo != null && workInfo.getState().isFinished()) {
                            Log.d("RequestState", "onProcess");
                            Data output = workInfo.getOutputData();
                            String message = output.getString("message");
                            Log.d("workerResult", message);
                            WorkManager.getInstance(context).pruneWork();
                            Log.d("RequestState", "success");
                            crowdedlySchedulePeriodicTask(worker, context, activity, interval);
                        }
                    });
                });
            }
        } else {
            throw new IllegalArgumentException("The interval is too lenient");
        }
    }

    public static class OneTimeTaskBuilder{
        private final Class<? extends Worker> worker;
        private final Context context;
        private Data inputData;
        private int delay;
        public OneTimeTaskBuilder(Class<? extends Worker> worker, Context context){
            this.worker = worker;
            this.context = context;
        }

        public OneTimeTaskBuilder input(Data inputData){
            this.inputData = inputData;
            return this;
        }

        public OneTimeTaskBuilder delay(int delay){
            this.delay = delay;
            return this;
        }

        public OneTimeWorkRequest build() {
            if(inputData == null){
                this.inputData = new Data.Builder().build();
            }
            return scheduleOneTimeTask(worker, context, inputData, delay);
        }
    }

    public static OneTimeWorkRequest scheduleOneTimeTask(Class<? extends Worker> worker, Context context, Data inputData, int delay){
        OneTimeWorkRequest oneTimeWorkRequest = new OneTimeWorkRequest
            .Builder(worker)
            .setInputData(inputData)
            .setInitialDelay(delay, TimeUnit.MINUTES)
            .build();
        WorkManager.getInstance(context).enqueue(oneTimeWorkRequest);
        return oneTimeWorkRequest;
    }
}
