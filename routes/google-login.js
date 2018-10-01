var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/',passport.authenticate('google', 
{ 
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] 
}

));


router.get('/callback', passport.authenticate('google', 
{ 
    failureRedirect: '/' 
}),
function(req, res) {
  res.redirect('/profile');
});
module.exports = router;
