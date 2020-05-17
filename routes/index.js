var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var User = require('../models/user');

let log = require('../config/log');

var server = require('http').Server(express);
// var io = require('socket.io')(server);

router.use(csrfProtection);



/* GET home page. */
router.get('/', function (req, res, next) {
  var username;
  var imagepath;
  if (req.user != undefined) {
    username = req.user.name;
    imagepath = req.user.imagepath;
  }
  var objs = [];
  User.find({
    'creator.isCreator': true
  }).exec(function (err, docs) {
    if (err) {
      console.log(err);
    }
    if (docs) {
      for (i = 0; i < docs.length; i++) {
        objs.push(docs[i]);
      }
      res.render('index', {
        title: 'Fantipper',
        objects: JSON.stringify(objs),
        name: username,
        imagePath: imagepath,
        csrfToken: req.csrfToken()
      });
    }
  });
});


router.get('/:url', function (req, res, next) {

  try {
    var userID = req.params.url;
    var searchQuery = {
      'creator.creatorUrl': userID
    }
    if (userID) {
      User.findOne(searchQuery).exec(function (err, doc) {
        if (doc) {
          res.locals.CreatorName = doc.creator.creatorName;
          res.locals.CreatorDescription = doc.creator.creatorDesc;
          res.locals.CreatorUserName = doc.creator.creatorNameuser;
          res.locals.CreatorURL = doc.creator.creatorUrl;
          res.locals.CreatorDesc = doc.creator.creatorDesc;
          res.locals.CreatorAbout = doc.creator.creatorAbout;
          res.locals.creatorTile = doc.creator.creatorTileImage;
          res.locals.creatorBack = doc.creator.creatorBack;
          res.locals.creatorCategories = doc.creator.creatorCategories;
          res.locals.CreatorLocation = doc.creator.creatorLocation;

          res.render('creator/previewmode', {
            title: 'Creator Profile',
            categories: res.locals.creatorCategories,
            creatorurl: userID,
            csrfToken: req.csrfToken()
          });
        } else {
          next();
        }

      });

    }
  } catch (e) {
    res.status(500).json({});
  }



});

router.get('/csrf', async function (req, res) {
  try {
    res.status(200).send(req.csrfToken());
  }
  catch (e) {
    res.status(500).send('Internal error occured');
  }
})

module.exports = router;