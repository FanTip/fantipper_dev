const express = require('express');
const router = express.Router();
const User = require("../../models/user");
const log = require('../../config/log');

router.get('/get', async function(req, res) {
    try {
        let user = await User.findById(req.user._id).exec();
        let categories = user.creator.creatorCategories;
        res.status(200).json(categories);
    } catch (e) {
        log.log_save(e);
        res.status(500).send({});
    }

});

module.exports = router;