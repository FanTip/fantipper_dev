var express = require('express');
var router = express.Router();
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);
const _l = require('./tools/logincheck');


/* GET home page. */
router.get('/', _l.isLoggedIn, async function(req, res, next) {
    let user = await User.findById(req.user._id).exec();
    let categories = user.creator.creatorCategories;
    res.render('creator/selectactivecreator', { title: 'Edit creator profile', csrfToken: req.csrfToken(), categories: categories });
});

router.post('/', _l.isLoggedIn, async function(req, res, next) {

    try {
        let user = await User.findByIdAndUpdate(
            req.user._id, {
                'creator.creatorName': req.body.fullname,
                'creator.creatorDesc': req.body.shortdesc,
                'creator.creatorNameuser': req.body.username,
                'creator.creatorCategories': req.body.categories,
                'creator.creatorAbout': req.body.maintext,
                'creator.creatorLocation': req.body.location,
                'creator.facebookURL': req.body.facebookURL,
                'creator.twitterURL': req.body.twitterURL,
            }
        ).exec();

        res.status(200).send(user.creator);
    } catch (e) {

        res.status(500).send({});
    }
});

router.post('/delete', _l.isLoggedIn, async function(req, res, next) {

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                'creator.isCreator': false,
                'creator.creatorName': "",
                'creator.creatorDesc': "",
                'creator.creatorEmail': "",
                'creator.creatorLocation': ""
            }
        }).exec();
        res.redirect('/profile');

    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = router;