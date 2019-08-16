const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

router.post('/register/donator', contorller.registerDonator);
router.post('/register/creator', contorller.registerCreator);

module.exports = router;