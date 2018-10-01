var express = require('express');
var router = express.Router();
const upload = require('../config/upload');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);
var newModel = require('../models/user');

/* GET users listing. */
router.get('/',isLoggedIn, function(req, res, next) {
    console.log('req: ', req.user);
    res.render('editImage', {csrfToken : req.csrfToken()});
});

router.post('/',isLoggedIn, function(req, res, next){
    upload.upload(req, res, function(err){
        if(err){
            res.render('editImage', {message : err, csrfToken : req.csrfToken()});
        }else{
            if(!(req.file)){
                res.render('editImage',{
                    message : 'Error : No file selected!',
                    csrfToken : req.csrfToken()
                });
            }else{
                var query = {email : req.user.email};
                var update = {imagepath : `uploads/${req.file.filename}`};
                newModel.findOneAndUpdate(query, update, function(err, doc){
                    if(err){
                        console.log(err);
                    }
                });
                res.render('editImage', {
                    message : 'File Uploaded!',
                    file : `uploads/${req.file.filename}`,  
                    csrfToken : req.csrfToken()
                });
                
            }
        }
    });
});
module.exports = router;
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/signup');
  }
