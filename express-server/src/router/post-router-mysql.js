const express = require('express');
const post = require('../models/mysql/postTest.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.get('/posts', (req, res) => {
    post.getList().then(function(data) {
        res.send({
            success: true,
            posts: data
        })
    }).catch(function(err) {
        res.send({success: false});
    });
});

router.get('/posts/:id', (req, res) => {
    post.getPost(req.params.id).then(data => {
        if(data.length > 0) {
            res.send({
                success: true,
                post: data[0]
            });
        } else {
            res.send({success: false});
        }
    }).catch(err => {
        res.send({success: false});
    });
})

router.post('/posts', (req, res) => {
    post.addPost(req.body.title, req.body.description).then(data => {
        res.send({success: true});
    }).catch(err => {
        res.send({success: false});
    });
});

router.put('/posts/:id', (req, res) => {
    post.updatePost(req.params.id, req.body.title, req.body.description).then(data => {
        res.send({success: true});
    }).catch(err => {
        res.send({success: false});
    });
});

router.delete('/posts/:id', (req, res)=> {
    post.removePost(req.params.id).then(data => {
        res.send({success: true});
    }).catch(err => {
        res.send({success: false});
    });
});

module.exports = router;
