const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.get('/query/:key', contorller.query);
router.put('/project', contorller.updateProject);
router.post('/project', contorller.createProject);
router.get('/project', contorller.getAllProjects);
router.delete('/project', contorller.deleteProject);
router.get('/project/history/:key', contorller.getHistory);
router.get('/project/donations/:key', contorller.getDonationHistory);
router.post('/project/update/status', contorller.updateProjectStatus);

// User
router.post('/user/register', contorller.registerCreator);
router.get('/user/:id/project', contorller.getAllProjectByUserID);

router.get('/tx/:txid', contorller.getTx);
router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

module.exports = router;