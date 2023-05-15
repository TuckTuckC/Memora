<script>
  import "firebase/firestore";
  import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import {
    Card,
    Button,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { db } from "../../lib/firebase/firebase.client";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";
  import { dateTime } from "../../stores/store";

  let title = "";
  let body = "";
  let notesList;
  let dark = true;

  //   Auth connection
  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  console.log("datetime", get(dateTime));
  console.log(`${get(dateTime).date} at ${get(dateTime).time}`);

  //   Get and display all notes
  const notesCollection = collection(db, "notes");

  onSnapshot(notesCollection, (snapshot) => {
    if (store.currentUser) {
      let tempNotes = [];
      snapshot.docs.forEach((doc) => {
        doc.data().user_id == store.currentUser.uid
          ? tempNotes.push({ ...doc.data(), id: doc.id })
          : null;
      });
      notesList = tempNotes;
    }
  });

  function newNote() {
    const newDoc = addDoc(notesCollection, {
      body: body,
      createdAt: `${get(dateTime).date} at ${get(dateTime).time}`,
      title: title,
      updatedAt: `${get(dateTime).date} at ${get(dateTime).time}`,
      user_id: store.currentUser.uid,
    });
    title = "";
    body = "";
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  async function deleteNote(id) {
    await deleteDoc(doc(db, "notes", id));
  }

  // Drawer JS
  import { sineIn } from "svelte/easing";

  let hidden4 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };
</script>

{#if store.currentUser}
  <div>
    <div class="text-center flex mb-2">
      <Button on:click={() => (hidden4 = false)}>Create New Note</Button>
    </div>
    <Drawer
      transitionType="fly"
      {transitionParams}
      bind:hidden={hidden4}
      id="sidebar4"
    >
      <div class="flex items-center">
        <h5
          id="drawer-label"
          class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          <svg
            class="w-5 h-5 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            /></svg
          >New event
        </h5>
        <CloseButton
          on:click={() => (hidden4 = true)}
          class="mb-4 dark:text-white"
        />
      </div>
      <form action="#" class="mb-6">
        <div class="mb-6">
          <Label for="title" class="block mb-2">Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Title"
            bind:value={title}
          />
        </div>
        <div class="mb-6">
          <Label for="body" class="mb-2">Body</Label>
          <Textarea
            id="message"
            placeholder="Write note body..."
            rows="4"
            name="message"
            bind:value={body}
          />
        </div>
        <Button type="submit" class="w-full" on:click={newNote}
          ><svg
            class="w-5 h-5 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            /></svg
          > Create Note</Button
        >
      </form>
    </Drawer>

    <div class="flex flex-wrap">
      {#if notesList}
        {#each notesList as note}
          <Card
            href="/cards"
            class="m-2 w-auto max-w-xs bg-lightnotebg dark:bg-darknotebg"
          >
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {note.title}
            </h5>
            <p
              class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
            >
              {note.body}
            </p>
            <Button color="red" class="w-fit" on:click={deleteNote(note.id)}
              >Delete</Button
            >
          </Card>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
</style>
