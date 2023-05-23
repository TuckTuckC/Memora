<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import { auth } from "../lib/firebase/firebase.client";

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

  <main>
    <slot />
  </main>

  <footer>
    <p>
      visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
    </p>
  </footer>
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
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
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
