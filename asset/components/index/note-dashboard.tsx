import { View, Text, useColorScheme, TouchableHighlight, useWindowDimensions } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { horizontalScale, moderateScale } from "../../scripts/Metric";
import { GoogleSignin } from "react-native-google-signin";

export default function NoteDashboard({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "NoteDashboard"> }) {
    const isDark = useColorScheme() === "dark"
    const { width } = useWindowDimensions();

    async function promptSignOut(){
        try {
            if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com")){
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            auth().signOut(); 
            navigation.replace("Registration")
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? Colors.darker : Colors.lighter }}>
            <Text>Dashboard</Text>
            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), height: "auto", padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    );
}