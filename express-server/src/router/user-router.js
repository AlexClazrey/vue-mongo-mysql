const express = require('express');
const group = require('../models/mysql/group');
const user = require('../models/mysql/user');
const cookies = require('../models/mysql/cookies');
const routerUtil = require('./util');

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

router.post('/register', (request, response) => {
    // I found it on stackoverflow
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    user.registerAndCookies(request.body.username, request.body.nickname, request.body.pass, request.body.email, ip).then(data => {
        // if fails, data.msg will contain error message.
        if(!data.msg) {
            data.success = true;
            response.send(data);
        } else {
            data.success = false;
            response.send(data);
        }
    }).catch(err => {
        response.send({ success: false });
    });
});

// get private info
// TODO this function has no security protection
router.get('/:uid', async (req, res) => {
    try {
        var userData = await user.getUserInfo(req.params.uid);
        if(userData) {
            res.send({
                success: true,
                data: userData
            });
        } else {
            res.send({
                success: false,
                msg: '没有这个用户'
            })
        }
    } catch(err) {
        res.send({success: false});
    }
});
// get public info
router.get('/:uid/info', async(req, res) => {
    routerUtil.modelCall(req, res, user.getUserPublicInfo, [req.params.uid]);
})

router.get('/:uid/privileges', async(req, res) => {
    if(req.params.uid != req.cookies.uid) {
        res.send({
            badAuth: true,
            success: false,
        })
    } else {
        routerUtil.modelCall(req, res, group.checkUserPrivilegeList, [req.params.uid], null, null, null, true);
    }
})

// user logout
router.delete('/', async(req, res) => {
    routerUtil.modelCall(req, res, cookies.delete, [req.cookies.user], null, null, null, true);
})

router.get('/:uid/posts', async(req, res) => {
    routerUtil.modelCall(req, res, user.getUserPosts, [req.params.uid]);
})

router.get('/:uid/drafts', async(req, res) => {
    if(req.params.uid != req.cookies.uid) {
        res.send({
            badAuth: true,
            success: false,
        })
    } else {
        routerUtil.modelCall(req, res, user.getUserDrafts, [req.params.uid], null, null, null, true);
    }
})


module.exports = router;
