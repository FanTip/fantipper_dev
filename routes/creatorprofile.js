var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var mongoose = require('mongoose');
var csrfProtection = csrf();
var passport = require('passport');
router.use(csrfProtection);

var User = require('../models/user');

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  console.log(req.user.creator.isCreator);
  res.render('creator/creatorindex', { title: 'Express', csrfToken : req.csrfToken()});
});

router.post('/updatecreator',isLoggedIn, function(req, res, next){
  console.log(req.body);
  User.findByIdAndUpdate(req.user._id,{
    $set:{'creator.creatorCategories' : req.body.name}
  }).exec(function(err, result){

  });
});

router.post('/create',isLoggedIn, function(req, res, next){
    console.log('body:',req.body);
    console.log('user',req.user);   
     req.checkBody('creator_name', 'Invalid Creator name').notEmpty();
     req.checkBody('creator_email', 'Invalid Email address').notEmpty().isEmail();
     if(req.validationErrors()){
      var errors = [];
      req.validationErrors().forEach(function(err){
        errors.push(err.msg);
        console.log(err.msg);
      });
     }
      User.findByIdAndUpdate(
        req.user._id, 
        { $set:{'creator.isCreator' : true,
        'creator.creatorName': req.body.creator_name,
        'creator.creatorDesc': req.body.creator_description,
        'creator.creatorEmail' : req.body.creator_email,
        'creator.UserName' : req.body.creator_name  
      }
        }
        
        ,).
        exec(function(err, result){
        console.log(err);
        if(result){
          console.log('updated');
          // res.status(200).send(result);
          res.redirect('/selectactivecreator');
        }
      });
    

});
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