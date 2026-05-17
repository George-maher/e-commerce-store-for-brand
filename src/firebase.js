// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase config from import.meta.env (Vite) and also allow
// REACT_APP_* keys if you supply them via a build system that exposes them.
const firebaseConfig = {
  apiKey: "AIzaSyBAuSv_-YPC9hfHXVHYZdtU3g37J6CI6XM",
  authDomain: "mintalitat.firebaseapp.com",
  projectId: "mintalitat",
  storageBucket: "mintalitat.firebasestorage.app",
  messagingSenderId: "645579050720",
  appId: "1:645579050720:web:6b867034de752b0d9c8a85",
  measurementId: "G-FY3G0HJFL3"
};

// Initialize Firebase app. If env is incomplete, this still initializes but
// will fail at runtime when calling Firebase APIs.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };