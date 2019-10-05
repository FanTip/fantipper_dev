var express = require('express');
var router = express.Router();
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', isLoggedIn, async function(req, res, next) {
  let user = await User.findById(req.user._id).exec();
  let categories = user.creator.creatorCategories;
  res.render('creator/selectactivecreator', { title: 'Edit', csrfToken : req.csrfToken(), categories : categories });
});

router.post('/', function(req, res, next){
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
      'creator.creatorName' : req.body.fullname,
      'creator.creatorDesc' : req.body.shortdesc,
      'creator.creatorNameuser' : req.body.username,
      'creator.creatorEmail' : req.user.email,
      }
    }
  ).exec(function(err, result){
    if(err){
      console.log(err);
    }
  });
  res.redirect('/selectactivecreator');
});

router.post('/delete', isLoggedIn, function(req, res, next){

  User.findByIdAndUpdate(req.user._id,
    {$set:{
      'creator.isCreator' : false,
      'creator.creatorName' : "",
      'creator.creatorDesc' : "",
      'creator.creatorEmail' : ""
    }}).exec(function(err){
    if(err){
      res.send(err);
    }
    res.redirect('/profile');
    
  });
});


module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}