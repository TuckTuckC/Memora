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
import { notes, oldNotes, events } from "../stores/store";
import { formatISO, parseISO, compareDesc, differenceInWeeks } from "date-fns";

let store;
authStore.subscribe((value) => {
  store = value;
});

const notesCollection = collection(db, "notes");

export function newNote(title, body) {
  console.log(body, title);
  const newDoc = addDoc(notesCollection, {
    body: body,
    createdAt: `${formatISO(new Date())}`,
    title: title,
    updatedAt: `${formatISO(new Date())}`,
    user_id: store.currentUser.uid,
  });
  title = "";
  body = "";
  console.log(`Your doc was created at ${newDoc.path}`);
}

export async function deleteNote(id) {
  await deleteDoc(doc(db, "notes", id));
}

export async function editNote(title, body, idTemp) {
  console.log("HERE", doc(db, "notes", idTemp));
  const newData = {
    body: body,
    title: title,
    updatedAt: `${formatISO(new Date())}`,
  };
  await setDoc(doc(db, "notes", idTemp), newData, { merge: true });

  title = "";
  body = "";
  console.log(`Your doc was updated at ${newData.path}`);
}
