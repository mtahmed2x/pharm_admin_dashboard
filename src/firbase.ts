import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAjGB_zZn2IBsD7Se_AEMCnAx9jIUuzgPw",
  authDomain: "herpill-cbce4.firebaseapp.com",
  projectId: "herpill-cbce4",
  storageBucket: "herpill-cbce4.firebasestorage.app",
  messagingSenderId: "1025596603755",
  appId: "1:1025596603755:web:ad86c2f401b305e0d4a02e",
  measurementId: "G-DTJZGET6VV",
};

export const getFirebaseMessaging = (): Messaging | null => {
  // Check if we're on the client side (the browser)
  if (typeof window !== "undefined") {
    // Initialize the app if it doesn't already exist
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // Return the messaging instance
    return getMessaging(app);
  }

  // Return null if on the server side
  return null;
};
