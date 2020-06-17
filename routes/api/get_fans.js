const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Tips = require('../../models/tips');
const _ = require('lodash');
const log = require('../../config/log');

// Get all fans who tipped a creator
router.get('/:url/', async function (req, res) {
  try {

    let user_url = req.params.url;
    let is_messages = 'true';

    let search_query = {
      'creator.creatorUrl': user_url
    };

    let user = await User.findOne(search_query).exec();

    let tips = await Tips.find({
      'id': user._id
    });

    let response;

    if (tips.length > 0) {
      let fans_all = [];
      let pic;
      for (let i = 0; i < tips.length; i++) {
        let paid_user = await User.findOne({
          'email': tips[i].pay_email
        }).exec();
        paid_user != null ? pic = paid_user.imagepath : pic = '/images/example.jpg';
        if (tips[i]._id) {
          fans_all.push({
            pic
          });
        }

      }
      response = {
        fans_all: _.unionBy(fans_all, "pic"),
      }

    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    log.log_save(e);
    res.status(500).send(e);
  }
});





module.exports = router;