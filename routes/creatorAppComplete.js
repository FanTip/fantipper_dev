var express = require('express');
var router = express.Router();
var upload = require('../config/upload');
var multer = require('multer');
var User = require('../models/user');
var xss = require('xss');


/* GET home page. */
router.post('/',function(req, res, next) {
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

router.post('/section1', function(req, res){

  var searchQuery = {
    email : req.user.email
  }

  var saveQuery = { $set : {
    "creator.isCreator" : true,
    "creator.creatorName" : req.body.name,
    "creator.creatorNameuser" : req.body.username,
    "creator.creatorUrl" : "fantipper/" + req.body.url,
    "creator.creatorLocation" : req.body.location,
    "creator.creatorDesc" : req.body.desc
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

router.post('/section2', function(req, res){
  console.log(req.body);
});

router.post('/section3', function(req, res){
  console.log(req.body);

  var searchQuery = {
    email : req.user.email
  }

  var saveQuery =  {
    "creator.creatorAbout" : xss(req.body.formattedContent)
  }

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
