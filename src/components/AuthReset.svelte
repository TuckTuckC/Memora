<script>
  import { authHandlers, authStore } from "../stores/authStore";
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { Button } from 'flowbite-svelte';

  let action = "";
  let completedAction = "";
  let newEmail = "";
  let newPass = "";

  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  async function handleSubmit() {
    completedAction = "updatePass";
    await authHandlers.resetPassword(store.currentUser.email);
  }
</script>

  {#if completedAction !== "updatePass"}
    <Button color="alternative" class="w-2/12"
      on:click={handleSubmit}>Update Password</Button
    >
  {/if}
  {#if completedAction === "updatePass"}
    <div>Your password reset email has been sent.</div>
  {/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .container form {
    display: flex;
    flex-direction: column;
  }

  .container div {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>
