import React, { useEffect, useState, useMemo, useRef } from "react"
import { Animated, StyleSheet, Text, TouchableHighlight, Easing, View, useColorScheme, TextInput, Modal, useWindowDimensions, Alert, ActivityIndicator } from "react-native"
import WebView from "react-native-webview"
import { jobDelay } from "../../scripts/util"
import { TypingText } from "../util";
import { horizontalScale, verticalScale, moderateScale } from "../../scripts/Metric"
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "react-native-google-signin";
import { FIREBASE_PERSONAL_ADMIN_KEY } from "@env"

async function signInWithGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const { idToken } = userInfo;

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        await auth().signInWithCredential(googleCredential);

        await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/setCustomUserClaims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: auth().currentUser?.uid, claims: { authenticatedThroughProvider: "google.com" }, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
        })

    } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('Sign-in cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Sign-in is already in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services not available or outdated');
        } else {
            console.error('Error:', error);
        }
    }
}

async function verifyUsername(username: string) {
    const response = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "util/availableUser", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const total_username_list = await response.json()
    const uid = total_username_list.docData[username]
    return uid;
}

async function getUserWebSession(uid: string){
    const response = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `util/authenticationSessions/${uid}/Web`, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const userWebSession = await response.json();
    return userWebSession;
}

async function verifySessionToken(sessionToken: string) {
    return await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/verifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: sessionToken, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
}

async function implementMobileAuthentication(uid: string) {
    const response = await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/createCustomToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uid, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const mobileAuthToken = await response.json();
    await auth().signInWithCustomToken(mobileAuthToken.data.token);
    await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `util/authenticationSessions`, collectionName: uid, docName: "Mobile", writeData: { authenticated: true, token: mobileAuthToken.data.token }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    });
    await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/setCustomUserClaims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: auth().currentUser?.uid, claims: { authenticatedThroughProvider: "password" }, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const userTokens = await auth().currentUser?.getIdTokenResult();
    const userClaims = userTokens?.claims;
    console.log(userClaims)
}

export default function RegistrationPage({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Registration"> }) {
    const { width, height } = useWindowDimensions()
    const isDark = useColorScheme() === 'dark';
    const [ providerType, setProvider ] = useState<string>("");
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const webviewState = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ injectJS, setInjectJS ] = useState<string>();
    const inputUsername = useRef<string>();
    const registrationBtnsFadingAnim = new Animated.Value(0);
    const registrationPageTitle = new Animated.Value(0);
    const appNameFadingAnim = new Animated.Value(0);
    const logoFadingAnim = new Animated.Value(0);
    const logoTransformingAnim = {
        translateY: new Animated.Value(0),
        scale: new Animated.Value(1),
    };
    const checkCookieJS = (message: string) => `
        function checkIsLoggedIn() {
            const interval = setInterval(() => {
                const allCookies = document.cookie;
                const cookieArray = allCookies.split(';');
                cookieArray.forEach((cookie) => {
                    cookie = cookie.trim();
                    const [ key, value ] = cookie.split('=');
                    if(key === "login" && value === "true"){
                        clearInterval(interval);
                        indexedDB.deleteDatabase("firebaseLocalStorageDb");
                        window.ReactNativeWebView.postMessage(JSON.stringify(${message}));
                    }
                });
            }, 100);
        };

        checkIsLoggedIn();
    `
    const registrationFocusJS = (username: string) => `
        function checkUsernameInputBox(){
            const interval = setInterval(() => {
                const usernameInput = document.querySelector("[name='username']");
                const regBox = document.querySelector(".reg-wrapper");
                const logIn = document.getElementById("login")
                const regMode = document.getElementById("registration-mode");
                if(usernameInput && regBox && logIn && regMode){
                    clearInterval(interval);
                    logIn.style.opacity = 0;
                    regMode.innerHTML = "Already have an account? Login now!"
                    regBox.style.transform = "translateX(-50%)";
                    usernameInput.value = "${username}";
                }
            }, 100)
        };

        checkUsernameInputBox();
    `

    const loginFocusJS = (username: string) => `
        function checkUserInputBox(){
            const interval = setInterval(() => {
                const userInput = document.querySelector("[name='user']");
                if(userInput){
                    clearInterval(interval);
                    userInput.value = "${username}";
                }
            }, 100)
        };

        checkUserInputBox();
    `

    const MainComponent = useMemo(() => (
        <View style={[styles.fullPageCenter, { flex: 1 }]}>
            <Animated.View style={{ width: (width > height ? horizontalScale(100, width) : horizontalScale(250, width)), height: (width > height ? height/2 : verticalScale(260, height)), display: "flex", flexDirection: "column", alignItems: "center", rowGap: 20, justifyContent: "center", transform: [{ translateY: logoTransformingAnim.translateY }, { scale: logoTransformingAnim.scale }] }}>
            {/* <a href="https://www.flaticon.com/free-icons/essay" title="essay icons">Essay icons created by RIkas Dzihab - Flaticon</a> */}
            <Animated.Image
                source={isDark ? require('../../imgs/dark-write.png') : require('../../imgs/light-write.png')}
                style={{ width: "100%", height: "100%", opacity: logoFadingAnim }}
            />
            <Animated.Text style={{ lineHeight: (width > height ? verticalScale(60, height) : verticalScale(45, height)), textAlignVertical: "center", fontSize: (width > height ? moderateScale(20, width) : moderateScale(40, width)), opacity: appNameFadingAnim}}>
                V
                <TypingText text="ersatile" delay={100} initialDelay={1500}/>
                &nbsp;Note
            </Animated.Text>
            </Animated.View>
            <View style={[styles.containerBox, { width: "100%", height: verticalScale(height/(width > height ? 0.65 : 1.35), height), position: "absolute", bottom: 0, rowGap: verticalScale(width > height ? 45 : 75, height) }]}>
                <Animated.Text style={[styles.btnText, { fontSize: moderateScale(40, width), opacity: registrationPageTitle }]}>Register with...</Animated.Text>
                <Animated.View style={[styles.containerBox, { opacity: registrationBtnsFadingAnim, rowGap: verticalScale(width > height ? 20 : 50, height) }]}>
                    <TouchableHighlight onPress={() => setShowModal(true)} underlayColor="darkgrey" style={[styles.btn, { backgroundColor: 'lightgrey', width: horizontalScale(250, width) }]}>
                        <Text style={styles.btnText}>CWR provider</Text>
                    </TouchableHighlight>
                    <GoogleSigninButton 
                        style={{ width: horizontalScale(200, width), height: verticalScale(width > height ? 100 : 50, height) }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={async () => { await signInWithGoogle(); if(auth().currentUser) navigation.replace("NoteDashboard") }}
                    />
                </Animated.View> 
            </View>
        </View>
    ), [ width, height ])

    useEffect(() => {
        GoogleSignin.configure({ 
            webClientId: "12217560937-khiiikcchh24kojufsg8iuei8envrgcc.apps.googleusercontent.com"    
        })
    }, [])

    useEffect(() => {
        // Reset Animation
        Animated.timing(logoFadingAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start();
        Animated.timing(appNameFadingAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start()
        Animated.timing(logoTransformingAnim.translateY, {
            toValue: 0,
            duration: 0,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
        Animated.timing(logoTransformingAnim.scale, {
            toValue: 1,
            duration: 0,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
        Animated.timing(registrationPageTitle, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
        }).start();
        Animated.timing(registrationBtnsFadingAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
        }).start();

        // Start Animation
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
            if(auth().currentUser) await jobDelay(() => navigation.replace("NoteDashboard"), 3000)
            if(width > height) await jobDelay(() => {
                Animated.timing(appNameFadingAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start()
                Animated.timing(logoFadingAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start()
            }, 1500)
            else await jobDelay(() => {
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
    }, [ width, height ]);

    return(
        <View style={[styles.fullPageCenter, { height: height }]}>
            <Modal animationType="slide" visible={showModal} transparent={true}>
                <View style={[styles.fullPageCenter, { flex: 1 }]}>
                    <View style={{ display: "flex", rowGap: verticalScale(width > height ? 20 : 10, height), backgroundColor: isDark ? "black" : "white", padding: moderateScale(20, width), borderRadius: moderateScale(10, width) }}>
                        <Text style={[styles.btnText, { fontSize: 20 }]}>Please enter your CWR account username</Text>
                        <TextInput onChangeText={text => inputUsername.current = text} placeholder="Your username here" style={{ borderColor: isDark ? "white" : "black", borderWidth: 1, padding: 10, borderRadius: 10 }}></TextInput>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableHighlight onPress={() => { setShowModal(false); inputUsername.current = ""; }} underlayColor="darkgrey" style={[styles.btn, { backgroundColor: 'lightgrey', width: "45%" }]}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={async () => {
                                if(inputUsername.current === "" || inputUsername.current === undefined) {
                                    Alert.alert("System Error", "Please type in your username!");
                                    return;
                                }
                                setLoading(true);
                                const uid = await verifyUsername(inputUsername.current || "")
                                if(uid) {
                                    const userWebSession = await getUserWebSession(uid);
                                    if(userWebSession.docData.authenticated){
                                        const tokenVerificationResult = await verifySessionToken(userWebSession.docData.token);
                                        if(tokenVerificationResult.ok) {
                                            await implementMobileAuthentication(uid);
                                            setLoading(false);
                                            setShowModal(false);
                                            return;
                                        };
                                    };
                                    setInjectJS(loginFocusJS(inputUsername.current || "") + checkCookieJS(JSON.stringify({ authenticated: true })));
                                } else {
                                    setInjectJS(registrationFocusJS(inputUsername.current || "") + checkCookieJS(JSON.stringify({ authenticated: true, newClient: true })));
                                }   
                                setProvider("cwr");
                                webviewState[1](true);
                                setLoading(false);
                                setShowModal(false);
                            }} underlayColor="silver" style={[styles.btn, { backgroundColor: isDark ? 'white' : 'whitesmoke', width: "45%" }]}>
                                <Text style={[styles.btnText, { color: "black" }]}>Submit</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            {MainComponent}
            <Modal animationType="none" visible={loading} transparent={true}>
                <View style={[styles.fullPageCenter, { position: "absolute", zIndex: 100, top: 0, left: 0, width: width, height: height }]}>
                    <View style={{ flex: 1, backgroundColor: isDark ? "black" : "white", opacity: 0.5, width: width, height: height }}></View>
                    <ActivityIndicator size="large" style={{ position: "absolute" }} />
                </View>
            </Modal>
            <ProviderWebView interactingUser={inputUsername.current || ""} type={providerType} webviewState={webviewState} injectedJavaScript={injectJS} navigation={navigation}/>
        </View>
    )
}

type ProviderWebViewProps = { 
    interactingUser: string,
    type: string, 
    webviewState: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ], 
    injectedJavaScript?: string,
    navigation: NativeStackNavigationProp<RouteStackParamList, "Registration">
}
function ProviderWebView({ interactingUser, type, webviewState, injectedJavaScript, navigation }: ProviderWebViewProps) {
    const { width, height } = useWindowDimensions()
    const [ webviewShow, setWebviewShow ] = webviewState;
    if(type === "cwr")
        return(
            <Modal visible={webviewShow} animationType="slide">
                <View style={{ flex: 1, position: "absolute", top: 0, left: 0, width: width, height: height}}>
                    <WebView
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        source={{ uri: 'https://codingwithrand.vercel.app/registration' }}
                        injectedJavaScript={injectedJavaScript}
                        onMessage={async (e) => { 
                            const postedData = JSON.parse(e.nativeEvent.data);
                            if(postedData.authenticated){
                                setWebviewShow(false);
                                if(postedData.newClient) Alert.alert("We have sent you a verification email for your account, please don't forget to check your inbox!")
                                const currentUserId = await verifyUsername(interactingUser);
                                await implementMobileAuthentication(currentUserId);
                                navigation.replace("NoteDashboard")
                            }
                        }}
                        style={{ flex: 1 }}
                    />
                </View>
            </Modal>
        )
    else return(<></>)
}

const styles = StyleSheet.create({
    fullPageCenter: {
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
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
        alignItems: "center",
    }
})