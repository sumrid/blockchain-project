var admin = require('firebase-admin');

const serviceAccount = require('./adminKey.json'); // Key for firebase project.

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://donachain-1107.firebaseio.com"
});