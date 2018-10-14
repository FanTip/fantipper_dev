var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

router.use(csrfProtection);

router.use('/', notLoggedIn, function(req, res, next){
  console.log('var: ', req.session.errors);
  
  next();
});


router.post('/', passport.authenticate('local.signup', {failWithError : true, failureFlash:true}),
  function(req, res, next){
    if(req.xhr){
      return res.json(req.user);
    }
    return res.json('/profile');
  },
  function(err, req, res, next){
    console.log('err', err);
    console.log(req.flash.error);
    if(req.xhr){return json(req.session.errors);}
    return res.redirect('/');
  }
);


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}
// check if the user is logged in or not
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/signup');
}