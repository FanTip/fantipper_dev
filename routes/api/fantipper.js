var user = require('../../models/user');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    user.find()
        .exec(function(err, resUser) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(resUser);
            }
        });
});


router.post('/', function(req, res) {
    user.findOne({ email: req.body.email }).exec(
        function(err, resUser) {
            if (err) { res.status(500).send(err) }
            if (resUser) {
                res.status(200).send("User already exists, Please login");
            } else {
                var newUser = new user();
                newUser.email = req.body.email;
                newUser.password = newUser.encryptPassword(req.body.password);
                newUser.name = req.body.name;

                newUser.save(function(err, result) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.status(200).send('User created successfully!');
                });
            }
        }
    );
});

router.get('/found/:username', function(req, res, next) {
    var searchQuery = {
        'creator.creatorNameuser': req.params.username
    }
    user.findOne(searchQuery).exec(function(err, result) {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send('No creator found');
        }
    });

});

router.get('/:email', function(req, res, next) {
    var searchQuery = {
        'email': req.params.email
    }
    user.findOne(searchQuery).exec(function(err, result) {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).send('No username found');
        }
    });

});

router.get('/:email/:password', function(req, res, next) {
    if (req.params.email && req.params.password) {
        user.findOne({ email: req.params.email })
            .exec(function(err, resUser) {
                if (err) {
                    res.status(500).send(err);
                }

                if (!resUser.validPassword(req.params.password)) {
                    res.status(500).send('Invalid password!');
                } else {
                    res.status(200).send(resUser);
                }
            });
    } else {
        next();
    }
});



module.exports = router;