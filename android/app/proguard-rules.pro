# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.api.** { *; }
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.google.android.gms.common.api.** { *; }
-keep class com.google.android.gms.common.internal.** { *; }
-keep class com.google.android.gms.common.internal.safeparcel.** { *; }
-keep class com.google.android.gms.common.server.response.** { *; }
-keep class com.google.android.gms.common.util.** { *; }
-keep class com.google.android.gms.drive.** { *; }
-keep class com.google.android.gms.dynamic.** { *; }
-keep class com.google.android.gms.location.** { *; }
-keep class com.google.android.gms.maps.** { *; }
-keep class com.google.android.gms.nearby.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
