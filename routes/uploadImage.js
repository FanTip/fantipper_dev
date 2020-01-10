// Uploading profile images
var express = require('express');
var router = express.Router();
const upload = require('../config/upload');
const log = require('../config/log');
var newModel = require('../models/user');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

router.post('/', async function (req, res, next) {
  try {
    const ID = process.env.AWSAccessKeyId;
    const key = process.env.AWSSecretKey;
    const bucket_name = process.env.AWSBucket;

    const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: key
    });

    upload.upload(req, res, async function (err) {
      var query = {
        email: req.user.email
      };

      const fileContent = fs.readFileSync(path.resolve(__dirname, '../public/uploads/' + req.user.email + '.jpg'));

      const params = {
        Bucket: bucket_name,
        // Key: req.user._id + 'fanimage/' +'fanimage-' + req.user._id + '.jpg',
        Key: 'fanimage-' + req.user._id + '.jpg',
        Body: fileContent,
        ACL: 'public-read'
      }

      s3.upload(params, async function (err, data) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);


        var update = {
          imagepath: data.Location
        };


        await newModel.findOneAndUpdate(query, update).exec();
        await fs.unlinkSync(path.resolve(__dirname, '../public/uploads/' + req.user.email + '.jpg'));
        res.status(200).send("OK");

      });
    });
  } catch (e) {
    log.log_save(e);
    console.log(e);
  }
});

module.exports = router;