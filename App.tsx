import React from 'react';
import { useColorScheme, SafeAreaView, StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Credit from './asset/components/intro/credit';
import Dashboard from './asset/components/index/dashboard';
import RegistrationPage from './asset/components/intro/registration';
import { Global } from './asset/scripts/global';
import { GUESTPAGE, UserPage1, UserPage2} from "./asset/components/index/ui";

const Stack = createNativeStackNavigator();

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

        <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "transparent" } }}>
          <Stack.Navigator screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Credit" component={Credit} options={{ headerShown: false }}/>
            <Stack.Screen name="Registration" component={RegistrationPage} options={{ headerShown: false }}/>
            <Stack.Screen name="GuestDashboard" component={GUESTPAGE} />
            <Stack.Screen name="UserDashboard" component={UserPage1} />
            <Stack.Screen name="UserDashboard2" component={UserPage2} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Global>
  )
}

export default App;
