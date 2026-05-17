// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase config from import.meta.env (Vite) and also allow
// REACT_APP_* keys if you supply them via a build system that exposes them.
const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "mintalitat.firebaseapp.com",
  projectId: "mintalitat",
  storageBucket: "mintalitat.firebasestorage.app",
  messagingSenderId: "ID",
  appId: "APPID",
  measurementId: "G-FY3G0HJFL3"
};

// Initialize Firebase app. If env is incomplete, this still initializes but
// will fail at runtime when calling Firebase APIs.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
