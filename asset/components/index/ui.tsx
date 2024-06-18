import { Text, View, TouchableHighlight, useWindowDimensions, Modal, ActivityIndicator, useColorScheme, StyleSheet, Switch, TouchableOpacity, NativeModules, ScrollView, Pressable } from "react-native";
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { GoogleSignin } from "react-native-google-signin";
import { horizontalScale, moderateScale } from "../../scripts/Metric";
import { retryFetch } from "../../scripts/util";
import { useEffect, useRef, createRef, useState, RefObject, LegacyRef, MutableRefObject, Ref } from "react";
import { Button, RadioButton } from "react-native-paper";
import { options } from "@react-native-community/cli-platform-android/build/commands/buildAndroid";
import { Picker } from "@react-native-picker/picker";
import MultiSelect from "react-native-multiple-select";
import Slider, { SliderRef } from "@react-native-community/slider";
import { RouteProp } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FIREBASE_PERSONAL_ADMIN_KEY } from "@env";

const { AppStatisticData } = NativeModules

export function UserPage1({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "UserDashboard"> }) {
    const [selectedUnit, setSelectedUnit] = useState('daily');
    const [selectedPlan, setSelectedPlan] = useState("duration");
    const [selectedGathering, setSelectedGathering] = useState("total");
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectStictMode, setSelectStictMode] = useState(false)
    const [appNamesArrey, setAppNamesArrey] = useState<object[]>([])
    const { width, height } = useWindowDimensions();

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

    const onSelectedItemsChange = (selectedItems: string[]) => {
        setSelectedItems(selectedItems);
    };


    return (
        <ScrollView>
            <Text style={styles.title}>การกำหนดเเผนการใช้งาน</Text>
            <Text style={styles.subtitle}>หน่วยเวลา</Text>


            <View style={styles.options}>
                <RadioButton.Android
                    value="daily"
                    status={selectedUnit === 'daily' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('daily')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>รายวัน</Text>
            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="weekly"
                    status={selectedUnit === 'weekly' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('weekly')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>รายสัปดาห์</Text>
            </View>

            <View style={styles.options}>
                <RadioButton.Android
                    value="mouthly"
                    status={selectedUnit === 'mouthly' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedUnit('mouthly')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>รายเดือน</Text>
            </View>

            <Text style={styles.subtitle}>รูปเเบบการกำหนดเเผน</Text>
            <View style={styles.options}>
                <RadioButton.Android
                    value="duration"
                    status={selectedPlan === 'duration' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedPlan('duration')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>กำหนดระยะเวลาที่จะใช้ในเเต่ละแอปต่อวัน</Text>

            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="range"
                    status={selectedPlan === 'range' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedPlan('range')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>กำหนดช่วงเวลาที่จะใช้ในเเต่ละแอปต่อวัน</Text>
            </View>
            <Text style={styles.title}>รูปแบบการเก็บข้อมูลการใช้แอปพลิเคชัน</Text>
            <View style={styles.options}>
                <RadioButton.Android
                    value="total"
                    status={selectedGathering === 'total' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedGathering('total')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>เเบบเหมารวม(รวมเวลาการใช้ทุกแอปพลิเคชั่น)</Text>

            </View>
            <View style={styles.options}>
                <RadioButton.Android
                    value="separate"
                    status={selectedGathering === 'separate' ?
                        'checked' : 'unchecked'}
                    onPress={() => setSelectedGathering('separate')}
                    color="#007BFF"
                />
                <Text style={styles.optionsLabel}>เเบบเเยกกัน</Text>
            </View>

            <Text style={styles.subtitle}>ให้การใช้เเอปพลิเคชั่นได้บ้าง</Text>
            <View style={{ margin: 10 }}>
                <MultiSelect
                    items={appNamesArrey}
                    uniqueKey="id"
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Pick Items"
                    searchInputPlaceholderText="Search Items..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#48d22b"
                    submitButtonText="Submit"
                />
            </View>

            <View style={[styles.options, { justifyContent: "space-between" }]}>
                <Text style={styles.title}>Stirct Mode</Text>
                <Switch onValueChange={() => setSelectStictMode(prevSelectStictMode => !prevSelectStictMode)} value={selectStictMode} />


            </View>
            <TouchableOpacity style={{ height: 50 }} onPress={() => navigation.replace("UserDashboard2", {
                unit: selectedUnit,
                plan: selectedPlan,
                gathering: {
                    name: selectedGathering,
                    body: selectedItems.length > 0 ? selectedItems : undefined
                },
                isStrictMode: selectStictMode
            })}>
                <Text style={{ fontSize: 50, textAlign: "center" }}>→</Text>
            </TouchableOpacity>


            <TouchableHighlight onPress={promptSignOut} underlayColor="dimgrey" style={{ width: horizontalScale(100, width), padding: moderateScale(10, width), backgroundColor: "grey", borderRadius: moderateScale(10, width) }}>
                <Text>Sign Out</Text>
            </TouchableHighlight>
        </ScrollView>

    )
}

export function GUESTPAGE({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "GuestDashboard"> }) {
    const [selectedGathering, setSelectedGathering] = useState("total");
    const [selectedDuration, setSelectedDuration] = useState("1h")
    const { width, height } = useWindowDimensions()
    return (
        <View style={{ height: height, flex: 1, display: "flex", justifyContent: "space-between" }}>
            <View><Text style={styles.title}>รูปแบบการเก็บข้อมูลการใช้แอปพลิเคชัน</Text>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="total"
                        status={selectedGathering === 'total' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedGathering('total')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>เเบบเหมารวม(รวมเวลาการใช้ทุกแอปพลิเคชั่น)</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="separate"
                        status={selectedGathering === 'separate' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedGathering('separate')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>เเบบเเยกกัน</Text>
                </View>
                <Text style={styles.title}>ระยะเวลาที่ใช้ในเเต่ระวัน</Text>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="15min"
                        status={selectedDuration === '15min' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration('15min')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>15 นาที</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="30min"
                        status={selectedDuration === '30min' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration('30min')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>30 นาที</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="1h"
                        status={selectedDuration === '1h' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration('1h')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>1 ชั่วโมง</Text>
                </View>
                <View style={styles.options}>
                    <RadioButton.Android
                        value="2h"
                        status={selectedDuration === '2h' ?
                            'checked' : 'unchecked'}
                        onPress={() => setSelectedDuration('2h')}
                        color="#007BFF"
                    />
                    <Text style={styles.optionsLabel}>2 ชั่วโมง</Text>
                </View>
            </View>

            <TouchableHighlight onPress={() => {

            }}
                style={styles.savebutton}
                activeOpacity={0.5}
                underlayColor="mediumseagreen"
            >
                <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Save Setting</Text>
            </TouchableHighlight>

        </View>
    )
}

export function UserPage2({ navigation, route }: { navigation: NativeStackNavigationProp<RouteStackParamList, "UserDashboard2">, route: RouteProp<RouteStackParamList, "UserDashboard2"> }) {
    type RangeObject = {
        owner: string,
        startTime: {
            hour?: number,
            minute?: number
        },
        endTime: {
            hour?: number,
            minute?: number
        }
    }

    const constraint = {
        PER_DAY: 120,
        PER_WEEK: 600,
        PER_MONTH: 3000

    }

    const unit = route.params?.unit;
    const plan = route.params?.plan;
    const gathering = route.params?.gathering;
    const isStrictMode = route.params?.isStrictMode;
    
    const isDarker = useColorScheme() === 'dark';
    const [sliderValue, SetSliderValue] = useState(Array.from((gathering?.body || ["total"]), () => 0));
    const [sliderMaximumValue, SetSliderMaximumValue] = useState(Array.from((gathering?.body || ["total"]), () => constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`]));
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [startTime, setStartTime] = useState<(Date | undefined)[]>(Array.from((gathering?.body || ["total"]), () => undefined));
    const [endTime, setEndtime] = useState<(Date | undefined)[]>(Array.from((gathering?.body || ["total"]), () => undefined));
    const [range, setRange] = useState<Array<RangeObject>>([]);
    const isPickingStartTimeN = useRef<number>();
    const isPickingEndTimeN = useRef<number>();

    const themed = isDarker ? Colors.lighter : Colors.darker

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
                    owner: gathering?.body?.at(index) || "total",
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
            if (prevSliderValue[index] > sliderMaximumValue[index]) {
                return sliderMaximumValue[index]
            } else {
                return prevSliderValue[index]
            }
        }))
    }, [sliderMaximumValue])

    return (plan === "duration" ? 
    <ScrollView>
        {/*page3*/}
        <Text style={styles.title}>ระยะเวลาในการใช้ต่อ{unit === "daily" ? "วัน" : unit === "monthly" ? "เดือน" : "สัปดาห์"}</Text>
        {(() => {
            let tempJSXArray: JSX.Element[] = [];
            (gathering?.body || ["total"]).forEach((v, i) => {
                tempJSXArray.push(
                    <View key={i}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 15, marginTop: 10 }}>{v}</Text>
                        <Text style={{ marginHorizontal: 15, textAlign: "center", fontWeight: "bold" }}>{Math.floor(sliderValue[i] / 60) !== 0 ? Math.floor(sliderValue[i] / 60) + " ชั่วโมง " : ""}{sliderValue[i] % 60 !== 0 ? sliderValue[i] % 60 + " นาที" : ""}</Text>
                        <Slider maximumValue={constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`]} upperLimit={sliderMaximumValue[i]} minimumValue={0} step={1} value={sliderValue[i]} onValueChange={function (slidervalue) {
                            SetSliderValue(prevSliderValue => prevSliderValue.map((val, index) => index === i ? slidervalue : val))
                            SetSliderMaximumValue(prevSliderMax => {
                                if (slidervalue > sliderValue[i]) {
                                    return prevSliderMax.map((val, index) => index !== i ? val - (slidervalue - sliderValue[i]) : val)
                                } else if (slidervalue < sliderValue[i]) {
                                    return prevSliderMax.map((val, index) => index !== i ? val + (sliderValue[i] - slidervalue) : val)
                                }
                                else {
                                    return prevSliderMax
                                }
                            });
                        }} />
                        <View style={[styles.options, { justifyContent: "space-between", marginHorizontal: 15 }]}>
                            <Text>0 นาที</Text>
                            <Text>{constraint[`PER_${unit === "daily" ? "DAY" : unit === "monthly" ? "MONTH" : "WEEK"}`] / 60} ชั่วโมง</Text>
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
                body: gathering?.body || ["total"]
            },
            isStrictMode: isStrictMode || false
        }
        )}>
            <Text style={{ fontSize: 50, textAlign: "center" }}>←</Text>
        </TouchableOpacity>

        <TouchableHighlight onPress={() => {

        }}
            style={styles.savebutton}
            activeOpacity={0.5}
            underlayColor="mediumseagreen"
        >
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Save Setting</Text>
        </TouchableHighlight>



    </ScrollView> : 
    <ScrollView>
        <Text style={styles.title}>กำหนดช่วงเวลาที่ไม่ให้ใช้เเอปพลิเคชัน</Text>
        {(() => {
            let tempJSXArray: JSX.Element[] = [];
            (gathering?.body || ["total"]).forEach((v, i) => {
                tempJSXArray.push(
                    <View key={i}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 15}}>{v}</Text>
                        <View style={[styles.options, { justifyContent: "space-between", marginHorizontal:10 }]}>
                            <TouchableOpacity onPress={() => showStartTimePicker(i)} style={[styles.borderbutton, {borderColor: "deepskyblue",}]}>
                                <Text style={{textAlign:"center", color:"deepskyblue"}}>
                                    {startTime[i] ? moment(startTime[i]).format("H:mmน.") : "Select Start Time"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showEndTimePicker(i)} style={[styles.borderbutton, {borderColor: "deepskyblue",}]}>
                                <Text style={{textAlign:"center", color:"deepskyblue"}}>
                                    {endTime[i] ? moment(endTime[i]).format("H:mmน.") : "Select End Time"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => addRange(i)} style={[styles.borderbutton, {borderColor: themed, width: "auto", margin: 10}]}>
                            <Text style={{textAlign:"center", color: themed}}>Add Range</Text>
                        </TouchableOpacity>
                        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {(() => {
                                let anotherTempJSXArray: JSX.Element[] = [];
                                range?.forEach((val, j) => {
                                    if(val.owner === v)
                                        anotherTempJSXArray.push(
                                            <View key={j} style={{ borderStyle: "solid", borderColor: themed, borderWidth: 2, borderRadius: 999, padding: 10, paddingVertical: 5, marginLeft: 10, margin: 5, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "29%", opacity: 0.6 }}>
                                                <Text style={{ textAlign: "center" }}>{`${val.startTime.hour}:${val.startTime.minute !== undefined && val.startTime.minute < 10 ? `0${val.startTime.minute}` : val.startTime} - ${val.endTime.hour}:${val.endTime.minute !== undefined && val.endTime.minute < 10 ? `0${val.endTime.minute}` : val.endTime}`}</Text>
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
                body: gathering?.body || ["total"]
            },
            isStrictMode: isStrictMode || false
        })}>
            <Text style={{ fontSize: 50, textAlign: "center" }}>←</Text>
        </TouchableOpacity>
        <TouchableHighlight onPress={() => {

        }}
            style={styles.savebutton}
            activeOpacity={0.5}
            underlayColor="mediumseagreen"
        >
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Save Setting</Text>
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