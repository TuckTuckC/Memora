<script>
  import Auth from "../components/Auth.svelte";
  import Notes from "./notes/+page.svelte";
  import Tasks from "./tasks/+page.svelte";
  import { authStore } from "../stores/authStore";
  import {sendPostRequest} from '../controllers/reminders';
</script>

<svelte:head>
  <title>Memora</title>
  <meta name="description" content="Sveltekit note & task taking application" />
</svelte:head>

<section>
  <div class="flex flex-col justify-center items-center gap-2 md:flex-row md:w-full md:content-start md:items-start md:pt-8 md:px-2 md:gap-0">
    <Notes />
    <Tasks />
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
