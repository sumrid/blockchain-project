const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.post('/project', contorller.createProject);
router.get('/project', contorller.getAllProjects);
router.post('/project/donate', contorller.donate);
router.get('/query/:key', contorller.query);
router.get('/project/history/:key', contorller.getHistory);
router.get('/project/donations/:key', contorller.getDonationHistory);

router.post('/project/donate/qr', contorller.createQR);   // ออก QRcode
router.post('/project/donate/readqr', contorller.readQR); // บริจาคและลบ QRcode
router.post('/project/donate/qr/v2', contorller.createQrDonation);

router.post('/test', contorller.testSave);
router.post('/testget', contorller.testGet);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;