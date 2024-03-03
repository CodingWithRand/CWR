import { useEffect, useState } from "react"
import { Animated, StyleSheet, Text, Dimensions, TouchableHighlight, Easing, View, useColorScheme, Alert } from "react-native"
import WebView from "react-native-webview"
import { jobDelay } from "../scripts/util"
import { TypingText } from "./util";
import auth from "@react-native-firebase/auth"

const { width, height } = Dimensions.get('window')

export function RegistrationPage() {
    const isDark = useColorScheme() === 'dark';
    const [ webview, setWebview ] = useState<string>("")
    const registrationBtnsFadingAnim = new Animated.Value(0);
    const registrationPageTitle = new Animated.Value(0);
    const appNameFadingAnim = new Animated.Value(0);
    const logoFadingAnim = new Animated.Value(0);
    const logoTransformingAnim = {
        translateY: new Animated.Value(0),
        scale: new Animated.Value(1),
    };

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            Alert.alert("user" + user || "null")
        })
    }, [])

    useEffect(() => {
        (async () => {
            Animated.timing(logoFadingAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
            await jobDelay(() => {
            Animated.timing(appNameFadingAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start()
            }, 1000)
            await jobDelay(() => {
            Animated.timing(logoTransformingAnim.translateY, {
                toValue: -300,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
            Animated.timing(logoTransformingAnim.scale, {
                toValue: 0.5,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
            }, 2000)
            await jobDelay(() => {
                Animated.timing(registrationPageTitle, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            }, 1500)
            await jobDelay(() => {
                Animated.timing(registrationBtnsFadingAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            }, 1000)
        })();
    }, []);

    return(
        <View style={styles.fullPageCenter}>
            <Animated.View style={{ width: 250, height: 250, display: "flex", flexDirection: "column", alignItems: "center", rowGap: 20, justifyContent: "center", transform: [{ translateY: logoTransformingAnim.translateY }, { scale: logoTransformingAnim.scale }] }}>
                {/* <a href="https://www.flaticon.com/free-icons/essay" title="essay icons">Essay icons created by RIkas Dzihab - Flaticon</a> */}
                <Animated.Image
                source={isDark ? require('../imgs/dark-write.png') : require('../imgs/light-write.png')}
                style={{ width: "100%", height: "100%", opacity: logoFadingAnim }}
                />
                <Animated.Text style={{ lineHeight: 35, textAlignVertical: "center", fontSize: 35, opacity: appNameFadingAnim}}>
                V
                <TypingText text="ersatile" delay={100} initialDelay={1500}/>
                &nbsp;Note
                </Animated.Text>
            </Animated.View>
            <View style={[styles.containerBox, { width: width, height: height/1.35, position: "absolute", bottom: 0, rowGap: 75 }]}>
                <Animated.Text style={[styles.btnText, { fontSize: 40, opacity: registrationPageTitle }]}>Registration with...</Animated.Text>
                <Animated.View style={[styles.containerBox, { opacity: registrationBtnsFadingAnim, rowGap: 50 }]}>
                    <TouchableHighlight onPress={() => setWebview("cwr")} underlayColor="dimgrey" style={[styles.btn, { backgroundColor: 'grey'}]}>
                         <Text style={styles.btnText}>CWR provider</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => setWebview("google")} underlayColor="silver" style={[styles.btn, { backgroundColor: 'white'}]}>
                        <Text style={[styles.btnText, { color: "black" }]}>Google</Text>
                   </TouchableHighlight>
                </Animated.View> 
            </View>
            <ProviderWebView type={webview}/>
        </View>
    )
}

export function ProviderWebView({ type }: { type: string }) {
    if(type === "cwr")
        return(
            <View style={{ flex: 1, position: "absolute", top: 0, left: 0, width: width, height: height}}>
                <WebView
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    source={{ uri: 'https://codingwithrand-rand0mtutorial.vercel.app/registration' }}
                    style={{ flex: 1 }}
                />
            </View>
        )
    else return(<></>)
}

const styles = StyleSheet.create({
    fullPageCenter: {
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        height: height
    },
    btn: {
        width: width/2,
        height: 50,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        fontSize: 30,
        textAlign: "center",
    },
    containerBox: {
        display: "flex",
        alignItems: "center"
    }
})