<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authHandlers, authStore } from "../../stores/authStore";
    import AuthReset from '../../components/AuthReset.svelte';
    import { ButtonGroup, Button, Modal } from 'flowbite-svelte';

    let defaultModal = false;

    let email;
    authStore.subscribe(curr => {
        console.log('CURR', curr);
        email = curr?.currentUser?.email
    })

    let userEmailName = email.split("@")[0]
</script>

{#if $authStore.currentUser}
<div class="flex flex-col w-full self-center gap-2">
    <h1>Hello, {userEmailName}</h1>
    <Button class="w-2/12" color="alternative" on:click={() => {}}>Settings</Button>
    <Button class="w-2/12" color="alternative" on:click={() => defaultModal = true}>Manage Account</Button>
    <Button class="w-2/12" color="alternative" on:click={authHandlers.logout}>Log Out</Button>
    
</div>
{:else}
<div>Loading.....</div>
{/if}

<Modal class='w-full' title="Manage Account" bind:open={defaultModal} autoclose><AuthReset /></Modal>

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