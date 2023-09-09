<script>
    import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";
  import { authStore } from "../../stores/authStore";
  import { storeTasks, storeTasksLabels, oldTasks, labelsAdded, colors } from "../../stores/store";
  import {
    formatDistanceToNow,
    parseISO,
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

  import {get} from 'svelte/store';

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
    hidden4 = true;
    hidden3 = true;
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
    hidden3 = false;
  }

  $: console.log($oldTasks)

  function handleColor(d) {
    console.log(d);
    colorSel = d;
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
    <div class="flex flex-col flex-1">
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
            >New Task
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
              placeholder="Write task body..."
              rows="4"
              name="message"
              bind:value={body}
            />
          </div>
          <div class="mb-6">
            <Label for="newLabel" class="block mb-2">New Label</Label>
            <Input
              id="newLabel"
              name="newLabel"
              placeholder="New Label"
              bind:value={labelName}
            />
          </div>
          <Button
            class="w-2/5 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
            on:click={() => {makeNewLabel({labelName}), resetLabel()}}>Create Label</Button
          >

          <div class="mb-6">
            <Label for="body" class="mb-2">Applied Labels</Label>
            <div class="flex flex-wrap justify-start align-center">
              {#each $labelsAdded as labelAdded}
                <div
                  class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded"
                >
                  <div>{labelAdded}</div>
                  <Button
                    class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    on:click={removeAppliedLabel(labelAdded)}>X</Button
                  >
                </div>
              {/each}
            </div>
          </div>

          {#if $storeTasksLabels}
            <div class="mb-6">
              <Label for="body" class="mb-2">Your Labels</Label>
              {#each $storeTasksLabels as label}
                <div
                  class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
                >
                  <div on:click={addLabel({labelName: label.labelName})}>
                    <div>{label.labelName}</div>
                  </div>
                  <Button
                    class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
                    on:click={removeStoredLabel(label.labelName)}
                  >
                    <svg
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
                    </svg>
                  </Button>
                </div>
              {/each}
            </div>
          {/if}
          <Button
            type="submit"
            class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
            on:click={() => {newTask({labelsAdded, body, title}), reset()}}
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
            Create Task</Button
          >
        </form>
      </Drawer>

      <div class="flex flex-col justify-center items-center">
        {#if $storeTasks}
          <div
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Upcoming Tasks
          </div>
          <hr
            class="w-48 h-1 mx-auto my-4 bg-gray-800 border-0 rounded md:my-4 dark:bg-gray-100"
          />
          <div
            class="mb-2 p-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white"
          >
            These have been here a while...
          </div>
          <div class='flex flex-col'>
            {#if $oldTasks}
              {#each $oldTasks as task}
                <Task {openEdit} {task} />
                <!-- <Card
                  on:click={openEdit(oldTask.id)}
                  class="m-2 relative w-full max-w-xs h-48 overflow-hidden cursor-pointer !bg-lightnotebg dark:!bg-darknotebg"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  >
                    {oldTask.title}
                  </h5>
                  <p
                    class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
                  >
                    {oldTask.body}
                  </p>
                  <p
                    class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
                  >
                    {formatDistanceToNow(parseISO(oldTask.updatedAt))} ago
                  </p>
                  {#if oldTask.labels}
                    <div class="flex justify-start items-center gap-2 flex-wrap">
                      {#each oldTask.labels as label}
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
                    class="w-fit absolute top-1 right-1 m-2 bg-redbtn dark:!bg-darkredbtn"
                    on:click={deleteStoredTask(oldTask.id)}
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
                </Card> -->
              {/each}
            {/if}
          </div>
          <hr
            class="w-48 h-1 mx-auto my-4 bg-gray-800 border-0 rounded md:my-4 dark:bg-gray-100"
          />
          <!-- {#each $storeTasks as task}
            <Card
              on:click={openEdit(task.id)}
              class="m-2 relative w-3/5 max-w-xs h-48 overflow-hidden cursor-pointer !bg-lightnotebg dark:!bg-darknotebg"
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
              <p
                class="font-normal text-gray-700 dark:text-gray-200 leading-tight mb-4"
              >
                {formatDistanceToNow(parseISO(task.updatedAt))} ago
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
                class="w-fit absolute top-1 right-1 m-2 bg-redbtn dark:!bg-darkredbtn"
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
          {/each} -->
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
                >Edit Task
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
                  placeholder="Write task body..."
                  rows="4"
                  name="message"
                  bind:value={body}
                />
              </div>
              {#if $labelsAdded.length > 0}
                <div class="mb-6">
                  <Label for="body" class="mb-2">Applied Labels</Label>
                  <div class="flex flex-wrap justify-start align-center">
                    {#each $labelsAdded as labelAdded}
                      <div
                        class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded"
                      >
                        <div>{labelAdded}</div>
                        <Button
                          class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                          on:click={removeAppliedLabel(labelAdded)}>X</Button
                        >
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if $storeTasksLabels}
                <div class="mb-6">
                  <Label for="body" class="mb-2">Your Labels</Label>
                  {#each $storeTasksLabels as label}
                    <div
                      class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
                    >
                      <div on:click={addLabel({labelName: label.labelName})}>
                        <div>{label.labelName}</div>
                      </div>
                      <Button
                        class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
                        on:click={removeStoredLabel(label.labelName)}
                      >
                        <svg
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
                        </svg>
                      </Button>
                    </div>
                  {/each}
                </div>
              {/if}
              <Button
                type="submit"
                class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                on:click={editTask}
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
                Update Task</Button
              >
            </form>
          </Drawer>
        {/if}
      </div>
    </div>
  {/if}
  {#if window.location.pathname == "/tasks"}
    <div class="flex flex-1">
      <div class="text-center w-fit flex flex-col mb-2 w-[37rem] mr-20">
        <AccordionItem>
          <div slot="header" class="mb-6">
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
              <div class="mb-6">
                <Label for="body" class="mb-2">Body</Label>
                <Textarea
                  id="message"
                  placeholder="Write task body..."
                  rows="4"
                  name="message"
                  bind:value={body}
                />
              </div>
              <div class="mb-6">
                <Label for="newLabel" class="block mb-2">New Label</Label>
                <Input
                  id="newLabel"
                  name="newLabel"
                  placeholder="New Label"
                  bind:value={labelName}
                />
              </div>
              <Button
                class="w-2/5 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                on:click={() => {makeNewLabel({labelName}), resetLabel()}}>Create Label</Button
              >
    
              <div class="mb-6">
                <Label for="body" class="mb-2">Applied Labels</Label>
                <div class="flex flex-col gap-2 items-center">
                  {#each $labelsAdded as labelAdded}
                    <div
                    class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded"
                  >
                    <div>
                      <div>{labelAdded} </div>
                    </div>
                    <i on:click={removeAppliedLabel(labelAdded)} class="bi bi-x"></i>
                  </div>
                  {/each}
                </div>
              </div>
            </div>
            <div>
              <ButtonGroup class="flex justify-center items-center gap-2">
                  <Button on:click={() => handleColor('#9BABB8')} class={`!bg-[#9BABB8] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#5C8984')} class={`!bg-[#5C8984] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#FCF9BE')} class={`!bg-[#FCF9BE] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#FF8787')} class={`!bg-[#FF8787] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#537188')} class={`!bg-[#537188] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#E8A0BF')} class={`!bg-[#E8A0BF] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#B2A4FF')} class={`!bg-[#B2A4FF] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
                  <Button on:click={() => handleColor('#A7727D')} class={`!bg-[#A7727D] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
              </ButtonGroup>
              {#if $storeTasksLabels}
              <div class="flex flex-col">
  
                <Label for="body" class="mb-2">Your Labels</Label>
                  <div class="ml-2 mb-6 grid grid-cols-2 gap-2 justify-items-center">
                    {#each $storeTasksLabels as label}
                      <div
                        class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center justify-self-start items-center focus:shadow-outline focus:outline-none text-white font-bold p-1 rounded"
                      >
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
                Create Task</Button
              >
        </AccordionItem>
      </div>

      <div class="flex flex-col justify-center">
        {#if $storeTasks}
          {#each $storeTasks as task}
            <Task {task} {openEdit}/>
          {/each}
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
                >New Task
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
                  placeholder="Write task body..."
                  rows="4"
                  name="message"
                  bind:value={body}
                />
              </div>
              <div class="mb-6">
                <Label for="newLabel" class="block mb-2">New Label</Label>
                <Input
                  id="newLabel"
                  name="newLabel"
                  placeholder="New Label"
                  bind:value={labelName}
                />
              </div>
              <Button
                class="w-2/5 !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                on:click={() => {makeNewLabel({labelName}), resetLabel()}}>Create Label</Button
              >

              <div class="mb-6">
                <Label for="body" class="mb-2">Applied Labels</Label>
                <div class="flex flex-wrap justify-start align-center">
                  {#each $labelsAdded as labelAdded}
                    <div
                      class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded"
                    >
                      <div>{labelAdded}</div>
                      <Button
                        class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        on:click={removeAppliedLabel(labelAdded)}>X</Button
                      >
                    </div>
                  {/each}
                </div>
              </div>

              {#if $storeTasksLabels}
                <div class="mb-6">
                  <Label for="body" class="mb-2">Your Labels</Label>
                  {#each $storeTasksLabels as label}
                    <div
                      class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
                    >
                      <div on:click={addLabel({labelName: label.labelName})}>
                        <div>{label.labelName}</div>
                      </div>
                      <Button
                        class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
                        on:click={removeStoredLabel(label.labelName)}
                      >
                        <svg
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
                        </svg>
                      </Button>
                    </div>
                  {/each}
                </div>
              {/if}
              <Button
                type="submit"
                class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                on:click={() => {newTask({labelsAdded, body, title, colorSel}), reset()}}
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
                Create Task</Button
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
                >Edit Task
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
                  placeholder="Write task body..."
                  rows="4"
                  name="message"
                  bind:value={body}
                />
              </div>
              {#if $labelsAdded.length > 0}
                <div class="mb-6">
                  <Label for="body" class="mb-2">Applied Labels</Label>
                  <div class="flex flex-wrap justify-start align-center">
                    {#each $labelsAdded as labelAdded}
                      <div
                        class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded"
                      >
                        <div>{labelAdded}</div>
                        <Button
                          class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                          on:click={removeAppliedLabel(labelAdded)}>X</Button
                        >
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if $storeTasksLabels}
                <div class="mb-6">
                  <Label for="body" class="mb-2">Your Labels</Label>
                  {#each $storeTasksLabels as label}
                    <div
                      class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
                    >
                      <div on:click={addLabel({labelName: label.labelName})}>
                        <div>{label.labelName}</div>
                      </div>
                      <Button
                        class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
                        on:click={removeStoredLabel(label.labelName)}
                      >
                        <svg
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
                        </svg>
                      </Button>
                    </div>
                  {/each}
                </div>
              {/if}
              <Button
                type="submit"
                class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
                on:click={() => {editTask({title, body, idTemp}), reset()}}
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
                Update Task</Button
              >
            </form>
          </Drawer>
        {/if}
      </div>
    </div>
    
  {/if}
{/if}

<style>
</style>
