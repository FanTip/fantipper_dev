const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const multer = require('multer');
const User = require('../models/user');
const xss = require('xss');
const _l = require('./tools/logincheck');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');


// const ID = 'AKIAJEYO37U4OSDIM7PA';
// const key = 'W/KJeBX67HhmxL6yoKa6EjTdS7q1psYeoj1kw2Li';
// const bucket_name = 'fantipper-img-save';

// const s3 = new AWS.S3({
//   accessKeyId: ID,
//   secretAccessKey: key
// });


/* GET home page. */
router.post('/profile', _l.isLoggedIn, async function (req, res, next) {
  try {
    const ID = process.env.AWSAccessKeyId;
    const key = process.env.AWSSecretKey;
    const bucket_name = process.env.AWSBucket;

    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: key
    });
    upload.uploadTile(req, res, async function (err) {
      if (!err) {
        var query = {
          email: req.user.email
        }

        const fileContent = fs.readFileSync(path.resolve(__dirname, '../public/uploads/tileImages/' + req.user.email + '.jpg'));

        const params = {
          Bucket: bucket_name,
          // Key: req.user._id + 'creator_tileimage/' + 'creator_tileimage-' + req.user._id + '.jpg',
          Key: 'creator_tileimage-' + req.user._id + '.jpg',
          Body: fileContent,
          ACL: 'public-read'
        }

        s3.upload(params, async function (err, data) {
          console.log(`File uploaded successfully. ${data.Location}`);
          var update = {
            $set: {
              'creator.creatorTileImage': data.Location
            }
          }

          if (data.Location) {
            let UploadImage = await User.findOneAndUpdate(query, update).exec();
            if (UploadImage) {
              let deleted = await fs.unlinkSync(path.resolve(__dirname, '../public/uploads/tileImages/' + req.user.email + '.jpg'));
              // if (deleted) {
                return res.send({
                  success: true
                });
              // }
            }
          }
        });
      }
    });
  } catch (e) {
    console.error(e);
  }

});

router.post('/background', _l.isLoggedIn, async function (req, res, next) {
  try {
    const ID = process.env.AWSAccessKeyId;
    const key = process.env.AWSSecretKey;
    const bucket_name = process.env.AWSBucket;

    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: key
    });
    upload.uploadBackground(req, res, async function (err) {
      if (!err) {
        var query = {
          email: req.user.email
        }
        const fileContent = fs.readFileSync(path.resolve(__dirname, '../public/uploads/backgroundImages/' + req.user.email + '.jpg'));

        const params = {
          Bucket: bucket_name,
          // Key: req.user._id + 'creator_backbround/' + 'creator_backbround-' + req.user._id + '.jpg',
          // Key: 'creator_backbround-' + req.user._id + '.jpg',
          Key: 'creator_backbround-' + req.user._id + '.jpg',
          Body: fileContent,
          ACL: 'public-read'
        }

        s3.upload(params, async function (err, data) {

          console.log(`File uploaded successfully. ${data.Location}`);

          var update = {
            $set: {
              'creator.creatorBack': data.Location
            }
          }

          if (data.Location) {
            let uploadImage = await User.findOneAndUpdate(query, update).exec();
            if (uploadImage) {
              let deleted = await fs.unlinkSync(path.resolve(__dirname, '../public/uploads/backgroundImages/' + req.user.email + '.jpg'));
              // if (deleted) {
                return res.send({
                  success: true
                });
              // }
            }
          }
        });
      }
    });

  } catch (e) {
    console.error(e);
  }
});

router.post('/formsubmission', async function (req, res) {

  try {
    var searchQuery = {
      email: req.user.email
    }

    var saveQuery = {
      $set: {
        "creator.isCreator": true,
        "creator.creatorName": req.body.name,
        "creator.creatorNameuser": req.body.username,
        "creator.creatorUrl": req.body.url,
        "creator.creatorLocation": req.body.location,
        "creator.creatorDesc": req.body.desc,
        "creator.creatorEmail": req.user.email,
        "creator.creatorAbout": xss(req.body.about),
        "creator.creatorCategories": req.body.categories
      }
    }

    const createUser = User.findOneAndUpdate(searchQuery, saveQuery).exec();

    if (createUser) {
      res.send({
        success: true
      });
    }

  } catch (e) {
    console.error(e);
  }

});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}