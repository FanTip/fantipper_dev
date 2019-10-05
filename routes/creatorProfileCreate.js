var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('creatorProfileApplication/creatorProfileCreate', { title: 'Let\'s get you signed up!' ,csrfToken : req.csrfToken()});
});

module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}