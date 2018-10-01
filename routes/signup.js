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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Signup', csrfToken : req.csrfToken(), messages : req.session.errors});
});

// authenticate user
// router.post('/', passport.authenticate('local.signup',{
//     successRedirect: '/profile',
//     failureRedirect: '/signup',
//     failureFlash: true
// }));

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



// router.post('/', function(req, res, next){
//   passport.authenticate('local.signup', function(err, user, info){
//     if(err){ console.log(err);}
//     if(user){ console.log(user);}
//     if(info){ console.log(info);}    
//   });
// });


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