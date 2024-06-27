import { useEffect, useRef, useState } from "react";
import { jobDelay } from "../../scripts/util";
import { Animated, View, useWindowDimensions, StyleSheet, useColorScheme, Alert, BackHandler, Modal, Text, ScrollView, FlatList, NativeModules, TouchableOpacity, Image } from "react-native";
import { verticalScale } from "../../scripts/Metric";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteStackParamList } from "../../scripts/native-stack-navigation-types";
import langs from '../../../langs';
import { useGlobal } from "../../scripts/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const { PermissionCheck } = NativeModules;

export default function Credit({ navigation }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Credit"> }) {
  const logoFadingAnim = useRef(new Animated.Value(0)).current
  const isDark = useColorScheme() === 'dark';
  const { lang, themedColor } = useGlobal();
  const { width, height } = useWindowDimensions()
  const [hasSetup, setHasSetup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [flagIcon, setFlagIcon] = useState(require("../../imgs/en.png"));
  const [langIndex, setLangIndex] = useState(0);
  const totalLang = ["en", "th"]

  const textStyle = { color: themedColor.comp }

  const permissionRequestExplanationTitles = [
    {
      id: "WRITE_SETTINGS",
      title: langs[lang.lang].permissionRequestPage.titles.writeSetting
    },
    {
      id: "PACKAGE_USAGE_STATS",
      title: langs[lang.lang].permissionRequestPage.titles.appUsageStats
    },
    {
      id: "ACCESSIBILITY_SERVICE",
      title: langs[lang.lang].permissionRequestPage.titles.accessibilityService
    },
    {
      id: "NOTIFICATIONS",
      title: langs[lang.lang].permissionRequestPage.titles.notifications
    }
  ]

  useEffect(() => {
    switch(totalLang[langIndex]){
      case "en": if(lang.setLang) lang.setLang("en"); setFlagIcon(require("../../imgs/en.png")); break;
      case "th": if(lang.setLang) lang.setLang("th"); setFlagIcon(require("../../imgs/th.png")); break;
    }
  }, [langIndex])

  useEffect(() => {
    (async () => {
      await (async () => {
        if(await AsyncStorage.getItem("hasSetup") === "true"){
          setHasSetup(true);
          return;
        }
        Alert.alert(
          langs[lang.lang].license.title,
          langs[lang.lang].license.content,
          [
            { text: langs[lang.lang].license.rejectBTN, onPress: () => BackHandler.exitApp() },
            { text: langs[lang.lang].license.acceptBTN, onPress: () => setShowModal(true) }
          ]
        )
      })();
      if(hasSetup){
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
      }
    })()
  }, [lang.lang, hasSetup])

  return (
    <View style={[styles.fullPageCenter, { height: height }]}>
      <Animated.Image
        source={isDark ? require('../../imgs/dark-logo.png') : require('../../imgs/light-logo.png')}
        style={{ width: "100%", height: (width > height ? height : verticalScale(200, height)), opacity: logoFadingAnim }}
        resizeMode='cover'
      />
      <Modal visible={showModal} animationType="fade">
        <ScrollView style={{ flex: 1, backgroundColor: themedColor.bg, width: width, height: height, padding: 35 }} contentContainerStyle={styles.fullPageCenter}>
          {/* Add language changing button next time */}
          <Text style={[textStyle, { fontSize: 30, marginTop: 40, marginVertical: 20 }]}>{langs[lang.lang].permissionRequestPage.header}</Text>
          <Text style={textStyle}>{langs[lang.lang].permissionRequestPage.description}</Text>
          <FlatList
            keyExtractor={(permissionRequestExplanationTitles) => permissionRequestExplanationTitles.id}
            data={permissionRequestExplanationTitles}
            renderItem={({ item }) => 
              <View style={{ marginVertical: 5 }}>
                <Text style={[{ fontWeight: "bold" }, textStyle]}>{item.title}</Text>
                <Text style={textStyle}>
                  {
                    item.id === "WRITE_SETTINGS" ? langs[lang.lang].permissionRequestPage.explanations.writeSetting :
                    item.id === "PACKAGE_USAGE_STATS" ? langs[lang.lang].permissionRequestPage.explanations.appUsageStats :
                    item.id === "ACCESSIBILITY_SERVICE" ? langs[lang.lang].permissionRequestPage.explanations.accessibilityService :
                    item.id === "NOTIFICATIONS" ? langs[lang.lang].permissionRequestPage.explanations.notifications : ""
                  }
                </Text>
              </View>
            }
          />
          <Text style={textStyle}>{langs[lang.lang].permissionRequestPage.conclusion}</Text>
          <TouchableOpacity onPress={async () => {
            if(!await PermissionCheck.checkForNotificationPermission()){
              await PermissionCheck.requestNotificationPermission()
              console.log("Notification permission is not granted");
              Alert.alert("Warning", "Notification permission is not granted yet")
              return
              // Grant by your self for now
            }else{
              console.log("Notification permission granted");
            }
            if(!await PermissionCheck.checkWriteSettingsPermission()){
              await PermissionCheck.requestWriteSettingsPermission()
              console.log("Write settings permission is not granted");
              Alert.alert("Warning", "Write settings permission is not granted yet")
              return
            }else{
              console.log("Write settings permission granted");
            }
            if(!await PermissionCheck.checkForAppUsageStatsPermission()){
              await PermissionCheck.requestUsageAccessSettingsPermission()
              console.log("Package usage stats permission is not granted");
              Alert.alert("Warning", "Package usage stats permission is not granted yet")
              return
            }else{
              console.log("Package usage stats permission granted");
            }
            if(!await PermissionCheck.checkForAccessibilityServicePermission()){
              await PermissionCheck.requestAccessibilityServicePermission()
              console.log("Accessibility service permission is not granted");
              Alert.alert("Warning", "Accessibility service permission is not granted yet")
              return
            }else{
              console.log("Accessibility service permission granted");
            }
            await AsyncStorage.setItem("hasSetup", "true");
            setHasSetup(true);
            setShowModal(false);
          }}>
            <Text style={[textStyle, { fontSize: 20, marginVertical: 40, color: "red" }]}>{langs[lang.lang].permissionRequestPage.permitBtn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ position: "absolute", top: 0, left: 0 }} onPress={() => {
            if(totalLang.length - langIndex === 1) setLangIndex(0);
            else setLangIndex(prevLangIndex => prevLangIndex += 1);
          }}>
            <Image style={{ width: 40, height: 40 }} source={flagIcon}/>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
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