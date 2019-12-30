// Uploading profile images
var express = require('express');
var router = express.Router();
const upload = require('../config/upload');

var newModel = require('../models/user');

router.post('/', function(req, res, next) {
    try {
        upload.upload(req, res, function(err) {
            var query = { email: req.user.email };
            var update = { imagepath: 'uploads/' + req.user.email + '.jpg' };
            newModel.findOneAndUpdate(query, update, function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send("OK");
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;