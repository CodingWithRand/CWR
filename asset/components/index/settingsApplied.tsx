import { View } from "react-native";
import { useGlobal } from "../../scripts/global";
import { RouteProp } from "@react-navigation/native";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";

export default function SettingsApplied({ route }: { route: RouteProp<RouteStackParamList, "SettingsApplied"> }){
    const { themedColor, lang } = useGlobal();
    const unit = route.params?.unit;
    const plan = route.params?.plan;
    const gathering = route.params?.gathering;
    const isStrictMode = route.params?.isStrictMode;
    const ranges = route.params?.ranges;
    const durations = route.params?.durations

    return(
        <View style={{ flex: 1, backgroundColor: themedColor.bg }}>
            
        </View>
    )
}