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
import {
  formatISO,
  parseISO,
  compareDesc,
  differenceInWeeks,
} from "date-fns";

let store;
authStore.subscribe((value) => {
  store = value;
});

export function initData() {
    const notesCollection = collection(db, "notes");
    const eventsCollection = collection(db, "events");
    const userDaysCollection = collection(db, "userDays");

    onSnapshot(notesCollection, (snapshot) => {
      if (store.currentUser) {
        let tempNotes = [];
        let tempOldNotes = [];
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        snapshot.docs.forEach((doc) => {
          let note = { ...doc.data(), id: doc.id };
          if (doc.data().user_id == store.currentUser.uid) {
            tempNotes.push(note);
            parseISO(note.updatedAt) <= oneWeekAgo
              ? tempOldNotes.push(note)
              : null;
          }
        });
        oldNotes.set(tempOldNotes);
        tempNotes.sort((a, b) =>
          compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))
        );
        console.log(tempNotes);
        notes.set(tempNotes);
      }
    });

    onSnapshot(eventsCollection, (snapshot) => {
      if (store.currentUser) {
        let tempEvents = [];
        snapshot.docs.forEach((doc) => {
          let event = { ...doc.data(), id: doc.id };
          doc.data().uid == store.currentUser.uid
            ? tempEvents.push(event)
            : null;
        });
        tempEvents.sort((a, b) =>
          compareDesc(parseISO(a.start), parseISO(b.start))
        );
        events.set(tempEvents);
      }
    });
  }

  if (store.currentUser) {
    initData();
  }