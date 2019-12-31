const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const multer = require('multer');
const User = require('../models/user');
const xss = require('xss');
const _l = require('./tools/logincheck');



/* GET home page. */
router.post('/profile', _l.isLoggedIn, function(req, res, next) {
  upload.uploadTile(req, res, function(err){
    if(!err){
      var query = { email : req.user.email }
      var update = { $set : { 'creator.creatorTileImage' : 'uploads/tileImages/' + req.user.email + '.jpg' } }
      User.findOneAndUpdate(query, update).exec(function(err, doc){
        if(err){
          console.log(err);
        }
      });
      return res.send({
        success : true
      });
    }
  });
});

router.post('/background', _l.isLoggedIn, function(req, res, next) {
  try{
    upload.uploadBackground(req, res, function(err){
      if(!err){
  
        var query = { email : req.user.email }
        var update = { $set : { 'creator.creatorBack' : 'uploads/backgroundImages/' + req.user.email + '.jpg' } }
        const uploadImage = User.findOneAndUpdate(query, update).exec();
        if(uploadImage) return res.send({success : true});
      }
    });

  }catch(e){
    console.error(e)
  }
});

router.post('/formsubmission', async function(req, res){

  try{
    var searchQuery = {
      email : req.user.email
    }
  
    var saveQuery = { $set : {
      "creator.isCreator" : true,
      "creator.creatorName" : req.body.name,
      "creator.creatorNameuser" : req.body.username,
      "creator.creatorUrl" :  req.body.url,
      "creator.creatorLocation" : req.body.location,
      "creator.creatorDesc" : req.body.desc,
      "creator.creatorEmail" : req.user.email,
      "creator.creatorAbout" : xss(req.body.about),
      "creator.creatorCategories" : req.body.categories
    }} 
  
    const createUser = User.findOneAndUpdate(searchQuery, saveQuery).exec();

    if(createUser){
      res.send({success : true});
    }

  }catch(e){
    console.error(e);
  }
  
});

module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}