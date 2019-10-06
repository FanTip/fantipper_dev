var express = require('express');
var router = express.Router();
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', isLoggedIn, async function(req, res, next) {
    let user = await User.findById(req.user._id).exec();
    let categories = user.creator.creatorCategories;
    res.render('creator/selectactivecreator', { title: 'Edit', csrfToken: req.csrfToken(), categories: categories });
});

router.post('/', isLoggedIn, async function(req, res, next) {
    let status;
    let response;
    try {
        let user = await User.findByIdAndUpdate(
            req.user._id, {
                'creator.creatorName': req.body.fullname,
                'creator.creatorDesc': req.body.shortdesc,
                'creator.creatorNameuser': req.body.username,
                'creator.creatorCategories': req.body.categories,
                'creator.creatorAbout': req.body.maintext,
            }
        ).exec();
        status = 200;
        response = user;
    } catch (e) {
        status = 500;
        response = "Error occured while updating";
    }
    console.log(status);
    res.status(status).json(response);

});

router.post('/delete', isLoggedIn, function(req, res, next) {

    User.findByIdAndUpdate(req.user._id, {
        $set: {
            'creator.isCreator': false,
            'creator.creatorName': "",
            'creator.creatorDesc': "",
            'creator.creatorEmail': ""
        }
    }).exec(function(err) {
        if (err) {
            res.send(err);
        }
        res.redirect('/profile');

    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}