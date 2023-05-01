<script>
    import { auth } from "../../lib/firebase/firebase.client";
    import { authStore } from "../../stores/authStore";

    let email;
    authStore.subscribe(curr => {
        email = authStore.currentUser.email
    })
</script>

<h1>CURRENT USER: {}</h1>