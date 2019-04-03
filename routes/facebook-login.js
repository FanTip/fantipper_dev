var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

module.exports = router;
