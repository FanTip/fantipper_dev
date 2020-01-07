const passport = require('passport'); //requiring the passport package
const User = require('../models/user'); //requiring the user model
const LocalStrategy = require('passport-local').Strategy; //requiring the passport local strategy
const mongoose = require('mongoose');
const log = require('../config/log');

//Serializing the user
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//de-serializing the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});



//implementation of the local strategy for the user signup
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done){
    //finding the user in the database
    User.findOne({'email' : email}, function(err, user){
        if(err){
            return done(err);// return back eny errors
        }
        if(user){ //return an error message if user is already has an account
            return done(null, false, {message: 'Email is already in use!'});
        }


        //creating a new user
        var newUser = new User();
        newUser._id = new mongoose.Types.ObjectId();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.name = req.param('name');
        newUser.messages = null;
        newUser.offers = null;
        newUser.imagepath = '/images/example.jpg';
        newUser.location = req.param('location');
        newUser.description = 'Tell us little bit about yourself';
        newUser.creator.isCreator = false;
        newUser.creator.creatorName = 'None provided';
        newUser.creator.creatorNameuser = 'None provided';
        newUser.creator.creatorCategories = null;
        newUser.creator.creatorUrl = 'None provided';
        newUser.creator.creatorLocation = 'None provided';
        newUser.creator.creatorEmail = 'None Provided';
        newUser.creator.creatorTileImage = '/images/example.jpg';
        newUser.card.isCard = false;
        newUser.save(function(err, result){
            if(err){
                log.log_save(err);
                return done(err);
            }
            req.session.username = email;
            return done(null, newUser);
        });
    })
}));

//implementation of the local stategy to signin
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done){
    User.findOne({'email' : email}, function(err, user){
        if(err){
            return done(err);
        }
        //if no username is entered
        if(!user){
            return done(null, false, {message: 'no user found'});
        }
        //if the password is incorrect
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password'});
        }
        req.session.username = email;
        return done(null, user);
    })
}));
 