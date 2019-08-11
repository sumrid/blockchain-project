const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// require('./config/db');
require('./config/firebase');

const server = express();
const hostname = '0.0.0.0';
const port = 8000;

// Use middlerware
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended : true, useNewUrlParser: true }));
server.use(morgan('combined'));

// Add router
server.use('/api', require('./router'));

// Start server
server.listen(port, hostname, () => {
    console.log(`express server is running on port: ${port}`);
});

module.exports = server;