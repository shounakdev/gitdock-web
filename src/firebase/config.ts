import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIfxg_6RhtAQKn-bjxKBCJu6DjpIfbg3A",
  authDomain: "gitdock-2e74d.firebaseapp.com",
  projectId: "gitdock-2e74d",
  storageBucket: "gitdock-2e74d.appspot.com",
  messagingSenderId: "681267550403",
  appId: "1:681267550403:web:20c1b99d05a16754cc6a76",
  measurementId: "G-HYK5M9SL04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);
