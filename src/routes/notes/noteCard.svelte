<script>
  import "firebase/firestore";
  import {
    Card,
    Button,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { dateTime, notes, oldNotes } from "../../stores/store";
  import { newNote, deleteNote, editNote } from "../../controllers/notes";

  import { sineIn } from "svelte/easing";

  export let note;
  export let openEdit;
</script>

<Card
  on:click={openEdit(note.id)}
  class={`m-2 w-auto ${
    window.location.pathname === "/notes" ? "max-w-[16rem]" : "max-w-[15.1rem]"
  } h-fit cursor-pointer !bg-lightnotebg dark:!bg-darknotebg`}
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    {note.title}
  </h5>
  <p
    class="font-normal text-gray-700 dark:text-gray-200 leading-tight h-fit max-h-32 overflow-auto mb-4"
  >
    {note.body}
  </p>
  <Button
    color="red"
    class="w-fit mt-0 bg-redbtn dark:!bg-darkredbtn flex self-end bottom-0"
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
