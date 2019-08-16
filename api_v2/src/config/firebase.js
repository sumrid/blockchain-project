var admin = require("firebase-admin");

var serviceAccount = require("./adminKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://donachain-1107.firebaseio.com"
});