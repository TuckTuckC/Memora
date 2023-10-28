<script>
  import Auth from "../components/Auth.svelte";
  import Notes from "./notes/+page.svelte";
  import Tasks from "./tasks/+page.svelte";
  import { authStore } from "../stores/authStore";
  import {sendPostRequest} from '../controllers/reminders';
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div class="flex w-full content-start pt-8 px-2">
    {#if $authStore.currentUser}
    <button on:click={sendPostRequest}>Send POST Request</button>
      <Notes />
      <Tasks />
    {/if}
    {#if !$authStore.currentUser}
      <Notes />
      <Tasks />
    {/if}
  </div>
  <Auth />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
