// Import the Functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "@firebase/auth"
import { getFirestore } from "@firebase/firestore"
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPvSP1CltvHsxRmF90YnOICg-mi1Ldmio",
  authDomain: "codingwithrand-s-code-storage.firebaseapp.com",
  projectId: "codingwithrand-s-code-storage",
  storageBucket: "codingwithrand-s-code-storage.appspot.com",
  messagingSenderId: "424857888955",
  appId: "1:424857888955:web:688d65bb194273d0c1e19e",
  measurementId: "G-SB2GGMLZFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestoreDatabase = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestoreDatabase, storage }