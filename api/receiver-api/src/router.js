const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.get('/project', contorller.getAllProjects);
router.post('/project/update/status', contorller.updateProjectStatus);
router.get('/query/:key', contorller.query);
router.get('/project/history/:key', contorller.getHistory);
router.get('/project/donations/:key', contorller.getDonationHistory);

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