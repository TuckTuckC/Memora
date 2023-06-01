<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import {
    getMonth,
    getYear,
    addMonths,
    subMonths,
    format,
    getDaysInMonth,
    startOfDay,
    set,
  } from "date-fns";
  import {
    Card,
    Button,
    SpeedDial,
    SpeedDialButton,
    Badge,
    Label,
    Input,
    Select,
    Drawer,
    CloseButton,
    Textarea,
    Datepicker,
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
      console.log("EVENTS", events);
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
      console.log("LOOKUP", tempUserDays);
    }
  });

  // Selections
  let selHour;
  let selMinute;

  let selYearEnd;
  let selMonthEnd;
  let selDayEnd;
  let selHourEnd;
  let selMinuteEnd;
  let selStart;
  const year = writable("");
  const month = writable("");
  const day = writable("");

  $: {
    if (selStart) {
      const [yearVal, monthVal, dayVal] = selStart.split("-");
      year.set(yearVal);
      month.set(monthVal);
      day.set(dayVal);
      console.log($year, $month, $day);
    }
  }

  let years = [
    { value: "2023", name: "2023" },
    { value: "2024", name: "2024" },
    { value: "2025", name: "2025" },
  ];
  let months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];
  let days = [
    { value: "01", name: "1" },
    { value: "02", name: "2" },
    { value: "03", name: "3" },
    { value: "04", name: "4" },
    { value: "05", name: "5" },
    { value: "06", name: "6" },
    { value: "07", name: "7" },
    { value: "08", name: "8" },
    { value: "09", name: "9" },
    { value: "10", name: "10" },
    { value: "11", name: "11" },
    { value: "12", name: "12" },
    { value: "13", name: "13" },
    { value: "14", name: "14" },
    { value: "15", name: "15" },
    { value: "16", name: "16" },
    { value: "17", name: "17" },
    { value: "18", name: "18" },
    { value: "19", name: "19" },
    { value: "20", name: "20" },
    { value: "21", name: "21" },
    { value: "22", name: "22" },
    { value: "23", name: "23" },
    { value: "24", name: "24" },
    { value: "25", name: "25" },
    { value: "26", name: "26" },
    { value: "27", name: "27" },
    { value: "28", name: "28" },
    { value: "29", name: "29" },
    { value: "30", name: "30" },
    { value: "31", name: "31" },
  ];
  let hours = [
    { value: "01", name: "1" },
    { value: "02", name: "2" },
    { value: "03", name: "3" },
    { value: "04", name: "4" },
    { value: "05", name: "5" },
    { value: "06", name: "6" },
    { value: "07", name: "7" },
    { value: "08", name: "8" },
    { value: "09", name: "9" },
    { value: "10", name: "10" },
    { value: "11", name: "11" },
    { value: "12", name: "12" },
  ];
  let minutes = [
    { value: "01", name: "1" },
    { value: "02", name: "2" },
    { value: "03", name: "3" },
    { value: "04", name: "4" },
    { value: "05", name: "5" },
    { value: "06", name: "6" },
    { value: "07", name: "7" },
    { value: "08", name: "8" },
    { value: "09", name: "9" },
    { value: "10", name: "10" },
    { value: "11", name: "11" },
    { value: "12", name: "12" },
    { value: "13", name: "13" },
    { value: "14", name: "14" },
    { value: "15", name: "15" },
    { value: "16", name: "16" },
    { value: "17", name: "17" },
    { value: "18", name: "18" },
    { value: "19", name: "19" },
    { value: "20", name: "20" },
    { value: "21", name: "21" },
    { value: "22", name: "22" },
    { value: "23", name: "23" },
    { value: "24", name: "24" },
    { value: "25", name: "25" },
    { value: "26", name: "26" },
    { value: "27", name: "27" },
    { value: "28", name: "28" },
    { value: "29", name: "29" },
    { value: "30", name: "30" },
    { value: "31", name: "31" },
    { value: "32", name: "32" },
    { value: "33", name: "33" },
    { value: "34", name: "34" },
    { value: "35", name: "35" },
    { value: "36", name: "36" },
    { value: "37", name: "37" },
    { value: "38", name: "38" },
    { value: "39", name: "39" },
    { value: "40", name: "40" },
    { value: "41", name: "41" },
    { value: "42", name: "42" },
    { value: "43", name: "43" },
    { value: "44", name: "44" },
    { value: "45", name: "45" },
    { value: "46", name: "46" },
    { value: "47", name: "47" },
    { value: "48", name: "48" },
    { value: "49", name: "49" },
    { value: "50", name: "50" },
    { value: "51", name: "51" },
    { value: "52", name: "52" },
    { value: "53", name: "53" },
    { value: "54", name: "54" },
    { value: "55", name: "55" },
    { value: "56", name: "56" },
    { value: "57", name: "57" },
    { value: "58", name: "58" },
    { value: "59", name: "59" },
  ];

  let title = "";
  let details = "";
  $: start = `${$year}-${$month}-${$day}T${selHour}:${selMinute}:00-04:00`;
  $: end = `${selYearEnd}-${selMonthEnd}-${selDayEnd}T${selHourEnd}:${selMinuteEnd}:00-04:00`;
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
    }).then((newDoc) => {
      console.log("EVENT DATA", newDoc);
      newDay({ id: newDoc.id, start });
    });
  }
  function newDay(doc) {
    console.log("NEW DAY LOGS", doc);

    const newDoc = addDoc(userDaysCollection, {
      date: formatISO(startOfDay(parseISO(doc.start))),
      events: [doc.id],
      uid: store.currentUser.uid,
    });
    console.log("DAY DATA", newDoc);
    console.log(`Your doc was created at ${newDoc.path}`);
    title = "";
    details = "";
    start = "";
    end = "";
    color = "";
    hidden4 = true;
  }

  async function getSingleDay(date) {
    let querySnap = await getDocs(
      query(collection(db, "userDays"), where("date", "==", date))
    );
  }

  async function getSingleEvent(eventId) {
    console.log("GET SINGLE EVENT", eventId);
    return await getDoc(doc(db, "events", eventId));
  }
  const tempEvents = writable([]);
  async function handleLoadDay(date) {
    let querySnap = await getDocs(
      query(collection(db, "userDays"), where("date", "==", date))
    );

    console.log("day date", date);

    let eventIds = [];

    querySnap.forEach((doc) => {
      console.log("events loop", doc.data());
      let eventData = doc.data().events;
      console.log("events loop 2", eventData);
      let docEventIds = eventData.map((eventRef) => eventRef);

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
      <input type="date" bind:value={selStart} />
      <Select class="mt-2" items={hours} bind:value={selHour} />
      <Select class="mt-2" items={minutes} bind:value={selMinute} />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">End</Label>
      <Select class="mt-2" items={years} bind:value={selYearEnd} />
      <Select class="mt-2" items={months} bind:value={selMonthEnd} />
      <Select class="mt-2" items={days} bind:value={selDayEnd} />
      <Select class="mt-2" items={hours} bind:value={selHourEnd} />
      <Select class="mt-2" items={minutes} bind:value={selMinuteEnd} />
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
