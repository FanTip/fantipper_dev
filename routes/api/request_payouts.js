const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../../models/user");
const Tips = require("../../models/tips");
const log = require('../../config/log');

router.post('/request', async function (req, res) {
    try {
        let ids = req.body.ids;
        let requested_s = [];
        for (i = 0; i < ids.length; i++) {
            let id = mongoose.Types.ObjectId(ids[i]);
            let query = {
                requested: true,
                request_date: new Date()
            };
            let updated_tips = await Tips.findByIdAndUpdate(id, query).exec();
            requested_s.push(updated_tips._id);
        }

        res.status(200).json(requested_s.length);
    } catch (e) {
        log.log_save(e);
        res.status(500).send(e);
    }
});



module.exports = router;