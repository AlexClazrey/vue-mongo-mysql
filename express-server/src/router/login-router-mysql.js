const express = require('express');
const user = require('../models/mysql/user.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});


router.get('/login', (req, res) => {
    user.IsIdexsit(req.params.id).then(data => {
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

router.post('/login', (req, res) => {
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
