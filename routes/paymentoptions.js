var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var async = require('async');

router.use(csrfProtection);

router.get('/', function(req, res, next) {
    res.render('fan/paymentoptions', { title: 'Payment Options' });
});

module.exports = router;