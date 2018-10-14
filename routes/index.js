var express = require('express');
var router = express.Router();
var empty = require('is-empty');
var fs = require('fs');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var User = require('../models/user');

var server = require('http').Server(express);
var io = require('socket.io')(server);

router.use(csrfProtection);



/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index: ', req.user);
    var username;
    var imagepath;
    if(req.user != undefined){
        console.log('name: ', req.user);
        username = req.user.name;
        imagepath = req.user.imagepath;
    }
    var objs = [];
    console.log(res.locals.CreatorUserName);
    

    User.find({'creator.isCreator' : true}).exec(function(err, docs){
        if(err){
            console.log(err);
        }
        if(docs){
            console.log(docs.length);
            for (i = 0; i < docs.length; i++) {
                objs.push(docs[i]);
           }
           res.render('index', { 
                title: 'Fantipper', 
                objects: JSON.stringify(objs),
                name : username,
                imagePath : imagepath,
                csrfToken : req.csrfToken()
            });
        }

        io.on('connection', function(socket){
            socket.emit('news',{hello : 'world'});
            socket.on('on other event', function(data){
                console.log(data)
            });
        });
    });
});

module.exports = router;
