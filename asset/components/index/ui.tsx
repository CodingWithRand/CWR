import { Text, View, TouchableHighlight, useWindowDimensions, Modal, ActivityIndicator, useColorScheme, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { GoogleSignin } from "react-native-google-signin";
import { FIREBASE_PERSONAL_ADMIN_KEY } from "@env"
import { horizontalScale, moderateScale } from "../../scripts/Metric";
import { retryFetch } from "../../scripts/util";
import { useState } from "react";

export default function UI({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Dashboard"> }){
    const isDark = useColorScheme() === 'dark';
    const { width, height } = useWindowDimensions();
    const [ loading, setLoading ] = useState<boolean>(false);
    async function promptSignOut(){
        try {
            setLoading(true)
            const userTokens = await auth().currentUser?.getIdTokenResult();
            const userClaims = userTokens?.claims;
            console.log(userClaims?.authenticatedThroughProvider);
            await retryFetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", { path: `util/authenticationSessions/${auth().currentUser?.uid}/Mobile`, writeData: { planreminder :{ authenticated: false, at: { place: null, time: null } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
            if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com") && userClaims?.authenticatedThroughProvider === "google.com") {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            await auth().signOut();
            setLoading(false)
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
        <View>
            <Modal animationType="none" visible={loading} transparent={true}>
                <View style={[styles.fullPageCenter, { position: "absolute", zIndex: 100, top: 0, left: 0, width: width, height: height }]}>
                    <View style={{ flex: 1, backgroundColor: isDark ? "black" : "white", opacity: 0.5, width: width, height: height }}></View>
                    <ActivityIndicator size="large" style={{ position: "absolute" }} />
                </View>
            </Modal>
            <Text>ewrerwok</Text>
            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    fullPageCenter: {
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
    },
})