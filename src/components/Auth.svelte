<script>
  import { authHandlers, authStore } from "../stores/authStore";
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "../lib/firebase/firebase.client";

  let register = false;
  let email = "";
  let password = "";
  let confirmPassword = "";
  let emailErr = false;
  let passErr = false;
  let confErr = false;
  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  const usersCollection = collection(db, "users");

  //   Adds the user that just registered to the users collection in Firebase
  async function newUser() {
    const newDoc = await addDoc(usersCollection, {
      email: email,
      notes: [],
      uid: store.currentUser.uid,
    });
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  async function handleSubmit() {
    // If a fiend is empty, throw an appropriate error
    if (!email || !password || (register && !confirmPassword)) {
      console.log(emailErr, passErr, confErr);
      !email ? (emailErr = true) : null;
      !password ? (passErr = true) : null;
      register && !confirmPassword ? (confErr = true) : null;
      return;
    }

    // If user is registering and registration is valid
    if (register && password === confirmPassword) {
      emailErr = false;
      passErr = false;
      confErr = false;
      try {
        // Signup with firebase
        await authHandlers.signup(email, password);
      } catch (err) {
        console.log(err);
      }
    } else {
      // Anything else and the user must be trying to Log In
      try {
        await authHandlers.login(email, password);
        register ? await newUser() : null;
      } catch (err) {
        console.log(err);
      }
    }
    // If there currently is a user in firebase, add the new user the the users collection in firestore
    if ($authStore.currentUser) {
      window.location.href = "/privatedashboard";
    }
  }
</script>

<div class="w-full max-w-xs">
  <form
    on:submit={handleSubmit}
    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
  >
    <div class="mb-4">
      <h1>{register ? "Register" : "Log In"}</h1>
      <input
        bind:value={email}
        type="email"
        placeholder="Email"
        class="appearance-none border-b-2 border-blue-300 w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-400 transition duration-200"
      />
      <p class="text-red-500 text-xs italic">
        {emailErr ? "Please choose an email." : ""}
      </p>
    </div>
    <div class="mb-6">
      <input
        bind:value={password}
        type="password"
        placeholder="Password"
        class="appearance-none border-b-2 border-blue-300 w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-400 transition duration-200"
      />
      <p class="text-red-500 text-xs italic">
        {passErr ? "Please choose a password." : ""}
      </p>
      {#if register}
        <label>
          <input
            bind:value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            class="appearance-none border-b-2 border-blue-300 w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-400 transition duration-200"
          />
          <p class="text-red-500 text-xs italic">
            {confErr ? "Please retype your password" : ""}
          </p>
        </label>
      {/if}
    </div>
    <div class="flex items-center justify-between mb-2">
      <button
        class="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
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
    <div class="flex flex-col justify-center items-center">
      {register ? "Already have an account?" : "Don't have an account?"}
      <div
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded w-fit text-sm"
        on:click={() => {
          register = !register;
        }}
        on:keydown={() => {}}
      >
        {register ? "Log In" : "Sign Up"}
      </div>
    </div>
  </form>
</div>

<style>
</style>
