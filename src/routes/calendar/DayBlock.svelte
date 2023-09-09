<script>
  import { differenceInMinutes, formatISO, parseISO, format, startOfDay, getHours, getMinutes, endOfDay, isWithinInterval, formatDistance } from "date-fns";
  import {eventDays} from "../../stores/store";
  import { Button, Modal, Listgroup, ListgroupItem } from 'flowbite-svelte';
  import {writable, get} from 'svelte/store';

  export let day;
  export let currentYear;
  export let currentMonth;
  export let addDayEvent;

  let clickOutsideModal = false;

  const dayEvents = writable([]);
  const dayEventTitles = writable([]);
  const tempDay = writable([]);
  const dayEStack = writable([]);


  $: {$eventDays.forEach((d) => {
    if (formatISO(startOfDay(parseISO(d.date))) === formatISO(new Date(currentYear, currentMonth, day))) {
      tempDay.set(d)
    }
  } )}

  function convertTimeSlot(start) {
    let hours = getHours(start)
    let minutes = getMinutes(start)
    let timeMinutes = (hours * 60) + minutes
    let intervalCount = timeMinutes / interval + 1
    return intervalCount
  }

  function eventStack() {
    // WRITABLE: dayEStack 
    let events = $tempDay.matchedEvents;
    let eStack = 0;
    let tempArr = [];
    if ($tempDay.matchedEvents) {
      for (let e = 0; e < events.length; e++) {
        // add all events ($tempDay.matchedEvents) inside dayEStack writable with their respective eStack numbers
        let stack = 1
        for (let i = 0; i < events.length; i++) {
          if (differenceInMinutes(parseISO(events[e].end), startOfDay(parseISO(events[e].end))) > differenceInMinutes(parseISO(events[i].start), startOfDay(parseISO(events[i].start)))) {
            stack++;
            tempArr = [...tempArr, {id: events[i].id, stack: stack}];
            // console.log("Innermost for loop");
          }
        }
        console.log("STACK", stack);
        if (stack > eStack) {
          eStack = stack;
        }
      }
    }
    console.log("eSTACK", eStack);
    dayEStack.set(tempArr);
    // all the events are listed within dayEstack with their eStack numbers
    return eStack
  }

  function matchEStack(event) {
    console.log($dayEStack);
    for (let i = 0; i < $dayEStack.length; i++) {
      if ($dayEStack[i].id === event.id) {
        return $dayEStack[i].stack;
      }
    }
    return 2
  }

  const startTime = new Date(currentYear, currentMonth, day);
  const endTime = endOfDay(startTime);
  let interval = 30;
  const timelineSlots = [];
  let currentTime = startTime;
  while (currentTime <= endTime) {
    timelineSlots.push(currentTime);
    currentTime = new Date(currentTime.getTime() + (interval * 60 * 1000)); // Increment by 30 minutes
  }

</script>

<div
    class="text-center w-full h-[7rem] border-2 dark:text-gray-400 overflow-hidden shadow-none"
    style={formatISO(new Date(currentYear, currentMonth, day)) == formatISO(startOfDay(new Date())) ? 'border-color:  #9376E0' : null}
    on:click={() => {clickOutsideModal = true; eventStack()}}
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
  <div class="grid gap-2" style={`grid-template-columns: 17% repeat(${eventStack() - 1}, 1fr)`}>
    {#each timelineSlots as slot}
    <div class="!h-4 text-sm text-base font-semibold gap-2 colabout:blank#blocked-start-1 border-t">
      <div>
        <span>{format(new Date(slot), "h:mm a")}
        </span>
      </div>
    </div>
    {/each}
    {#if $tempDay.matchedEvents}
    {#each $tempDay.matchedEvents as event}
    <div class="border" style={`color: ${event.color ? `white` : "black"}; background-color:  ${event.color ? `${event.color}` : "transparent"}; grid-row: ${convertTimeSlot(parseISO(event.start))} / span ${event.duration / interval}; grid-column-start: ${matchEStack(event)}`}>
      {event.title}
    </div>
    {/each}
    {/if}
  </div>
  <svelte:fragment slot='footer'>
    <Button color="green" on:click={() => {addDayEvent(currentYear, currentMonth, day)}}>Add Event</Button>
  </svelte:fragment>
</Modal>