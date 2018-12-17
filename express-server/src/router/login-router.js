const express = require('express');
const user = require('../models/mysql/user.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.post('/login', (request, response) => {
    // I found it on stackoverflow
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    user.loginAndCookies(request.body.username, request.body.pass, ip).then(data => {
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
