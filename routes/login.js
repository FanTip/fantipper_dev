var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

router.use(csrfProtection);

router.use('/', notLoggedIn, function(req, res, next){
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', csrfToken : req.csrfToken()});
});

// authenticate user
// router.post('/', passport.authenticate('local.signin',{
//     successRedirect: '/profile',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

router.post('/', passport.authenticate('local.signin',{failWithError:true}),
  function(req, res, next){
    if(req.xhr) {
      return res.json(req.user);
    }
    return res.redirect('/profile');
  },
  function(err,req, res, next){
    if(req.xhr){return json(err)}
    return res.redirect('/login');
  }
  );

module.exports = router;
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}