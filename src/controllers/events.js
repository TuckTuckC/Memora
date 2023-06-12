import {
  formatISO,
  parseISO,
  startOfDay,
  compareAsc,
  minutesToHours,
  formatDistance,
  compareDesc,
  getMinutes,
  getHours,
  parse,
} from "date-fns";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase.client";
import { notes, oldNotes, events, userDays, eventDays } from "../stores/store";
import { writable, get } from "svelte/store";
import { authStore } from "../stores/authStore";

let store;
authStore.subscribe((value) => {
  store = value;
});

const eventsCollection = collection(db, "events");
const userDaysCollection = collection(db, "userDays");

export function matchDaysWithEvents(match) {
  // console.log(match.userDays, match.events);
  if (match.userDays.length > 0 && match.events.length > 0) {
    const matchedDays = match.userDays.map((day) => {
      const matchedEvents = [];
      const date = day.date;
      const uid = day.uid;
      // console.log("MATCHED EVENTS", match.events);
      match.events.forEach((event) => {
        // console.log(
        //   date,
        //   formatISO(startOfDay(parseISO(event.start))) == date,
        //   event.title
        // );
        if (formatISO(startOfDay(parseISO(event.start))) == date) {
          matchedEvents.push(event);
        }
      });
      let sortedEvents = matchedEvents.sort((a, b) => {
        return compareAsc(parseISO(a.start), parseISO(b.start));
      });
      // console.log("SORTED EVENTS", sortedEvents);
      // console.log("EVENTS", match.events);

      return { date, matchedEvents: sortedEvents, uid };
    });
    eventDays.set(matchedDays);
    // console.log("MATCH", get(eventDays));
  }
}

export function newEvent(doc) {
  console.log("doc.start & doc.end, respectively", doc.start, " ", doc.end);

  // const [hStart, mStart] = /(\d{2}):(\d{2})/.exec(
  //   doc.start.slice(11, 16).split(":")
  // );
  const hStart = doc.start.slice(11, 13);
  const mStart = doc.start.slice(14, 16);
  const startHours = parseInt(hStart, 10);
  const startMins = parseInt(mStart, 10);
  const startMinPos = startHours * 60 + startMins;

  // const [hEnd, mEnd] = /(\d{2}):(\d{2})/.exec(doc.end.slice(11, 16).split(":"));
  const hEnd = doc.start.slice(11, 13);
  const mEnd = doc.start.slice(14, 16);
  const endHours = parseInt(hEnd, 10);
  const endMins = parseInt(mEnd, 10);
  const endMinPos = endHours * 60 + endMins;

  // console.log("startMinutes", startMinutes);
  // console.log("endMinutes", endMinutes);
  // const duration = endMinutes - startMinutes;
  addDoc(eventsCollection, {
    title: doc.title,
    details: doc.details,
    start: doc.start,
    TuckDuration: endMinPos - startMinPos,
    end: doc.end,
    color: doc.color,
    uid: store.currentUser.uid,
  }).then((newDoc) => {
    // console.log("EVENT DATA", newDoc);
    // console.log("EVENT DAYS", get(eventDays));
    if (
      [...get(eventDays)].some(
        (d) => d.date === formatISO(startOfDay(parseISO(doc.start)))
      )
    ) {
      addEventToDay({
        id: newDoc.id,
        date: formatISO(startOfDay(parseISO(doc.start))),
      });
    } else {
      newDay({ id: newDoc.id, start: doc.start });
    }
  });
}

async function addEventToDay(doc) {
  let querySnap = await getDocs(
    query(collection(db, "userDays"), where("date", "==", doc.date))
  );

  if (!querySnap.empty) {
    const dayDoc = querySnap.docs[0];

    // Get the existing events array from the day's document
    const docEvents = dayDoc.data().events || [];

    // Add the new event to the array
    docEvents.push(doc.id);

    // Update the events array in the day's document
    await updateDoc(dayDoc.ref, { events: arrayUnion(doc.id) });
  }
}

function newDay(doc) {
  // console.log("NEW DAY LOGS", doc);

  const newDoc = addDoc(userDaysCollection, {
    date: formatISO(startOfDay(parseISO(doc.start))),
    events: [doc.id],
    uid: store.currentUser.uid,
  });
  // console.log("DAY DATA", newDoc);
  // console.log(`Your doc was created at ${newDoc.path}`);
}
