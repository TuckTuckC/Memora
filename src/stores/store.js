import {writable} from 'svelte/store';

function getDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateTime = {
        date: new Date().toLocaleDateString("en-US", options),
        time: new Date().toLocaleTimeString(),
        time24: new Date().toLocaleTimeString([], {hour12: false}),
        utc: new Date().toUTCString(),
        timeZoneOffset: `UTC${new Date().getUTCHours() > new Date().getHours() ? '-' : ''}${(new Date().getUTCHours()) - (new Date().getHours())}`

    }



    return dateTime
}

export const notes = writable([])

export const dateTime = writable(getDateTime());