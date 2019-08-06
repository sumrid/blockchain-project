const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.post('/project', contorller.createProject);
router.post('/donate', contorller.donate);
router.get('/query/:key', contorller.query);
router.get('/history/:key', contorller.getHistory);
router.get('/donations/:key', contorller.getDonationHistory);

router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;