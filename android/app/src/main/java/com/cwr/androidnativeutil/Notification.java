package com.cwr.androidnativeutil;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class Notification extends MainNativeUtil {
    private final NotificationManager notificationManager;
    public Notification(ReactApplicationContext reactContext){
        super(reactContext);
        this.notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    public Notification(Context context){
        super(context);
        this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    @NonNull
    @Override
    public String getName(){
        return "Notification";
    }

    @ReactMethod
    public void createAndSendNotification(String channelId, String contentTitle, String contentText, String contentInfo, String ticker){
        long now = System.currentTimeMillis();
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(NativeModuleContext, channelId);
        notificationBuilder
                .setDefaults(android.app.Notification.DEFAULT_ALL)
                .setWhen(now)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setTicker(ticker)
                .setPriority(android.app.Notification.PRIORITY_HIGH)
                .setContentTitle(contentTitle)
                .setContentText(contentText)
                .setContentInfo(contentInfo)
        ;
        notificationManager.notify((int) now, notificationBuilder.build());
    }

    public void createNotificationChannel(String channelId, String title, String description) throws Exception {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationChannel notificationChannel = new NotificationChannel(channelId, title, NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.setDescription(description);
            notificationChannel.enableVibration(true);
            notificationChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            notificationManager.createNotificationChannel(notificationChannel);
        }else{
            throw new Exception("Your android version is not compatible for creating notification channel (Require version 8.0 and above)");
        }
    }
}
