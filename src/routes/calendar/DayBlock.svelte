<script>
  import { formatISO, parseISO, format, startOfDay, endOfDay, isWithinInterval, formatDistance } from "date-fns";
  import {eventDays} from "../../stores/store";
  import { Button, Modal, Listgroup, ListgroupItem } from 'flowbite-svelte';
  import {writable} from 'svelte/store';

  export let day;
  export let currentYear;
  export let currentMonth;

  let clickOutsideModal = false;

  const dayEvents = writable([]);
  const dayEventTitles = writable([]);
  const tempDay = writable([]);


  $: {$eventDays.forEach((d) => {
    if (formatISO(startOfDay(parseISO(d.date))) === formatISO(new Date(currentYear, currentMonth, day))) {
      tempDay.set(d)
    }
  } )}

  const startTime = new Date(currentYear, currentMonth, day);
  const endTime = endOfDay(startTime);
  const timelineSlots = [];
  let currentTime = startTime;
  while (currentTime <= endTime) {
    timelineSlots.push(currentTime);
    currentTime = new Date(currentTime.getTime() + (30 * 60 * 1000)); // Increment by 30 minutes
  }

</script>

<div
    class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400 overflow-hidden shadow-none"
    style={formatISO(new Date(currentYear, currentMonth, day)) == formatISO(startOfDay(new Date())) ? 'border-color:  #9376E0' : null}
    on:click={() => clickOutsideModal = true}
    on:keydown={() => {console.log("Keydown pressed")}}
>
    {day}
    {#if $eventDays && [...$eventDays].some((d) => formatISO(startOfDay(parseISO(d.date))) === formatISO(startOfDay(new Date(currentYear,currentMonth, day))))}
      {#each $eventDays as eventDay}
        {#if eventDay.date === formatISO(new Date(currentYear, currentMonth, day))}
        <div
          class="max-w-md space-y-1 text-gray-200 list-disc list-inside dark:text-gray-400"
        >
          {#each eventDay.matchedEvents as event}
            <div style={`background-color:  ${event.color ? `${event.color}` : "transparent"}`}>{event.title}</div>
          {/each}
        </div>
        {/if}
      {/each}
    {/if}
</div>

<Modal title={format(new Date(currentYear, currentMonth, day), "EEE, MMM do")} class="w-[40rem] h-[60rem]" bind:open={clickOutsideModal} autoclose outsideclose>
  <div class="grid grid-cols-4">
    {#each timelineSlots as slot}
    <div class="text-base font-semibold gap-2 col-start-1">
      <div>
        <span>{format(new Date(slot), "h:mm a")}
        </span>
      </div>
    </div>
    {/each}
    {#each $tempDay.matchedEvents as event}
      <!-- currently within timelineSlot's EACH slot
      going over each matched event as event
      if event time === timeslot time, display event title once -->
      <div class="col-start-2 border" style={`grid-row: ${timelineSlots.indexOf(new Date(parseISO(event.start)))} / ${timelineSlots.indexOf(new Date(parseISO(event.end)))};`}>
        {event.title}
        Start: {new Date(parseISO(event.start))}
        TimeSlots: {timelineSlots[27]}
        Index: {timelineSlots.indexOf("Tue Jun 13 2023 13:30:00 GMT-0400 (Eastern Daylight Time)")}
        Duration: {(event.duration)}
      </div>
    {/each}
  </div>
  <svelte:fragment slot='footer'>
    <Button color="green" on:click={() => alert('Handle "success"')}>Add Event</Button>
  </svelte:fragment>
</Modal>