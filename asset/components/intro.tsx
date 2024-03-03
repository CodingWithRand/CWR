import { useEffect } from "react";
import { jobDelay } from "../scripts/util";
import { Animated, View, Dimensions, StyleSheet, useColorScheme } from "react-native";

const { width, height } = Dimensions.get('window')

export default function Intro() {
  const logoFadingAnim = new Animated.Value(0);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    (async () => {
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
    })()
  }, [])

  return (
    <View style={styles.fullPageCenter}>
      <Animated.Image 
        source={isDark ? require('../imgs/dark-logo.png') : require('../imgs/light-logo.png')}
        style={{ width: width, height: 200, opacity: logoFadingAnim }}
        resizeMode='cover'
      />
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