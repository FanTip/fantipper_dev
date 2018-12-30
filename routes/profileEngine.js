var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/:username', function(req, res){
    // res.send(req.params.username);
    var searchQuery = {
        'creator.creatorUrl' : 'fantipper/'+req.params.username
    }
    User.findOne(searchQuery).exec(function(err, creator){
        if(err){
            res.send('User not found!');
        }
        // res.send(creator);
        res.render('creator/previewmode',{
            creatorBack : creator.creator.creatorBack,
            creatorTile : creator.creator.creatorTileImage,
            CreatorName : creator.creator.creatorName,
            location : creator.creator.creatorLocation,
            CreatorURL : creator.creator.creatorUrl,
            CreatorAbout : creator.creator.creatorAbout,
            CreatorDesc : creator.creator.creatorDesc,
            creatorPreview : true
        });
    });
});
module.exports = router;