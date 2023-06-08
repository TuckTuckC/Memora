import "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase.client";
import { authStore } from "../stores/authStore";
import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  parseISO,
  formatISO,
} from "date-fns";
import { labelsAdded } from "../stores/store";
import { get } from 'svelte/store'

let store;
authStore.subscribe((value) => {
  store = value;
}); 

const tasksCollection = collection(db, "tasks");
const taskLabelsRef = collection(db, "taskLabels");

export async function newTask(doc) {
    const newDoc = await addDoc(tasksCollection, {
      body: doc.body,
      createdAt: `${formatISO(new Date())}`,
      title: doc.title,
      updatedAt: `${formatISO(new Date())}`,
      user_id: store.currentUser.uid,
      labels: doc.labelsAdded,
    });
    console.log(`Your doc was created at ${newDoc.path}`);
    console.log("labelsAdded is now: ", doc.labelsAdded);
}

export async function editTask(d) {
  console.log("HERE", doc(db, "tasks", d.idTemp));
  const newData = {
    body: d.body,
    title: d.title,
    updatedAt: `${formatISO(new Date())}`,
    labels: get(labelsAdded),
  };
  await setDoc(doc(db, "tasks", d.idTemp), newData, { merge: true });

  // console.log(`Your doc was updated at ${newData.path}`);
}
