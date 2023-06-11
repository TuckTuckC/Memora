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
import { writable, get } from "svelte/store";
import { notes, oldNotes, events, userDays } from "../stores/store";
import { matchDaysWithEvents } from "./events.js";
import { formatISO, parseISO, compareDesc, differenceInWeeks } from "date-fns";

let store;
authStore.subscribe((value) => {
  store = value;
});

let userDaysLookup = writable([]);

export function initData() {
  const notesCollection = collection(db, "notes");
  const eventsCollection = collection(db, "events");
  const userDaysCollection = collection(db, "userDays");

  // Get Notes
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
      notes.set(tempNotes);
    }
  });

  // Get Events
  onSnapshot(eventsCollection, (snapshot) => {
    if (store.currentUser) {
      let tempEvents = [];
      snapshot.docs.forEach((doc) => {
        let event = { ...doc.data(), id: doc.id };
        doc.data().uid == store.currentUser.uid ? tempEvents.push(event) : null;
      });
      events.set(tempEvents);
    }
  });

  // Get Days
  onSnapshot(userDaysCollection, (snapshot) => {
    if (store.currentUser) {
      let tempUserDays = [];
      let tempUserDaysLookup = [];
      snapshot.docs.forEach((doc) => {
        let event = { ...doc.data(), id: doc.id };
        if (doc.data().uid == store.currentUser.uid) {
          tempUserDays.push(event);
          tempUserDaysLookup.push(event.start);
        }
      });
      tempUserDays.sort((a, b) =>
        compareDesc(parseISO(a.start), parseISO(b.start))
      );

      matchDaysWithEvents({ events: get(events), userDays: tempUserDays });

      userDays.set(tempUserDays);

      userDaysLookup.set(
        tempUserDays.map((day) => formatISO(parseISO(day.date)))
      );
    }
  });
}

if (store.currentUser) {
  initData();
}
