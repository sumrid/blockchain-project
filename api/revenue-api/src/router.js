const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', (req, res)=>{
    res.json({message:"Hello from revenue department.", status: 200})
});

router.get('/invoice/:number', controller.getINV);
router.post('/invoice', controller.addINV);

module.exports = router;