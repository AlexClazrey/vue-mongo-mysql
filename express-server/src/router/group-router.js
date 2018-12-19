const express = require('express');
const group = require('../models/mysql/group');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        var data = await group.listGroup();
        res.send({
            success: true,
            data,
        })
    } catch(err) {
        res.send({success: false});
    }
});

module.exports = router;