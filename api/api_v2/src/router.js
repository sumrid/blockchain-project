const express = require('express');
const router = express.Router();
const contorller = require('./controller/controller');
const userController = require('./controller/user');

router.get('/query/:key', contorller.query);

router.put('/project', contorller.updateProject);
router.post('/project', contorller.createProject);
router.get('/project', contorller.getAllProjects);
router.delete('/project', contorller.deleteProject);
router.get('/project/:project/events', contorller.getEvents);
router.get('/project/:project/history', contorller.getHistory);
router.post('/project/status', contorller.updateProjectStatus);
router.get('/project/:project/donations/', contorller.getDonationHistory);

// TODO : verify token
router.post('/project/donate', contorller.donate);
router.post('/project/donate/qr', contorller.createQR);             // v2 ออก QRcode promptpay 
router.post('/project/donate/readqr', contorller.readQR);           // บริจาคและลบ QRcode
router.post('/project/donate/qr/v2', contorller.createQrDonation);  // genQR + firebase
router.post('/project/donate/qr/v3', contorller.createQRv3);        // v3 ออกQR เป็นแบบ Url

// User
router.post('/user', userController.regisUser);
router.get('/user/:id/project', userController.getProjects);
router.get('/user/:id/donation', userController.getDonations);
router.get('/user/:id/receive', userController.getReceiveProject);

router.get('/tx/:txid', contorller.getTx);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;