<script>
  import "firebase/firestore";
  import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
  } from "firebase/firestore";
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
          <div
            class="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
          >
            <h5
              class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50"
            >
              {note.title}
            </h5>
            <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
              {note.body}
            </p>
            <div
              data-te-chip-init
              data-te-ripple-init
              class={dark
                ? "[word-wrap: break-word] my-[5px] mr-4 flex h-[32px] w-fit cursor-pointer items-center justify-between rounded-[16px] border border-[#332d2d] bg-[#eceff1] bg-[transparent] px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none transition-[opacity] duration-300 ease-linear hover:border-[#332d2d] hover:!shadow-none dark:text-neutral-200"
                : "[word-wrap: break-word] my-[5px] mr-4 flex h-[32px] w-fit cursor-pointer items-center justify-between rounded-[16px] border border-[#fbfbfb] bg-[#eceff1] bg-[transparent] px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none transition-[opacity] duration-300 ease-linear hover:border-[#fbfbfb] hover:!shadow-none dark:text-neutral-200"}
              data-te-ripple-color="light"
            >
              Label
              <span
                data-te-chip-close
                class="float-right w-4 cursor-pointer pl-[8px] text-[16px] text-[#afafaf] opacity-[.53] transition-all duration-200 ease-in-out hover:text-[#8b8b8b] dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-3 w-3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
            <button
              type="button"
              class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              data-te-ripple-init
              data-te-ripple-color="light"
              on:click={deleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
</style>
