import { authStore } from "../stores/authStore";

let store;
authStore.subscribe((value) => {
  store = value;
});

export async function sendPostRequest() {
  const url = "http://localhost:3000"; // Replace this with your NestJS backend URL

  const payload = {
    key1: "value1",
    key2: "value2",
    // additional data you want to send in the request body
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, requestOptions);
    const text = await response.text(); // Log the raw text response

    // Then try to convert to JSON
    try {
      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
    } catch (parseError) {
      console.log("Could not parse as JSON:", parseError);
    }
  } catch (fetchError) {
    console.log("There was an error with the fetch:", fetchError);
  }
}

export async function sendNotification() {
  const token = store.currentUser.FCMToken;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token }), // You can also send other data needed by the server
  };

  try {
    const response = await fetch(
      "http://localhost:3000/send-notification",
      requestOptions
    ); // Replace with your actual server URL

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Notification sent:", data);
  } catch (error) {
    console.log("There was a problem sending the notification:", error);
  }
}
