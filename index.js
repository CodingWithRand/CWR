import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeApp } from '@react-native-firebase/app'
import { androidCredentials } from './asset/scripts/firebase-credentials';

initializeApp(androidCredentials, { name: 'STORAGE' });

AppRegistry.registerComponent(appName, () => App);
