<script>
    import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, query, setDoc, where, onSnapshot } from "firebase/firestore";
    import { db } from "../../lib/firebase/firebase.client";
    import "firebase/firestore";
    import { authStore } from "../../stores/authStore";
    import { get } from "svelte/store";
    import { dateTime } from "../../stores/store";
    import { storeTasks } from "../../stores/store";
    import { storeTasksLabels } from "../../stores/store";
    import { Card, Button, Label, Input, Drawer, CloseButton, Textarea } from "flowbite-svelte";
  
    let idTemp = "";
    let dark = true;

    let title = "";
    let body = "";
    let labelName = "";
    let labelsAdded = [];
    let store;
    authStore.subscribe((value) => {
      store = value;
    });
    
    const tasksCollection = collection(db, "tasks");
    const taskLabelsRef = collection(db, "taskLabels");

    //real time collection of labels
    let labels = [];
    onSnapshot( taskLabelsRef, (snapshot) => {
        labels = [];
        snapshot.docs.forEach((doc) => {
            // console.log(doc.data());
            labels.push({...doc.data(), labelName: doc.data().labelName});
        })
        // console.log(labels);
    })

    onSnapshot( tasksCollection, (snapshot) => {
        let array = [];
        snapshot.docs.forEach((doc) => {
            // console.log(doc.data());
            array.push({...doc.data(), id: doc.id})
        })
        console.log("This is the storeTasks array: ", array);
        // console.log(array);
        storeTasks.set(array);
    })

    onSnapshot( taskLabelsRef, (snapshot) => {
        let array = [];
        snapshot.docs.forEach((doc) => {
            // console.log(doc.data());
            array.push({...doc.data()})
        })
        // console.log(array);
        storeTasksLabels.set(array);
    })

    function addLabel(labelName) {
      //ensure that the label isn't already added/applied
      if (labelsAdded.includes(labelName)) {
        console.log("No can do, this label is already applied and we don't want duplicates");
      } else {
        console.log("Adding this label: ", labelName);
        labelsAdded.push(labelName);
        labelsAdded = labelsAdded;
      }
    }

    function removeAppliedLabel(labelName) {
        console.log("Removing this label: ", labelName);
        console.log("labelsAdded before splicing", labelsAdded);
        let indexToRemove = labelsAdded.indexOf(labelName);
        console.log(indexToRemove);
        labelsAdded.splice(indexToRemove, 1);
        console.log("labelsAdded after splice", labelsAdded);
        labelsAdded = labelsAdded;
    }
  
    async function newTask() {
      const newDoc = await addDoc(tasksCollection, {
        body: body,
        createdAt: `${get(dateTime).date} at ${get(dateTime).time}`,
        title: title,
        updatedAt: `${get(dateTime).date} at ${get(dateTime).time}`,
        user_id: store.currentUser.uid,
        labels: labelsAdded,
      });
      labelsAdded = [];
      console.log(`Your doc was created at ${newDoc.path}`);
      console.log("labelsAdded is now: ", labelsAdded);
    }

    async function newLabel() {
      /*need to add a check here to ensure label name is NOT used (necessary for our delete function)*/
      let namesToCheck = [];
      const q = query(taskLabelsRef);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        namesToCheck.push(doc.data().labelName);
      });

      if (!namesToCheck.includes(labelName)) {
        const newDoc = await addDoc(taskLabelsRef, {
          labelName: labelName,
        });
        console.log(`Your doc was created at ${newDoc.path}`);
      } else {
        alert("Please enter a unique label name")
      }
    }
    
    async function removeStoredLabel(labelName) {
      const q = query(taskLabelsRef, where("labelName", "==", labelName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => { //documents cite using forEach -- should only run on one b/c of query == labelName
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        deleteDoc(doc.ref);
      });
    }

    async function deleteStoredTask(id) {
      await deleteDoc(doc(db, "tasks", id));
    }

    async function openEdit(id) {
      let docSnap = await getDoc(doc(db, "tasks", id));
      title = docSnap.data().title;
      body = docSnap.data().body;
      labelsAdded = docSnap.data().labels;
      idTemp = id;
      console.log(docSnap.data());
      hidden3 = false;
    }

    async function editTask() {
      console.log("HERE", doc(db, "tasks", idTemp));
      const newData = {
        body: body,
        title: title,
        updatedAt: `${get(dateTime).date} at ${get(dateTime).time}`,
        labels: labelsAdded,
      };
      await setDoc(doc(db, "tasks", idTemp), newData, { merge: true });

      title = "";
      body = "";
      labelsAdded = [];
      hidden3 = true;
      // console.log(`Your doc was updated at ${newData.path}`);
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
  <div>
    <div class="text-center flex mb-2">
      <Button
        on:click={() => (hidden4 = false)}
        class="!bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
        >Create New Task</Button
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
          on:click={newLabel}
          >Create Label</Button
        >
        
        <div class="mb-6">
          <Label for="body" class="mb-2">Applied Labels</Label>
          <div class="flex flex-wrap justify-start align-center">
            {#each labelsAdded as labelAdded}
              <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded">
                <div>{labelAdded}</div>
                <Button class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={removeAppliedLabel(labelAdded)}>X</Button>
              </div>
            {/each}
          </div>
        </div>
        
        {#if $storeTasksLabels}
        <div class="mb-6">
          <Label for="body" class="mb-2">Your Labels</Label>
          {#each $storeTasksLabels as label}
            <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
              <div on:click={addLabel(label.labelName)}>
                  <div>{label.labelName}</div>
              </div>
              <Button class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center" on:click={removeStoredLabel(label.labelName)}>
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
          on:click={newTask}
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

    <div class="flex flex-wrap">
      {#if $storeTasks}
        {#each $storeTasks as task}
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
            {#if labelsAdded.length > 0}
              <div class="mb-6">
                <Label for="body" class="mb-2">Applied Labels</Label>
                <div class="flex flex-wrap justify-start align-center">
                  {#each labelsAdded as labelAdded}
                    <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-2 rounded">
                      <div>{labelAdded}</div>
                      <Button class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={removeAppliedLabel(labelAdded)}>X</Button>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            
            {#if $storeTasksLabels}
              <div class="mb-6">
                <Label for="body" class="mb-2">Your Labels</Label>
                {#each $storeTasksLabels as label}
                  <div class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
                    <div on:click={addLabel(label.labelName)}>
                        <div>{label.labelName}</div>
                    </div>
                    <Button class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center" on:click={removeStoredLabel(label.labelName)}>
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
  
  <!-- <div class="grid grid-cols-2" >
    <div>
      <form class="w-full max-w-sm">
        <div>
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
            on:click={newTask}
          >
            Create new Task
          </button>
        </div>
      </div>
    </form>

    <div class="block text-gray-500 font-bold md:flex flex-col md:items-center mb-6 mt-4">Applied Labels Here</div>
    <div>
        <ul>
          <div class="flex flex-wrap justify-start align-center">
            {#each labelsAdded as labelAdded}
              <p class="bg-gray-500 w-fit hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
                <li>
                    <div>{labelAdded}</div>
                </li>
                <Button class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={removeAppliedLabel(labelAdded)}>X</Button>
              </p>
            {/each}
          </div>
        </ul>
    </div>
  </div>

  <div class="md:flex flex-col md:items-center md:justify-center mb-6">
    <form class="w-full max-w-sm">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="note-body"
          >
            Label
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="task-label"
            type="text"
            placeholder="Label Name"
            bind:value={labelName}
          />
        </div>
      </div>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3" />
        <div class="md:w-2/3">
          <button
            class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            on:click={newLabel}
          >
            Create new Label
          </button>
        </div>
      </div>
    </form>
    {#if $storeTasksLabels}
            <div class="md:flex flex-col md:items-center mb-6">
              <div class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4  mt-4">Stored Labels in Store.js</div>
              <div>
                <ul>
                  {#each $storeTasksLabels as label}
                  <p class="bg-gray-500 hover:bg-gray-300 flex gap-2 justify-center items-center focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
                    <li on:click={addLabel(label.labelName)}>
                        <div>{label.labelName}</div>
                    </li>
                    <Button class="w-2/5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center" on:click={removeStoredLabel(label.labelName)}>Remove</Button>
                  </p>
                  {/each}
                </ul>
              </div>
            </div>
          {/if}
    

  </div>
</div>

  <div>
      <div class="grid grid-cols-2 m-4 justify-center content-center">
          

          {#if $storeTasks}
              <div class="md:flex flex-col md:items-center mb-6">
                <div>Stored Tasks in Store.js</div>
                <div>
                    <ul>
                        {#each $storeTasks as task}
                        <Card class="m-2">
                          <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                          >
                            {task.title}
                          </h5>
                          <p
                            class="font-normal mb-2 text-gray-700 dark:text-gray-400 leading-tight"
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
                          <Button class="w-fit text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" on:click={deleteStoredTask(task.id)}>
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
                        </Card>
                        {/each}
                    </ul>
                </div>
              </div>
          {/if}
  </div>
</div> -->

<style>
</style>
