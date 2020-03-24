import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB5ZpABFeKY1Nm2lgMGY3jiksbHun3udBw",
    authDomain: "mine-todo-list-33a64.firebaseapp.com",
    databaseURL: "https://mine-todo-list-33a64.firebaseio.com",
    projectId: "mine-todo-list-33a64",
    storageBucket: "mine-todo-list-33a64.appspot.com",
    messagingSenderId: "299596834169",
    appId: "1:299596834169:web:d39758235a39a5ca9d7ba8",
    measurementId: "G-QH8H47STQY"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;
