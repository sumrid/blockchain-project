const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.get('/query/:key', contorller.query);
router.get('/project', contorller.getAllProjects);
router.get('/project/history/:key', contorller.getHistory);
router.post('/project/status', contorller.updateProjectStatus);
router.get('/project/donations/:key', contorller.getDonationHistory);
router.get('/project/:project/events', contorller.getEvent);
router.get('/project/:project/invoice', contorller.getInvoice);
router.post('/project/:project/invoice', contorller.sendInvoice);
router.post('/invoice', contorller.sendInvoice);

// User
router.post('/user/register', contorller.registerReceiver);
router.get('/user/:id/project', contorller.getAllProjectByUserID);
router.get('/user/:id/receive', contorller.getAllProjectByReceiver);
router.get('/user/:id', contorller.getUser);

router.get('/tx/:txid', contorller.getTx);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;