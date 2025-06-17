import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIfxg_6RhtAQKn-bjxKBCJu6DjpIfbg3A",
  authDomain: "gitdock-2e74d.firebaseapp.com",
  projectId: "gitdock-2e74d",
  storageBucket: "gitdock-2e74d.firebasestorage.app",
  messagingSenderId: "681267550403",
  appId: "1:681267550403:web:20c1b99d05a16754cc6a76",
  measurementId: "G-HYK5M9SL04"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// (Optional) Enable analytics only if supported (non-SSR only)
let analytics: ReturnType<typeof getAnalytics> | undefined;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { auth, db, analytics };