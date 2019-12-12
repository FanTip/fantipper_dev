let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let csrfProtection = csrf();
let _ = require('lodash');
let Tipper = require('../models/tipper');
let Tippee = require('../models/tippee');

let mongoose = require('mongoose');

let tips = require('../models/tips');

let stripe = require("stripe")("sk_test_lzFXk4jctTfL15eqiv0l4hJD");

router.use(csrfProtection);

function amount(amount){
    return parseFloat(amount).toFixed(3)*100;
}

async function saveTip(charge, req, res){
    
    let loggedIn = req.isAuthenticated() ? req.user._id : 0;
    let tip = {
        id :  mongoose.Types.ObjectId(req.body._receiver_id),
        amount : charge.amount,
        creator_email : req.body._creatorEmail, 
        pay_email : req.body._email,
        date : new Date(),
        loggedIn : mongoose.Types.ObjectId(loggedIn),
        tipmessage : req.body._description ? req.body._description : ""
    }

    let tipCreated = await tips.create(tip);

    res.status(200).send(charge);
}
    
// sending a tip to the reciepient 
router.post('/sendtip', async function(req, res, next){
    try{
        const token = req.body._stripeID;
        console.log(token);
        stripe.customers.create({
            email : req.body._email,
            source : token
        })
        .then(customer => stripe.charges.create({
            amount : amount(req.body._amount),
            currency : 'aud',
            customer : customer.id,
            receipt_email : req.body._email
        }))
        .then(charge => saveTip(charge, req, res));
    }
    catch(e){
        console.error(e);
    }
    
});


module.exports = router;