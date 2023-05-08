<script>
  import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";
  import { dateTime } from "../../stores/store";
  let title = "";
  let body = "";
  $: notes = [];
  let store;
  authStore.subscribe((value) => {
    store = value;
  });
  console.log("datetime", get(dateTime));
  console.log(`${get(dateTime).date} at ${get(dateTime).time}`);
  const notesCollection = collection(db, "notes");

  function newNote() {
    const newDoc = addDoc(notesCollection, {
      body: body,
      createdAt: `${get(dateTime).date} at ${get(dateTime).time}`,
      title: title,
      updatedAt: `${get(dateTime).date} at ${get(dateTime).time}`,
      user_id: store.currentUser.uid,
    });
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  onSnapshot(collection(db, "notes"), (snapshot) => {
    let notes = [];
    snapshot.docs.forEach((doc) => {
      notes.push({ ...doc.data() });
    });
    console.log(notes);
    return notes;
  });
</script>

<div>
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
    {notes.length}
    {notes}
    {#each notes as note}
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img
          class="w-full"
          src="/img/card-top.jpg"
          alt="Sunset in the mountains"
        />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{note.title}</div>
          <p class="text-gray-700 text-base">{note.body}</p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#photography</span
          >
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#travel</span
          >
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#winter</span
          >
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
</style>
