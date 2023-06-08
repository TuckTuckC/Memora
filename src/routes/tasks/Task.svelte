<script>
      import {
    doc,
    getDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";
  import { authStore } from "../../stores/authStore";
  import { storeTasks, storeTasksLabels, oldTasks, labelsAdded } from "../../stores/store";
  import {
    formatDistanceToNow,
    parseISO,
  } from "date-fns";
  import {
    Card,
    Button,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
    Accordion
  } from "flowbite-svelte";
  import { newTask, editTask, deleteStoredTask } from "../../controllers/tasks";
  import { makeNewLabel, removeStoredLabel, addLabel, removeAppliedLabel } from "../../controllers/labels";

  export let openEdit;
  export let task;
</script>

<Card
on:click={openEdit(task.id)}
class="m-2 w-auto max-w-xs h-56 overflow-hidden cursor-pointer !bg-lightnotebg dark:!bg-darknotebg"
>
<h5
  class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
>
  {task.title}
</h5>
<p
  class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
>
  {task.body}
</p>
{#if task.labels}
  <div class="flex justify-start items-center gap-2 flex-wrap">
    {#each task.labels as label}
      <Label
        class="text-sm w-fit text-gray-700 block mb-2 p-2 border-solid border-2 border-white rounded dark:text-gray-400 leading-tight"
      >
        {label}
      </Label>
    {/each}
  </div>
{/if}
<Button
  color="red"
  class="w-fit mt-6 bg-redbtn dark:!bg-darkredbtn flex self-end bottom-0"
  on:click={deleteStoredTask(task.id)}
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