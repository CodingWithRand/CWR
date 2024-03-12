import { View, Text, useColorScheme, TouchableHighlight, useWindowDimensions } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { horizontalScale, moderateScale } from "../../scripts/Metric";

export default function NoteDashboard({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "NoteDashboard"> }) {
    const isDark = useColorScheme() === "dark"
    const { width, height } = useWindowDimensions();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? Colors.darker : Colors.lighter }}>
            <Text>Dashboard</Text>
            <TouchableHighlight onPress={() => { auth().signOut(); navigation.replace("Registration") }} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), height: "auto", padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </View>
    );
}