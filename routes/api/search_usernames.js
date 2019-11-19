const express = require('express');
const router = express.Router();
const fs = require('fs');
const fuse = require('fuse.js');
const mongoose = require('mongoose');
const User = require('../../models/user');


var fuseOptions = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    includeScore: true,
    threshold: 0.3,
    location: 0,
    distance: 50,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys : [
        "username"
    ]
};

router.get('/search', async function(req, res){

    let users = await User.find({}).exec();
    let users_list = [];
    
    for(i = 0; i < users.length; i++)
    {
        let user_name = {"username" : users[i].creator.creatorNameuser};
        users_list.push(user_name);
    }

    var fuseSearch = new fuse(users_list, fuseOptions);
    if (!req.query.city){
        return res.status(400).send('Not found');
    }

    var matches = fuseSearch.search(req.query.city.trim());
    res.status(200).json(matches.map(match => {
        return match.item;
    }))
});

module.exports = router;