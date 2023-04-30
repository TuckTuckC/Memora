import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD-D14reNH4taY5EFKRCcJUOcA_0eluF9A",
    authDomain: "memora-fbbcf.firebaseapp.com",
    projectId: "memora-fbbcf",
    storageBucket: "memora-fbbcf.appspot.com",
    messagingSenderId: "719301821680",
    appId: "1:719301821680:web:6e8341b01d1ec3cc8eae35",
    measurementId: "G-EJJ1CMWYCE"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
