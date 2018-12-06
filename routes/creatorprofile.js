var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var mongoose = require('mongoose');
var csrfProtection = csrf();
var passport = require('passport');

router.use(csrfProtection);
var User = require('../models/user');

/**
 * Hard coded section is for demonstration only 
 * must be removed after 23/10/2018
 */

function retriveUser(id){
  User.findById(id, function(err, result){
    if(err){
      return err;
    }
    if(result){
      return result;
    }
  })
}

var members = [{
  name: "Calvin Keast",
  image: "/people/person1.jpg",
  description: "enable proactive communities"
}, {
  name: "Thorny Loxdale",
  image: "/people/person2.jpg",
  description: "whiteboard out-of-the-box content"
}, {
  name: "Lucho Agiolfinger",
  image: "/people/person3.jpg",
  description: "iterate magnetic architectures"
}]

var messages = [
  { 
    name: "Cthrine Robertshaw", 
    message: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. ", 
    photo: "/people/person4.jpg", 
    date: "07-Jun-2018" }, 
  { 
    name: "Finlay Wickersham", 
    message: "Nulla ac enim. In tempor, turpis nec euismod scelerisque.", 
    photo: "/people/person5.jpg", 
    date: "06-Nov-2017" }, 
  { 
    name: "Radcliffe Avis", 
    message: "Nam nulla. Integer pede justo, lacinia eget, tincidunt eget. ", 
    photo: "/people/person6.jpg", 
    date: "14-Nov-2017" }, 
  { 
    name: "Hyman Penticoot", 
    message: "Curabitur in libero ut massa volutpat convallis. Morbi odio odio.", 
    photo: "/people/person7.jpg", 
    date: "24-Jul-2018" }
]

/**
 * Mock data section ends
 */


/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  console.log(req.user.creator.isCreator);
  var obj1 = [];
  var obj2 = [];

  for(i = 0; i < members.length; i++){
    obj1.push(members[i]);
  }

  res.render('creator/creatorindex', { title: 'Creator', csrfToken : req.csrfToken(), obj1 : members, obj2 : messages});
});




router.get('/preview', function(req, res, next){
  var userdata;
  User.findById(req.user._id).exec(function(err, result){
    if(err){
      res.send(err);
    }
    res.render('creator/previewmode', { title: 'Creator Profile', csrfToken : req.csrfToken(), obj1 : members, obj2 : messages, userdata : result});
  });
  
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
