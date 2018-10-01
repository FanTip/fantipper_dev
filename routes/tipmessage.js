var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

var Messages = require('../models/message');
router.use(csrfProtection);

router.get('/',function(req, res, next){
    
    Messages.find({}).exec(
        function(err, result){
            res.render('fan/messages', {title: 'Messages',messages : JSON.stringify(result)});
        }
    );

});

module.exports = router;