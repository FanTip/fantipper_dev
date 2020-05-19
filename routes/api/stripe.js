// Stripe.js saving card
const express = require('express');
const router = express.Router();
const _ = require('lodash');
// let csrf = require('csurf');
// let csrfProtection = csrf();
const stripe = require('stripe')('sk_test_lzFXk4jctTfL15eqiv0l4hJD');
const log = require('../../config/log');

const User = require('../../models/user');

router.get('/user', function (req, res) {
    try {
        if (req.user) {
            console.log(req.user);
            res.status(200).json(req.user);
        } else {
            res.status(200).json(false);
        }

    } catch (e) {
        log.log_save(e);
        res.status(500).send({});
    }
});

router.get('/is_card', async function (req, res) {
    try {
        let user = await User.findById(req.user._id).exec();
        res.status(200).send(user.card.isCard);
    } catch (e) {
        log.log_save(e);
        res.send(e);
    }
});

router.get('/pub', function (req, res) {
    res.status(200).json(process.env.STRIPE_PUB_KEY)
});

router.post('/intents', async function (req, res) {
    try {
        let today = new Date();
        let date = today.getFullYear() + '-' +
            (today.getMonth() + 1) + '-' +
            today.getDate() + '--' +
            (today.getHours() > 12 ? (today.getHours() - 12) : today.getHours()) + ':' +
            today.getMinutes() + ':' + today.getSeconds() + ':' +
            today.getMilliseconds();


        let user = await User.findById(req.user._id).exec();
        let existing_customer = user.customer_id ? await stripe.customers.retrieve(user.customer_id) : null;
        if (_.isNull(existing_customer)) {
            let customer = await stripe.customers.create({
                email: user.email,
                description: "Customer " + user.email + ' Created at :' + date,
            });

            let customer_query = {
                customer_id: customer.id
            }
            let usertest = await User.findByIdAndUpdate(req.user._id, customer_query).exec();

            let intent = await stripe.setupIntents.create({
                customer: customer.id
            });
            let cust = await stripe.customers.retrieve(customer.id);
            res.status(200).send(intent);
        } else {
            res.status(200).send({});
        }
    } catch (e) {
        log.log_save(e);
        res.status(500).send(e);
    }
});

router.post('/save-card-credentials', async function (req, res) {
    try {
        let card = req.body.source;

        let query = {
            $set: {
                'card.card_data': card
            }
        }

        await User.findByIdAndUpdate(req.user._id, query).exec();
        let updated_user = await User.findById(req.user._id).exec();
        res.status(200).json({});
    } catch (e) {
        log.log_save(e);
        res.status(500).json({});
    }
});


router.post('/save-payment-method', async function (req, res) {
    try {
        let query = {
            $set: {
                'card.isCard': true,
                'card.payment_credentials': {
                    id: req.body.id,
                    object: req.body.object,
                    created: req.body.created,
                    payment_method: req.body.payment_method,
                    payment_method_types: req.body.payment_method_types,
                    status: req.body.status
                }
            }
        }


        await User.findByIdAndUpdate(req.user._id, query).exec();
        let updated = await User.findById(req.user._id).exec();
        let intent = await stripe.setupIntents.create({
            customer: updated.customer_id
        });


        res.status(200).send(updated);
    } catch (e) {
        log.log_save(e);
        res.status(500).send(e);
    }

});

router.get('/saved-card', async function (req, res) {
    try {
        let card_data = await User.findById(req.user._id).exec();

        res.status(200).send(card_data.card);

    } catch (e) {
        log.log_save(e);
        res.status(500).send(e);
    }
});

router.post('/attach_customer', async function (req, res) {
    try {
        let user = await User.findById(req.user._id).exec();
        // Attach Once
        const paymentMethod = await stripe.paymentMethods.attach(
            user.card.payment_credentials.payment_method, {
            customer: user.customer_id,
        }
        );

        let retrive_customers = await stripe.customers.retrieve(user.customer_id);
        res.send(paymentMethod);
    } catch (e) {
        log.log_save(e);
        res.send(e);
    }
});


router.get('/delete-card', async function (req, res) {
    try {
        let user = await User.findById(req.user._id).exec();

        let existing_customer = await stripe.customers.retrieve(user.customer_id);
        if (!_.isEmpty(existing_customer)) {
            let deleted_cutomer = await stripe.customers.del(user.customer_id);

            let query = {
                $set: {
                    'card.isCard': false,
                }
            }
            let query1 = {
                $unset: {
                    'card.card_data': "",
                    'card.payment_credentials': "",
                    'customer_id': ""
                }
            }
            await User.findByIdAndUpdate(req.user._id, query).exec();
            await User.findByIdAndUpdate(req.user._id, query1).exec();

            res.send(deleted_cutomer);
        } else {
            res.send({});
        }

    } catch (e) {
        log.log_save(e);
        res.send(e);
    }
});



module.exports = router;
