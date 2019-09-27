const express = require('express');
const router = express.Router();
const contorller = require('./controller/controller');

const userController = require('./controller/user');
const projectController = require('./controller/project');
const donationController = require('./controller/donation');

router.get('/query/:key', contorller.query);

router.put('/project', projectController.updateProject);
router.post('/project', projectController.createProject);
router.get('/project', projectController.getAllProjects);
router.delete('/project', projectController.deleteProject);
router.get('/project/:project', projectController.getProjectByID);
router.post('/project/status', projectController.updateProjectStatus);
router.get('/project/:project/events', projectController.getProjectEvents);
router.get('/project/:project/invoice', projectController.getProjectInvoices);
router.get('/project/:project/history', projectController.getProjectDonations);
router.get('/project/:project/donations', projectController.getProjectDonations);

// TODO : verify token
router.post('/project/donate', donationController.donate);
router.post('/project/donate/qr', donationController.readQR);             // v2 ออก QRcode promptpay 
router.post('/project/donate/readqr', contorller.readQR);           // บริจาคและลบ QRcode
router.post('/project/donate/qr/v2', contorller.createQrDonation);  // genQR + firebase
router.post('/project/donate/qr/v3', contorller.createQRv3);        // v3 ออกQR เป็นแบบ Url

router.post('/invoice',);

// User
router.get('/user');
router.post('/user', userController.regisUser);
router.get('/user/:id/project', userController.getProjects);
router.get('/user/:id/donation', userController.getDonations);
router.get('/user/:id/receive', userController.getReceiveProject);

router.get('/tx/:txid', contorller.getTx);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;