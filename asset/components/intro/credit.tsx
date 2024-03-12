import { useEffect } from "react";
import { jobDelay } from "../../scripts/util";
import { Animated, View, useWindowDimensions, StyleSheet, useColorScheme } from "react-native";
import { verticalScale } from "../../scripts/Metric";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";

export default function Credit({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Credit"> }) {
  const logoFadingAnim = new Animated.Value(0);
  const isDark = useColorScheme() === 'dark';
  const { width, height } = useWindowDimensions()

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
      await jobDelay(() => navigation.replace("Registration"), 2000);
    })()
  }, [])

  return (
    <View style={[styles.fullPageCenter, { height: height }]}>
      <Animated.Image
        source={isDark ? require('../../imgs/dark-logo.png') : require('../../imgs/light-logo.png')}
        style={{ width: "100%", height: (width > height ? height : verticalScale(200, height)), opacity: logoFadingAnim }}
        resizeMode='cover'
      />
    </View>
  );
}

const styles = StyleSheet.create({
    fullPageCenter: {
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'
    }
});