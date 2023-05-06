import {writable} from 'svelte/store';

function getDateTime() {
    let time = new Date();
    
    $: hours = time.getHours();
	$: minutes = time.getMinutes();
	$: seconds = time.getSeconds();
}

export const dateTime = writeable('');