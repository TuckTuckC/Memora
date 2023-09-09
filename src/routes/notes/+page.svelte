<script>
  import "firebase/firestore";
  
  import { setDoc, doc, getDoc } from "firebase/firestore";
  import {
    Button,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { db } from "../../lib/firebase/firebase.client";
  import { authStore } from "../../stores/authStore";
  import { notes, oldNotes } from "../../stores/store";
  import { newNote, editNote } from "../../controllers/notes";
  import { formatISO } from "date-fns";
  import NoteCard from "./noteCard.svelte";

  let title = "";
  let body = "";
  let idTemp = "";

  //   Auth connection
  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  async function openEdit(id) {
    let docSnap = await getDoc(doc(db, "notes", id));
    title = docSnap.data().title;
    body = docSnap.data().body;
    idTemp = id;
    console.log(docSnap.data());
    hidden3 = false;
    await setDoc(
      doc(db, "notes", id),
      { updatedAt: `${formatISO(new Date())}` },
      { merge: true }
    );
  }

  function reset() {
    title = "";
    body = "";
    hidden3 = true;
    hidden4 = true;
  }

  // Drawer JS
  import { sineIn } from "svelte/easing";

  let hidden4 = true;
  let hidden3 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };
</script>

{#if store.currentUser}
  <div class={`flex flex-col flex-2 w-9/12 ${window.location.pathname === "/" ?  "border-2 border-gray rounded-lg bg-zinc-100 dark:bg-neutral-800" : ""}`}>
    {#if window.location.pathname === "/"}
      <p class="text-center pb-4 text-2xl font-bold dark:text-white pt-2">
        Forgot About These?
      </p>
    {/if}
    <div
      class={`flex flex-wrap`}
    >
      {#if $notes}
        {#if $oldNotes && window.location.pathname === "/"}
          <div class="flex flex-wrap w-full pb-4 px-4">
            {#each $oldNotes as note}
              <NoteCard forgot={true} {openEdit} {note} />
            {/each}
          </div>
        {/if}
        <div class="flex flex-col w-full pt-6 px-4">
          {#if window.location.pathname === "/"}
            <p class="text-center pb-4 border-b-2 border-black text-2xl dark:text-white dark:border-white">
              Recents
            </p>
          {/if}
          <Button
            on:click={() => (hidden4 = false)}
            class="w-fit mt-6 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
            >Create New Note</Button
          >
          <div class="flex flex-row flex-wrap justify-start w-full pt-6">
            {#each $notes as note}
              <NoteCard forgot={false} {openEdit} {note} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

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
    <Button
      type="submit"
      class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
      on:click={(newNote(title, body), reset())}
      ><svg
        width="30"
        height="30"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38.4 20.7417H14C12.8954 20.7417 12 21.6371 12 22.7417V66.7417C12 67.8463 12.8954 68.7417 14 68.7417H58C59.1046 68.7417 60 67.8463 60 66.7417V42.342"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M68.0145 21.8972C68.7943 21.1174 68.7943 19.8532 68.0145 19.0734L62.3577 13.4166C61.5753 12.6342 60.3069 12.6342 59.5246 13.4166L30.6996 42.2416C28.1991 44.7421 26.5974 48.0005 26.1449 51.5077L25.7115 54.8664C25.6479 55.359 26.0674 55.7785 26.56 55.715L29.9187 55.2816C33.4259 54.829 36.6844 53.2273 39.1849 50.7268L68.0145 21.8972Z"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M52.1455 20.8037L60.6261 29.2843"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Create Note</Button
    >
  </form>
</Drawer>

<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={hidden3}
  id="sidebar3"
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
      on:click={() => (hidden3 = true)}
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
    <Button
      type="submit"
      class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
      on:click={()  => {hidden3= true; editNote(title, body, idTemp)}}
      ><svg
        width="30"
        height="30"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38.4 20.7417H14C12.8954 20.7417 12 21.6371 12 22.7417V66.7417C12 67.8463 12.8954 68.7417 14 68.7417H58C59.1046 68.7417 60 67.8463 60 66.7417V42.342"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M68.0145 21.8972C68.7943 21.1174 68.7943 19.8532 68.0145 19.0734L62.3577 13.4166C61.5753 12.6342 60.3069 12.6342 59.5246 13.4166L30.6996 42.2416C28.1991 44.7421 26.5974 48.0005 26.1449 51.5077L25.7115 54.8664C25.6479 55.359 26.0674 55.7785 26.56 55.715L29.9187 55.2816C33.4259 54.829 36.6844 53.2273 39.1849 50.7268L68.0145 21.8972Z"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M52.1455 20.8037L60.6261 29.2843"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Update Note</Button
    >
  </form>
</Drawer>

<style>
  .max-w-2 {
    max-width: 20px;
  }
  .flex-2 {
    flex: 2;
  }
</style>
