var Express = require('express');
var file = require('../models/mysql/file');
const routerUtil = require('./util.js');

var router = Express.Router();

// /<:file-id>
router.get('/:fileId', async (req, res) => {
    routerUtil.modelCall(req, res, file.getAddress, [req.params.fileId], null);
})

module.exports = router;