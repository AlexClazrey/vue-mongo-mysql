const express = require('express');
const group = require('../models/mysql/group');
const user = require('../models/mysql/user');
const routerUtil = require('./util.js');

const router = express.Router();

// list group
router.get('/', async (req, res) => {
    routerUtil.simpleModelCall(req, res, group.listGroup);
});

router.get('/privileges', async (req, res) => {
    routerUtil.simpleModelCall(req, res, group.listPrivilege);
});

// TODO TODO 一定要添加跨域cookies的解决方案。
router.get('/user-to-group', async(req, res) => {
    routerUtil.simpleModelCall(req, res, group.listUserToGroup, null, 'user admin');
});

router.get('/group-to-privileges', async(req, res) => {
    routerUtil.simpleModelCall(req, res, group.listPrivilegeToGroup, null, 'user admin');
})

router.get('/user-list', async(req, res) => {
    routerUtil.simpleModelCall(req, res, user.getUserList, null, 'user admin');
})

module.exports = router;