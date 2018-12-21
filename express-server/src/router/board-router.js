const express = require('express');
const board = require('../models/mysql/board');
const routerUtil = require('./util');

var router = express.Router();

router.get('/', async (req, res) => {
    routerUtil.simpleModelCall(req, res, board.list);
});

router.post('/', async (req, res) => {
    routerUtil.modelCall(req, res, board.add, [req.body.name], data => {
        res.send({success: true, bid: data});
    }, null, 'user admin');
})

router.delete('/:bid', async (req, res) => {
    routerUtil.modelCall(req, res, board.remove, [req.params.bid], null, null, 'user admin');
})

module.exports = router;