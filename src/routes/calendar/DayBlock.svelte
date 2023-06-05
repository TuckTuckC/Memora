<script>
  import { formatISO } from "date-fns";
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
  let isValidDate = $eventDays && [...$eventDays].some((d) => d.date === formatISO(new Date(currentYear,currentMonth, day)))
  $eventDays.forEach((d) => {
    if (d.date === formatISO(new Date(currentYear, currentMonth, day))) {
      tempDay.set(d)
    }
  } )


</script>

<div
    class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400 overflow-hidden"
    on:click={() => clickOutsideModal = true}
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

<Modal title="Terms of Service" class="w-[30rem]" bind:open={clickOutsideModal} autoclose outsideclose>
  <Listgroup items={$tempDay.matchedEvents} let:item class="w-96">
    <ListgroupItem class="text-base font-semibold gap-2">
      <p>{item.title}</p>
    </ListgroupItem>
  </Listgroup>
  <svelte:fragment slot='footer'>
    <Button on:click={() => alert('Handle "success"')}>I accept</Button>
    <Button color="alternative">Decline</Button>
  </svelte:fragment>
</Modal>