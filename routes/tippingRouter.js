var express = require('express');
var router = express.Router();
var empty = require('is-empty');
var fs = require('fs');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var User = require('../models/user');
var toastr = require('toastr');
var tipper = require('../models/tipper');
var tippee = require('../models/tippee');
var message = require('../models/message');

var stripe = require("stripe")("sk_test_lzFXk4jctTfL15eqiv0l4hJD");

router.use(csrfProtection);

function amount(amount){
    return parseFloat(amount).toFixed(3)*1000;
}

// sending a tip to the reciepient 
router.post('/sendtip', function(req, res, next){

    console.log(req.body);
    console.log(req.body._stripeID)

    console.log(parseFloat(req.body._amount).toFixed(3)*1000);

    const token = req.body._stripeID;

    stripe.customers.create({
        // this email is creators email   need to change later on
        email : req.body._email,
        source : token
    })
    .then(customer => stripe.charges.create({
        amount : amount(req.body._amount),
        currency : 'aud',
        customer : customer.id
    }))
    .then(charge => res.status(200).send('OK'));

    // (async () => {
    //     const charge = await stripe.charges.create({
    //         amount : amount(req.body._amount),
    //         currency : 'usd',
    //         description : req.body._description,
    //         source : token
    //     });

    //     console.log(charge);
    // });
    

    // if sender is logged in to the fantipper website
    // if(res.locals.login){
    //     var tipperData = new tipper({
    //         tipperID : req.user._id,
    //         tipAmount : req.body._tipamount,
    //         tipTo : req.body._creatorEmail,
    //         tipDate : Date.now()
    //     });
        
    //     if(req.body._message){
    //         var tipMessage = new message({
    //             creatorEmail : req.body._creatorEmail,   
    //             messageFrom : req.user.email,
    //             content : req.body._message,
    //             sentDate : Date.now(),
    //             isRead : false,
    //             reply : {
    //                 replyFrom : null,
    //                 replyDate : null,
    //                 replyContent : null 
    //             }
    //         });
    //     }
        

    //     console.log(tipperData);
    //     tipperData.save(function(err){
    //         if(err){
    //             console.log(err);
    //         }else{
    //             if(req.body._message){
    //                 tipMessage.save(function(err){
    //                     console.log(err);
    //                 });
    //             }
    //         }
    //         User.findOne({'creator.creatorEmail':req.body._creatorEmail}).exec(function(err, creator){
    //             var tippeeData = new tippee({
    //                 tipeeID : creator._id,
    //                 tipAmount : req.body._tipamount,
    //                 tipFrom : req.body._creatorEmail,
    //                 tipDate : Date.now(),
    //             });
    //             tippeeData.save(function(err){
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     res.status(200).send('done');
    //                 }
    //             });
    //         });
            
    //     });

        
    // } else //if user is not logged in to the website
    // {
    //     User.findOne({'creator.creatorEmail':req.body._creatorEmail}).exec(function(err, creator){
    //         console.log(req.body);
    //         var tipeeData = new tippee({
    //             tipeeID : creator._id,
    //             tipAmount : req.body._tipamount,
    //             tipFrom : req.body._email,
    //             tipDate : Date.now(),
    //         });

    //         if(req.body._message){
    //             var tipMessage = new message({
    //                 creatorEmail : req.body._creatorEmail,
    //                 messageFrom : req.body._email,
    //                 content : req.body._message,
    //                 sentDate : Date.now(),
    //                 isRead : false,
    //                 reply : {
    //                     replyFrom : null,
    //                     replyDate : null,
    //                     replyContent : null
    //                 }
    //             });
    //         }

    //         console.log(tipeeData);
    //         tipeeData.save(function(err){
    //             if(err){ res.status(500).send(err);}
    //             else{
    //                 if(req.body._message){
    //                     tipMessage.save(function(err){
    //                         if(err){
    //                             console.log(err);
    //                         }
    //                     });
    //                 }
    //                 res.status(200).send('done');
    //             }
                
    //         });
    //     });
        
    //     console.log(req.body);
    // }
});


module.exports = router;