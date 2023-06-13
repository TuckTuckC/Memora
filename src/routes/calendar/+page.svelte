<script>
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { sineIn } from "svelte/easing";
  import {
    getMonth,
    getYear,
    addMonths,
    subMonths,
    format,
    getDaysInMonth,
  } from "date-fns";
  import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownHeader,
    SpeedDial,
    SpeedDialButton,
    Label,
    Input,
    Select,
    Drawer,
    CloseButton,
    Textarea,
  } from "flowbite-svelte";
  import { authStore } from "../../stores/authStore";
  import {newEvent} from "../../controllers/events";
  import { writable } from "svelte/store";
  import DayBlock from './DayBlock.svelte';

  let date = new Date();

  let currentMonth = getMonth(date);
  let currentYear = getYear(date);
  const daysGrid = writable([]);

  let hidden4 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  generateGrid();

  function handleColor(d) {
    console.log(d);
    color = d;
  }

  function reset() {
    title = "";
    details = "";
    start = "";
    end = "";
    color = "";
    hidden4 = true;
  }

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


  // Event Selections
  let selHour;
  let selMinute;

  let selHourEnd;
  let selMinuteEnd;

  let selStart;
  let selEnd;

  const year = writable("");
  const month = writable("");
  const day = writable("");

  const yearEnd = writable("");
  const monthEnd = writable("");
  const dayEnd = writable("");

  $: {
    if (selStart) {
      const [yearVal, monthVal, dayVal] = selStart.split("-");
      year.set(yearVal);
      month.set(monthVal);
      day.set(dayVal);
    }
    if (selEnd) {
      const [yearVal, monthVal, dayVal] = selStart.split("-");
      yearEnd.set(yearVal);
      monthEnd.set(monthVal);
      dayEnd.set(dayVal);
    }
  }

  let hours = [
    { value: "01", name: "1a" },
    { value: "02", name: "2a" },
    { value: "03", name: "3a" },
    { value: "04", name: "4a" },
    { value: "05", name: "5a" },
    { value: "06", name: "6a" },
    { value: "07", name: "7a" },
    { value: "08", name: "8a" },
    { value: "09", name: "9a" },
    { value: "10", name: "10a" },
    { value: "11", name: "11a" },
    { value: "12", name: "12p" },
    { value: "11", name: "1p" },
    { value: "12", name: "2p" },
    { value: "13", name: "3p" },
    { value: "14", name: "4p" },
    { value: "15", name: "5p" },
    { value: "16", name: "6p" },
    { value: "17", name: "7p" },
    { value: "18", name: "8p" },
    { value: "19", name: "9p" },
    { value: "20", name: "10p" },
    { value: "21", name: "11p" },
    { value: "22", name: "12a" },
  ];
  let minutes = [
    { value: "00", name: "0" },
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
  $: end = `${$yearEnd}-${$monthEnd}-${$dayEnd}T${selHourEnd}:${selMinuteEnd}:00-04:00`;
  let color = "";
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
          <DayBlock {day} {currentYear} {currentMonth}/>
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
      <Select
        class="mt-2"
        items={hours}
        placeholder="Hour..."
        bind:value={selHour}
      />
      <Select
        class="mt-2"
        items={minutes}
        placeholder="Minute..."
        bind:value={selMinute}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">End</Label>
      <input type="date" bind:value={selEnd} />
      <Select
        class="mt-2"
        items={hours}
        placeholder="Hour..."
        bind:value={selHourEnd}
      />
      <Select
        class="mt-2"
        items={minutes}
        placeholder="Minute..."
        bind:value={selMinuteEnd}
      />
    </div>
    <div class="mb-6">
      <Label for="body" class="mb-2">Color</Label>

      <ButtonGroup class="flex justify-center items-center gap-2">
        <Button on:click={() => handleColor('#9BABB8')} class={`!bg-[#9BABB8] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#5C8984')} class={`!bg-[#5C8984] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#FCF9BE')} class={`!bg-[#FCF9BE] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#FF8787')} class={`!bg-[#FF8787] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#537188')} class={`!bg-[#537188] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#E8A0BF')} class={`!bg-[#E8A0BF] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#B2A4FF')} class={`!bg-[#B2A4FF] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
        <Button on:click={() => handleColor('#A7727D')} class={`!bg-[#A7727D] !p-1 !rounded-full w-[1rem] h-[1rem]`}></Button>
    </ButtonGroup>
    </div>
    <Button
      type="submit"
      class="w-full !bg-greenbtn !text-black dark:!bg-purplebtn dark:!text-white"
      on:click={() => {newEvent({title, details, start, end, color}), reset()}}
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
