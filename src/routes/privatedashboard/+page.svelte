<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authHandlers, authStore } from "../../stores/authStore";
    import AuthReset from '../../components/AuthReset.svelte';
    import { ButtonGroup, Button, Modal } from 'flowbite-svelte';
    import {writable, get} from 'svelte/store';
    import Appearance from './Appearance.svelte';

    let manageAccount = false;
    let settings = false;

    let email;
    authStore.subscribe(curr => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email
    })

    const settingsTab = writable("all");

    let userEmailName = email.split("@")[0]
</script>

{#if $authStore.currentUser}
<div class="flex flex-col w-full self-center gap-2">
    <h1>Hello, {userEmailName}</h1>
    <Button class="w-2/12" color="alternative" on:click={() => {settings = true}}>Settings</Button>
    <Button class="w-2/12" color="alternative" on:click={() => manageAccount = true}>Manage Account</Button>
    <Button class="w-2/12" color="alternative" on:click={authHandlers.logout}>Log Out</Button>
    
</div>
{:else}
<div>Loading.....</div>
{/if}

<Modal class='w-full' title="Manage Account" bind:open={manageAccount} autoclose><AuthReset /></Modal>
<Modal class='w-full flex flex-col' bind:open={settings}>
  <ButtonGroup class='items-center'>
    <Button on:click={() => {settingsTab.set("all")}}>All</Button>
    <Button on:click={() => {settingsTab.set("notifications")}}>Notifications</Button>
    <Button on:click={() => {settingsTab.set("appearance")}}>Appearance</Button>
  </ButtonGroup>

  <div>
    {#if $settingsTab == "all"}
    ALL
    <Appearance />
    {/if}
    {#if $settingsTab == "notifications"}
    NOTIFICATIONS
    {/if}
    {#if $settingsTab == "appearance"}
    <Appearance />
    {/if}
  </div>
</Modal>

<style>
    div {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h1 {
        text-align: center;
    }
</style>