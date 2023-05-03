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

<div class="w-full max-w-xs">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <h1>{register ? "Register" : "Log In"}</h1>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Email
      </label>
      <input
        bind:value={email}
        type="email"
        placeholder="Email"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        bind:value={password}
        type="password"
        placeholder="Password"
        class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
      {#if register}
        <label>
          <input
            bind:value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      {/if}
      <p class="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        {register ? "Register" : "Sign In"}
      </button>
      <div
        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        href="/"
        on:click={() => {
          authHandlers.resetPassword(email);
        }}
        on:keydown={() => {}}
      >
        Forgot Password?
      </div>
    </div>
    {#if register}
      <div>
        Already have an account?
        <div
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded w-fit text-sm"
          on:click={() => {
            register = false;
          }}
          on:keydown={() => {}}
        >
          Log In
        </div>
      </div>
    {:else}
      <div class="mt-5">
        Don't have an account? <div
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded w-fit text-sm"
          on:click={() => {
            register = true;
          }}
          on:keydown={() => {}}
        >
          Sign Up
        </div>
      </div>
    {/if}
  </form>
</div>

<style>
</style>
