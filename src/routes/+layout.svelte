<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import { auth } from "../lib/firebase/firebase.client";
  import { messaging } from "../lib/firebase/firebase";
  import { initData } from "../controllers/data";
  import { getMessaging, getToken } from "firebase/messaging";
  import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase.client";

let store;
authStore.subscribe((value) => {
  store = value;
});

async function addTokenToFirestore(token, id) {
  await setDoc(doc(db, "users", id), {FCMToken: token}, { merge: true });
}

async function setFCMToken(token) {
    onSnapshot(collection(db, "users"), (snapshot) => {
        if (store.currentUser) {
          snapshot.docs.forEach((doc) => {
            if (doc.data().uid == store.currentUser.uid) {
              // console.log('ID:', doc.data().uid);
              addTokenToFirestore(token, doc.id)
            }
          });
        }
      });

    console.log(store.currentUser);

    
  }

  async function initializeFCM() {
  // Request user's permission to send notifications.
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");

      getToken(messaging, { vapidKey: import.meta.env.VITE_VAPIDKEY }).then((currentToken) => {
        if (currentToken) {
          console.log("Token: ", currentToken);

          setFCMToken(currentToken)
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });

      // Get FCM token
      // console.log("Messaging is:", messaging);
      // if (messaging != undefined) {
      //   messaging
      //     .getToken()
      //     .then((currentToken) => {
      //       if (currentToken) {
      //         console.log("FCM Token:", currentToken);
      //         // TODO: Send the token to your server and update Firestore or whatever database you are using
      //         // For Firestore, assuming 'users' is your collection and each user has a unique 'userId'
      //         const usersCollection = collection(db, "users");
      //         const payload = { fcmToken: currentToken }; // Assume you want to store the token under the field "fcmToken"
      //         // Adding the token to Firestore (replace 'userId' with the actual user's ID)
      //         addDoc(usersCollection, payload);
      //       } else {
      //         console.log("No FCM token retrieved");
      //       }
      //     })
      //     .catch((err) => {
      //       console.log("An error occurred while retrieving token:", err);
      //     });
      // }
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

  $: {
    if ($authStore.currentUser) {
      initData();
      initializeFCM();
    }
  }
  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      authStore.update((curr) => {
        return { ...curr, isLoading: false, currentUser: user };
      });

      if (browser) {
        if (
          !$authStore?.currentUser &&
          !$authStore.isLoading &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/";
          console.log(authStore.currentUser, authStore.isLoading);
        }
      }
    });

    return unsubscribe;
  });
</script>

<div class="app dark:bg-darkbg">
  <Header />

  <main class='dark:bg-darkbg'>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    min-height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    position: absolute;
    top: 10%;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
