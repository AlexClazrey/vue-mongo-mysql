const express = require('express');
const user = require('../models/mysql/user.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.post('/userRegiters', (request, response) => {
    // I found it on stackoverflow
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    user.registerAndCookies(request.body.username, request.body.nickname, request.body.pass,request.body.email,request.body.portrait, ip).then(data => {
        // data is { uid: uid, cookies: cookies } or null
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
