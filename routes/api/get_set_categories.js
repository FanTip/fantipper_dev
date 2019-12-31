const express = require('express');
const router = express.Router();
const User = require("../../models/user");

router.get('/get', async function(req, res) {
    try {
        let user = await User.findById(req.user._id).exec();
        let categories = user.creator.creatorCategories;
        res.status(200).json(categories);
    } catch (e) {
        res.status(500).send({});
    }

});

module.exports = router;