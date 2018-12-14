const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const conf = require('./readConfig');
const PostRouter = require('./router/post-router-mysql');

// read config and set up mongo connection
const mongoAddr = conf.mongodb.host + ':' + conf.mongodb.port + '/' + conf.mongodb.db;
if(conf.mongodb.auth) {
	console.log(conf);
    mongoose.connect('mongodb://' + mongoAddr, { user: conf.mongodb.username, pass: conf.mongodb.password, auth: {authdb: 'admin'}});
} else {
    mongoose.connect('mongodb://' + mongoAddr, { useNewUrlParser: true });
}
var db = mongoose.connection;
db.on("error", console.error.bind(console, "[Error][MongoDB] Connection Error."));
db.once("open", console.log.bind(console, "[OK][MongoDB] Connection succeeded."));

// set up express server
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// add routers here
app.use('/', PostRouter);

// listen
app.listen(process.env.PORT || 8081);

