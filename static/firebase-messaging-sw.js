// import { getMessaging, getToken } from "firebase/messaging";

// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// const messaging = getMessaging();
// getToken(messaging, {
//   vapidKey:
//     "BBzyveUhNV5lGswL0Ca8P4b5UFRzBafu-684XIt2-Z1jJETfGokiZobZekyD825HRj_qRLfUZRihPWPY_UU-18g",
// })
//   .then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = getMessaging(firebaseApp);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "./images/Memora.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
