const express = require('express');
const router = express.Router();
const contorller = require('./controller');

router.get('/', (req, res) => {
    res.send('Hello world! from home');
});

router.post('/register/donator', contorller.registerDonator);
router.post('/register/creator', contorller.registerCreator);
router.post('/profile/', contorller.getProfile);  // TODO อัพเดทโปรไฟล์ย้ายไปทำบน UI
router.get('/profile/');  // ย้ายไป UI

module.exports = router;