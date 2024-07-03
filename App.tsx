import React, { useState } from 'react';
import { useColorScheme, SafeAreaView, StatusBar, Image, View, TouchableOpacity, useWindowDimensions, Pressable, ScrollView, Text, Alert, BackHandler, StyleSheet, Modal, FlatList, Linking, NativeModules } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Credit from './asset/components/intro/credit';
import { SignOutBTN } from './asset/components/util';
import RegistrationPage from './asset/components/intro/registration';
import { Global, useGlobal } from './asset/scripts/global';
import { GUESTPAGE, UserPage1, UserPage2} from "./asset/components/index/dashboard";
import FlashMessage from 'react-native-flash-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RouteStackParamList } from './asset/scripts/native-stack-navigation-types';
import { horizontalScale } from './asset/scripts/Metric';
import { RouteProp } from "@react-navigation/native";
import auth from "@react-native-firebase/auth"
import langs from './langs';
import SettingsApplied from './asset/components/index/settingsApplied';
import { Dashboard } from './asset/components/utility-component';

const Stack = createNativeStackNavigator();
const { BackgroundProcess, PermissionCheck } = NativeModules;

function ToolBarBTN({ navigation, guest }: { navigation: any, guest?: boolean }){
  const isDark = useColorScheme() === 'dark';
  return(
    <TouchableOpacity onPress={() => navigation.navigate("Menu", { guest: guest })}>
        {/* <a href="https://www.flaticon.com/free-icons/order" title="order icons">Order icons created by Dave Gandy - Flaticon</a> */}
        <Image style={{ width: 30, height: 30 }} 
          source={isDark ? require("./asset/imgs/dark-menu.png") : require("./asset/imgs/light-menu.png")}
        />
    </TouchableOpacity>
  )
}

function ToolBar({ navigation, route }: { navigation: NativeStackNavigationProp<RouteStackParamList, "Menu">, route: RouteProp<RouteStackParamList, "Menu"> }) {
  const isDark = useColorScheme() === 'dark';
  const { width, height } = useWindowDimensions();
  const { themedColor, lang } = useGlobal();
  const modal = {
    lang: useState(false),
    attrb: useState(false),
    help: useState(false),
  }
  
  const iconSize = width > height ? 50 : 35
  const menuFontSize = width > height ? 30 : 15

  const mutableStyles = StyleSheet.create({
    menuBtn: {
      backgroundColor: isDark ? "black" : "white",
      borderStyle: "solid",
      borderColor: isDark ? "#888" : "#ccc",
      borderTopWidth: 1,
      borderBottomWidth: 1
    },
    menuBtnText: {
      fontSize: width > height ? 25 : 15,
      color: themedColor.comp,
      padding: 15,
      width: "100%"
    },
    sectionTitle: {
      padding: 10,
      color: isDark ? "#aaa" : "#888",
    },
    row: {
      display: 'flex',
      flexDirection: "row",
      alignItems: "center",
    },
  })

  const imgSources = [
    {link:"https://www.flaticon.com/free-icons/order", title: "Order icons created by Dave Gandy - Flaticon", img: isDark ? require("./asset/imgs/dark-menu.png") : require("./asset/imgs/light-menu.png") },
    {link:"https://www.flaticon.com/free-icons/thailand", title: "Thailand icons created by Freepik - Flaticon", img: require("./asset/imgs/th.png")},
    {link:"https://www.flaticon.com/free-icons/united-states", title: "United states icons created by CorelisOP - Flaticon", img: require("./asset/imgs/en.png")},
    {link:"https://www.flaticon.com/free-icons/question-mark", title: "Question mark icons created by Fathema Khanom - Flaticon", img: require("./asset/imgs/err.png")},
    {link:"https://www.flaticon.com/free-icons/tick", title: "Tick icons created by Maxim Basinski Premium - Flaticon", img: require("./asset/imgs/check.png")},
    {link:"https://www.flaticon.com/free-icons/close", title: "Close icons created by Pixel perfect - Flaticon", img: require("./asset/imgs/close.png")},
    {link:"https://www.flaticon.com/free-icons/triangle", title: "Triangle icons created by Dave Gandy - Flaticon", img: require("./asset/imgs/arrow-down.png")},
    {link:"https://www.flaticon.com/free-icons/search", title: "Search icons created by Catalin Fertu - Flaticon", img: require("./asset/imgs/search-symbol.png")},
    {link:"https://www.flaticon.com/free-icons/user", title: "User icons created by Freepik - Flaticon", img: isDark ? require("./asset/imgs/dark-account.png") : require("./asset/imgs/light-account.png")},
    {link: "https://www.flaticon.com/free-icons/verified-badge-emoji", title: "Verified badge emoji icons created by icon wind - Flaticon", img: require("./asset/imgs/verify.png")},
  ]

  const setLang = (langCode: keyof typeof langs) => {
    if(lang.setLang) lang.setLang(langCode);
    modal.lang[1](false);
  }

  const openImageSource = (url: string) => Linking.openURL(url);

  return(
    <>
      <Pressable style={{ width: width, height: height }} onPress={() => navigation.goBack()} />
      <View style={{ position: "absolute", zIndex: 10, opacity: 1, top: 0, right: 0, width: horizontalScale(200, width), height: height, backgroundColor: isDark ? "#080808" : "#f8f8f8", elevation: 5 }}>
        <View style={[mutableStyles.row, { columnGap: 10, padding: 15 }]}>
          {/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a> */}
          <Image source={auth().currentUser?.photoURL ? { uri: auth().currentUser?.photoURL } : isDark ? require("./asset/imgs/dark-account.png") : require("./asset/imgs/light-account.png")} style={{ borderRadius: 999, width: iconSize, height: iconSize }} />
          <Text style={{ fontSize: menuFontSize, color: "deepskyblue" }}>{auth().currentUser?.displayName}</Text>
        </View>
        <View style={mutableStyles.menuBtn}>
          <TouchableOpacity onPress={() => Alert.alert(
            langs[lang.lang].license.title,
            langs[lang.lang].license.content,
            [
              { text: langs[lang.lang].license.rejectBTN, onPress: () => BackHandler.exitApp() },
              { text: langs[lang.lang].license.acceptBTN, style: "default" }
            ]
          )}>
            <Text style={mutableStyles.menuBtnText}>{langs[lang.lang].menu["licensebutton"]}</Text>
          </TouchableOpacity>
          <Modal visible={modal.attrb[0]} animationType='fade'>
            <ScrollView style={{ backgroundColor: isDark ? "black" : "white", padding: 30 }}>
              <FlatList
                keyExtractor={(source) => source.link}
                data={imgSources}
                renderItem={({ item }) => 
                  <TouchableOpacity onPress={() => openImageSource(item.link)} style={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: 10, marginVertical: 5 }}>
                    <Image source={item.img} style={{ width: 30, height: 30 }} />
                    <Text style={{ color: themedColor.comp }}>{item.title}</Text>
                  </TouchableOpacity>
                }
              />
            </ScrollView>
            <Pressable onPress={() => modal.attrb[1](false)} style={{ backgroundColor: isDark ? "black" : "white" }}>
              <Text style={{ color: themedColor.comp, textAlign: "center", fontSize: 30, marginVertical: 20 }}>X</Text>
            </Pressable>
          </Modal>
        </View>
        <View style={mutableStyles.menuBtn}>
          <TouchableOpacity onPress={() => modal.attrb[1](true)}>
            <Text style={mutableStyles.menuBtnText}>{langs[lang.lang].menu.attributionbutton}</Text>
          </TouchableOpacity>
        </View>
        <Text style={mutableStyles.sectionTitle}>{langs[lang.lang].menu["languagetext"]}</Text>
        <View style={mutableStyles.menuBtn}>
          <TouchableOpacity style={[mutableStyles.row, { paddingHorizontal: 20 }]} onPress={() => modal.lang[1](true)}>
            {/* <a href="https://www.flaticon.com/free-icons/thailand" title="thailand icons">Thailand icons created by Freepik - Flaticon</a> */}
            {/* <a href="https://www.flaticon.com/free-icons/united-states" title="united states icons">United states icons created by CorelisOP - Flaticon</a> */}
            {/* <a href="https://www.flaticon.com/free-icons/question-mark" title="question mark icons">Question mark icons created by Fathema Khanom - Flaticon</a> */}
            <Image source={
              lang.lang === "en" ? require("./asset/imgs/en.png") :
              lang.lang === "th" ? require("./asset/imgs/th.png") :
              require("./asset/imgs/err.png")
            } style={{ width: iconSize, height: iconSize }}/>
            <Text style={mutableStyles.menuBtnText}>{
              lang.lang === "en" ? langs[lang.lang].menu["englishtext"] :
              lang.lang === "th" ? langs[lang.lang].menu["thaitext"] :
              ""
            }</Text>
          </TouchableOpacity>
          <Modal visible={modal.lang[0]} animationType="fade">
            <View style={{ backgroundColor: isDark ? "black" : "white", padding: 30, height: height }}>
              <TouchableOpacity style={[mutableStyles.row, { paddingHorizontal: 20 }]} onPress={() => setLang("en")}>
                <Image source={require("./asset/imgs/en.png")} style={{ width: iconSize, height: iconSize }}/>
                <Text style={mutableStyles.menuBtnText}>{langs[lang.lang].menu["englishtext"]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[mutableStyles.row, { paddingHorizontal: 20 }]} onPress={() => setLang("th")}>
                <Image source={require("./asset/imgs/th.png")} style={{ width: iconSize, height: iconSize }}/>
                <Text style={mutableStyles.menuBtnText}>{langs[lang.lang].menu["thaitext"]}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <Text style={mutableStyles.sectionTitle}>{langs[lang.lang].menu["othertext"]}</Text>
        <View style={mutableStyles.menuBtn}>
          <TouchableOpacity onPress={() => modal.help[1](true)}>
            <Text style={mutableStyles.menuBtnText}>{langs[lang.lang].menu.helpbutton}</Text>
          </TouchableOpacity>
          <Modal visible={modal.help[0]} animationType='fade'>
            <ScrollView style={{ backgroundColor: isDark ? "black" : "white", padding: 15 }}>
              <Text style={{ marginVertical: 10, color: themedColor.comp }}>{langs[lang.lang].menu.accessibilityserviceexplain}</Text>
              <TouchableOpacity style={{ marginVertical: 20 }} onPress={async () => await PermissionCheck.requestAccessibilityServicePermission()}>
                <Text style={{ color: "red", textAlign: "center" }}>{langs[lang.lang].menu.accessibilityservicetoggle}</Text>
              </TouchableOpacity>
              <Text style={{ marginVertical: 10, color: themedColor.comp }}>{langs[lang.lang].menu.helpinquiry}</Text>
              <Text style={{ fontWeight: "bold", color: themedColor.comp }}>Email: thanwisitang7910@gmail.com</Text>
              <Text style={{ fontWeight: "bold", color: themedColor.comp }}>Facebook: Thanwisit Angsachon</Text>
              <Text style={{ fontWeight: "bold", color: themedColor.comp }}>Tel: +66 0960042389</Text>
            </ScrollView>
            <Pressable onPress={() => modal.help[1](false)} style={{ backgroundColor: isDark ? "black" : "white" }}>
              <Text style={{ color: themedColor.comp, textAlign: "center", fontSize: 30, marginVertical: 20 }}>X</Text>
            </Pressable>
          </Modal>
        </View>
        <View style={mutableStyles.menuBtn}>
          <TouchableOpacity onPress={async () => {
              await BackgroundProcess.revokeAppInForegroundEventListener();
              if(await BackgroundProcess.isInvokerRegistered()){
                  await BackgroundProcess.revokeInvokerRegistry();
              }
              Alert.alert("Success", langs[lang.lang].settingsAppliedPage.alertsuccessrevoke);
          }}>
              <Text style={[mutableStyles.menuBtnText, { color: "red", textAlign:"center" }]}>{langs[lang.lang].settingsAppliedPage.revokeAll}</Text>
          </TouchableOpacity>
        </View>
        
        <SignOutBTN navigation={navigation} guest={route.params.guest}/>
      </View>
    </>
  )
}

function Pages(){
  const isDarkMode = useColorScheme() === 'dark';
  const titleBarStyle = {
    headerStyle: { backgroundColor: isDarkMode ? "black" : "white" },
    headerTintColor: isDarkMode ? Colors.lighter : Colors.darker
  }
  const { lang } = useGlobal();

  return(
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "transparent" } }}>
      <Stack.Navigator screenOptions={{ presentation: "transparentModal" }}>
        <Stack.Screen name="Credit" component={Credit} options={{ headerShown: false }}/>
        <Stack.Screen name="Registration" component={RegistrationPage} options={{ headerShown: false }}/>
        <Stack.Screen name="GuestDashboard" component={GUESTPAGE} options={({ navigation }) => ({...titleBarStyle, title: langs[lang.lang].headerTitles.guestpage, headerRight: () => <ToolBarBTN navigation={navigation} guest/> })}/>
        <Stack.Screen name="UserDashboard" component={UserPage1} options={({ navigation }) => ({...titleBarStyle, title: langs[lang.lang].headerTitles.userpage, headerRight: () => <ToolBarBTN navigation={navigation}/> })} />
        <Stack.Screen name="UserDashboard2" component={UserPage2} options={({ navigation }) => ({...titleBarStyle, title: langs[lang.lang].headerTitles.userpage, headerRight: () => <ToolBarBTN navigation={navigation}/> })} />
        <Stack.Screen name="Menu" component={ToolBar} options={{ headerShown: false }}/>
        <Stack.Screen name="SettingsApplied" component={SettingsApplied} options={{...titleBarStyle, title: "" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return(
    <Global>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        <Pages/>      
        <FlashMessage/>
      </SafeAreaView>
    </Global>
  )
}

export default App;
