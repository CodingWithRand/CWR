import React, { useEffect, useState, useMemo, useRef } from "react"
import { Animated, StyleSheet, Text, TouchableHighlight, Easing, View, useColorScheme, TextInput, Modal, useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity } from "react-native"
import WebView from "react-native-webview"
import { jobDelay, asyncDelay, getClientIp, useDelayedEffect, retryFetch } from "../../scripts/util"
import { TypingText } from "../util";
import { horizontalScale, verticalScale, moderateScale } from "../../scripts/Metric"
import auth from "@react-native-firebase/auth"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "react-native-google-signin";
import { FIREBASE_PERSONAL_ADMIN_KEY, FIREBASE_GOOGLE_PROVIDER_WEB_CLIENT_ID } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobal } from "../../scripts/global";
import { Loading } from "../util";
import { showMessage } from "react-native-flash-message";

GoogleSignin.configure({ 
    webClientId: FIREBASE_GOOGLE_PROVIDER_WEB_CLIENT_ID
})

async function signInWithGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const { idToken } = userInfo;

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        const userCredential = await auth().signInWithCredential(googleCredential);
        if(userCredential.user.displayName){
            await AsyncStorage.setItem("clientUsername", userCredential.user.displayName);
            await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: "util/availableUser", writeData: { [userCredential.user.displayName]: userCredential.user.uid }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
            })
        }

        const ip = await getClientIp();
        
        const updateMobileRegistryResponse = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: `util/authenticationSessions/${userCredential.user.uid}/Mobile`, writeData: { planreminder :{ authenticated: true, at: { place: ip, time: Date() } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
        })
        if(updateMobileRegistryResponse.status === 404){
            await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: "util/authenticationSessions", collectionName: userCredential.user.uid, docName: "Mobile", writeData: { planreminder :{ authenticated: true, at: { place: ip, time: Date() } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
            });
        }

        await retryFetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/setCustomUserClaims", { uid: userCredential.user.uid, claims: { authenticatedThroughProvider: "google.com" }, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
        if(!userCredential.user.providerData.some(provider => provider.providerId === "password")) await retryFetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/setCustomUserClaims", { uid: userCredential.user.uid, claims: { createdAccountWithGoogleAccount: true }, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
        showMessage({ message: "Welcome back, " + await AsyncStorage.getItem("clientUsername")})

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

async function verifyUsername(username: string | null) {
    if(username === null) return;
    const response = await fetch(`https://cwr-api-us.onrender.com/post/provider/cwr/firestore/query?select=${username}`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "util", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    if(response.ok){
        const the_username_list = await response.json()
        const uid = the_username_list.docDatas.availableUser[username]
        return uid;
    }
}

async function getUserWebSessions(uid: string){
    const response = await fetch(`https://cwr-api-us.onrender.com/post/provider/cwr/firestore/query?select=${encodeURIComponent("https://codingwithrand.vercel.app")}`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `util/authenticationSessions/${uid}`, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    if(response.ok){
        const userWebSessions = await response.json();
        const providerWebSessions = userWebSessions.docDatas.Web["https://codingwithrand.vercel.app"];
        return providerWebSessions;
    }
}

async function implementMobileAuthentication(uid: string) {
    const response = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/createCustomToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uid, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const mobileAuthToken = await response.json();
    const userCredential = await auth().signInWithCustomToken(mobileAuthToken.data.token);
    if(userCredential.user.displayName) await AsyncStorage.setItem("clientUsername", userCredential.user.displayName);
    const ip = await getClientIp();
    const updateRegistryResponse = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `util/authenticationSessions/${userCredential.user.uid}/Mobile`, writeData: { planreminder :{ authenticated: true, at: { place: ip, time: Date() } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
    })
    if(updateRegistryResponse.status === 404){
        await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: "util/authenticationSessions", collectionName: userCredential.user.uid, docName: "Mobile", writeData: { planreminder :{ authenticated: true, at: { place: ip, time: Date() } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
        });
    }

    await retryFetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/setCustomUserClaims", { uid: auth().currentUser?.uid, claims: { authenticatedThroughProvider: "password" }, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
}

export default function RegistrationPage({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Registration"> }) {
    /* 
        Suggestion
        Added I already have an account at the bottom, and isolate the signin procession
    */
    const { width, height } = useWindowDimensions()
    const isDark = useColorScheme() === 'dark';
    const [ providerType, setProvider ] = useState<string>("");
    const webviewState = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ injectJS, setInjectJS ] = useState<string>();
    const [ cwrRegistrationType, setCWRRegistrationType ] = useState<string>("");
    const { authUser, counter } = useGlobal();
    const { themedColor } = useGlobal();
    const registrationBtnsFadingAnim = new Animated.Value(0);
    const registrationPageTitle = new Animated.Value(0);
    const appNameFadingAnim = new Animated.Value(0);
    const logoFadingAnim = new Animated.Value(0);
    const logoTransformingAnim = {
        translateY: new Animated.Value(0),
        scale: new Animated.Value(1),
    };

    /* Try clearing the cookie as well, because the problem is that you can't change to other account with email sign in method */
    const clearDB = () => `
        function deleteCachedData(){
            indexedDB.deleteDatabase("firebaseLocalStorageDb");
            document.cookie = 'emailVerified=false; username=null; login=false';
        }
        deleteCachedData();
    `

    const checkCookieJS = (isNewClient: boolean) => `
        async function checkIsLoggedIn() {
            await new Promise((res) => setTimeout(() => res(), 1000));
            const interval = setInterval(() => {
                const allCookies = document.cookie;
                const cookieArray = allCookies.split(';');
                let cookieObj = {};

                cookieArray.forEach((cookie) => {
                    cookie = cookie.trim();
                    const [ key, value ] = cookie.split('=');
                    cookieObj[key] = decodeURIComponent(value);
                });

                if(cookieObj["emailVerified"] === "true" && cookieObj["username"]){
                    clearInterval(interval);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ authenticated: true, username: cookieObj["username"], newClient: ${isNewClient} }));
                }
            }, 100);
        };

        checkIsLoggedIn();
    `
    const disableRegModeButton = () => `
        function disableRegModeButton(){
            const interval = setInterval(() => {
                const regMode = document.querySelector("#registration-mode");
                if(regMode){
                    clearInterval(interval);
                    regMode.style.pointerEvents = "none";
                    regMode.style.opacity = 0.5;
                }
            }, 100)
        };

        disableRegModeButton();
    `

    const closeButtonAdded = () => `
        function closeButtonAdded(){
            const closeButton = document.createElement('button');
            closeButton.innerHTML = 'X';
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.zIndex = "10000";
            closeButton.style.backgroundColor = "transparent";
            closeButton.style.border = "none";
            closeButton.style.color = "grey";
            closeButton.style.fontSize = "40px";
            closeButton.addEventListener('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ actionCancel: true }));
            });
            document.body.appendChild(closeButton);
        }

        closeButtonAdded();
    `

    const MainComponent = useMemo(() => (
        <View style={[styles.fullPageCenter, { flex: 1 }]}>
            <Animated.View style={{ width: (width > height ? horizontalScale(100, width) : horizontalScale(250, width)), height: (width > height ? height/2 : verticalScale(260, height)), display: "flex", flexDirection: "column", alignItems: "center", rowGap: 20, justifyContent: "center", transform: [{ translateY: logoTransformingAnim.translateY }, { scale: logoTransformingAnim.scale }] }}>
            {/* <a href="https://www.flaticon.com/free-icons/planing" title="planing icons">Planing icons created by iconixar - Flaticon</a> */}
            <Animated.Image
                source={isDark ? require('../../imgs/dark-content-management.png') : require('../../imgs/light-content-management.png')}
                style={{ width: "100%", height: "100%", opacity: logoFadingAnim }}
            />
            <Animated.Text style={{ width: width, textAlign: "center", lineHeight: (width > height ? verticalScale(60, height) : verticalScale(45, height)), textAlignVertical: "center", fontSize: (width > height ? moderateScale(20, width) : moderateScale(40, width)), opacity: appNameFadingAnim}}>
                <TypingText text="Plan Reminder" delay={100} initialDelay={1500} style={{color: themedColor.comp}}/>
            </Animated.Text>
            </Animated.View>
            <View style={[styles.containerBox, { width: "100%", height: verticalScale(height/(width > height ? 0.65 : 1.35), height), position: "absolute", bottom: 0, rowGap: verticalScale(width > height ? 45 : 75, height) }]}>
                <Animated.Text style={[styles.btnText, { fontSize: moderateScale(40, width), opacity: registrationPageTitle, color: themedColor.comp }]}>Register with...</Animated.Text>
                <Animated.View style={[styles.containerBox, { opacity: registrationBtnsFadingAnim, rowGap: verticalScale(width > height ? 20 : 50, height) }]}>
                    <TouchableHighlight
                        onPress={async () => {
                            setLoading(true);
                            setInjectJS(clearDB() + checkCookieJS(true) + disableRegModeButton() + closeButtonAdded());
                            setCWRRegistrationType("register")
                            setProvider("cwr");
                            webviewState[1](true);
                            setLoading(false);
                        }}
                        underlayColor="dodgerblue"
                        style={[styles.btn, { backgroundColor: 'deepskyblue', width: horizontalScale(200, width) }]}
                    >   
                        <Text style={styles.btnText}>Email</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="darkgrey" onPress={async () => { setLoading(true); await auth().signInAnonymously(); setLoading(false); }} style={[styles.btn, { backgroundColor: 'lightgrey', width: horizontalScale(200, width) }]}>
                        <Text style={[styles.btnText, { fontSize: 20 }]}>Sign Up as a Guest</Text>
                    </TouchableHighlight>
                    <GoogleSigninButton
                        style={{ width: horizontalScale(200, width), height: verticalScale(width > height ? 100 : 50, height) }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={async () => { await signInWithGoogle(); if(auth().currentUser) navigation.replace("UserDashboard") }}
                    />
                    <TouchableOpacity onPress={async () => {
                        setLoading(true);
                        let uid;
                        if(await AsyncStorage.getItem("clientUsername")) uid = await verifyUsername(await AsyncStorage.getItem("clientUsername"));
                        if(uid) {
                            const inquiryCheck = await new Promise((resolve) => {
                                Alert.alert(
                                    "Warning",
                                    "You've previously signed in with an account. Do you want to continue in the account or sign into the new one?",
                                    [
                                        { text: "Cancel", onPress: () => resolve(undefined) },
                                        { text: "Continue in this account", onPress: () => resolve(true) },
                                        { text: "Sign into the new account", onPress: () => resolve(false) },
                                    ]
                                )
                            })
                            if(inquiryCheck !== undefined && inquiryCheck === true){
                                if(await new Promise((resolve) => {
                                    getUserWebSessions(uid).then((userWebSession) => {
                                            if(userWebSession.authenticated) resolve(true);
                                            else resolve(false);
                                        }).catch(() => resolve(false))
                                    })
                                ){
                                    await implementMobileAuthentication(uid);
                                } else {
                                    const userClaimsRequest = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/getCustomUserClaims", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ uid: uid, securityStage: "none", adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
                                    })
                                    const userClaims = await userClaimsRequest.json();
                                    if(userClaims.createdAccountWithGoogleAccount){
                                        Alert.alert(
                                            "Warning", 
                                            "You have created an account with Google before. Therefore, your password has not been set. Please sign in with your google account instead by choosing the above option.", // You can still proceed if you want to sign into a different account. But you'll have to set your new password first. Do you want to proceed?",
                                            /* Developing dynamically prompt send reset password link to user postponed */
                                            /*
                                                [
                                                    { text: "OK", onPress: async () => {
                                                        const userProviderDataRequest = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/getUserProviderData", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ uid: uid, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
                                                        })
                                                        const userProviderDatas = await userProviderDataRequest.json();
                                                        for(const userProviderData of userProviderDatas){
                                                            if(userProviderData.provider === "password"){
                                                                setInjectJS(clearDB() + checkCookieJS(false) + disableRegModeButton());
                                                                setCWRRegistrationType("login")
                                                                setProvider("cwr");
                                                                webviewState[1](true);
                                                                return;
                                                            }
                                                        }
                                                        showMessage({ message: "Please set your password first." })
                                                    } },
                                                    { text: "Cancel", style: "cancel" }
                                                ]
                                            */
                                        );
                                    } else {
                                        setInjectJS(clearDB() + checkCookieJS(false) + disableRegModeButton() + closeButtonAdded());
                                        setCWRRegistrationType("login")
                                        setProvider("cwr");
                                        webviewState[1](true);
                                    }
                                }
                            } else if(inquiryCheck !== undefined && inquiryCheck === false) { 
                                setInjectJS(clearDB() + checkCookieJS(false) + disableRegModeButton() + closeButtonAdded());
                                setCWRRegistrationType("login")
                                setProvider("cwr");
                                webviewState[1](true);
                            }
                        } else {
                            setInjectJS(clearDB() + checkCookieJS(false) + disableRegModeButton() + closeButtonAdded());
                            setCWRRegistrationType("login")
                            setProvider("cwr");
                            webviewState[1](true);
                        }
                        setLoading(false);
                    }}>
                        <Text>I already have an account</Text>
                    </TouchableOpacity>
                </Animated.View> 
            </View>
        </View>
    ), [ width, height, themedColor ])

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
            try{
                (async () => {
                    if(counter.setGlobalCounter) counter.setGlobalCounter(0);
                    for(let i = 0; i<10; i++) await asyncDelay(1000);
                })()
                const cachedUsername = await AsyncStorage.getItem("clientUsername");
                const uid = await verifyUsername(cachedUsername);
                const MobileAuthSessionsResponse = await fetch(`https://cwr-api-us.onrender.com/post/provider/cwr/firestore/query?select=planreminder`, { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${uid}`, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
                })
                const MobileAuthSessions = await MobileAuthSessionsResponse.json();
                const planreminderMobileAuthSession = MobileAuthSessions.docDatas.Mobile.planreminder;
                if(counter.globalCounter && counter.globalCounter < 10){
                    if(planreminderMobileAuthSession.authenticated && !auth().currentUser){
                        console.log("Welcome back", cachedUsername);
                        const response = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/auth/createCustomToken", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ uid: uid, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
                        })
                        const mobileAuthToken = await response.json();
                        const userCredential = await auth().signInWithCustomToken(mobileAuthToken.data.token);
                        const userTokens = await auth().currentUser?.getIdTokenResult();
                        const userClaims = userTokens?.claims;
                        if(userClaims?.authenticatedThroughProvider === "google.com") await GoogleSignin.signInSilently();
                        const ip = await getClientIp();
                        await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ path: `util/authenticationSessions/${userCredential.user.uid}/Mobile`, writeData: { planreminder: { authenticated: true, at: { place: ip, time: Date() } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
                        });
                    }
                    else if(!planreminderMobileAuthSession.authenticated && auth().currentUser) await auth().signOut();
                    else if(planreminderMobileAuthSession.authenticated && auth().currentUser){
                        const userTokens = await auth().currentUser?.getIdTokenResult();
                        const userClaims = userTokens?.claims;
                        if(userClaims?.authenticatedThroughProvider === "google.com") await GoogleSignin.signInSilently();
                        await jobDelay(() => {
                            AsyncStorage.getItem("clientUsername").then((un) => showMessage({ message: "Welcome back, " + un }));
                            navigation.replace("UserDashboard")
                        }, 3000);
                    }
                }
            }catch(error){
                console.error(error);   
            } 
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
    }, [ width, height, themedColor ]);

    useDelayedEffect(() => {
        if(authUser.isAuthUser || auth().currentUser){
            console.log("authenticated user");
            (async () => {
                const userTokens = await auth().currentUser?.getIdTokenResult();
                const userClaims = userTokens?.claims;
                try{
                    await GoogleSignin.hasPlayServices();
                    if(userClaims?.authenticatedThroughProvider === "google.com") await GoogleSignin.signInSilently();
                }catch(error){
                    console.error(error);
                }
                showMessage({ message: "Welcome back, " + await AsyncStorage.getItem("clientUsername")});
                navigation.replace("UserDashboard");
            })();
        }
    }, [authUser.isAuthUser], 3000)

    return(
        <View style={[styles.fullPageCenter, { height: height }]}>
            {MainComponent}
            <Loading loading={loading}/>
            <ProviderWebView 
                type={providerType}
                webviewState={webviewState}
                injectedJavaScript={injectJS}
                navigation={navigation}
                cwrRegistrationType={cwrRegistrationType}
            />
        </View>
    )
}

type ProviderWebViewProps = { 
    type: string, 
    webviewState: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ], 
    injectedJavaScript?: string,
    navigation: NativeStackNavigationProp<RouteStackParamList, "Registration">,
    cwrRegistrationType: string
}
function ProviderWebView({ type, webviewState, injectedJavaScript, navigation, cwrRegistrationType }: ProviderWebViewProps) {
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
                        source={{ uri: `https://codingwithrand.vercel.app/registration?page=${cwrRegistrationType}` }}
                        injectedJavaScript={injectedJavaScript}
                        onMessage={async (e) => { 
                            const postedData = JSON.parse(e.nativeEvent.data);
                            if(postedData.authenticated){
                                setWebviewShow(false);
                                const currentUserId = await verifyUsername(postedData.username);
                                await implementMobileAuthentication(currentUserId);
                                if(postedData.newClient) showMessage({ message: "Successfully created and signed into your account"})
                                else showMessage({ message: "Welcome back, " + await AsyncStorage.getItem("clientUsername")})
                                navigation.replace("UserDashboard");
                            }else if(postedData.actionCancel){
                                setWebviewShow(false);
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
        borderRadius: 10,
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