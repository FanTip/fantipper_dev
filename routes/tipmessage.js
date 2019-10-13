var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

var Messages = require('../models/message');
router.use(csrfProtection);

router.get('/', function(req, res, next){
    res.render('fan/messages', {tittle : 'Messages', csrfToken : req.csrfToken()})
});


router.get('/getmessage',function(req, res, next){
    Messages.find({}).exec(
        function(err, result){
            res.status(200).send(result);
        }
    );

});

router.get('/delete', function(req, res, next){

});

module.exports = router;