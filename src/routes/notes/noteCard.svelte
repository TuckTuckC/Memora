<script>
  import "firebase/firestore";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    Card,
    Button,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { setDoc, doc, getDoc } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import { formatISO } from "date-fns";
  import { dateTime, notes, oldNotes } from "../../stores/store";
  import { newNote, deleteNote, editNote } from "../../controllers/notes";

  import { sineIn } from "svelte/easing";

  export let note;
  export let openEdit;
  export let forgot;
</script>

<Card
  on:click={openEdit(note.id)}
  class={`m-2 w-auto ${
    window.location.pathname === "/notes" ? "max-w-[16rem]" : "max-w-[15.1rem]"
  } 
  ${
    window.location.pathname === "/" ? "bg-white" : "!bg-lightnotebg dark:!bg-darknotebg"
  }
  h-fit cursor-pointer `}
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    {note.title}
  </h5>
  <p
    class="font-normal text-gray-700 dark:text-gray-200 leading-tight min-h-fit py-2 max-h-32 overflow-auto mb-4 pr-2"
  >
    {note.body}
  </p>
  <div class='flex self-end gap-2'>
    {#if (forgot)}
    <Button
      color="yellow"
      class="w-fit mt-0 bg-yellowbtn dark:!bg-redbtn flex self-end bottom-0"
      on:click={async (e) => {
        e.stopPropagation();
        await setDoc(
          doc(db, "notes", note.id),
          { updatedAt: `${formatISO(new Date())}` },
          { merge: true }
        );
      }}
      ><i class="bi bi-arrow-down-left"></i></Button
    >
    {/if}
    <Button
      color="red"
      class="w-fit mt-0 bg-redbtn dark:!bg-darkredbtn flex self-end bottom-0"
      on:click={(e) => {e.stopPropagation(); deleteNote(note.id);}}
      ><i class="bi bi-trash text-base"></i></Button
    >
  </div>
</Card>
