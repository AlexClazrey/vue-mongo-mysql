const express = require('express');
const post = require('../models/mysql/post.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.get('/', async (req, res) => {
    try {
        var data = await post.getList(req.query.bid, req.query.page);
        res.send({
            success: true,
            data: data
        });
    } catch(err) {
        res.send({success: false});
    }
});

router.post('/draft', async (req, res) => {
    try {
        var newPid = await post.saveDraft(req.body.uid, req.body.pid, req.body.title, req.body.content)
        if(newPid > 0) {
            // 内容创建成功
            if(req.body.isReply) {
                // 添加到回复
                await post.addPostToReply(newPid, req.body.pPid);
            } else {
                // 添加到板块
                await post.addPostToBoard(newPid, req.body.bid);
            }
            res.send({
                success: true,
                pid: newPid
            });
        } else {
            // 内容创建失败
            res.send({success: false});
        }
    } catch(err) {
        res.send({success: false, pid: (newPid > 0 ? newPid : undefined)});
    }
});

router.post('/', async (req, res) => {
    try {
        await post.commitPost(req.body.uid, req.body.pid);
        res.send({success: true});
    } catch (err) {
        res.send({success: false});
    }
})

module.exports = router;
