const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.post('/project', contorller.createProject);
router.get('/project', contorller.getAllProjects);
router.post('/project/donate', contorller.donate);
router.post('/project/donate/qr', contorller.createQR);
router.get('/query/:key', contorller.query);
router.get('/project/history/:key', contorller.getHistory);
router.get('/project/donations/:key', contorller.getDonationHistory);

router.post('/test', contorller.testSave);
router.post('/testget', contorller.testGet);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;