<script>
  import { collection, getDocs } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase";

  //   const querySnapshot = getDocs(collection(db, "users"));
  //   console.log("snap:", querySnapshot);
  //   for (const doc of querySnapshot.docs) {
  //     console.log(`${doc.id} => ${doc.data}`);
  //   }

  async function loadUserData() {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log("snap:", querySnapshot);
    for (const doc of querySnapshot.docs) {
      console.log(`${doc.id} => ${doc.data}`);
    }
  }

  loadUserData();
</script>

<div />

<style>
</style>
