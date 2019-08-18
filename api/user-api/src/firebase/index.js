const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const firebaseConfig = {
apiKey: "AIzaSyAPX4I7LmVTw6PulG1t8NjFzyEU9uB4F5o",
    authDomain: "donachain-1107.firebaseapp.com",
    databaseURL: "https://donachain-1107.firebaseio.com",
    projectId: "donachain-1107",
    storageBucket: "donachain-1107.appspot.com",
    messagingSenderId: "906687292873",
    appId: "1:906687292873:web:eb7ae3452a034641"
};

firebase.initializeApp(firebaseConfig);

exports.getProfile = async (email, password) => {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    return user.user;
}

exports.regisUser = async (email, password, name) => {
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await user.user.updateProfile({
        displayName: name
    });
    return user.user;
}