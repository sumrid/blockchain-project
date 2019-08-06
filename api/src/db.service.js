const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const DB_URL = process.env.DB_URL || 'mongodb://db:27017';
const DB_NAME = 'projects';

mongoose.connect();