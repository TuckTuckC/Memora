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
import { get } from "svelte/store"

let store;
authStore.subscribe((value) => {
  store = value;
}); 

const taskLabelsRef = collection(db, "taskLabels");

export async function makeNewLabel(doc) {
    /*need to add a check here to ensure label name is NOT used (necessary for our delete function)*/
    console.log("HI MAKING NEW LABEL");
    let namesToCheck = [];
    const q = query(taskLabelsRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((d) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      namesToCheck.push(d.data().labelName);
    });
    if (namesToCheck.includes(doc.labelName)) {
      console.log(
        "No can do, this label is already applied and we don't want duplicates"
      );
    } else {
      console.log("Adding this label: ", doc.labelName);
      console.log("LabelsAdded:", get(labelsAdded));
      let toBeNew = get(labelsAdded);
      toBeNew.push(doc.labelName);
      labelsAdded.set(toBeNew);
      const newDoc = await addDoc(taskLabelsRef, {
        labelName: doc.labelName,
      });
    }
  }

export function addLabel(doc) {
    //ensure that the label isn't already added/applied
    let toBeNew = get(labelsAdded);
    if (toBeNew.includes(doc.labelName)) {
      console.log(
        "No can do, this label is already applied and we don't want duplicates"
      );
    } else {
      console.log("Adding this label: ", doc.labelName);
      toBeNew.push(doc.labelName);
      labelsAdded.set(toBeNew);
    }
  }

export async function removeStoredLabel(labelName) {
    const q = query(taskLabelsRef, where("labelName", "==", labelName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //documents cite using forEach -- should only run on one b/c of query == labelName
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      deleteDoc(doc.ref);
    });
}

export function removeAppliedLabel(labelName) {
  let tempLabelsAdded = get(labelsAdded);
  console.log("Removing this label: ", labelName);
  console.log("labelsAdded before splicing", get(labelsAdded));
  let indexToRemove = tempLabelsAdded.indexOf(labelName);
  console.log(indexToRemove);
  tempLabelsAdded.splice(indexToRemove, 1);
  labelsAdded.set(tempLabelsAdded);
  console.log("labelsAdded after splice", get(labelsAdded));
}