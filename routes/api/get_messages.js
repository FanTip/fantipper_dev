const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Tips = require('../../models/tips');

router.get('/getfan', async function(req, res){
    try
    {
        let logged_id = req.user.id;
        let logged_email = req.user.email;

        let query = {
            'creator_email' : logged_email
        };

        let tips = await Tips.find(query);

        res.status(200).send(tips);
    }
    catch(e)
    {
        res.status(401).send('Unauthorized');
    }

});

router.get('/getcreator', async function(req, res){
    try
    {
        let logged_id = req.user.id;
        let logged_email = req.user.email;

        let query = {
            'pay_email' : logged_email
        };

        let tips = await Tips.find(query);

        res.status(200).send(tips);
    }
    catch(e)
    {
        res.status(401).send('Unauthorized');
    }

});





module.exports = router;