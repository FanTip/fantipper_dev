var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var async = require('async');

router.use(csrfProtection);

router.get('/', isLoggedIn, function (req, res, next) {
  res.render('fan/paymentoptions', { title: 'Payment Options', csrfToken: req.csrfToken() });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}