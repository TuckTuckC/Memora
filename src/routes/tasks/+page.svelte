<script>
    import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore";
    import { db } from "../../lib/firebase/firebase.client";
    import "firebase/firestore";
    import { authStore } from "../../stores/authStore";
    import { get } from "svelte/store";
    import { dateTime } from "../../stores/store";
    import { storeTasks } from "../../stores/store";
    import { storeTasksLabels } from "../../stores/store";
  
    let title = "";
    let body = "";
    let labelName = "";
    let labelsAdded = [];
    let store;
    authStore.subscribe((value) => {
      store = value;
    });
    // console.log("datetime", get(dateTime));
    // console.log(`${get(dateTime).date} at ${get(dateTime).time}`);
    const tasksCollection = collection(db, "tasks");
    const taskLabelsRef = collection(db, "taskLabels");

  let title = "";
  let body = "";
  let labelName = "";
  let labelsAdded = [];
  let store;
  authStore.subscribe((value) => {
    store = value;
  });
  // console.log("datetime", get(dateTime));
  // console.log(`${get(dateTime).date} at ${get(dateTime).time}`);
  const tasksCollection = collection(db, "tasks");
  const taskLabelsRef = collection(db, "taskLabels");

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
      UUID: uuidv4(),
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


    async function deleteStoredTask(id) {
      console.log(id);
      // querySnapshot.forEach((doc) => { //documents cite using forEach -- should only run on one b/c of query == user_id
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      //   deleteDoc(doc.ref);
      // });
    if (!namesToCheck.includes(labelName)) {
      const newDoc = await addDoc(taskLabelsRef, {
        labelName: labelName,
      });
      console.log(`Your doc was created at ${newDoc.path}`);
    } else {
      alert("Please enter a unique label name");
    }
  }

  async function removeStoredLabel(labelName) {
    const q = query(taskLabelsRef, where("labelName", "==", labelName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //documents cite using forEach -- should only run on one b/c of query == labelName
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      deleteDoc(doc.ref);
    });
  }

  async function deleteStoredTask(task) {
    console.log(task.UUID);
    const q = query(tasksCollection, where("UUID", "==", task.UUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //documents cite using forEach -- should only run on one b/c of query == user_id
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      deleteDoc(doc.ref);
    });
  }
</script>

<div>
  <form class="w-full max-w-sm">
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
    <div class="md:w-2/3">
      <input
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        id="inline-title"
        type="text"
        placeholder="Title"
        bind:value={title}
      />
    </div>
  </form>
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
</div>

<div class="w-full max-w-sm mt-4">
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
</div>

<div class="grid grid-cols-2 m-4 justify-center content-center">
  <div class="md:flex flex-col md:items-center mb-6">
    <div>Applied Labels Here</div>
    <div>
      <ul>
        {#each labelsAdded as labelAdded}
          <li
            class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
            on:click={addLabel(labelAdded.labelName)}
            on:keydown={() => {}}
          >
            {labelAdded}
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="grid grid-cols-2 m-4 justify-center content-center">
    <div class="md:flex flex-col md:items-center mb-6">
      <div>Applied Labels Here</div>
      <div>
        <ul>
          {#each labelsAdded as labelAdded}
            <li
              class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
            >
              <button>{labelAdded}</button>
            </li>
            <button on:click={removeAppliedLabel(labelAdded)}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M55.5564 55.6693L24.4437 24.5566"
                  stroke="#BC12CC"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24.4436 55.6693L55.5563 24.5566"
                  stroke="#BC12CC"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          {/each}
        </ul>
      </div>
    </div>

    <div class="md:flex flex-col md:items-center mb-6">
      <div>All Available Labels Here</div>
      <div>
        <ul>
          {#each labels as label}
            <li
              class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded"
              on:click={addLabel(label.labelName)}
            >
              <button>{label.labelName}</button>
            </li>
            <button on:click={removeStoredLabel(label.labelName)}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M55.5564 55.6693L24.4437 24.5566"
                  stroke="#BC12CC"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24.4436 55.6693L55.5563 24.5566"
                  stroke="#BC12CC"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          {/each}
        </ul>
      </div>
    </div>

      <div class="grid grid-cols-2 m-4 justify-center content-center">
        <div class="md:flex flex-col md:items-center mb-6">
            <div>Applied Labels Here</div>
            <div>
                <ul>
                    {#each labelsAdded as labelAdded}
                        <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
                            <button>{labelAdded}</button>
                        </li>
                        <button on:click={removeAppliedLabel(labelAdded)} >
                          <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M55.5564 55.6693L24.4437 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24.4436 55.6693L55.5563 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                    {/each}
                </ul>
            </div>
          </div>
    

          {#if $storeTasksLabels}
            <div class="md:flex flex-col md:items-center mb-6">
              <div>Stored Labels in Store.js</div>
              <div>
                <ul>
                  {#each $storeTasksLabels as label}
                  <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded" on:click={addLabel(label.labelName)}>
                          <div>{label.labelName}</div>
                      </li>
                      <button on:click={removeStoredLabel(label.labelName)} >
                        <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M55.5564 55.6693L24.4437 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M24.4436 55.6693L55.5563 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                  {/each}
                </ul>
              </div>
            </div>
          {/if}


          <!-- <div class="md:flex flex-col md:items-center mb-6">
            <div>All Available Labels Here</div>
            <div>
                <ul>
                    {#each labels as label}
                        <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded" on:click={addLabel(label.labelName)}>
                          <button>{label.labelName}</button>
                        </li>
                        <button on:click={removeStoredLabel(label.labelName)} >
                          <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M55.5564 55.6693L24.4437 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24.4436 55.6693L55.5563 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </button>
                    {/each}
                </ul>
            </div>
          </div> -->

          {#if $storeTasks}
              <div class="md:flex flex-col md:items-center mb-6">
                <div>Stored Tasks in Store.js</div>
                <div>
                    <ul>
                        {#each $storeTasks as task}
                            <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded">
                                <div>{task.title}</div>
                                <div>{task.body}</div>
                                <div>{task.createdAt}</div>
                                <div>{task.labels}</div>
                            </li>
                            <button on:click={deleteStoredTask(task.id)} >
                              <svg width="40" height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M55.5564 55.6693L24.4437 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M24.4436 55.6693L55.5563 24.5566" stroke="#BC12CC" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </button>
                        {/each}
                    </ul>
                </div>
              </div>
          {/if}
      </div>
    {/if}
  </div>
</div>
<style>
</style>

