import React, { useState, useEffect, useCallback, useRef } from 'react';
import { asyncDelay, jobDelay } from '../scripts/util';
import { Animated, Text, StyleProp, TextStyle, Modal, ActivityIndicator, View, useWindowDimensions, Alert, TouchableOpacity } from 'react-native';
import { FIREBASE_PERSONAL_ADMIN_KEY } from "@env"
import { retryFetch } from "../scripts/util";
import { useGlobal } from "../scripts/global";
import { GoogleSignin } from "react-native-google-signin";
import auth from "@react-native-firebase/auth"

type TypingTextPropsType= { animated?: boolean, text: string, style?: StyleProp<TextStyle>, delay: number, initialDelay?: number };
export function TypingText({ animated, text, style, delay, initialDelay }: TypingTextPropsType) {
  const [typedText, setTypedText] = useState<string>('');

  useEffect(() => {
    (async () => {
        if(initialDelay && typedText.length === 0) await asyncDelay(initialDelay)
        if(typedText !== text) await jobDelay(() => setTypedText(typedText + text[typedText.length]), delay)
    })()
  }, [typedText])
  
  return animated ? <Animated.Text style={style}>{typedText}</Animated.Text> : <Text style={style}>{typedText}</Text>
}

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
}

export function Loading({ loading }: { loading: boolean }){
  const { width, height } = useWindowDimensions();
  const { themedColor } = useGlobal();
  return(
      <Modal animationType="none" visible={loading} transparent={true}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: "absolute", zIndex: 100, top: 0, left: 0, width: width, height: height }}>
              <View style={{ flex: 1, backgroundColor: themedColor.bg, opacity: 0.5, width: width, height: height }}></View>
              <ActivityIndicator size="large" style={{ position: "absolute" }} />
          </View>
      </Modal>
  )
}

export function SignOutBTN({ navigation, guest }: { navigation: any, guest?: boolean }) {
  /* 
      Suggestion
      Make a modal that asks user whether to sign out or not.
  */
  const [ loading, setLoading ] = useState(false);
  const { themedColor } = useGlobal();
  const { width, height } = useWindowDimensions();
  async function promptSignOut(){
      try {
          setLoading(true);
          const userTokens = await auth().currentUser?.getIdTokenResult();
          const userClaims = userTokens?.claims;
          console.log(userClaims?.authenticatedThroughProvider);
          await retryFetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", { path: `util/authenticationSessions/${auth().currentUser?.uid}/Mobile`, writeData: { planreminder :{ authenticated: false, at: { place: null, time: null } } }, adminKey: FIREBASE_PERSONAL_ADMIN_KEY })
          if(auth().currentUser?.providerData.some(provider => provider.providerId === "google.com") && userClaims?.authenticatedThroughProvider === "google.com") {
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
          }
          await auth().signOut();
          setLoading(false);
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
      <>
          <TouchableOpacity onPress={() =>
            Alert.alert(
              "Info",
              `You're about to sign out. ${guest && "As being a guest user, your account will be deleted, and you won't be able to sign in again."} Do you confirm this operation?`,
              [
                { text: "Yes, I'd like to sign out", onPress: guest ? async () => {
                  await auth().currentUser?.delete();
                  navigation.replace("Registration");
                } : promptSignOut },
                { text: "Cancel", style: "cancel" },
              ]
            )
          }>
            <Text style={{ fontSize: width > height ? 25 : 15, color: themedColor.comp, padding: 15, width: "100%" }}>Sign Out</Text>
          </TouchableOpacity>
          <Loading loading={loading} />
      </>
  )
}