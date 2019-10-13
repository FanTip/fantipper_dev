
const express = require('express');
const router = express.Router();
const User = require("../../models/user");

router.get('/get', async function(req, res){
    let user = await User.findById(req.user._id).exec();
    let categories = user.creator.creatorCategories;
    res.status(200).json(categories);
});

module.exports = router;