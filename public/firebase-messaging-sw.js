importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBe8SaShx7fAsylx8KXzCrP-rQ1LNIrPiM",
  authDomain: "herpill-ed1e1.firebaseapp.com",
  projectId: "herpill-ed1e1",
  storageBucket: "herpill-ed1e1.firebasestorage.app",
  messagingSenderId: "813249102643",
  appId: "1:813249102643:web:5094f17a7add0387ff7446",
  measurementId: "G-62ZE8ZJ251",
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
