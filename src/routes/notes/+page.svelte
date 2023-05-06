<script>
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";
  import { authStore } from "../../stores/authStore";

  let title = "";
  let body = "";
  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  const notesCollection = collection(db, "notes");

  async function newNote() {
    const newDoc = await addDoc(notesCollection, {
      body: body,
      title: title,
      user_id: store.currentUser.uid,
    });
    console.log(`Your doc was created at ${newDoc.path}`);
  }
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
</div>

<style>
</style>
