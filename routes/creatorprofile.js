let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let mongoose = require('mongoose');
let csrfProtection = csrf();
let passport = require('passport');
router.use(csrfProtection);
var User = require('../models/user');


/* GET home page. */
router.get('/', isLoggedIn,async function(req, res, next) {
  let user = await User.findById(req.user._id).exec();
   
  let categories = user.creator.creatorCategories;
  res.render('creator/creatorindex', { title: 'Creator', csrfToken : req.csrfToken(), categories : categories});
});


router.get('/preview', isLoggedIn, async function(req, res, next){
  
  let user = await User.findById(req.user._id).exec();
   
  let categories = user.creator.creatorCategories;
  res.render('creator/previewmode', { title: 'Creator Profile', csrfToken : req.csrfToken(), categories : categories});
  
});

router.post('/updatecreator', isLoggedIn, function(req, res, next){
  User.findByIdAndUpdate(req.user._id,{
    $set:{'creator.creatorCategories' : req.body.name}
  }).exec(function(err, result){

  });
});

router.post('/create', isLoggedIn, function(req, res, next){
     req.checkBody('creator_name', 'Invalid Creator name').notEmpty();
     req.checkBody('creator_email', 'Invalid Email address').notEmpty().isEmail();
     if(req.validationErrors()){
      var errors = [];
      req.validationErrors().forEach(function(err){
        errors.push(err.msg);
      });
     }
      User.findByIdAndUpdate(
        req.user._id,
        { $set:{'creator.isCreator' : true,
        'creator.creatorName': req.body.creator_name,
        'creator.creatorDesc': req.body.creator_description,
        'creator.creatorEmail' : req.user.email,
        'creator.UserName' : req.body.creator_name
      }
        }

        ,).
        exec(function(err, result){
        console.log(err);
        if(result){
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
