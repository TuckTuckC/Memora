<script>
  import { collection, getDocs, setDoc, doc } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase.client";
  import "firebase/firestore";

  //   const querySnapshot = getDocs(collection(db, "users"));
  //   console.log("snap:", querySnapshot);
  //   for (const doc of querySnapshot.docs) {
  //     console.log(`${doc.id} => ${doc.data}`);
  //   }

  import { authStore } from "../../stores/authStore";
  import { onMount } from "svelte";
  let store;

  const notesCollection = collection(db, "notes");
  async function newNote() {
    const newDoc = await addDoc(notesCollection, {
      body: "TEST Body",
      createdAt: "May 4, 2023 at 1:19:31 PM UTC-4",
      title: "TEST Title",
      updatedAt: "May 4, 2023 at 1:38:38 PM UTC-4",
      user_id: "test@gmail.com",
    });
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  //   onMount(async () => {
  //     try {
  //       authStore.subscribe((value) => {
  //         store = value;
  //       });

  //       const querySnapshot = await getDocs(collection(db, "notes"));
  //       console.log("SNAPSHOT:", querySnapshot);

  //       console.log("store:", store);
  //       console.log("notes:", db.notes);
  //       const data = {
  //         title: "NOTE 2",
  //         body: "Note 2 Body",
  //         createdAt: "May 4, 2023 at 1:19:31 PM UTC-4",
  //         updatedAt: "May 4, 2023 at 1:38:38 PM UTC-4",
  //         user_id: store.currentUser.uid,
  //       };
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   });

  async function loadUserData() {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log("snap:", querySnapshot);
    for (const doc of querySnapshot.docs) {
      console.log(doc.data());
    }
  }

  loadUserData();
</script>

<div>
  <button on:click={newNote} />
</div>

<style>
</style>
