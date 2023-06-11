<script>
  import { formatISO, parseISO, format, endOfDay, isWithinInterval } from "date-fns";
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
  let isValidDate = '$eventDays && [...$eventDays].some((d) => startOfDay(d.date) === formatISO(new Date(currentYear,currentMonth, day)))'
  $eventDays.forEach((d) => {
    if (d.date === formatISO(new Date(currentYear, currentMonth, day))) {
      tempDay.set(d)
    }
  } )

  const startTime = new Date(currentYear, currentMonth, day);
  const endTime = endOfDay(startTime);
  const timelineSlots = [];
  let currentTime = startTime;
  while (currentTime <= endTime) {
    timelineSlots.push(currentTime);
    currentTime = new Date(currentTime.getTime() + (30 * 60 * 1000)); // Increment by 30 minutes
  }

  console.log("TEMP DAY", $tempDay);

</script>

<div
    class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400 overflow-hidden"
    on:click={() => {$tempDay.matchedEvents && $tempDay.matchedEvents.length > 0 ? clickOutsideModal = true : null}}
    on:keydown={() => {}}
>
    {day}
    {#if isValidDate}
      {#each $eventDays as eventDay}
        {#if eventDay.date === formatISO(new Date(currentYear, currentMonth, day))}
        <ul
          class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"
        >
          {#each eventDay.matchedEvents as event}
            <li>{event.title}</li>
          {/each}
        </ul>
        {/if}
      {/each}
    {/if}
</div>

<Modal title={format(new Date(currentYear, currentMonth, day), "EEE, MMM do")} class="w-[40rem] h-[60rem]" bind:open={clickOutsideModal} autoclose outsideclose>
  <Listgroup class="width: 100%;">
    {#each timelineSlots as slot}
    <ListgroupItem class="text-base font-semibold gap-2">
      <p>
        {#each $tempDay.matchedEvents as event}
        {#if isWithinInterval(parseISO(event.start), { start: slot, end: new Date(slot.getTime() + (30 * 60 * 1000)) })}
        <span>
          {format(parseISO(event.start), "h:mm a")}
        </span>
        : {event.title}
        {/if}
        {/each}
      </p>
    </ListgroupItem>
    {/each}
  </Listgroup>
  <svelte:fragment slot='footer'>
    <Button color="green" on:click={() => alert('Handle "success"')}>Add Event</Button>
  </svelte:fragment>
</Modal>