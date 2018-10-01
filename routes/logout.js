var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

router.get('/', isLoggedIn, function(req, res, next){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}