var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var mongoose = require('mongoose');


passport.use('facebook',new Strategy({
    clientID: '563423380470078',
    clientSecret: '214cce65d9185d7775c95e2a0a32e91a',
    callbackURL: 'https://fantipper.herokuapp.com/login/facebook/callback' || 'http://localhost:3000/login/facebook/callback',
    profileFields : ['emails','picture.type(large)','name']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      console.log(profile);
      User.findOne({'facebookID' : profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user);
        }else{
          var NewUser = new User();
          NewUser._id = new mongoose.Types.ObjectId();
          NewUser.facebookID = profile.id;
          NewUser.accessToken = accessToken;
          NewUser.name = profile.name.givenName + ' ' + profile.name.familyName;
          NewUser.email = profile.emails[0].value;
          NewUser.imagepath = profile.photos[0].value;
          NewUser.creator.isCreator = false;
          NewUser.creator.creatorName = 'None provided';
          NewUser.creator.creatorNameuser = 'None provided';
          NewUser.creator.creatorCategories = null;
          NewUser.creator.creatorUrl = 'None provided';
          NewUser.creator.creatorLocation = 'None provided';
          NewUser.creator.creatorEmail = 'None Provided';
          NewUser.creator.creatorTileImage = '/images/example.jpg';
          NewUser.card.isCard = false;
          
          NewUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, NewUser);
          });
        }
      });
    });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });