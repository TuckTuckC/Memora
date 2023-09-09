<script>
  import { authHandlers, authStore } from "../stores/authStore";
  import { collection, addDoc, onSnapshot } from "firebase/firestore";
  import { db } from "../lib/firebase/firebase.client";
  import { dateTime, notes, oldNotes, signModalState } from "../stores/store";

  import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";

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
        // Check if registering
        register ? await newUser() : null;
      } catch (err) {
        console.log(err);
      }
    }
    // If there currently is a user in firebase, add the new user the the users collection in firestore
    if ($authStore.currentUser) {
      signModalState.set(false);

      // Get NOTES
      const notesCollection = collection(db, "notes");

      onSnapshot(notesCollection, (snapshot) => {
        if (store.currentUser) {
          let tempNotes = [];
          let tempOldNotes = [];
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          snapshot.docs.forEach((doc) => {
            let note = { ...doc.data(), id: doc.id };
            if (doc.data().user_id == store.currentUser.uid) {
              tempNotes.push(note);
              parseISO(note.updatedAt) <= oneWeekAgo
                ? tempOldNotes.push(note)
                : null;
            }
          });
          oldNotes.set(tempOldNotes);
          console.log("OLD NOTES", tempOldNotes);
          tempNotes.sort((a, b) =>
            compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))
          );
          console.log(tempNotes);
          notes.set(tempNotes);
        }
      });

      const eventsCollection = collection(db, "events");
      const userDaysCollection = collection(db, "userDays");

      onSnapshot(eventsCollection, (snapshot) => {
        if (store.currentUser) {
          let tempEvents = [];
          snapshot.docs.forEach((doc) => {
            let event = { ...doc.data(), id: doc.id };
            doc.data().uid == store.currentUser.uid
              ? tempEvents.push(event)
              : null;
          });
          tempEvents.sort((a, b) =>
            compareDesc(parseISO(a.start), parseISO(b.start))
          );
          events.set(tempEvents);
        }
      });

      register = false;
      email = "";
      password = "";
      confirmPassword = "";
      window.location.href = "/";
    }
  }
</script>

<Modal
  id="form-modal"
  bind:open={$signModalState}
  size="xs"
  autoclose={false}
  class="w-full"
>
  <form class="flex flex-col space-y-6" on:submit={handleSubmit}>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      {register ? "Register" : "Log In"}
    </h3>
    <Label class="space-y-2">
      <span>Email</span>
      <Input
        type="email"
        name="email"
        placeholder="name@company.com"
        bind:value={email}
        required
      />
      <p class="text-red-500 text-xs italic">
        {emailErr ? "Please choose an email." : ""}
      </p>
    </Label>
    <Label class="space-y-2">
      <span>Your password</span>
      <Input
        type="password"
        name="password"
        placeholder="•••••"
        bind:value={password}
        required
      />
      <p class="text-red-500 text-xs italic">
        {passErr ? "Please choose a password." : ""}
      </p>
    </Label>
    {#if register}
      <Label class="space-y-2">
        <span>Your password</span>
        <Input
          type="password"
          name="password"
          placeholder="•••••"
          bind:value={confirmPassword}
          required
        />
        <p class="text-red-500 text-xs italic">
          {confErr ? "Please repeat your password." : ""}
        </p>
      </Label>
    {/if}
    <div class="flex items-start">
      <!-- <Checkbox>Remember me</Checkbox> -->
    </div>
    <Button type="submit" class="w-full1"
      >{register ? "Register" : "Sign In"}</Button
    >
    <div class=" flex text-sm font-medium text-gray-500 dark:text-gray-300">
      {register ? "Already Have an account?" : "Not Registered?"}<a
        href="/"
        class="text-blue-700 hover:underline dark:text-blue-500"
        on:click={() => {
          register = !register;
        }}
        on:keydown={() => {}}>{register ? "Log In" : "Sign Up"}</a
      >
      <a
        href="/"
        class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
        on:click={() => {
          authHandlers.resetPassword(email);
        }}
        on:keydown={() => {}}>Lost password?</a
      >
    </div>
  </form>
</Modal>

<style>
</style>
