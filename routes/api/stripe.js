// Stripe.js integration

const express = require('express');
const router = express.Router();
// var csrf = require('csurf');
// var csrfProtection = csrf();
const stripe = require('stripe')('sk_test_lzFXk4jctTfL15eqiv0l4hJD');

router.get('/pub', function(req, res){
    res.status(200).json(process.env.STRIPE_PUB_KEY)
});


router.post('/', function(req, res){
    const customer = stripe.customers.create({
        email : req.body.email,
    });

    res.send(customer);
});


module.exports = router;