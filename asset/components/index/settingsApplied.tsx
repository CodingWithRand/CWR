import { Image, StyleSheet, TouchableOpacity, View, NativeModules, Alert } from "react-native";
import { useGlobal } from "../../scripts/global";
import { RouteProp } from "@react-navigation/native";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import langs from "../../../langs";

const { BackgroundProcess } = NativeModules;

export default function SettingsApplied({ route }: { route: RouteProp<RouteStackParamList, "SettingsApplied"> }){
    const { themedColor, lang } = useGlobal();
    const [ config, setConfig ] = useState<Object>();
    const unit = route.params?.unit;
    const plan = route.params?.plan;
    const gathering = route.params?.gathering;
    const isStrictMode = route.params?.isStrictMode;
    const ranges = route.params?.ranges;
    const durations = route.params?.durations

    useEffect(() => {
        if (plan === "duration" && durations) {
            if (gathering?.name === "total") {
                setConfig([
                    {
                        name: 'Retriever',
                        retrieveTotalAppsStatistic: {
                            interval: unit || "daily"
                        }
                    },
                    {
                        name: 'Processor',
                        mlang: lang.lang,
                        jobs: {
                            totalAppUsageRestriction: {
                                restrictedPeriod: durations[0].duration,
                                inUnit: "minute",
                                watchInterval: unit || "daily",
                                isIntenselyStricted: isStrictMode ? isStrictMode : false
                            }
                        }
                    }
                ]);
            }
            else if (gathering?.name === "separate") {
                console.log(durations)
                setConfig([
                    {
                        name: 'Retriever',
                        retrieveAppsStatistic: Array.from(gathering?.body, (v) => v).map((v) => ({ appName: v, interval: unit || "daily" })),
                    },
                    {
                        name: 'Processor',
                        mlang: lang.lang,
                        jobs: {
                            appsUsageRestriction: (() => {
                                const obj = {};
                                for(const d of durations){
                                    obj[d.owner] = {
                                        restrictedPeriod: d.duration,
                                        inUnit: "minute",
                                        watchInterval: unit || "daily",
                                        isIntenselyStricted: isStrictMode ? isStrictMode : false
                                    }
                                }
                                return obj
                            })()
                        }
                    }
                ]);
            }
        } else if (plan === "range" && ranges)  {
            console.log(ranges)
            setConfig({
                ...(() => {
                    const obj = {};
                    for(const r of ranges){
                        obj[r.owner] = {
                            fromHour: r.startTime.hour,
                            fromMinute: r.startTime.minute,
                            toHour: r.endTime.hour,
                            toMinute: r.endTime.minute
                        }
                    }
                    return obj
                })(),
                mlang: lang.lang, 
                isStrictModeOn: isStrictMode ? isStrictMode : false
            })
        }
    }, []);

    // useEffect(() => config && console.log(config), [config])

    return(
        <View style={{ flex: 1, backgroundColor: themedColor.bg, display: "flex", justifyContent: "center", alignItems: "center", rowGap: 10 }}>
            <Image source={require("../../imgs/verify.png")} style={{ width: 100, height: 100 }}/>
            <Text style={{ color: themedColor.comp, fontSize: 20 }}>{langs[lang.lang].settingsAppliedPage["successApplied"]}</Text>
            <Text style={{ color: themedColor.comp, fontSize: 20 }}>{langs[lang.lang].settingsAppliedPage["choices"]}</Text>
            <View style={{display: "flex", flexDirection: "row", columnGap: 10}}>
                <TouchableOpacity style={[styles.borderbutton, {borderColor: "green"}]} onPress={async () => {
                    if(config){
                        if(plan === "duration"){
                            if(!await BackgroundProcess.isInvokerRegistered()){
                                await BackgroundProcess.registerInvoker(config);
                                Alert.alert("Success", langs[lang.lang].settingsAppliedPage.alertsuccessinitiate);
                            } else {
                                Alert.alert("Error", langs[lang.lang].settingsAppliedPage.alerterrorinitiate);
                            }
                        } else if (plan === "range"){
                            await BackgroundProcess.registerAppInForegroundEventListener(config);
                            Alert.alert("Success", langs[lang.lang].settingsAppliedPage.alertsuccessinitiate);
                        }
                    }
                }}>
                    <Text style={{ color: "green", textAlign:"center" }}>{langs[lang.lang].settingsAppliedPage.initiate}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.borderbutton, {borderColor: "red"}]} onPress={async () => {
                    if(config){
                        if(plan === "duration"){
                            if(await BackgroundProcess.isInvokerRegistered()){
                                await BackgroundProcess.revokeInvokerRegistry();
                                Alert.alert("Success", langs[lang.lang].settingsAppliedPage.alertsuccessrevoke);
                            } else {
                                Alert.alert("Error", langs[lang.lang].settingsAppliedPage.alerterrorrevoke);
                            }
                        }else if (plan === "range"){
                            await BackgroundProcess.revokeAppInForegroundEventListener();
                            Alert.alert("Success", langs[lang.lang].settingsAppliedPage.alertsuccessrevoke);
                        }
                    }
                }}>
                    <Text style={{ color: "red", textAlign:"center" }}>{langs[lang.lang].settingsAppliedPage.revoke}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    borderbutton: {
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 3,
        padding: 10,
        width: 150

    }
})