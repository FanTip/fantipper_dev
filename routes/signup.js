var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var _ = require('lodash')

let Collect = require('../models/userCollect');

router.use(csrfProtection);

// router.post('/', passport.authenticate('local.signup', {failWithError : true, failureFlash:true}),
//   function(req, res, next){
//     if(req.xhr){
//       return res.json(req.user);
//     }
//     return res.json('/profile');
//   },
//   function(err, req, res, next){
//     console.log('err', err);
//     console.log(req.flash.error);
//     if(req.xhr){return json(req.session.errors);}
//     return res.redirect('/');
//   }
// );

router.post('/', async function (req, res) {
  try {
    let userData = {
      name: req.body.name,
      email: req.body.email,
      location: req.body.location
    }

    let exists;

    
    exists = await Collect.findOne({
      email: req.body.email,
      name: req.body.name
    }).exec();


    if(_.isEmpty(exists)){
      exists = await Collect.findOne({
        email : req.body.email,
      }).exec();
    }
    

    console.log(exists)
    let newUser;

    if (_.isEmpty(exists)) {
      newUser = await Collect.create(userData);
    }

    let serverRes = {
      data: newUser || exists,
      state: exists ? true : false
    }

    res.status(200).json(serverRes);
  } catch (e) {

  }
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
// check if the user is logged in or not
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signup');
}