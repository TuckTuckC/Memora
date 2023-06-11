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
import {
  notes,
  oldNotes,
  events,
  userDays,
  storeTasks,
  storeTasksLabels,
  oldTasks,
} from "../stores/store";
import { matchDaysWithEvents } from "./events.js";
import {
  formatISO,
  parseISO,
  compareDesc,
  differenceInWeeks,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from "date-fns";

let store;
authStore.subscribe((value) => {
  store = value;
});

let userDaysLookup = writable([]);

export function initData() {
  const notesCollection = collection(db, "notes");
  const eventsCollection = collection(db, "events");
  const userDaysCollection = collection(db, "userDays");
  const tasksCollection = collection(db, "tasks");
  const taskLabelsRef = collection(db, "taskLabels");

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

  // Get Tasks
  onSnapshot(tasksCollection, (snapshot) => {
    let array = [];
    let tempOldTasks = [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    snapshot.docs.forEach((doc) => {
      let task = { ...doc.data(), id: doc.id };
      if (doc.data().user_id == store.currentUser.uid) {
        array.push(task);
        parseISO(task.updatedAt) <= oneWeekAgo ? tempOldTasks.push(task) : null;
      }
      // console.log(doc.data());
      // let result = formatDistanceToNowStrict(
      //   parseISO(doc.data().updatedAt)
      // ).split(" ");
      // let filtered = result.filter((word) => word !== "in");
      // in cases of ~1 year, formatDistanceToNowStrict may return "in 1 year"
      // console.log(filtered);
      // if (filtered[1] == "days") {
      //   // oldTasks.set(...doc.data());
      //   olderDaysTasks.push(doc.data());
      // }
      // if (filtered[1] == "month" || filtered[1 == "month"]) {
      // oldTasks.set(...doc.data());
      //   olderMonthsTasks.push(doc.data());
      // }
      // console.log(olderMonthsTasks);
      // array.push({ ...doc.data(), id: doc.id });
      // olderMonthsTasks = olderMonthsTasks;
    });
    // console.log("This is the storeTasks array: ", array);
    // console.log(array);
    oldTasks.set(tempOldTasks);
    array.sort((a, b) =>
      compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))
    );
    storeTasks.set(array);
  });

  // Get Task Labels
  onSnapshot(taskLabelsRef, (snapshot) => {
    let array = [];
    snapshot.docs.forEach((doc) => {
      // console.log(doc.data());
      array.push({ ...doc.data() });
    });
    // console.log(array);
    storeTasksLabels.set(array);
  });
}

if (store.currentUser) {
  initData();
}
