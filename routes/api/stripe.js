// Stripe.js saving card
const express = require('express');
const router = express.Router();
// var csrf = require('csurf');
// var csrfProtection = csrf();
const stripe = require('stripe')('sk_test_lzFXk4jctTfL15eqiv0l4hJD');

const User = require('../../models/user');

router.get('/pub', function (req, res) {
    res.status(200).json(process.env.STRIPE_PUB_KEY)
});

router.post('/intents', async function (req, res) {
    res.send(await stripe.setupIntents.create());
});

router.post('/save-card-element', async function (req, res) {
    try {
        query = {
            $set: {
                'card.isCard': true,
                'card.cardDetails': req.body
            }
        }
        await User.findByIdAndUpdate(req.user._id, query).exec();
        let updated = await User.findById(req.user._id).exec();
        res.status(200).send(updated);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.post('/', function (req, res) {
    const customer = stripe.customers.create({
        email: req.body.email,
    });

    res.send(customer);
});


module.exports = router;