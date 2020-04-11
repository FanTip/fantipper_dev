const express = require('express');
const router = express.Router();
const User = require("../../models/user");

const log = require('../../config/log');

router.get('/', async function (req, res) {
    try {
        let users = await User.find({ 'creator.isCreator': true }).exec();
        let formated_users = [];

        users.forEach(element => {
            data = {
                creatorName: element.creator.creatorName,
                image: element.creator.creatorTileImage,
                creatorEmail: element.creator.creatorEmail,
                creatorDescription: element.creator.creatorDesc,
                creatorLocation: element.creator.creatorLocation,
                creatorURL: element.creator.creatorUrl,
                categories:element.creator.creatorCategories,
                user_id: element._id
            }
            formated_users.push(data);
        });
        console.log(formated_users);

        res.status(200).json(formated_users);
    } catch (e) {
        log.log_save(e);
        res.status(500).send('error');
    }
});

module.exports = router;