const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'projects';
const CONNECTION_URL = DB_URL + '/' + DB_NAME;

try {
    mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });
    console.log('connect to mongoDB at ' + CONNECTION_URL)
} catch (err) {
    console.error(err());
}