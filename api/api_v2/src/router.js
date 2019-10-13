const express = require('express');
const router = express.Router();
const contorller = require('./controller/controller');

const userController = require('./controller/user');
const invoiceController = require('./controller/invoice');
const projectController = require('./controller/project');
const donationController = require('./controller/donation');
const transferController = require('./controller/transfer');

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
router.post('/project/donate/qr', donationController.createQR);             // v2 ออก QRcode promptpay 
router.post('/project/donate/readqr', donationController.readQR);           // บริจาคและลบ QRcode
router.post('/project/donate/qr/v2', donationController.createQrDonation);  // genQR + firebase
router.post('/project/donate/qr/v3', donationController.createQRv3);        // v3 ออกQR เป็นแบบ Url

router.post('/invoice', invoiceController.sendInvoice);
router.get('/invoice/:id', invoiceController.getInvoice);
router.get('/invoices', invoiceController.getAllInvoices);

router.post('/withdraw', transferController.withdrawFromProject);

// User
router.post('/user', userController.regisUser);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.post('/user/:id/rating', userController.rating);
router.get('/user/:id/uid', userController.getUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id/verify/idcard', userController.verifyUserIDCard);
router.get('/user/:id/project', userController.getProjects);
router.get('/user/:id/donation', userController.getDonations);
router.get('/user/:id/receive', userController.getReceiveProject);

router.get('/tx/:txid', contorller.getTx);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;