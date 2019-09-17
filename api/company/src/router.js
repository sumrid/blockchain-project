const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', (req, res)=>{
    res.json({message:"Hello from store.", status: 200})
});

router.get('/products', controller.getProducts);

module.exports = router;