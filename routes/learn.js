var express = require('express');
var router = express.Router();
var User = require('../models/user');
var tipper = require('../models/tipper');
var tippee = require('../models/tippee');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('learn', { title: 'Learn' });

  });

module.exports = router;
