import React, { useEffect, useState } from 'react';
import { useColorScheme, SafeAreaView, StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RegistrationPage } from './asset/components/registration';
import { jobDelay } from './asset/scripts/util';
import Intro from './asset/components/intro';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [ currentPage, setCurrentPage ] = useState<JSX.Element>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    (async () => {
      setCurrentPage(<Intro/>);
      await jobDelay(() => setCurrentPage(<RegistrationPage/>), 4000);
    })();
  }, [])

  return(
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {currentPage}
    </SafeAreaView>
  )
}

export default App;
