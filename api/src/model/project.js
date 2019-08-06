const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const projectSchema = new mongoose.Schema({
    id: uuid(),
    title: String
});