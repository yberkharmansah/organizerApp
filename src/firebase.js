// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBRCdVI3EKJCS2KuJec36OD9jfuqmJtfB8",
    authDomain: "organizerapp-1cf1f.firebaseapp.com",
    projectId: "organizerapp-1cf1f",
    databaseURL: "https://organizerapp-1cf1f-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "organizerapp-1cf1f.appspot.com",
    messagingSenderId: "11756220835",
    appId: "1:11756220835:web:4ebddd25a171cec72e6a16",
    measurementId: "G-XCW9LPCZE3"
  };

// Firebase'i başlat
const app = initializeApp(firebaseConfig);



// Authentication ve Firestore'u al
const auth = getAuth(app);
const db = getDatabase(app);
const eventsRef = dbRef(db, 'events'); // Veritabanındaki etkinlikler için referans

export { auth, db , dbRef};
