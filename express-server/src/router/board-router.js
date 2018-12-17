const express = require('express');
const board = require('../models/mysql/board');

var router = express.Router();

router.get('/', async (req, res) => {
    try {
        var result = await board.list();
        res.send ({success: true, data: result});
    } catch (err) {
        res.send({success: false});
    }
});

module.exports = router;