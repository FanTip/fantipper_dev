// Stripe.js saving card
const express = require('express');
const router = express.Router();
// var csrf = require('csurf');
// var csrfProtection = csrf();
const stripe = require('stripe')('sk_test_lzFXk4jctTfL15eqiv0l4hJD');

const User = require('../../models/user');

router.get('/user', async function (req, res) {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send({});
  }
});

router.get('/pub', function (req, res) {
  res.status(200).json(process.env.STRIPE_PUB_KEY)
});

router.post('/intents', async function (req, res) {
  res.send(await stripe.setupIntents.create());
});

router.post('/create-customer', async function (req, res) {
  try {
    let customer = await stripe.customers.create({
      description: "Customer " + req.body.data,
    });

    let customer_query = {
      customer_id: customer.id
    }

    await User.findByIdAndUpdate(req.user._id, customer_query).exec();

    res.status(200).json({});
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/save-card-credentials', async function (req, res) {
  try {
    let card = req.body;
    let query = {
      $set: {
        'card.card_credentials': {
          id: req.body.source.id,
          card: req.body.source.card,
          type: req.body.source.type,
          object: req.body.source.object,
          status: req.body.source.status,
          usage: req.body.source.usage
        }
      }
    };

    await User.findByIdAndUpdate(req.user._id, query).exec();
    let updated_user = await User.findById(req.user._id).exec();
    console.log(updated_user);


    res.status(200).json({});
  } catch (e) {
    res.status(500).json({});
  }
});


router.post('/save-card-element', async function (req, res) {
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



    res.status(200).send(updated);
  } catch (e) {
    res.status(500).send(e);
  }

});

router.get('/saved-card', async function (req, res) {
  try {
    let card_data = await User.findById(req.user._id).exec();

    res.status(200).send(card_data.card);

  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/update_intents', async function (req, res) {
  try {
    let user = await User.findById(req.user._id).exec();
    const customer = await stripe.customers.create({
      payment_method: user.card.payment_credentials.payment_method,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'aud',
      customer: user.customer_id,
      payment_method: user.card.payment_credentials.payment_method,
      off_session: true,
      confirm: true,
    });
    console.log(paymentIntent);
  } catch (e) {
    console.log(e)
  }



  // const paymentMethod = await stripe.paymentMethods.attach(
  //   user.card.payment_credentials.payment_method,
  //   {
  //     customer: user.customer_id,
  //   }
  // );
  // console.log(user);


  // res.send(paymentMethod);
});


module.exports = router;