const express = require('express');
const post = require('../models/mysql/post.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

// get post list
router.get('/', async (req, res) => {
    try {
        var data = await post.getListAndReplies(req.query.bid, req.query.page);
        res.send({
            success: true,
            data: data
        });
    } catch(err) {
        res.send({success: false});
    }
});

// save draft
router.post('/draft', async (req, res) => {
    try {
        var newPid = await post.saveDraft(req.body.uid, req.body.pid, req.body.title, req.body.content)
        if(newPid > 0) {
            // 内容创建成功
            if(req.body.isReply) {
                // 添加到回复
                var success = await post.addPostToReply(newPid, req.body.pPid, true);
                if(success == 0) {
                    res.send({
                        success: false,
                        msg: '你不能回复一个回复帖',
                        pid: newPid
                    });
                }
            } else {
                // 添加到板块
                await post.addPostToBoard(newPid, req.body.bid, true);
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

// commit post
router.post('/', async (req, res) => {
    try {
        await post.commitPost(req.body.uid, req.body.pid);
        res.send({success: true});
    } catch (err) {
        res.send({success: false});
    }
})

// get post details
router.get('/:pid', async(req, res) => {
    try {
        var postData = await post.getPost(req.params.pid)
        if(postData.length == 0) {
            res.send({
                success: false,
                msg: 'No such post'
            })
        } else {
            res.send({
                success: true,
                data: postData
            });
        }
    } catch (err) {
        res.send({success: false});
    }
})

// Get post's recent replies list
router.get('/reply-list/:pid', async(req, res) => {
    try {
        var replies = await post.getReplies(req.params.pid, 5);
        res.send({
            success: true,
            data: replies
        });
    } catch (err) {
        res.send({success: false});
    }
})

// delete draft



// user delete post


module.exports = router;
