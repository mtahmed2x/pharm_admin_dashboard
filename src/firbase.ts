import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBe8SaShx7fAsylx8KXzCrP-rQ1LNIrPiM",
  authDomain: "herpill-ed1e1.firebaseapp.com",
  projectId: "herpill-ed1e1",
  storageBucket: "herpill-ed1e1.firebasestorage.app",
  messagingSenderId: "813249102643",
  appId: "1:813249102643:web:5094f17a7add0387ff7446",
  measurementId: "G-62ZE8ZJ251",
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
