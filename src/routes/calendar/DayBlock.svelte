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
    class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400 overflow-hidden"
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
  <Listgroup class="width: 100%;">
    {#each timelineSlots as slot}
    <ListgroupItem class="text-base font-semibold gap-2">
      <div>
        <span>{format(new Date(slot), "h:mm a")}
        <!-- {#if isWithinInterval(parseISO(event.start), { start: slot, end: new Date(slot.getTime() + (30 * 60 * 1000)) })}
          {format(parseISO(event.start), "h:mm a")}
          {/if} -->
        </span>
        <!-- check to see if this timeslot has a matching event in tempDay.matchedEvents
        if it does, get that event and then display the title? -->
        
        <!-- {#if Array.from($tempDay.matchedEvents, (e => format(parseISO(e.start), "h:mm a")).includes(format(new Date(slot), "h:mm a")))}
        YES
        {/if} -->


        {#each $tempDay.matchedEvents as event}
          <!-- currently within timelineSlot's EACH slot
          going over each matched event as event
          if event time === timeslot time, display event title once -->
          {#if format(parseISO(event.start), "h:mm a") === format(new Date(slot), "h:mm a")}
            {event.title}
          {/if}
        {/each}
      </div>
    </ListgroupItem>
    {/each}
  </Listgroup>
  <svelte:fragment slot='footer'>
    <Button color="green" on:click={() => alert('Handle "success"')}>Add Event</Button>
  </svelte:fragment>
</Modal>