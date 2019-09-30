if (process.env.NODE_ENV !== "test") {
    require('@google-cloud/trace-agent').start();
}
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const ORG = process.env.ORG;
require('custom-env').env(ORG);

const port = process.env.PORT || 8000;
const hostname = '0.0.0.0';
const server = express();

// Use middlerware
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
server.use(morgan('combined'));

// Add router
server.use('/api', require('./router'));

// Start server
server.listen(port, hostname, () => {
    console.log(`${ORG} server is running on port: ${port}`);
});

// https.createServer({
//     key: fs.readFileSync('../../etc/letsencrypt/domain.key'),
//     cert: fs.readFileSync('../../etc/letsencrypt/chained.pem')
// }, server)
// .listen(port, ()=> {
//     console.log(`${ORG} server is running on port: ${port}`);
// });

module.exports = server;