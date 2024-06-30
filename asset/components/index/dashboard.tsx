import { Text, View, TouchableHighlight, useWindowDimensions, StyleSheet, Switch, TouchableOpacity, NativeModules, ScrollView, Pressable, Image, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DurationObject, RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { useEffect, useRef, useState } from "react";
import { RadioButton } from "react-native-paper";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Slider from "@react-native-community/slider";
import { RouteProp } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { useGlobal } from "../../scripts/global";
import { showMessage } from "react-native-flash-message";
import { RangeObject } from "../../scripts/native-stack-navigation-types";
import Icon from "react-native-vector-icons/MaterialIcons";
import langs from "../../../langs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"

const { AppStatisticData } = NativeModules

export function UserPage1({ navigation, route }: { navigation: NativeStackNavigationProp<RouteStackParamList, "UserDashboard">, route: RouteProp<RouteStackParamList, "UserDashboard"> }) {

    type GatheringObject = { name: string, body?: string[] }

    const unit = useState<string>();
    const plan = useState<string>();
    const gathering = useState<GatheringObject>();
    const isStrictMode = useState<boolean>();
    const ranges = useState<RangeObject[]>();
    const durations = useState<DurationObject[]>();

    useEffect(() => {
        (async () => {
            const userPageSettings = await AsyncStorage.getItem("userPageSettings");
            try{
                const cloudDataRef = firestore().collection("planreminder");
                const personalDataRef = cloudDataRef.doc(auth().currentUser?.uid);
                const personalDataSnap = await personalDataRef.get()
                if(personalDataSnap.exists) {
                    const personalData = personalDataSnap.data();
                    unit[1](route.params?.unit ? route.params?.unit : personalData?.unit);
                    plan[1](route.params?.plan ? route.params?.plan : personalData?.plan);
                    gathering[1](route.params?.gathering ? route.params?.gathering : personalData?.gathering);
                    isStrictMode[1](route.params?.isStrictMode ? route.params?.isStrictMode : personalData?.isStrictMode);
                    ranges[1](route.params?.ranges ? route.params?.ranges : personalData?.ranges);
                    durations[1](route.params?.durations ? route.params?.durations : personalData?.durations);
                    return;
                } else {
                    firestore().collection("planreminder").doc(auth().currentUser?.uid).set({});
                }
                
                if(userPageSettings) {
                    const parsedSettings = JSON.parse(userPageSettings);
                    unit[1](route.params?.unit ? route.params?.unit : parsedSettings?.unit);
                    plan[1](route.params?.plan ? route.params?.plan : parsedSettings?.plan);
                    gathering[1](route.params?.gathering ? route.params?.gathering : parsedSettings?.gathering);
                    isStrictMode[1](route.params?.isStrictMode ? route.params?.isStrictMode : parsedSettings?.isStrictMode);
                    ranges[1](route.params?.ranges ? route.params?.ranges : parsedSettings?.ranges);
                    durations[1](route.params?.durations ? route.params?.durations : parsedSettings?.durations);
                }
            } catch(e){ console.error(e) }
        })()
    }, [])

    const [selectedUnit, setSelectedUnit] = useState(unit[0] || 'daily');
    const [selectedPlan, setSelectedPlan] = useState(plan[0] || "duration");
    const [selectedGathering, setSelectedGathering] = useState(gathering[0]?.name || "total");
    const [selectedItems, setSelectedItems] = useState<string[]>(gathering[0]?.body || [])
    const [selectStictMode, setSelectStictMode] = useState(isStrictMode[0] || false)
    const [appNamesArrey, setAppNamesArrey] = useState<object[]>([])
    const { themedColor } = useGlobal();
    const topicsTextStyle = { color: themedColor.comp }
    const { lang } = useGlobal();

    useEffect(() => {
        setSelectedUnit(unit[0] || 'daily')
        setSelectedPlan(plan[0] || "duration")
        setSelectedGathering(gathering[0]?.name || "total")
        setSelectStictMode(isStrictMode[0] || false)
        setSelectedItems(gathering[0]?.body || [])
    }, [ unit[0], plan[0], gathering[0], isStrictMode[0], ranges[0], durations[0] ])

    useEffect(() => {
        (async () => {
            const TotalApps = await AppStatisticData.getAllInstalledLaunchableAppNames()
            const TAK = Object.keys(TotalApps)
            const TAV = Object.values(TotalApps)
            let array: object[] = []
            TAV.forEach((v, i) => {
                array.push(
                    { id: TAK[i], name: v }
                )
            });
            setAppNamesArrey(array)
        })()
    }, [])

    const onSelectedItemsChange = (selectedItems: string[]) => {
        setSelectedItems(selectedItems);
    };

    useEffect(() => {
        if(selectedGathering === "total") setSelectedItems([])
    }, [selectedGathering])

    return (
        <ScrollView>
            <Text style={[styles.title, topicsTextStyle]}>{langs[lang.lang].userpage1["usageplanningbutton"]}</Text>
            <Text style={[styles.subtitle,topicsTextStyle]}>{langs[lang.lang].userpage1["unitoftimetext"]}</Text>


            <View style={styles.options}>
                <RadioButton.Android
                    value="daily"
                    status={selectedUnit === 'daily' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('daily')}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Dailybutton"]}</Text>
            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="weekly"
                    status={selectedUnit === 'weekly' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('weekly')}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["weeklybutton"]}</Text>
            </View>

            <View style={styles.options}>
                <RadioButton.Android
                    value="mouthly"
                    status={selectedUnit === 'mouthly' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('mouthly')}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Monthlybutton"]}</Text>
            </View>

            <Text style={[styles.subtitle,topicsTextStyle]}>{langs[lang.lang].userpage1["Planningformattext"]}</Text>
            <View style={styles.options}>
                <RadioButton.Android
                    value="duration"
                    status={selectedPlan === 'duration' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedPlan('duration')}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Setappperdaytext"]}</Text>

            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="range"
                    status={selectedPlan === 'range' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedPlan('range')}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Settimeusageappperday"]}</Text>
            </View>
            <Text style={[styles.title,topicsTextStyle]}>{langs[lang.lang].userpage1["datacollectionformat"]}</Text>
            <View style={styles.options}>
                <RadioButton.Android
                    value="total"
                    status={selectedGathering === 'total' ?
                        'checked' : 'unchecked'}
                    onPress={() => {setSelectedGathering('total'); setSelectedItems([])}}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Allinclusiveplanbutton"]}</Text>

            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="separate"
                    status={selectedGathering === 'separate' ?
                        'checked' : 'unchecked'}
                    onPress={() => {setSelectedGathering('separate'); setSelectedItems(prevSelectedItem => prevSelectedItem.filter(it => it !== langs[lang.lang].defaultApp))}}
                    color="#007BFF"
                />
                <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].userpage1["Separatebutton"]}</Text>
            </View>
            { 
                selectedGathering === "separate" ? 
                <>
                    <Text style={[styles.subtitle,topicsTextStyle]}>{langs[lang.lang].userpage1["Allowstext"]}</Text>
                    <View style={{ margin: 10, backgroundColor: "lightgrey", borderRadius: 20, padding: 5}}>
                        {/* <a href="https://www.flaticon.com/free-icons/tick" title="tick icons">Tick icons created by Maxim Basinski Premium - Flaticon</a> */}
                        {/* <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by Pixel perfect - Flaticon</a> */}
                        {/* <a href="https://www.flaticon.com/free-icons/triangle" title="triangle icons">Triangle icons created by Dave Gandy - Flaticon</a> */}
                        <SectionedMultiSelect
                            items={appNamesArrey}
                            uniqueKey="id"
                            onSelectedItemsChange={onSelectedItemsChange}
                            selectedItems={selectedItems}
                            IconRenderer={Icon}
                            searchIconComponent={<Image source={require("../../imgs/search-symbol.png")} style={{ width: 30, height: 30 }} />}
                            selectedIconComponent={<Image source={require("../../imgs/check.png")} style={{ width: 30, height: 30 }} />}
                            selectToggleIconComponent={<Image source={require("../../imgs/arrow-down.png")} style={{ width: 15, height: 15 }} />}
                            chipRemoveIconComponent={<Image source={require("../../imgs/close.png")} style={{ width: 10, height: 10 }} />}
                        />
                    </View>
                </>
                : <></>
            }

            <View style={[styles.options, { justifyContent: "space-between" }]}>
                <Text style={[styles.title,topicsTextStyle]}>Stirct Mode</Text>
                <Switch onValueChange={() => setSelectStictMode(prevSelectStictMode => !prevSelectStictMode)} value={selectStictMode} />
            </View>
            <TouchableOpacity style={{ height: 100 }} onPress={() => {
                if(selectedGathering === "separate" && selectedItems.length === 0){
                    showMessage({
                        message: langs[lang.lang].userpage1.showMessageText,
                        type: "danger",
                        icon: "danger"
                    })
                    return
                }
                navigation.replace("UserDashboard2", {
                    unit: selectedUnit,
                    plan: selectedPlan,
                    gathering: {
                        name: selectedGathering,
                        body: selectedItems.length > 0 ? selectedItems : undefined
                    },
                    ranges: ranges[0],
                    durations: durations[0], 
                    isStrictMode: selectStictMode
                })
            }}>
                <Text style={[{ fontSize: 50, textAlign: "center" }, topicsTextStyle]}>→</Text>
            </TouchableOpacity>
        </ScrollView>

    )
}

export function GUESTPAGE({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "GuestDashboard"> }) {
    
    const [selectedGathering, setSelectedGathering] = useState("total");
    const [selectedDuration, setSelectedDuration] = useState(60)
    const { width, height } = useWindowDimensions()
    const { themedColor } = useGlobal(); 
    const topicsTextStyle = { color: themedColor.comp }
    const { lang } = useGlobal();

    useEffect(() => {
        (async () => {
            const guestPageSettings = await AsyncStorage.getItem("guestSettings");
            if(guestPageSettings){
                const settings = JSON.parse(guestPageSettings);
                setSelectedGathering(settings.gathering.name);
                setSelectedDuration(settings.durations[0].duration);
            }
        })()
    }, [])

    return (
        <View style={{ height: height, flex: 1, display: "flex", justifyContent: "space-between" }}>
            <View><Text style={[styles.title,topicsTextStyle]}>{langs[lang.lang].guestpage["formatapplicationcollect"]}</Text>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="total"
                        status={selectedGathering === 'total' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedGathering('total')}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["allinclusiveapp"]}</Text>
                </View>
                <View style={[styles.options, {opacity: 0.5}]}>
                    <RadioButton.Android
                        disabled
                        value="separate"
                        status={selectedGathering === 'separate' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedGathering('separate')}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["separate"]}</Text>
                </View>
                <Text style={[styles.title,topicsTextStyle]}>{langs[lang.lang].guestpage["timespentperday"]}</Text>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="15min"
                        status={selectedDuration === 15 ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration(15)}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["fifteenminutes"]}</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="30min"
                        status={selectedDuration === 30 ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration(30)}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["thirtymin"]}</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="1h"
                        status={selectedDuration === 60 ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration(60)}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["oneh"]}</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="2h"
                        status={selectedDuration === 120 ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration(120)}
                        color="#007BFF"
                    />
                    <Text style={[styles.optionsLabel,topicsTextStyle]}>{langs[lang.lang].guestpage["twoh"]}</Text>
                </View>
            </View>

            <TouchableHighlight onPress={async () => {
                const guestSettings = {
                    gathering: {
                        name: "total",
                        body: ["total"]
                    },
                    durations: [{
                        owner: "total",
                        duration: selectedDuration
                    }]
                }
                await AsyncStorage.setItem("guestSettings", JSON.stringify(guestSettings));
                navigation.navigate("SettingsApplied", guestSettings);
                
            }}
                style={styles.savebutton}
                activeOpacity={0.5}
                underlayColor="mediumseagreen"
            >
                <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>{langs[lang.lang].saveSettingsBtn}</Text>
            </TouchableHighlight>

        </View>
    )
}

export function UserPage2({ navigation, route }: { navigation: NativeStackNavigationProp<RouteStackParamList, "UserDashboard2">, route: RouteProp<RouteStackParamList, "UserDashboard2"> }) {

    const constraint = {
        PER_DAY: 120,
        PER_WEEK: 600,
        PER_MONTH: 3000
    }

    const unit = route.params?.unit;
    const plan = route.params?.plan;
    const gathering = route.params?.gathering;
    const isStrictMode = route.params?.isStrictMode;
    const ranges = route.params?.ranges;
    const durations = route.params?.durations;
    const { lang } = useGlobal();
    const [sliderValue, SetSliderValue] = useState<Array<{ owner: string, duration: number }>>(
        durations && durations.length <= (gathering?.body?.length || [langs[lang.lang].defaultApp].length)
        ?
            Array.from((gathering?.body || [langs[lang.lang].defaultApp]), (v, i) => {
                if(durations.some(c => c.owner === v)) return { owner: v, duration: durations.find(c => c.owner === v)?.duration || 0 }
                else return { owner: v, duration: 0 }
            })
        :
        durations && durations.length > (gathering?.body?.length || [langs[lang.lang].defaultApp].length)
        ?
            (() => {
                let counter = 0;
                const theArray = Array.from(durations, (v) => {
                    if((gathering?.body || [langs[lang.lang].defaultApp]).some(appName => appName === v.owner)) return { owner: v.owner, duration: v.duration }
                    else{
                        let mappedValue;
                        if((gathering?.body || [langs[lang.lang].defaultApp])[counter] !== undefined){
                            mappedValue ={ owner: (gathering?.body || [langs[lang.lang].defaultApp])[counter], duration: 0 }
                        }else{
                            mappedValue = undefined
                        }
                        counter++;
                        return mappedValue
                    }
                }).filter(item => item !== undefined) as Array<{ owner: string, duration: number }>;
                return theArray
            })()
        :
        Array.from((gathering?.body || [langs[lang.lang].defaultApp]), (v) => { 
            return { owner: v, duration: 0 } 
        })
    );
    const [sliderMaximumValue, SetSliderMaximumValue] = useState(Array.from((gathering?.body || [langs[lang.lang].defaultApp]), () => constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`]));
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [startTime, setStartTime] = useState<(Date | undefined)[]>(Array.from((gathering?.body || [langs[lang.lang].defaultApp]), () => undefined));
    const [endTime, setEndtime] = useState<(Date | undefined)[]>(Array.from((gathering?.body || [langs[lang.lang].defaultApp]), () => undefined));
    const [range, setRange] = useState<Array<RangeObject>>(ranges || []);
    const isPickingStartTimeN = useRef<number>();
    const isPickingEndTimeN = useRef<number>();
    const { themedColor } = useGlobal();
    const topicsTextStyle = {color : themedColor.comp}

    const showStartTimePicker = (index: number) => {
        isPickingStartTimeN.current = index;
        setStartTimePickerVisibility(true);
    };

    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false);
    };

    const handleStartConfirm = (date: Date) => {
        setStartTime(prevStartTime => prevStartTime.map((st, i) => i === isPickingStartTimeN.current ? date : st)); 
        hideStartTimePicker();
    };

    const showEndTimePicker = (index: number) => {
        isPickingEndTimeN.current = index;
        setEndTimePickerVisibility(true);
    };

    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };

    const handleEndConfirm = (date: Date) => {
        setEndtime(prevEndTime => prevEndTime.map((se, i) => i === isPickingEndTimeN.current ? date : se));
        hideEndTimePicker();
    };

    const addRange = (index: number) => {
        setRange((prevRange) => {
            if(startTime.length === endTime.length) {
                return [...prevRange, {
                    startTime: {
                        hour: startTime[index]?.getHours(),
                        minute: startTime[index]?.getMinutes()
                    },
                    owner: gathering?.body?.at(index) || langs[lang.lang].defaultApp,
                    endTime: {
                        hour: endTime[index]?.getHours(),
                        minute: endTime[index]?.getMinutes()
                    }
                }]
            }else{
                return prevRange
            }
        })
    }

    const removeRange = (index: number) => {
        setRange(prevRange => {
            const newRange = prevRange.filter((_, i) => i !== index)
            console.log(newRange)
            return newRange
        })
    }

    useEffect(() => {
        SetSliderValue(prevSliderValue => prevSliderValue.map((val, index) => {
            if (prevSliderValue[index].duration > sliderMaximumValue[index]) {
                return {
                    ...prevSliderValue[index],
                    duration: sliderMaximumValue[index]
                }
            } else {
                return prevSliderValue[index]
            }
        }))
    }, [sliderMaximumValue])

    return (plan === "duration" ? 
    <ScrollView>
        {/*page3*/}
        <Text style={[styles.title,topicsTextStyle]}>{langs[lang.lang].userpage2["timetouse"]}{langs[lang.lang].userpage2.timetouseUnit(unit)}</Text>
        {(() => {
            let tempJSXArray: JSX.Element[] = [];
            (gathering?.body || [langs[lang.lang].defaultApp]).forEach((v, i) => {
                tempJSXArray.push(
                    <View key={i}>
                        <Text style={[{ fontSize: 20, fontWeight: "bold", marginHorizontal: 15, marginTop: 10 }, topicsTextStyle]}>{v}</Text>
                        <Text style={[{ marginHorizontal: 15, textAlign: "center", fontWeight: "bold" }, topicsTextStyle]}>{Math.floor(sliderValue[i].duration / 60) !== 0 ? Math.floor(sliderValue[i].duration / 60) + " " + langs[lang.lang].userpage2.hourUnit(Math.floor(sliderValue[i].duration / 60)) + " " : ""}{sliderValue[i].duration % 60 !== 0 ? sliderValue[i].duration % 60 + " " + langs[lang.lang].userpage2.minuteUnit(sliderValue[i].duration % 60) + "" : ""}</Text>
                        <Slider maximumValue={constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`]} upperLimit={sliderMaximumValue[i]} minimumValue={0} step={1} value={sliderValue[i].duration} onValueChange={function (slidervalue) {
                            SetSliderValue(prevSliderValue => prevSliderValue.map((val, index) => index === i ? {...val, duration: slidervalue} : val))
                            SetSliderMaximumValue(prevSliderMax => {
                                if (slidervalue > sliderValue[i].duration) {
                                    return prevSliderMax.map((val, index) => index !== i ? val - (slidervalue - sliderValue[i].duration) : val)
                                } else if (slidervalue < sliderValue[i].duration) {
                                    return prevSliderMax.map((val, index) => index !== i ? val + (sliderValue[i].duration - slidervalue) : val)
                                }
                                else {
                                    return prevSliderMax
                                }
                            });
                        }} />
                        <View style={[styles.options, { justifyContent: "space-between", marginHorizontal: 15 }]}>
                            <Text style={topicsTextStyle}>{`0 ${langs[lang.lang].userpage2.minuteUnit(0)}`}</Text>
                            <Text style={topicsTextStyle}>{constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`] / 60} {langs[lang.lang].userpage2.hourUnit(2)}</Text>
                        </View>

                    </View>
                )
            })
            return tempJSXArray
        })()}

        <TouchableOpacity style={{ height: 50 }} onPress={() => navigation.replace("UserDashboard", {
            unit: unit || "daily",
            plan: plan || "duration",
            gathering: {
                name: gathering?.name || "total",
                body: gathering?.body || [langs[lang.lang].defaultApp]
            },
            durations: sliderValue,
            isStrictMode: isStrictMode || false,
        }
        )}>
            <Text style={[{ fontSize: 50, textAlign: "center" }, topicsTextStyle]}>←</Text>
        </TouchableOpacity>

        <TouchableHighlight onPress={async () => {
            for(const config of sliderValue){
                if(config.duration === 0){
                    Alert.alert(langs[lang.lang].userpage2.alertMessage);
                    return;
                }
            }
            const durationUserPage = {
                unit: unit || "daily",
                plan: plan || "duration",
                gathering: {
                    name: gathering?.name || "total",
                    body: gathering?.body || [langs[lang.lang].defaultApp]
                },
                durations: sliderValue,
                isStrictMode: isStrictMode || false,
            }
            await firestore().collection("planreminder").doc(auth().currentUser?.uid).set(durationUserPage);
            await AsyncStorage.setItem("userPageSettings", JSON.stringify(durationUserPage));
            navigation.navigate("SettingsApplied", durationUserPage);
        }}
            style={styles.savebutton}
            activeOpacity={0.5}
            underlayColor="mediumseagreen"
        >
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>{langs[lang.lang].saveSettingsBtn}</Text>
        </TouchableHighlight>



    </ScrollView> : 
    <ScrollView>
        <Text style={[styles.title,topicsTextStyle]}>{langs[lang.lang].userpage2["periodcantuseapp"]}</Text>
        {(() => {
            let tempJSXArray: JSX.Element[] = [];
            (gathering?.body || [langs[lang.lang].defaultApp]).forEach((v, i) => {
                tempJSXArray.push(
                    <View key={i}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 15}}>{v}</Text>
                        <View style={[styles.options, { justifyContent: "space-between", marginHorizontal:10 }]}>
                            <TouchableOpacity onPress={() => showStartTimePicker(i)} style={[styles.borderbutton, {borderColor: "deepskyblue",}]}>
                                <Text style={{textAlign:"center", color:"deepskyblue"}}>
                                    {startTime[i] ? moment(startTime[i]).format("H:mm") : "Select Start Time"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showEndTimePicker(i)} style={[styles.borderbutton, {borderColor: "deepskyblue",}]}>
                                <Text style={{textAlign:"center", color:"deepskyblue"}}>
                                    {endTime[i] ? moment(endTime[i]).format("H:mm") : "Select End Time"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => addRange(i)} style={[styles.borderbutton, {borderColor: themedColor.comp, width: "auto", margin: 10}]}>
                            <Text style={{textAlign:"center", color: themedColor.comp}}>Add Range</Text>
                        </TouchableOpacity>
                        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {(() => {
                                let anotherTempJSXArray: JSX.Element[] = [];
                                range?.forEach((val, j) => {
                                    if(val.owner === v)
                                        anotherTempJSXArray.push(
                                            <View key={j} style={{ borderStyle: "solid", borderColor: themedColor.comp, borderWidth: 2, borderRadius: 999, padding: 10, paddingVertical: 5, marginLeft: 10, margin: 5, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "29%", opacity: 0.6 }}>
                                                <Text style={{ textAlign: "center" }}>{`${val.startTime.hour}:${val.startTime.minute !== undefined && val.startTime.minute < 10 ? `0${val.startTime.minute}` : val.startTime.minute} - ${val.endTime.hour}:${val.endTime.minute !== undefined && val.endTime.minute < 10 ? `0${val.endTime.minute}` : val.endTime.minute}`}</Text>
                                                <Pressable onPress={() => removeRange(j)}><Text>X</Text></Pressable>
                                            </View>
                                        )
                                })
                                return anotherTempJSXArray
                            })()}
                        </View>
                    </View>
                )
            })
            return tempJSXArray
        })()}
        <TouchableOpacity style={{ height: 50 }} onPress={() => navigation.replace("UserDashboard", {
            unit: unit || "daily",
            plan: plan || "duration",
            gathering: {
                name: gathering?.name || "total",
                body: gathering?.body || [langs[lang.lang].defaultApp]
            },
            ranges: range,
            isStrictMode: isStrictMode || false
        })}>
            <Text style={[{ fontSize: 50, textAlign: "center" }, topicsTextStyle]}>←</Text>
        </TouchableOpacity>
        <TouchableHighlight onPress={async () => {
            for(const r of range){
                const startTimeInMinute = r.startTime.hour as number * 60 + (r.startTime.minute as number)
                const endTimeInMinute = r.endTime.hour as number * 60 + (r.endTime.minute as number)
                if(startTimeInMinute >= endTimeInMinute) {
                    showMessage({
                        message: langs[lang.lang].userpage2.showMessageText,
                        type: "danger",
                        icon: "danger"
                    })
                    return;
                }
            }
            const rangePageSettings = {
                unit: unit || "daily",
                plan: plan || "duration",
                gathering: {
                    name: gathering?.name || "total",
                    body: gathering?.body || [langs[lang.lang].defaultApp]
                },
                ranges: range,
                isStrictMode: isStrictMode || false,
            }
            await firestore().collection("planreminder").doc(auth().currentUser?.uid).set(rangePageSettings);
            await AsyncStorage.setItem("userPageSettings", JSON.stringify(rangePageSettings))
            navigation.navigate("SettingsApplied", rangePageSettings)
        }}
            style={styles.savebutton}
            activeOpacity={0.5}
            underlayColor="mediumseagreen"
        >
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>{langs[lang.lang].saveSettingsBtn}</Text>
        </TouchableHighlight>
        <DateTimePicker
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleStartConfirm}
            onCancel={hideStartTimePicker}
        />
        <DateTimePicker
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleEndConfirm}
            onCancel={hideEndTimePicker}
        />
        {/*page2*/}
    </ScrollView>)


}


const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginHorizontal: 10,
        marginTop: 20
    },
    subtitle: {
        fontSize: 20,
        marginHorizontal: 10
    },
    options: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    optionsLabel: {
        color: "deepskyblue"
    },
    picker: {
        color: "black",
        backgroundColor: "lightgray",
        margin: 10
    },
    savebutton: {
        backgroundColor: "mediumspringgreen",
        margin: 20,
        padding: 20,
        borderRadius: 10
    },
    borderbutton: {
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 3,
        padding: 10,
        width: 150

    }


})