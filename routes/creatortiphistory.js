var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

router.get('/', function(req, res, next) {
    res.render('creator/creatortiphistory', { title: 'Creator tip history', csrfToken: req.csrfToken() });

});

module.exports = router;