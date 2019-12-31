var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var tipper = require('../models/tipper');
var tippee = require('../models/tippee');
var async = require('async');

router.use(csrfProtection);

router.get('/', function(req, res, next) {
    res.render('fan/fantiphistory', { title: 'Fan tip history' });
});

module.exports = router;