import { View, Text, useColorScheme, TouchableHighlight, useWindowDimensions, Alert, Switch, NativeModules, Modal, ActivityIndicator } from "react-native";
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

export function Dashboard({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Dashboard"> }) {
    const isDark = useColorScheme() === "dark"
    const { width } = useWindowDimensions();
    const switchesEvent = {
        intenseMode: useState(false),
    };

    useEffect(() => {
        (async () => {
            console.log(await AppStatisticData.getAllInstalledLaunchableAppNames());
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
            await retryFetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", { path: `util/authenticationSessions/${auth().currentUser?.uid}/Mobile`, writeData: { planreminder :{ authenticated: false, at: { place: null, time: null } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
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
            <TouchableHighlight onPress={async () => await BackgroundProcess.registerInvoker([
                {
                    name: "Retriever",
                    // retrieveTotalAppsStatistic: {
                    //     interval: "daily"
                    // }
                    retrieveAppsStatistic: [
                        {
                            appName: "YouTube",
                            interval: "daily"
                        },
                        {
                            appName: "planreminder",
                            interval: "daily"
                        }
                    ]
                },
                {
                    name: "Processor",
                    jobs: {
                        // totalAppUsageRestriction: {
                        //     restrictedPeriod: 1,
                        //     inUnit: "hour",
                        //     watchInterval: "daily",
                        //     isIntenselyStricted: true
                        // }
                        appsUsageRestriction: {
                            YouTube: {
                                restrictedPeriod: 1,
                                inUnit: "hour",
                                watchInterval: "daily",
                                isIntenselyStricted: true
                            },
                            planreminder: {
                                restrictedPeriod: 1,
                                inUnit: "hour",
                                watchInterval: "daily",
                                isIntenselyStricted: true
                            }
                        }
                    }
                }
            ])} underlayColor="darkgreen" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "green", borderRadius: moderateScale(10, width) }}>
                <Text>Register Example Task</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={async () => await BackgroundProcess.revokeInvokerRegistry()} underlayColor="maroon" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "red", borderRadius: moderateScale(10, width) }}>
                <Text>Revoke Example Task</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={async () => await BackgroundProcess.registerAppInForegroundEventListener({
                YouTube: {
                    from: 14,
                    to: 16
                },
                isStrictModeOn: false
            })} underlayColor="cyan" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "lightblue", borderRadius: moderateScale(10, width) }}>
                <Text>Start Tracking 3rd Party Foreground App</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    );
}

export function Loading({ loading }: { loading: boolean }){
    const { width, height } = useWindowDimensions();
    const { themedColor } = useGlobal();
    return(
        <Modal animationType="none" visible={loading} transparent={true}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: "absolute", zIndex: 100, top: 0, left: 0, width: width, height: height }}>
                <View style={{ flex: 1, backgroundColor: themedColor.bg, opacity: 0.5, width: width, height: height }}></View>
                <ActivityIndicator size="large" style={{ position: "absolute" }} />
            </View>
        </Modal>
    )
}

export function SignOutBTN({ navigation }: { navigation: any }){
    const [ loading, setLoading ] = useState(false);
    async function promptSignOut(){
        try {
            setLoading(true);
            const userTokens = await auth().currentUser?.getIdTokenResult();
            const userClaims = userTokens?.claims;
            console.log(userClaims?.authenticatedThroughProvider);
            await retryFetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", { path: `util/authenticationSessions/${auth().currentUser?.uid}/Mobile`, writeData: { planreminder :{ authenticated: false, at: { place: null, time: null } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
            if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com") && userClaims?.authenticatedThroughProvider === "google.com") {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            await auth().signOut();
            setLoading(false);
            navigation.replace("Registration");
        } catch (e) {
            if((e as Error).message === "SIGN_IN_REQUIRED" && auth().currentUser){
                await auth().signOut();
                navigation.replace("Registration");
            }
            console.error((e as Error).message);
        }
    }

    return(
        <>
            <Button onPress={promptSignOut}>Sign Out</Button>
            <Loading loading={loading} />
        </>
    )
}