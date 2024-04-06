import { View, Text, useColorScheme, TouchableHighlight, useWindowDimensions, Alert, Switch } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { horizontalScale, moderateScale } from "../../scripts/Metric";
import { GoogleSignin } from "react-native-google-signin";
import { NativeModules } from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { AndroidNativeUtil } = NativeModules;

export default function Dashboard({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Dashboard"> }) {
    const isDark = useColorScheme() === "dark"
    const { width } = useWindowDimensions();
    const switchesEvent = {
        intenseMode: useState(false),
    } 

    useEffect(() => {
        (async () => {
            if(!await AndroidNativeUtil.checkWriteSettingsPermission()) AsyncStorage.setItem("intenseMode", "false");
        })
    }, [])

    useEffect(() => {
        (async () => {
            console.log(await AsyncStorage.getItem("intenseMode"));
            switchesEvent.intenseMode[1](await AsyncStorage.getItem("intenseMode") === "true" && await AndroidNativeUtil.checkWriteSettingsPermission());
        })()
    }, [switchesEvent.intenseMode[0]])

    async function promptSignOut(){
        try {
            const userTokens = await auth().currentUser?.getIdTokenResult();
            const userClaims = userTokens?.claims;
            console.log(userClaims?.authenticatedThroughProvider);
            if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com") && userClaims?.authenticatedThroughProvider === "google.com") {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            auth().signOut();
            navigation.replace("Registration");
        } catch (e) {
            console.error(e);
        }
    }

    async function intenseModeToggle(value: boolean) {
        const settingPermission = await AndroidNativeUtil.checkWriteSettingsPermission();
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
                        { text: "OK", onPress: () => AndroidNativeUtil.requestWriteSettingsPermission() },
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
            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), height: "auto", padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    );
}