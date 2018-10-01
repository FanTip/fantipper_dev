var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('creatorProfileApplication/creatorProfileCreate', { title: 'Let\'s get you signed up!' });
});

module.exports = router;
