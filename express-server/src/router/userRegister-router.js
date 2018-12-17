const express = require('express');
const user = require('../models/mysql/user.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.post('/userregister', (request, response) => {
    // I found it on stackoverflow
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    user.registerAndCookies(request.body.username, request.body.nickname, request.body.pass,request.body.email, ip).then(data => {
        if(data) {
            data.success = true;
            response.send(data);
        } else {
            response.send({ success: false });
        }
    }).catch(err => {
        response.send({ success: false });
    });
});


module.exports = router;
