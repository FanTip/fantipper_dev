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
    var username;
    var imagepath;
    if(req.user != undefined){
        username = req.user.name;
        imagepath = req.user.imagepath;
    }
    var objs = [];

    User.find({'creator.isCreator' : true}).exec(function(err, docs){
        if(err){
            console.log(err);
        }
        if(docs){
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


router.get('/:url', async function(req, res, next){
    try{
        var userID = req.params.url;
        var searchQuery = {
            'creator.creatorUrl' : userID
        }
        if(userID){
            const doc = await User.findOne(searchQuery).exec();
            const tags = JSON.parse(doc.creator.creatorCategories);
            res.locals.CreatorName = doc.creator.creatorName;
            res.locals.CreatorDescription = doc.creator.creatorDesc;
            res.locals.CreatorUserName = doc.creator.creatorNameuser;
            res.locals.CreatorURL = doc.creator.creatorUrl;
            res.locals.CreatorDesc = doc.creator.creatorDesc;
            res.locals.CreatorAbout = doc.creator.creatorAbout;
            res.locals.creatorTile = doc.creator.creatorTileImage;
            res.locals.creatorBack = doc.creator.creatorBack;
            res.locals.tags = tags
            res.render('creator/previewmode', { title: 'Creator Profile'});
        }
    }catch(e){
        console.error(e);
        res.render('creator/previewmode', { title: 'No user found'});
    }
    
    
});


module.exports = router;
