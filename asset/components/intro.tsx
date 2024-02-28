import { useEffect, useState } from "react";
import { jobDelay } from "../scripts/util";
import { TypingText } from "./util";
import { Animated, View, Dimensions, StyleSheet, Easing } from "react-native";

const { width, height } = Dimensions.get('window')

export default function Intro({ isDark }: { isDark: boolean }) {
  const registered = false; // Placeholder for now
  const logoFadingAnim = new Animated.Value(0);
  const logoTransformingAnim = {
    translateY: new Animated.Value(0),
    scale: new Animated.Value(1),
  };
  const appNameFadingAnim = new Animated.Value(0);
  const [presentingLogo, setPL] = useState<JSX.Element>();

  useEffect(() => {
    (async () => {
      setPL(
        <Animated.Image 
          source={isDark ? require('../imgs/dark-logo.png') : require('../imgs/light-logo.png')}
          style={{ width: width, height: 200, opacity: logoFadingAnim }}
          resizeMode='cover'
        />
      );
      await jobDelay(() => {
        Animated.timing(logoFadingAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 1000);
      await jobDelay(() => {
        Animated.timing(logoFadingAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 1500);
      
      await jobDelay(() => {
        setPL(
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
        );
      }, 2000)
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
    })()
  }, [])

  return (
    <View style={styles.fullPageCenter}>
      {presentingLogo}
    </View>
  );
}

const styles = StyleSheet.create({
    fullPageCenter: {
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      height: height
    }
});