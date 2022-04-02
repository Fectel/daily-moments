import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyC1ERMXlKEiLY-2WrJkXpLDG4mHha0iNYI",
    authDomain: "daily-moments-fe801.firebaseapp.com",
    projectId: "daily-moments-fe801",
    storageBucket: "daily-moments-fe801.appspot.com",
    messagingSenderId: "1036578516348",
    appId: "1:1036578516348:web:db2fbe69741c7621c448f9"
};

const app = firebase.initializeApp(firebaseConfig)

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();