<script>
  import "firebase/firestore";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    Card,
    Button,
    Label,
    AccordionItem, 
    Accordion
  } from "flowbite-svelte";
  import { deleteStoredTask } from "../../controllers/tasks";
  import {
    formatDistanceToNow,
    parseISO,
  } from "date-fns";
  
  export let openEdit;
  export let task;

</script>

<!-- <Card
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
</Card> -->

<AccordionItem class='!w-full self-start dark:border-gray-400' style={`border: 4px solid ${task.color ? `${task.color}` : "transparent"}; padding-left: 0;`}>
  <span slot="header" class='flex items-center gap-4' style={`justify-content: ${window.location.pathname == "/tasks" ? "space-between" : "flex-start"}; ${window.location.pathname == "/tasks" ? "width: 100%" : ""}`}>
    <div class='flex items-center gap-2'>
      {#if task.color} 
      <Button color="dark" class={`!bg-[${task.color}] !p-1 !rounded-full w-[1rem] h-[1rem] border-2 border-black`}></Button>
      {/if}
      {#if !task.color} 
        <Button color="dark" class={`!bg-transparent !p-1 !rounded-full w-[1rem] h-[1rem] border-2 border-transparent`}></Button>
      {/if}
      <i class="bi bi-x-lg bg-transparent rounded-full text-red-500 mr-4 hover:text-red-800 hover:bg-slate-200 dark:hover:bg-slate-500 transition ease-in-out p-1" on:click={(e) => {e.stopPropagation(); deleteStoredTask(task.id)}}></i>{task.title}
    </div>
    {#if window.location.pathname == "/tasks"}
    <div class="flex justify-start items-center gap-2 mr-2">
      <div class="flex justify-start items-center gap-2 flex-wrap">
        {#each task.labels as label}
          <Label
            class="text-sm w-fit text-gray-700 block p-2 border-solid border-2 border-gray-700 rounded dark:text-gray-400 dark:border-gray-400 leading-tight"
          >
            {label}
          </Label>
        {/each}
      </div>
      {formatDistanceToNow(parseISO(task.updatedAt))} ago
    </div>
    {/if}
  </span>
  <p class="mb-2 text-gray-500 dark:text-gray-400">{task.body}</p>
  {#if window.location.pathname != "/tasks"}
    <p
      class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
    >
      {formatDistanceToNow(parseISO(task.updatedAt))} ago
    </p>
    {#if task.labels}
    <div class="flex justify-start items-center gap-2 flex-wrap">
      {#each task.labels as label}
        <Label
          class="text-sm w-fit text-gray-700 block mb-2 p-2 border-solid border-2 border-gray-700 rounded dark:text-gray-400 dark:border-gray-400 leading-tight"
        >
          {label}
        </Label>
      {/each}
    </div>
  {/if}
{/if}
</AccordionItem>

<style>
  svg {
    visibility: hidden;
  }

  .group > button {
    padding: 0 !important;
  }
</style>