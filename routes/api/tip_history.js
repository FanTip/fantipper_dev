const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require("../../models/user");
const Tips = require("../../models/tips");
const log = require('../../config/log');

router.get('/get-as-fan', async function(req, res) {
    try {
        let query = {
            pay_email: req.user.email
        }
        let tips = await Tips.find(query).sort({ date: -1 }).exec();
        res.status(200).send(tips);

    } catch (e) {
        log.log_save(e);
        res.status(500).send({});
    }
});


router.get('/get-as-creator', async function(req, res) {
    try {
        let query = {
            creator_email: req.user.creator.creatorEmail
        }
        let tips = await Tips.find(query).sort({ date: -1 }).exec();

        res.status(200).send(tips);
    } catch (e) {
        log.log_save(e);
        res.status(500).send({});
    }
});

module.exports = router;