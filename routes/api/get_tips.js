const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Tips = require('../../models/tips');
const log = require('../../config/log');

router.get('/:url/:isMessages', async function (req, res) {
  try {

    let user_url = req.params.url;
    let is_messages = req.params.isMessages;

    let search_query = {
      'creator.creatorUrl': user_url
    };

    let user = await User.findOne(search_query).exec();

    let tips = await Tips.find({
      'id': user._id
    });

    let response;

    if (is_messages === 'true') {
      let messages = [];
      let pic;
      for (let i = 0; i < tips.length; i++) {
        let paid_user = await User.findOne({'email' : tips[i].pay_email}).exec();
        paid_user != null ? pic = paid_user.imagepath : pic = '/images/example.jpg';
        if (tips[i].tipmessage.length > 0) {
          messages.push({
            'message' : tips[i].tipmessage,
            'image' : pic
          });
        }

      }
      response = {
        num_of_messages: messages.length,
        messages: messages,
      }
    } else {
      response = {
        num_of_tips: tips.length,
        tips_data: tips
      }
    }

    res.status(200).json(response);
  } catch (e) {
    log.log_save(e);
    res.status(500).send(e);
  }
});

router.get('/tip_history/:user', async function(req, res){
  try{
    let user = await User.findById(req.user._id).exec();
    let tip_history = await Tips.find({pay_email : user.email}).exec();
    res.send(tip_history);
  }
  catch(e){
    log.log_save(e);
  }
});



module.exports = router;