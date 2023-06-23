<script>
  import "firebase/firestore";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    Card,
    Button,
    Label,
  } from "flowbite-svelte";
  import { deleteStoredTask } from "../../controllers/tasks";
  import {
    formatDistanceToNow,
    parseISO,
  } from "date-fns";
  
  export let openEdit;
  export let task;

</script>

<Card
on:click={openEdit(task.id)}
id="taskCard"
class={`m-2 w-auto max-w-xs h-56 overflow-hidden cursor-pointer !bg-lightnotebg dark:!bg-darknotebg border-8`}
style={`border: 4px solid ${task.color ? `${task.color}` : "transparent"}`}
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
{#if window.location.pathname === "/"}
  <p
    class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
  >
    {formatDistanceToNow(parseISO(task.updatedAt))} ago
  </p>
{/if}
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
  ><i class="bi bi-trash"></i></Button
>
</Card>
