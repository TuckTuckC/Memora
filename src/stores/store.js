import {writable, readable} from 'svelte/store';

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

export const colors = readable([
    '#9BABB8',
    '#5C8984',
    '#FCF9BE',
    '#FF8787',
    '#537188',
    '#E8A0BF',
    '#B2A4FF',
    '#A7727D',
])

export const storeTasks = writable([]);
export const storeTasksLabels = writable([]);
export const labelsAdded = writable([]);

export const notes = writable([])
export const oldNotes = writable([])
export const oldTasks = writable([])

export const events = writable([])

export const userDays = writable([])
export const eventDays = writable([])

export const signModalState = writable(false);

export const dateTime = writable(getDateTime());