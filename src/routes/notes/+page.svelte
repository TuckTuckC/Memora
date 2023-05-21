<script>
  import "firebase/firestore";
  import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import { Card, Button, Label, Input } from "flowbite-svelte";
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
</script>

{#if store.currentUser}
  <div>
    <div class="mb-6">
      <Label for="title" class="block mb-2">Title</Label>
      <Input id="body" size="lg" placeholder="Body" />
    </div>
    <div class="mb-6">
      <Label for="default-input" class="block mb-2">Default input</Label>
      <Input id="default-input" placeholder="Default input" />
    </div>
    <div class="mb-6">
      <Label for="large-input" class="block mb-2">Small input</Label>
      <Input size="sm" placeholder="Small input" label="Small input" />
    </div>

    <form class="w-full max-w-sm">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-title"
          >
            Title
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-title"
            type="text"
            placeholder="Title"
            bind:value={title}
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="note-body"
          >
            Body
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="note-body"
            type="text"
            placeholder="Body"
            bind:value={body}
          />
        </div>
      </div>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3" />
        <div class="md:w-2/3">
          <button
            class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            on:click={newNote}
          >
            Creat new Note
          </button>
        </div>
      </div>
    </form>

    <div>
      {#if notesList}
        {#each notesList as note}
          <Card href="/cards">
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {note.title}
            </h5>
            <p
              class="font-normal text-gray-700 dark:text-gray-400 leading-tight"
            >
              {note.body}
            </p>
            <Button color="red" on:click={deleteNote(note.id)}>Delete</Button>
          </Card>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
</style>
