const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

import config from './firebaseConfig';
const firebaseConfig = {
    apiKey: "AIzaSyAPX4I7LmVTw6PulG1t8NjFzyEU9uB4F5o",
    authDomain: "donachain-1107.firebaseapp.com",
    databaseURL: "https://donachain-1107.firebaseio.com",
    projectId: "donachain-1107",
    storageBucket: "donachain-1107.appspot.com",
    messagingSenderId: "906687292873",
    appId: "1:906687292873:web:eb7ae3452a034641"
};

firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export default firebase.auth();