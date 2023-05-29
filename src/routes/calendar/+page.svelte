<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    getMonth,
    getYear,
    addMonths,
    subMonths,
    format,
    getDaysInMonth,
  } from "date-fns";
  import {
    Card,
    Button,
    SpeedDial,
    SpeedDialButton,
    Badge,
    Label,
    Input,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    setDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { authStore } from "../../stores/authStore";
  import { events, userDays } from "../../stores/store";
  import { db } from "../../lib/firebase/firebase.client";

  import {
    formatISO,
    parseISO,
    compareDesc,
    differenceInWeeks,
  } from "date-fns";

  let date = new Date();

  let currentMonth = getMonth(date);
  let currentYear = getYear(date);
  const daysGrid = writable([]);

  function previousMonth() {
    date = subMonths(date, 1);
    currentMonth = getMonth(date);
    currentYear = getYear(date);
    generateGrid();
  }

  function nextMonth() {
    date = addMonths(date, 1);
    currentMonth = getMonth(date);
    currentYear = getYear(date);
    generateGrid();
  }

  function generateGrid() {
    const totalDays = getDaysInMonth(date);
    const startingDay = new Date(currentYear, currentMonth, 1).getDay();
    const grid = [];

    for (let i = 0; i < startingDay; i++) {
      grid.push("");
    }

    for (let day = 1; day <= totalDays; day++) {
      grid.push(day);
    }

    if (grid.length < 35) {
      for (let i = grid.length; i < 35; i++) {
        grid.push("");
      }
    }

    if (grid.length > 35 && grid.length < 42) {
      for (let i = grid.length; i < 42; i++) {
        grid.push("");
      }
    }

    daysGrid.set(grid);
  }

  generateGrid();

  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  let userDaysLookup = writable([]);

  const eventsCollection = collection(db, "events");
  const userDaysCollection = collection(db, "userDays");

  onSnapshot(eventsCollection, (snapshot) => {
    if (store.currentUser) {
      let tempEvents = [];
      snapshot.docs.forEach((doc) => {
        let event = { ...doc.data(), id: doc.id };
        doc.data().uid == store.currentUser.uid ? tempEvents.push(event) : null;
      });
      tempEvents.sort((a, b) =>
        compareDesc(parseISO(a.start), parseISO(b.start))
      );
      console.log("EVENTS", tempEvents);
      events.set(tempEvents);
    }
  });

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
      userDays.set(tempUserDays);

      userDaysLookup.set(
        tempUserDays.map((day) => formatISO(parseISO(day.date)))
      );
      console.log("LOOKUP", $userDaysLookup);
    }
  });

  let title = "";
  let details = "";
  let start = "";
  let end = "";
  let color = "";
  let hidden4 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };
  import { sineIn } from "svelte/easing";
  function newEvent() {
    const newDoc = addDoc(eventsCollection, {
      title: title,
      details: details,
      start: start,
      end: end,
      color: color,
      uid: store.currentUser.uid,
    });
    title = "";
    details = "";
    start = "";
    end = "";
    color = "";
    hidden4 = true;
    console.log(`Your doc was created at ${newDoc.path}`);
  }

  async function getSingleDay(date) {
    let querySnap = await getDocs(
      query(collection(db, "userDays"), where("date", "==", date))
    );
  }

  async function getSingleEvent(eventId) {
    return await getDoc(doc(db, "events", eventId));
  }
  const tempEvents = writable([]);
  async function handleLoadDay(date) {
    let querySnap = await getDocs(
      query(collection(db, "userDays"), where("date", "==", date))
    );

    let eventIds = [];

    querySnap.forEach((doc) => {
      let eventData = doc.data().events;
      let docEventIds = eventData.map((eventRef) => eventRef.id);

      eventIds.push(...docEventIds);
    });

    console.log("event ids", eventIds);
    let eventsData = [];
    let tempEventsData = [];
    // Retrieve event details based on the event IDs
    for (let i = 0; i < eventIds.length; i++) {
      let event = (await getSingleEvent(eventIds[i])).data();
      //   tempEvents.push({
      //     title: event.title,
      //     description: event.description,
      //     start: event.start,
      //     end: event.end,
      //   });
      tempEventsData = [
        ...tempEventsData,
        {
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
        },
      ];
      tempEvents.set(tempEventsData);
    }
    console.log("temp events data", tempEvents);

    // Update the events store with the new data
    events.set(eventsData);
    console.log("TEMP EVENTS", tempEvents);
  }
</script>

<div class="flex flex-col self-center p-4 w-5/6 border-2">
  <div
    class="flex place-content-evenly mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    <Button on:click={previousMonth} color="purple"
      ><i class="bi bi-arrow-left" /></Button
    >
    <h2>{format(date, "MMMM yyyy")}</h2>
    <Button on:click={nextMonth} color="purple"
      ><i class="bi bi-arrow-right" /></Button
    >
  </div>
  <div class="flex flex-col">
    <div
      class="grid grid-cols-7 justify-items-center mb-4 font-normal text-gray-700 dark:text-gray-400 leading-tight"
    >
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
    <div class="grid grid-cols-7 gap-4 justify-items-center">
      {#if $daysGrid}
        {#each $daysGrid as day}
          <div
            class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400"
          >
            {day}
            {#if $userDaysLookup && Array.from($userDaysLookup).includes(formatISO(new Date(currentYear, currentMonth, day)))}<ul
                class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"
                onload={handleLoadDay(
                  formatISO(new Date(currentYear, currentMonth, day))
                )}
              >
                {#each $tempEvents as event}
                  <li>{event.title}</li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
    <SpeedDial color="purple" outline defaultClass="absolute right-12 bottom-8">
      <SpeedDialButton name="Event" on:click={() => (hidden4 = false)}>
        <i class="bi bi-calendar-check" />
      </SpeedDialButton>
    </SpeedDial>
  </div>
</div>

<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={hidden4}
  id="sidebar4"
>
  <div class="flex items-center">
    <h5
      id="drawer-label"
      class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      <svg
        class="w-5 h-5 mr-2"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        /></svg
      >New event
    </h5>
    <CloseButton
      on:click={() => (hidden4 = true)}
      class="mb-4 dark:text-white"
    />
  </div>
  <form action="#" class="mb-6">
    <div class="mb-6">
      <Label for="title" class="block mb-2">Title</Label>
      <Input
        id="title"
        name="title"
        required
        placeholder="Title"
        bind:value={title}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">Details</Label>
      <Textarea
        id="message"
        placeholder="Write note body..."
        rows="4"
        name="message"
        bind:value={details}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">Start</Label>
      <Textarea
        id="message"
        placeholder="Write note body..."
        rows="4"
        name="message"
        bind:value={start}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">End</Label>
      <Textarea
        id="message"
        placeholder="Write note body..."
        rows="4"
        name="message"
        bind:value={end}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">Color</Label>
      <Textarea
        id="message"
        placeholder="Write note body..."
        rows="4"
        name="message"
        bind:value={color}
      />
    </div>
    <Button
      type="submit"
      class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
      on:click={newEvent}
      ><svg
        width="30"
        height="30"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38.4 20.7417H14C12.8954 20.7417 12 21.6371 12 22.7417V66.7417C12 67.8463 12.8954 68.7417 14 68.7417H58C59.1046 68.7417 60 67.8463 60 66.7417V42.342"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M68.0145 21.8972C68.7943 21.1174 68.7943 19.8532 68.0145 19.0734L62.3577 13.4166C61.5753 12.6342 60.3069 12.6342 59.5246 13.4166L30.6996 42.2416C28.1991 44.7421 26.5974 48.0005 26.1449 51.5077L25.7115 54.8664C25.6479 55.359 26.0674 55.7785 26.56 55.715L29.9187 55.2816C33.4259 54.829 36.6844 53.2273 39.1849 50.7268L68.0145 21.8972Z"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M52.1455 20.8037L60.6261 29.2843"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Create Event</Button
    >
  </form>
</Drawer>
