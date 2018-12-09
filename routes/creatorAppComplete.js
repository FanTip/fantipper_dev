var express = require('express');
var router = express.Router();
var upload = require('../config/upload');
var multer = require('multer');
var User = require('../models/user');
var xss = require('xss');


/* GET home page. */
router.post('/profile',function(req, res, next) {
  upload.uploadTile(req, res, function(err){

    console.log(req.file);
    if(!err){

      var query = { email : req.user.email }
      var update = { $set : { 'creator.creatorTileImage' : 'uploads/tileImages/' + req.user.email + '.jpg' } }
      User.findOneAndUpdate(query, update).exec(function(err, doc){
        if(err){
          console.log(err);
        }
        console.log(doc);
      });
      return res.send({
        success : true
      });
    }
  });
});

router.post('/background',function(req, res, next) {
  upload.uploadBackground(req, res, function(err){

    console.log(req.file);
    if(!err){

      var query = { email : req.user.email }
      var update = { $set : { 'creator.creatorBack' : 'uploads/backgroundImages/' + req.user.email + '.jpg' } }
      User.findOneAndUpdate(query, update).exec(function(err, doc){
        if(err){
          console.log(err);
        }
        console.log(doc);
      });
      return res.send({
        success : true
      });
    }
  });
});

router.post('/formsubmission', function(req, res){

  console.log('about: ',req.body.about);


  var searchQuery = {
    email : req.user.email
  }

  var saveQuery = { $set : {
    "creator.isCreator" : true,
    "creator.creatorName" : req.body.name,
    "creator.creatorNameuser" : req.body.username,
    "creator.creatorUrl" : "fantipper/" + req.body.url,
    "creator.creatorLocation" : req.body.location,
    "creator.creatorDesc" : req.body.desc,
    "creator.creatorAbout" : xss(req.body.about)
  }} 

  console.log("search" , searchQuery);
  console.log("save ", saveQuery);


  User.findOneAndUpdate(searchQuery, saveQuery).exec(function(err, doc){
    if(err){
      console.log(err);
    }

    if(doc){
      console.log(doc);
    }

    return res.send({
      success : true
    });

  });

});





module.exports = router;
