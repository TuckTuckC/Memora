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
