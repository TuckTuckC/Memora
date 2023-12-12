<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";
  import { authStore } from "../../stores/authStore";
  import { storeTasks, storeTasksLabels, oldTasks, labelsAdded, colors, guestTasks, guestOldTasks, guestTaskLabels, guestLabelsAdded, guestStoreTasksLabels } from "../../stores/store";
  import {
    formatDistanceToNow,
    parseISO,
    formatISO
  } from "date-fns";
  import {
    Card,
    Button,
    ButtonGroup,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
    Accordion,
    AccordionItem,
  } from "flowbite-svelte";
  import { newTask, editTask } from "../../controllers/tasks";
  import { makeNewLabel, removeStoredLabel, addLabel, removeAppliedLabel } from "../../controllers/labels";
  import Task from './Task.svelte';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';
  import { v4 as uuidv4 } from 'uuid';

  const buttonColors = ["#9BABB8","#5C8984","#FCF9BE","#FF8787","#537188","#E8A0BF","#B2A4FF","#A7727D"];

  let displayMore;
  let idTemp = "";

  let title = "";
  let body = "";
  let labelName = "";
  let colorSel = "";
  let store;
  authStore.subscribe((value) => {
    store = value;
  }); 

  function reset() {
    title = "";
    body = "";
    colorSel = "";
    labelsAdded.set([]);
  }

  function resetLabel() {
    labelName = "";
  }

  async function openEdit(id) {
    let docSnap = await getDoc(doc(db, "tasks", id));
    title = docSnap.data().title;
    body = docSnap.data().body;
    labelsAdded.set(docSnap.data().labels);
    idTemp = id;
  }

  function guestDeleteTask(taskId) {
    const gottenGuestTasks = get(guestTasks);
    const taskToDeleteIndex = gottenGuestTasks.findIndex(x => x.id === taskId);
    gottenGuestTasks.splice(taskToDeleteIndex, 1);
    guestTasks.set(gottenGuestTasks);
  }
  function guestDeleteOldTask(taskId) {
    const gottenGuestOldTasks = get(guestOldTasks);
    const taskToDeleteIndex = gottenGuestOldTasks.findIndex(x => x.id === taskId);
    gottenGuestOldTasks.splice(taskToDeleteIndex, 1);
    guestOldTasks.set(gottenGuestOldTasks);
  }
  function guestNewTask({guestLabelsAdded, body, title, colorSel}) {
    const gottenGuestTasks = get(guestTasks);
    const newTask = {
      id: uuidv4(),
      body: body,
      createdAt: `${formatISO(new Date())}`,
      title: title,
      updatedAt: `${formatISO(new Date())}`,
      user_id: "dummydata@fake.com",
      color: colorSel,
      labels: get(guestLabelsAdded),
    }
    gottenGuestTasks.unshift(newTask);
    guestTasks.set(gottenGuestTasks);
    guestLabelsAdded.set([]);
  }
  function guestEditTask() {

  }
  function guestOpenEdit() {

  }
  function guestMakeNewLabel(guestNewLabelName) {
    let namesToCheck = [];
    const gottenGuestStoredLabels = get(guestStoreTasksLabels)
    gottenGuestStoredLabels.forEach((d) => {
      namesToCheck.push(d.labelName);
    });
    if (namesToCheck.includes(guestNewLabelName.labelName)) {
      console.log(
        "No can do, this label is already applied and we don't want duplicates"
      );
    } else {
      console.log("Adding this label: ", guestNewLabelName.labelName);
      gottenGuestStoredLabels.push(guestNewLabelName);
      guestLabelsAdded.set([guestNewLabelName.labelName]);
      guestStoreTasksLabels.set(gottenGuestStoredLabels);
    }
  }
  function guestRemoveStoredLabel() {

  }
  function guestAddLabel() {

  }
  function guestRemoveAppliedLabel() {

  }
  // $: console.log($oldTasks)

  function handleColor(d) {
    console.log(d);
    colorSel = d;
  }
</script>

{#if browser}
  {#if store.currentUser}
    {#if window.location.pathname == "/"}
      <div class="flex flex-col flex-1 border-2 border-gray rounded-lg p-2 w-full md:w-9/12 md:ml-4 bg-blue-50 dark:text-white dark:bg-blue-950">
        <div class="flex flex-col justify-center items-center">
          {#if $storeTasks}
            <div class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Upcoming Tasks
            </div>
            <hr class="w-48 h-1 mx-auto my-4 bg-gray-800 border-0 rounded md:my-4 dark:bg-gray-100"/>
            <div class="mb-2 p-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
              These have been here a while...
            </div>
            <div class='flex flex-col w-full px-6'>
              {#if $oldTasks}
                {#each $oldTasks as task}
                  <Task {openEdit} {task} />
                {/each}
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
    {#if window.location.pathname == "/tasks"}
      <div class="relative md:grid md:grid-cols-5 md:pt-8 dark:text-white">
        <div class="col-span-2">
          <div class="text-center flex flex-col px-4 sticky h-fit top-32 left-0">
            <div>
              <div class="mb-6">
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Title"
                  bind:value={title}
                />
              </div>
              <div class="flex">
                <div>
                  <div class="mb-2">
                    <Label for="body" class="mb-2">Body</Label>
                    <Textarea
                      id="message"
                      placeholder="Write task body..."
                      rows="4"
                      name="message"
                      bind:value={body}
                    />
                  </div>
                  <div class="mb-2">
                    <Label for="newLabel" class="block mb-2">New Label</Label>
                    <Input
                      id="newLabel"
                      name="newLabel"
                      placeholder="New Label"
                      bind:value={labelName}
                    />
                  </div>
                  <Button
                    class="w-fit m-4 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                    on:click={() => {makeNewLabel({labelName}), resetLabel()}}>Create Label</Button
                  >
                  <div class="mb-2">
                    <Label for="body" class="mb-2">Applied Labels</Label>
                    <div class="flex flex-col gap-2 items-center">
                      {#each $labelsAdded as labelAdded}
                        <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded">
                          <div>
                            <div>{labelAdded}</div>
                          </div>
                          <i on:click={removeAppliedLabel(labelAdded)} class="bi bi-x"></i>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
                <div>
                  <ButtonGroup class="flex justify-center items-center gap-2">
                    {#each buttonColors as buttonColor}
                      <Button on:click={() => handleColor(buttonColor)} color="dark" class={`!bg-[${buttonColor}] !p-1 !rounded-full w-[1rem] h-[1rem] border-2 border-transparent hover:border-black dark:hover:border-white transition ease-in-out`}></Button>
                    {/each}
                  </ButtonGroup>
                  {#if $storeTasksLabels}
                  <div class="flex flex-col">
                    <Label for="body" class="mb-2">Your Labels</Label>
                      <div class="ml-2 mb-6 grid grid-cols-2 gap-2 justify-center items-center p-2">
                        {#each $storeTasksLabels as label}
                          <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center justify-self-start items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 pl-2 rounded">
                            <div on:click={addLabel({labelName: label.labelName})}>
                              <div>{label.labelName} </div>
                            </div>
                            <i on:click={removeStoredLabel(label.labelName)} class="bi bi-x"></i>
                          </div>
                        {/each}
                      </div>
                  </div>
                  {/if}
                </div>
              </div>
                  <Button
                    class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                    on:click={() => {newTask({labelsAdded, body, title, colorSel}), reset()}}
                    ><i class="bi bi-clipboard-plus-fill mr-2"></i>
                    Create Task
                  </Button>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center md:col-span-3">
          {#if $storeTasks}
            {#each $storeTasks as task}
              <Task {task} {openEdit}/>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/if}
  {#if !store.currentUser}
    {#if window.location.pathname == "/"}
      <div class="flex flex-col flex-1 border-2 border-gray rounded-lg p-2 w-full md:w-9/12 md:ml-4 bg-blue-50 dark:text-white dark:bg-blue-950">
        <div class="flex flex-col justify-center items-center">
          {#if $guestTasks}
            <div class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Upcoming Tasks
            </div>
            <hr class="w-48 h-1 mx-auto my-4 bg-gray-800 border-0 rounded md:my-4 dark:bg-gray-100"/>
            <div class="mb-2 p-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
              These have been here a while...
            </div>
            <div class='flex flex-col w-full px-6'>
              {#if $guestOldTasks}
                {#each $guestOldTasks as task}
                  <Task {openEdit} {task} {guestDeleteOldTask} />
                {/each}
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
    {#if window.location.pathname == "/tasks"}
      <div class="relative md:grid md:grid-cols-5 md:pt-8 dark:text-white">
        <div class="col-span-2">
          <div class="text-center flex flex-col px-4 sticky h-fit top-32 left-0">
            <div>
              <div class="mb-4 md:mb-6">
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Title"
                  bind:value={title}
                />
              </div>
              <div class="flex flex-col">
                <div>
                  <div class="mb-2">
                    <Label for="body" class="mb-2">Body</Label>
                    <Textarea
                      id="message"
                      placeholder="Write task body..."
                      rows="4"
                      name="message"
                      bind:value={body}
                    />
                  </div>
                  <div class="mb-2">
                    <Label for="newLabel" class="block mb-2">New Label</Label>
                    <Input
                      id="newLabel"
                      name="newLabel"
                      placeholder="New Label"
                      bind:value={labelName}
                    />
                  </div>
                  <Button
                    class="w-fit m-4 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                    on:click={() => {guestMakeNewLabel({labelName}), resetLabel()}}>Create Label
                  </Button>
                  <div class="mb-2">
                    <Label for="body" class="mb-2">Applied Labels</Label>
                    <div class="flex flex-col gap-2 items-center">
                      {#if $guestLabelsAdded.length > 0}
                        {#each $guestLabelsAdded as labelAdded}
                          <div
                            class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded"
                          >
                          <div>
                            <div>{labelAdded} </div>
                          </div>
                            <i on:click={removeAppliedLabel(labelAdded)} class="bi bi-x"></i>
                          </div>
                        {/each}
                      {/if}
                    </div>
                  </div>
                </div>
                <div>
                  <ButtonGroup class="mt-2 md:mt-0 flex justify-center items-center gap-2">
                    {#each buttonColors as buttonColor}
                      <Button on:click={() => handleColor(buttonColor)} color="dark" class={`!bg-[${buttonColor}] !p-1 !rounded-full w-[1rem] h-[1rem] border-2 border-transparent hover:border-black dark:hover:border-white transition ease-in-out`}></Button>
                    {/each}
                  </ButtonGroup>
                  {#if $guestStoreTasksLabels.length > 0}
                  <div class="flex flex-col">
                    <Label for="body" class="mb-2">Your Labels</Label>
                      <div class="ml-2 mb-6 grid grid-cols-2 gap-2 justify-center items-center p-2">
                        {#each $guestStoreTasksLabels as label}
                          <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center justify-self-start items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 pl-2 rounded">
                            <div on:click={addLabel({labelName: label.labelName})}>
                              <div>{label.labelName} </div>
                            </div>
                            <i on:click={removeStoredLabel(label.labelName)} class="bi bi-x"></i>
                          </div>
                        {/each}
                      </div>
                  </div>
                  {/if}
                </div>
              </div>
                <Button
                  class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                  on:click={() => {guestNewTask({guestLabelsAdded, body, title, colorSel}), reset()}}
                  ><i class="bi bi-clipboard-plus-fill mr-2"></i>
                  Create Task</Button
                >
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center md:col-span-3">
          {#if $guestTasks}
            {#each $guestTasks as task}
              <Task {task} {openEdit} {guestDeleteTask}/>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/if}
{/if}

<style>
</style>
