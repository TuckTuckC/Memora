<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import { auth } from "../lib/firebase/firebase.client";
  import { initData } from "../controllers/data";

  import { getMessaging, getToken, onMessage } from "firebase/messaging";

  $: {
    if ($authStore.currentUser) {
      initData();
    }
  }

  onMount(() => {

    const messaging = getMessaging();
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // Get the messaging token
        getToken(messaging).then((token) => {
          console.log('Token:', token);
          // Store this token in Firestore under the user's document
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
      }})

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
