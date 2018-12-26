const express = require('express');
const group = require('../models/mysql/group');
const user = require('../models/mysql/user');
const routerUtil = require('./util.js');

const router = express.Router();

// list group
router.get('/group', async (req, res) => {
    routerUtil.simpleModelCall(req, res, group.listGroup);
});

router.get('/privilege', async (req, res) => {
    routerUtil.simpleModelCall(req, res, group.listPrivilege);
});

router.get('/user-to-group', async(req, res) => {
    routerUtil.simpleModelCall(req, res, group.listUserToGroup, null, 'user admin');
});

router.get('/group-to-privileges', async(req, res) => {
    routerUtil.simpleModelCall(req, res, group.listPrivilegeToGroup, null, 'user admin');
})

router.get('/user-list', async(req, res) => {
    routerUtil.simpleModelCall(req, res, user.getUserList, null, 'user admin');
})

router.post('/group', async(req, res) => {
    routerUtil.modelCall(req, res, group.addGroup, [req.body.name, req.body.priority], data => {
        res.send({success: true, gid: data});   
    }, null, 'user admin');
})

router.delete('/group/:gid', async(req, res) => {
    routerUtil.modelCall(req, res, group.removeGroup, [req.params.gid], null, null, 'user admin');
})

router.post('/privilege', async(req, res) => {
    routerUtil.modelCall(req, res, group.addPrivilege, [req.body.name], data => {
        res.send({success: true, priId: data});
    }, null, 'user admin');
})

router.delete('/privilege/:priId', async(req, res) => {
    routerUtil.modelCall(req, res, group.removePrivilege, [req.params.priId], null, null, 'user admin');
})

router.post('/user-to-group', async(req, res) => {
    routerUtil.modelCall(req, res, group.addUserToGroup, [req.body.uid, req.body.gid, req.body.bid], null, null, 'user admin');
})

router.delete('/user-to-group/:id', async(req, res) => {
    routerUtil.modelCall(req, res, group.removeUserFromGroup, [req.params.id], null, null, 'user admin');
})

router.post('/group-to-privileges', async(req, res) => {
    routerUtil.modelCall(req, res, group.addPrivilegeToGroup, [req.body.priId, req.body.gid, req.body.permit], null, null, 'user-admin');
})

router.delete('/group-to-privileges/', async(req, res) => {
    routerUtil.modelCall(req, res, group.removePrivilegeFromGroup, [req.query.pri_id, req.query.gid], null, null, 'user admin');
})

router.get('/check-privileges', async(req, res) => {
    routerUtil.modelCall(req, res, group.checkUserPrivilegeList, [req.query.uid, req.query.username], null, null, 'user admin');
})

module.exports = router;
