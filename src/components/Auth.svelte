<script>
  import { authHandlers, authStore } from "../stores/authStore";

  let register = false;
  let email = "";
  let password = "";
  let confirmPassword = "";

  async function handleSubmit() {
    if (!email || (!password && register && !confirmPassword)) {
      return;
    }

    if (register && password === confirmPassword) {
      try {
        await authHandlers.signup(email, password);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await authHandlers.login(email, password);
      } catch (err) {
        console.log(err);
      }
    }
    if ($authStore.currentUser) {
      window.location.href = "/privatedashboard";
    }
  }
</script>

<div class="container flex flex-col items-center justify-center flex-1">
  <h1>{register ? "Register" : "Log In"}</h1>
  <form class="flex flex-col">
    <label>
      <input bind:value={email} type="email" placeholder="Email" />
    </label>
    <label>
      <input bind:value={password} type="password" placeholder="Password" />
    </label>
    {#if register}
      <label>
        <input
          bind:value={confirmPassword}
          type="password"
          placeholder="Password"
        />
      </label>
    {/if}
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      on:click={handleSubmit}>Submit</button
    >
  </form>
  {#if register}
    <div
      on:click={() => {
        register = false;
      }}
      on:keydown={() => {}}
    >
      Already have an account?
      <p>Log In</p>
    </div>
  {:else}
    <div
      on:click={() => {
        register = true;
      }}
      on:keydown={() => {}}
    >
      Don't have an account? <p>Sign Up</p>
    </div>
    <div
      on:click={() => {
        authHandlers.resetPassword(email);
      }}
      on:keydown={() => {}}
    >
      Forgot Password?
    </div>
  {/if}
</div>

<style>
</style>
