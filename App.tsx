import React from 'react';
import { useColorScheme, SafeAreaView, StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Credit from './asset/components/intro/credit';
import { SignOutBTN } from './asset/components/util';
import RegistrationPage from './asset/components/intro/registration';
import { Global } from './asset/scripts/global';
import { GUESTPAGE, UserPage1, UserPage2} from "./asset/components/index/ui";
import FlashMessage from 'react-native-flash-message';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };
  const titleBarStyle = {
    headerStyle: { backgroundColor: isDarkMode ? "black" : "white" },
    headerTintColor: isDarkMode ? Colors.lighter : Colors.darker
  }

  return(
    <Global>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "transparent" } }}>
          <Stack.Navigator screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Credit" component={Credit} options={{ headerShown: false }}/>
            <Stack.Screen name="Registration" component={RegistrationPage} options={{ headerShown: false }}/>
            <Stack.Screen name="GuestDashboard" component={GUESTPAGE} />
            <Stack.Screen name="UserDashboard" component={UserPage1} options={({ navigation }) => ({...titleBarStyle, headerRight: () => <SignOutBTN navigation={navigation}/> })} />
            <Stack.Screen name="UserDashboard2" component={UserPage2} />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage/>
      </SafeAreaView>
    </Global>
  )
}

export default App;
