var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);
const _l = require('./tools/logincheck');


/* GET home page. */
router.get('/', _l.isLoggedIn, function(req, res, next) {
  res.render('creatorProfileApplication/creatorProfileCreate', { title: 'Let\'s get you signed up!' ,csrfToken : req.csrfToken()});
});

module.exports = router;
