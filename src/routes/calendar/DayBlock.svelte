<script>
  import { formatISO } from "date-fns";
  import {eventDays} from "../../stores/store";
  import { Button, Modal, Listgroup } from 'flowbite-svelte';

  export let day;
  export let currentYear;
  export let currentMonth;

  let clickOutsideModal = false;


</script>

<div
    class="text-center w-[12rem] h-[7rem] border-2 dark:text-gray-400 overflow-hidden"
    on:click={() => clickOutsideModal = true}
>
    {day}
    {#if $eventDays && [...$eventDays].some((d) => d.date === formatISO(new Date(currentYear,currentMonth, day)))}
      <ul
        class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400"
      >
        {#each $eventDays as eventDay}
          {#if eventDay.date === formatISO(new Date(currentYear, currentMonth, day))}
            {#each eventDay.matchedEvents as event}
              <li>{event.title}</li>
            {/each}
          {/if}
        {/each}
      </ul>
    {/if}
</div>

<Modal title="Terms of Service" bind:open={clickOutsideModal} autoclose outsideclose>
  <Listgroup items={$eventDays} let:item class="w-48">
    {item}
  </Listgroup>
  <svelte:fragment slot='footer'>
    <Button on:click={() => alert('Handle "success"')}>I accept</Button>
    <Button color="alternative">Decline</Button>
  </svelte:fragment>
</Modal>