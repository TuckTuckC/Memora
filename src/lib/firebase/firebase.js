import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
let messaging;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}
export { messaging };

// export async function initializeFCM(messaging) {
//   // Request user's permission to send notifications.
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");

//       // Get FCM token
//       console.log("Messaging is:", messaging);
//       if (messaging != "undefined") {
//         messaging
//           .getToken()
//           .then((currentToken) => {
//             if (currentToken) {
//               console.log("FCM Token:", currentToken);
//               // TODO: Send the token to your server and update Firestore or whatever database you are using
//               // For Firestore, assuming 'users' is your collection and each user has a unique 'userId'
//               const usersCollection = collection(db, "users");
//               const payload = { fcmToken: currentToken }; // Assume you want to store the token under the field "fcmToken"
//               // Adding the token to Firestore (replace 'userId' with the actual user's ID)
//               addDoc(usersCollection, payload);
//             } else {
//               console.log("No FCM token retrieved");
//             }
//           })
//           .catch((err) => {
//             console.log("An error occurred while retrieving token:", err);
//           });
//       }
//     } else {
//       console.log("Unable to get permission to notify.");
//     }
//   });
// }
