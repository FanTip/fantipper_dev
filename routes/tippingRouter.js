var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var _ = require('lodash');
var Tipper = require('../models/tipper');
var Tippee = require('../models/tippee');

var stripe = require("stripe")("sk_test_lzFXk4jctTfL15eqiv0l4hJD");

router.use(csrfProtection);

function amount(amount){
    return parseFloat(amount).toFixed(3)*100;
}

async function saveTip(charge, req, res){

    let tippeeData = {
        tipAmount : charge.amount,
        tipFrom : req.body._email,
        tipDate : charge.created
    };
    await Tippee.create(tippeeData);

    if(! _.isEmpty(req.user)){
        let tipperData = {
            tipAmount : charge.amount,
            tipDate : charge.created,
            tipTo : req.body._creatorEmail
        }
        await Tipper.create(tipperData);
    }
    res.status(200).send(charge);
}
    
// sending a tip to the reciepient 
router.post('/sendtip', async function(req, res, next){
    try{
        const token = req.body._stripeID;
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