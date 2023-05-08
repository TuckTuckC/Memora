<script>
    import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
    import { db } from "../../lib/firebase/firebase.client";
    import "firebase/firestore";
    import { authStore } from "../../stores/authStore";
    import { get } from "svelte/store";
    import { dateTime } from "../../stores/store";
  
    let title = "";
    let body = "";
    let labelName = "";
    let labelsAdded = [];
    let store;
    authStore.subscribe((value) => {
      store = value;
    });
    console.log("datetime", get(dateTime));
    console.log(`${get(dateTime).date} at ${get(dateTime).time}`);
    const tasksCollection = collection(db, "tasks");
    const taskLabelsRef = collection(db, "taskLabels");

    //real time collection of labels
    let labels = [];
    onSnapshot( taskLabelsRef, (snapshot) => {
        labels = [];
        snapshot.docs.forEach((doc) => {
            console.log(doc.data());
            labels.push({...doc.data(), labelName: doc.data().labelName})
        })
        console.log(labels);
    })

    function addLabel(labelName) {
        console.log("Adding this label: ", labelName);
        labelsAdded.push(labelName);
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
      const newDoc = await addDoc(taskLabelsRef, {
        labelName: labelName,
      });
      console.log(`Your doc was created at ${newDoc.path}`);
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

    <form class="w-full max-w-sm mt-4">
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

      <div class="grid grid-cols-2 m-4 justify-center content-center">
        <div class="md:flex flex-col md:items-center mb-6">
            <div>Applied Labels Here</div>
            <div>
                <ul>
                    {#each labelsAdded as labelAdded}
                        <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded" on:click={addLabel(labelAdded.labelName)}>
                            {labelAdded}
                        </li>
                    {/each}
                </ul>
            </div>
          </div>
    
          <div class="md:flex flex-col md:items-center mb-6">
            <div>All Available Labels Here</div>
            <div>
                <ul>
                    {#each labels as label}
                        <li class="shadow bg-gray-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 m-4 rounded" on:click={addLabel(label.labelName)}>
                            {label.labelName}
                        </li>
                    {/each}
                </ul>
            </div>
          </div>
      </div>
  </div>
  
  <style>
  </style>
  