// Stripe.js integration

const express = require('express');
const router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

router.get('/pub', function(req, res){
    res.status(200).json(process.env.STRIPE_PUB_KEY)
});


router.post('/', function(req, res){
    console.log(req.body);
    res.send(200);
});


module.exports = router;