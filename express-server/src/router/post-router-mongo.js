const express = require('express');
const Post = require('../models/mongo/post.js');

const router = express.Router();

// set middleware here
// router.use(function(req,res,next) {next();});

router.get('/posts', (req, res) => {
	Post.find({}, 'title description', function(error, posts) {
		if(error) { console.log(error); res.send({success: false}); }
		else {
			res.send({
				success: true,
				posts
			});
		}
	}).sort({_id:-1});
});

router.get('/posts/:id', (req, res) => {
	Post.findById(req.params.id, 'title description', (error, post) => {
		if(error) { console.log(error); res.send({success: false}); }
		else {
			res.send({
				success: true,
				post: post
			});
		}
	});
})

router.post('/posts', (req, res) => {
	var title = req.body.title;
	var description = req.body.description;
	var newPost = new Post({
		title: title,
		description: description
	});
	newPost.save(error => {
		if(error) {
			console.log(error);
			res.send({success: false});
		} else {
			res.send({success: true});
		}
	})
});

router.put('/posts/:id', (req, res) => {
	Post.findById(req.params.id, 'title description', (error, post) => {
		if(error) { console.log(error); res.send({success:false}); }
		else {
			post.title = req.body.title;
			post.description = req.body.description;
			post.save(error => {
				if(error) { console.log(error); res.send({success:false}); }
				else {
					res.send({success: true});
				}
			})
		}
	});
});

router.delete('/posts/:id', (req, res)=> {
	console.log("delete received", req.params.id);
	Post.findByIdAndRemove(req.params.id, undefined, function(error, post) {
		if(error) { console.log(error); res.send({success: false, error: error}); }
		else {
			res.send({success: true});
		}
	})
});

module.exports = router;
