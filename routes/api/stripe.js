// Stripe.js integration

const express = require('express');
const router = express.Router();

router.get('/pub', function(req, res){
    res.status(200).json(process.env.STRIPE_PUB_KEY)
});

router.get('/sec', function(req, res){
    res.status(200).json(process.env.STRIPE_SEC_KEY)
});


module.exports = router;