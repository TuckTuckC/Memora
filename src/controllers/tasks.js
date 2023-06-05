import "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase.client";
import { authStore } from "../stores/authStore";

const tasksCollection = collection(db, "tasks");
const taskLabelsRef = collection(db, "taskLabels");

export async function newTask() {
    const newDoc = await addDoc(tasksCollection, {
      body: body,
      createdAt: `${formatISO(new Date())}`,
      title: title,
      updatedAt: `${formatISO(new Date())}`,
      user_id: store.currentUser.uid,
      labels: labelsAdded,
    });
    labelsAdded = [];
    console.log(`Your doc was created at ${newDoc.path}`);
    console.log("labelsAdded is now: ", labelsAdded);
    hidden4 = true;
}