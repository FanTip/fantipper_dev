var express = require('express');
var router = express.Router();
var upload = require('../config/upload');
var multer = require('multer');
var User = require('../models/user');
var xss = require('xss');


/* GET home page. */
router.post('/profile',function(req, res, next) {
  upload.uploadTile(req, res, function(err){
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
      "creator.creatorAbout" : xss(req.body.about)
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
