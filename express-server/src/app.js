const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const Post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/a-forum', { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "[Error][MongoDB] Connection Error."));
db.once("open", console.log.bind(console, "[OK][MongoDB] Connection succeeded."));

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
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

app.get('/posts/:id', (req, res) => {
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

app.post('/posts', (req, res) => {
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

app.put('/posts/:id', (req, res) => {
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

app.delete('/posts/:id', (req, res)=> {
	console.log("delete received", req.params.id);
	Post.findByIdAndRemove(req.params.id, undefined, function(error, post) {
		if(error) { console.log(error); res.send({success: false, error: error}); }
		else {
			res.send({success: true});
		}
	})
});

app.listen(process.env.PORT || 8081);

