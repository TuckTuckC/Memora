<script>
  import "firebase/firestore";
  import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    setDoc,
    doc,
    getDoc,
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
  import { dateTime, notes } from "../../stores/store";

  let title = "";
  let body = "";
  let idTemp = "";
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
      notes.set(tempNotes);
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
    hidden4 = true;
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  async function deleteNote(id) {
    await deleteDoc(doc(db, "notes", id));
  }

  async function openEdit(id) {
    let docSnap = await getDoc(doc(db, "notes", id));
    title = docSnap.data().title;
    body = docSnap.data().body;
    idTemp = id;
    console.log(docSnap.data());
    hidden3 = false;
    await setDoc(
      doc(db, "notes", id),
      { updatedAt: `${get(dateTime).date} at ${get(dateTime).time}` },
      { merge: true }
    );
  }

  async function editNote() {
    console.log("HERE", doc(db, "notes", idTemp));
    const newData = {
      body: body,
      title: title,
      updatedAt: `${get(dateTime).date} at ${get(dateTime).time}`,
    };
    await setDoc(doc(db, "notes", idTemp), newData, { merge: true });

    title = "";
    body = "";
    hidden3 = true;
    console.log(`Your doc was updated at ${newData.path}`);
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
  {#if window.location.pathname == "/"}
    I"M ON THE HOMEPAGE
  {/if}
  {#if window.location.pathname == "/notes"}
    <div class="flex flex-col flex-2 w-9/12 self-center">
      <div class="text-center flex mb-2">
        <Button
          on:click={() => (hidden4 = false)}
          class="!bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
          >Create New Note</Button
        >
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
          <Button
            type="submit"
            class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
            on:click={newNote}
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

      <div class="flex flex-wrap">
        {#if $notes}
          {#each $notes as note}
            <Card
              on:click={openEdit(note.id)}
              class="m-2 w-auto max-w-xs h-48 overflow-hidden cursor-pointer !bg-lightnotebg dark:!bg-darknotebg"
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
              <Button
                color="red"
                class="w-fit mt-6 bg-redbtn dark:!bg-darkredbtn flex self-end bottom-0"
                on:click={deleteNote(note.id)}
                ><svg
                  width="20"
                  height="20"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M61 20L56.3735 64.4144C56.1612 66.4521 54.4437 68 52.395 68H27.605C25.5563 68 23.8388 66.4521 23.6265 64.4144L19 20"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M65 20H15"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M27.8555 19.9986L33.926 12.3865H46.0747L52.1452 19.9986"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg></Button
              >
            </Card>
          {/each}
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
                on:click={editNote}
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
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  .flex-2 {
    flex: 2;
  }
</style>
