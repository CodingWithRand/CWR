import { View, Text, useColorScheme, TouchableHighlight, useWindowDimensions, Alert, Switch, NativeModules } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteStackParamList } from "../scripts/native-stack-navigation-types";
import { horizontalScale, moderateScale } from "../scripts/Metric";
import { GoogleSignin } from "react-native-google-signin";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_PERSONAL_ADMIN_KEY } from "@env"
import { retryFetch } from "../scripts/util";
import { Button } from "react-native-paper";
import { useGlobal } from "../scripts/global";


const { AppStatisticData, PermissionCheck, BackgroundProcess } = NativeModules;

export function Dashboard({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "UserDashboard"> }) {
    const isDark = useColorScheme() === "dark"
    const { width } = useWindowDimensions();
    const switchesEvent = {
        intenseMode: useState(false),
    };
    const { lang } = useGlobal();

    useEffect(() => {
        (async () => {
            // console.log(await AppStatisticData.getAllInstalledLaunchableAppNames());
            // await PermissionCheck.requestAccessibilityServicePermission();
            if(!await PermissionCheck.checkWriteSettingsPermission()) AsyncStorage.setItem("intenseMode", "false");
        })()
    }, [])

    useEffect(() => {
        (async () => {
            switchesEvent.intenseMode[1](await AsyncStorage.getItem("intenseMode") === "true" && await PermissionCheck.checkWriteSettingsPermission());
        })()
    }, [switchesEvent.intenseMode[0]]);

    async function promptSignOut(){
        try {
            const userTokens = await auth().currentUser?.getIdTokenResult();
            const userClaims = userTokens?.claims;
            console.log(userClaims?.authenticatedThroughProvider);
            await retryFetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", { path: `util/authenticationSessions/${auth().currentUser?.uid}/Mobile`, writeData: { planreminder :{ authenticated: false, at: { place: null, time: null } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
            if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com") && userClaims?.authenticatedThroughProvider === "google.com") {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            await auth().signOut();
            navigation.replace("Registration");
        } catch (e) {
            if((e as Error).message === "SIGN_IN_REQUIRED" && auth().currentUser){
                await auth().signOut();
                navigation.replace("Registration");
            }
            console.error((e as Error).message);
        }
    }

    async function intenseModeToggle(value: boolean) {
        const settingPermission = await PermissionCheck.checkWriteSettingsPermission();
        if(value) {
            if(settingPermission){
                AsyncStorage.setItem("intenseMode", "true");
                switchesEvent.intenseMode[1](true);
            }
            else{
                Alert.alert(
                    "Permission Request",
                    "Please grant settings writting permission to enable intense mode",
                    [
                        { text: "OK", onPress: () => PermissionCheck.requestWriteSettingsPermission() },
                        { text: "Cancel", style: "cancel" },
                    ],
                );
            }
        } else {
            AsyncStorage.setItem("intenseMode", "false");
            switchesEvent.intenseMode[1](false);
        }
    }



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? Colors.darker : Colors.lighter }}>
            <Text>Dashboard</Text>
            <View>
                <Switch 
                    onValueChange={intenseModeToggle}
                    value={switchesEvent.intenseMode[0]}
                />
                <Text>Intense Mode</Text>
            </View>

            {/* หมายเหตุ1: TouchableHighlight เป็นปุ่มชนิดหนึ่งใน React Native ไปศึกษาเพิ่มเติมได้เอง */}
            {/* หมายเหตุ2: i: number */}
            {/* ตัวอย่างการใช้งาน Native Module สำหรับการตรวจจับระยะเวลาการใช้งาน */}

            <TouchableHighlight onPress={async () => await BackgroundProcess.registerInvoker([
                /* ประกอบไปด้วย object ที่มีข้อมูล configs ของ workers สองตัว (Retriever และ Processor) */
                /* Retriever ทำหน้าที่รับข้อมูล และส่งต่อไปให้ Processor ประมวลผล */
                {
                    name: "Retriever", // ชื่อ Worker (*Required)

                    /* ตรวจจับการใช้งานแอปทุกแอปพลิเคชัน */
                    // retrieveTotalAppsStatistic: {
                    //     interval: "daily" // ได้จากตัวแปร unit (*Required)
                    // }

                    /* ตรวจจับการใช้งานแอปแต่ละแอปพลิเคชัน */
                    retrieveAppsStatistic: [
                        /* ตัวอย่าง */
                        //1. YouTube
                        {
                            appName: "YouTube", // ชื่อ App (*Required)
                            interval: "daily" // ได้จากตัวแปร unit (*Required)
                        },
                        //2. planreminder (this app)
                        {
                            appName: "planreminder",
                            interval: "daily"
                        }
                    ]
                },
                {
                    name: "Processor",
                    mlang: "th", //ภาษาที่จะแสดงใน message ของการแจ้งเตือนแบบพุช ได้จาก lang.lang (*Required)
                    /* รายการงานที่จะให้ประมวลผล */
                    jobs: {

                        // ชื่องาน(*Fix): { // configs }

                        /* งานตรวจจับระยะเวลาการใช้แอปทั้งหมด */
                        // totalAppUsageRestriction: {
                        //     restrictedPeriod: 1, // ระยะเวลาที่ให้ใช้ ได้จาก durations[i].duration (*Required)
                        //     inUnit: "minute", // ใช้หน่วย "minute"(นาที) เท่านั้น (*Required)
                        //     watchInterval: "daily", // ได้จากตัวแปร unit (*Required)
                        //     isIntenselyStricted: true // ได้จากตัวแปร isStrictMode (*Required)
                        // }

                        /* งานตรวจจับระยะเวลาการใช้แอปต่างๆ */
                        appsUsageRestriction: {
                            /* ชื่อแอป (ได้จาก durations[i].owner): { // configs } */
                            YouTube: {
                                restrictedPeriod: 1,
                                inUnit: "minute",
                                watchInterval: "daily",
                                isIntenselyStricted: true
                            },
                            planreminder: {
                                restrictedPeriod: 1,
                                inUnit: "minute",
                                watchInterval: "daily",
                                isIntenselyStricted: true
                            }
                        }
                    }
                }
            ])} underlayColor="darkgreen" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "green", borderRadius: moderateScale(10, width) }}>
                <Text>Register Example Task</Text>
            </TouchableHighlight>

            {/* ตัวอย่างการใช้งาน Native Module สำหรับยกเลิกการทำงานของ Worker */}

            <TouchableHighlight onPress={async () => await BackgroundProcess.revokeInvokerRegistry()} underlayColor="maroon" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "red", borderRadius: moderateScale(10, width) }}>
                <Text>Revoke Example Task</Text>
            </TouchableHighlight>

            {/* ตัวอย่างการใช้งาน Native Module สำหรับการเริ่มการตรวจจับว่าเปิดแอปในช่วงเวลาต้องห้ามหรือไม่ */}

            <TouchableHighlight onPress={async () => await BackgroundProcess.registerAppInForegroundEventListener({
                mlang: lang.lang, //ภาษาที่จะแสดงใน message ของการแจ้งเตือนแบบพุช ได้จาก lang.lang (*Required)

                /* ชื่อแอป (ได้จาก ranges[i].owner): { //configs } */
                YouTube: {
                    fromHour: 13, //ได้จาก ranges[i].startTime.hour
                    fromMinute: 40, //ได้จาก ranges[i].startTime.minute
                    toHour: 15, //ได้จาก ranges[i].endTime.hour
                    toMinute: 30 //ได้จาก ranges[i].endTime.minute
                },
                Google: {
                    fromHour: 22,
                    fromMinute: 0,
                    toHour: 23,
                    toMinute: 0
                },

                isStrictModeOn: switchesEvent.intenseMode[0]// ได้จากตัวแปร isStrictMode (*Required)
            })} underlayColor="cyan" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "lightblue", borderRadius: moderateScale(10, width) }}>
                <Text>Start Tracking 3rd Party Foreground App</Text>
            </TouchableHighlight>

            {/* ตัวอย่างการใช้งาน Native Module สำหรับการหยุดการตรวจจับว่าเปิดแอปในช่วงเวลาต้องห้ามหรือไม่ */}

            <TouchableHighlight onPress={async () => await BackgroundProcess.revokeAppInForegroundEventListener()}>
                <Text>Stop Tracking 3rd Party Foreground App</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    );
}
