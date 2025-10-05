importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAjGB_zZn2IBsD7Se_AEMCnAx9jIUuzgPw",
  authDomain: "herpill-cbce4.firebaseapp.com",
  projectId: "herpill-cbce4",
  storageBucket: "herpill-cbce4.firebasestorage.app",
  messagingSenderId: "1025596603755",
  appId: "1:1025596603755:web:ad86c2f401b305e0d4a02e",
  measurementId: "G-DTJZGET6VV",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/login-bg.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
