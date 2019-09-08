const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.post('/project', contorller.createProject);
router.get('/project', contorller.getAllProjects);
router.put('/project', contorller.updateProject);
router.delete('/project', contorller.deleteProject);
router.post('/project/update/status', contorller.updateProjectStatus);
router.post('/project/donate', contorller.donate);
router.get('/query/:key', contorller.query);
router.get('/project/history/:key', contorller.getHistory);
router.get('/project/donations/:key', contorller.getDonationHistory);
// TODO : verify token
router.post('/project/donate/qr', contorller.createQR);             // v2 ออก QRcode promptpay 
router.post('/project/donate/readqr', contorller.readQR);           // บริจาคและลบ QRcode
router.post('/project/donate/qr/v2', contorller.createQrDonation);  // genQR + firebase
router.post('/project/donate/qr/v3', contorller.createQRv3);        // v3 ออกQR เป็นแบบ Url

// User
router.get('/user/:id/donation', contorller.getDonationByUserID);
router.get('/user/:id/project', contorller.getAllProjectByUserID);
router.get('/user/:id/receive', contorller.getAllProjectByReceiver);

router.get('/tx/:txid', contorller.getTx);
router.post('/test', contorller.testSave);
router.post('/testget', contorller.testGet);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;