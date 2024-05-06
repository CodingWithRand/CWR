import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeApp } from '@react-native-firebase/app'
import { androidCredentials } from './asset/scripts/firebase-credentials';

initializeApp(androidCredentials, { name: 'STORAGE' });

// let MyHeadlessTask = async (event) => {
//   // Get task id from event {}:
//   let taskId = event.taskId;
//   let isTimeout = event.timeout;  // <-- true when your background-time has expired.
//   if (isTimeout) {
//     // This task has exceeded its allowed running-time.
//     // You must stop what you're doing immediately finish(taskId)
//     console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
//     BackgroundFetch.finish(taskId);
//     return;
//   }
//   console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

//   // Required:  Signal to native code that your task is complete.
//   // If you don't do this, your app could be terminated and/or assigned
//   // battery-blame for consuming too much time in background.
//   BackgroundFetch.finish(taskId);
// }

// Register your BackgroundFetch HeadlessTask
// BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
