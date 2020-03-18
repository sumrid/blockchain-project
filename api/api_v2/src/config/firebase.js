const path = require('path');
var admin = require("firebase-admin");

const keyPath = path.resolve(process.cwd(), '..', '..', 'cert', 'firebase', 'adminKey.json'); // local dev key path
const FIREBASE_KEY = process.env.FIREBASE_KEY || keyPath;

var serviceAccount = require(FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://donachain-1107.firebaseio.com"
});