var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var User = require('../models/user');

router.use(csrfProtection);
 
router.post('/', isLoggedIn, function(req, res, next){
    var profileUser = req.newUser || req.user;
    var query = {email : profileUser.email};
    var email = req.user.email.substr(0, req.user.email.indexOf('@'));
    var newDesc = {description : req.body.des}
    User.findOneAndUpdate(query, newDesc, function(err, doc){
        if(err){
            console.log(err);
        }
        res.render('fan/profile', { title: 'profile ', 
                            url: email,
                            csrfToken : req.csrfToken()
        });
    });
});


/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
    
    var email = req.user.email.substr(0, req.user.email.indexOf('@'));
    res.render('fan/profile', { title: 'profile ', 
                            body: '/faneditviews/fansummery',
                            url: email,
                            csrfToken : req.csrfToken()
    });
});

// authenticate user
module.exports = router;
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/signup');
  }
