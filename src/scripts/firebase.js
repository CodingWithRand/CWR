// Import the Functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "@firebase/auth"
import { getFirestore } from "@firebase/firestore"
import { getStorage } from '@firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB25iNk5zg1-jijl0Mfs9wtUytTdqv0yZA",
  authDomain: "cwr-education.firebaseapp.com",
  projectId: "cwr-education",
  storageBucket: "cwr-education.appspot.com",
  messagingSenderId: "694237489250",
  appId: "1:694237489250:web:b66f7953605c10827b493b",
  measurementId: "G-DPQP86HGS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestoreDatabase = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestoreDatabase, storage }