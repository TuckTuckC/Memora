<script>
  import { auth } from "../firebase";

  let email = "";
  let password = "";

  async function handleLogin() {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect the user to the home page
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
  <label for="email">Email:</label>
  <input type="email" id="email" bind:value={email} required />

  <label for="password">Password:</label>
  <input type="password" id="password" bind:value={password} required />

  <button type="submit">Login</button>
</form>
