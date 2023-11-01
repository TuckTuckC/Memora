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

export const guestNotes = writable([
    {
        body: "Insert your beautiful note text here",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Note Title 1",
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your beautiful note text here",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Note Title 2",
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your beautiful note text here",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Note Title 3",
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your beautiful note text here",
        createdAt: "2023-06-11T22:16:17-05:00",
        title: "Note Title 4",
        updatedAt: "2023-06-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your beautiful note text here",
        createdAt: "2023-06-11T22:16:17-05:00",
        title: "Note Title 5",
        updatedAt: "2023-06-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
])
export const guestTasks = writable([
    {
        body: "Insert your upcoming task here!",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Task Title 1",
        labels: ["Awesome label #1", "Awesome label #2"],
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your upcoming task here!",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Task Title 2",
        labels: ["Awesome label #1"],
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your upcoming task here!",
        createdAt: "2023-04-11T22:16:17-05:00",
        title: "Task Title 3",
        labels: ["Awesome label #3", "Awesome label #4"],
        updatedAt: "2023-04-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your upcoming task here!",
        createdAt: "2023-06-11T22:16:17-05:00",
        title: "Task Title 4",
        labels: ["Awesome label #5"],
        updatedAt: "2023-06-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Insert your upcoming task here!",
        createdAt: "2023-06-11T22:16:17-05:00",
        title: "Task Title 5",
        updatedAt: "2023-06-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
])
export const guestOldNotes = writable([
    {
        body: "These are notes from way back when!",
        createdAt: "2023-01-11T22:16:17-05:00",
        title: "Old Note Title 2",
        updatedAt: "2023-01-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "These are notes from way back when!",
        createdAt: "2023-01-7T22:16:17-05:00",
        title: "Old Note Title 3",
        updatedAt: "2023-01-7T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "These are notes from way back when!",
        createdAt: "2023-01-1T22:16:17-05:00",
        title: "Old Note Title 1",
        updatedAt: "2023-01-1T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
])
export const guestOldTasks = writable([
    {
        body: "Tasks as old as the dinosaurs",
        createdAt: "2023-01-11T22:16:17-05:00",
        title: "Old Task Title 1",
        labels: ["Awesome label #1", "Awesome label #2"],
        updatedAt: "2023-01-11T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Tasks as old as the dinosaurs",
        createdAt: "2023-01-7T22:16:17-05:00",
        title: "Old Task Title 2",
        labels: ["Awesome label #1"],
        updatedAt: "2023-01-7T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
    {
        body: "Tasks as old as the dinosaurs",
        createdAt: "2023-01-1T22:16:17-05:00",
        title: "Old Task Title 3",
        labels: ["Awesome label #3", "Awesome label #4"],
        updatedAt: "2023-01-1T22:16:17-05:00",
        user_id: "dummydata@fake.com",
    }, 
])
export const guestTaskLabels = writable(["Awesome label #1", "Awesome label #2", "Awesome label #3", "Awesome label #4", "Awesome label #5"])
export const guestLabelsAdded = writable(["Added label #1", "Added label #2", "Added label #3"])
export const guestStoreTasksLabels = writable([{labelName: "My label #1"}, {labelName: "My label #2"}, {labelName: "My label #3"}])