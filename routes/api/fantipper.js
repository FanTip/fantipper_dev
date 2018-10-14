var user = require('../../models/user');
var express = require('express');
var router = express.Router();
var tipper = require('../../models/tipper');
var tippee = require('../../models/tippee');

router.get('/:url', function(req, res){
    var url = req.params.url;
    res.render('./fanprofiles/fans');
});

router.get('/:email/:password', function(req, res){
    console.log(req.params.email);
    console.log(req.params.password);
    user.findOne({email:req.params.email})
    .exec(function(err, resUser){
        if(err){
            res.status(500).send(err);
        }
        
        if(!resUser.validPassword(req.params.password)){
            res.status(500).send('Invalid password!');
        }else{
            res.status(200).send(resUser);
        }
    });
});

router.get('/', function(req, res){
    user.find()
    .exec(function(err, resUser){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(resUser);
        }
    });
});

router.post('/', function(req, res){
    user.findOne({email : req.body.email}).exec(
        function(err,resUser){
            if(err) { res.status(500).send(err)}
            if(resUser){
                res.status(200).send("User already exists, Please login");
            }else{
                var newUser = new user();
                newUser.email = req.body.email;
                newUser.password = newUser.encryptPassword(req.body.password);
                newUser.name = req.body.name;

                newUser.save(function(err, result){
                    if(err){
                        res.status(500).send(err);
                    }
                    res.status(200).send('User created successfully!');
                });
            }
        }
    );
});

router.get('/tipper', function(req, res, next){
    var tips;
    tipper.find({tipperID : req.user._id}).populate('tipperID').exec(function(err, tipper){
        if(req.xhr){
            res.status(200).send(tipper);
        }
    });
});
router.get('/tippee', function(){
    tippee.find({tipeeID : req.user._id}).populate('tipeeID').exec(function(err, tippee){
        if(req.xhr){
            console.log('req',req.xhr);
            res.status(200).send(tippee);;
        }
    });
});


module.exports = router;