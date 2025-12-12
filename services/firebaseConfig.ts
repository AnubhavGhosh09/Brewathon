import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaTzeQP1xOrjGPTbCw35gCwm-AOpFAci8",
  authDomain: "survival-station.firebaseapp.com",
  projectId: "survival-station",
  storageBucket: "survival-station.firebasestorage.app",
  messagingSenderId: "1098061400776",
  appId: "1:1098061400776:web:9ba9e18928b59c22e8b3fd",
  measurementId: "G-2FXQ72QNGF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with experimentalForceLongPolling to bypass WebSocket issues
// which causes "Could not reach Cloud Firestore backend" errors.
export const dbInstance = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});