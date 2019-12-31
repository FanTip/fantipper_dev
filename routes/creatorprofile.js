let express = require('express');
let router = express.Router();
let csrf = require('csurf');
let csrfProtection = csrf();
let passport = require('passport');
router.use(csrfProtection);
var User = require('../models/user');
const _l = require('./tools/logincheck');



/* GET home page. */
router.get('/', _l.isLoggedIn, async function(req, res, next) {
    let user = await User.findById(req.user._id).exec();
    let creatorurl = user.creator.creatorUrl;

    let categories = user.creator.creatorCategories;
    res.render('creator/creatorindex', { title: 'Creator', csrfToken: req.csrfToken(), categories: categories, creatorurl: creatorurl });
});


router.get('/preview', _l.isLoggedIn, async function(req, res, next) {

    let user = await User.findById(req.user._id).exec();
    let creatorurl = user.creator.creatorUrl;
    let categories = user.creator.creatorCategories;
    res.render('creator/previewmode', { title: 'Creator Profile', csrfToken: req.csrfToken(), categories: categories, creatorurl: creatorurl });

});

router.post('/updatecreator', _l.isLoggedIn, function(req, res, next) {
    User.findByIdAndUpdate(req.user._id, {
        $set: { 'creator.creatorCategories': req.body.name }
    }).exec(function(err, result) {

    });
});

router.post('/create', _l.isLoggedIn, function(req, res, next) {
    req.checkBody('creator_name', 'Invalid Creator name').notEmpty();
    req.checkBody('creator_email', 'Invalid Email address').notEmpty().isEmail();
    if (req.validationErrors()) {
        var errors = [];
        req.validationErrors().forEach(function(err) {
            errors.push(err.msg);
        });
    }
    User.findByIdAndUpdate(
        req.user._id, {
            $set: {
                'creator.isCreator': true,
                'creator.creatorName': req.body.creator_name,
                'creator.creatorDesc': req.body.creator_description,
                'creator.creatorEmail': req.user.email,
                'creator.UserName': req.body.creator_name
            }
        }

        , ).
    exec(function(err, result) {
        console.log(err);
        if (result) {
            // res.status(200).send(result);
            res.redirect('/selectactivecreator');
        }
    });


});
module.exports = router;

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signup');
}