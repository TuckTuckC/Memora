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
  import { Card, Button } from "flowbite-svelte";
  import { writable } from "svelte/store";

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

    console.log(totalDays);
    daysGrid.set(grid);
  }

  generateGrid();
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
          <div class="text-center w-[12rem] h-[7rem] border-2">{day}</div>
        {/each}
      {/if}
    </div>
  </div>
</div>
