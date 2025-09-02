import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBUU5JtXpxADEYR22WwADjd56EV5caxtUk",
  authDomain: "padhneai-platform.firebaseapp.com",
  projectId: "padhneai-platform",
  storageBucket: "padhneai-platform.firebasestorage.app",
  messagingSenderId: "530273085559",
  appId: "1:530273085559:web:f9cb38f59590a097403e72",
  measurementId: "G-W5VNBW7RZC"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// export const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);