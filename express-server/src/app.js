const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const conf = require('./readConfig');
const PostRouter = require('./router/post-router');

// read config and set up mongo connection
const mongoAddr = conf.mongodb.host + ':' + conf.mongodb.port + '/' + conf.mongodb.db;
const mongoUser = conf.mongodb.auth ? (conf.mongodb.username + ':' + conf.mongodb.password + '@') : '';
mongoose.connect('mongodb://' + mongoUser + mongoAddr, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "[Error][MongoDB] Connection Error."));
db.once("open", console.log.bind(console, "[OK][MongoDB] Connection succeeded."));

// set up express server
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// add router here
app.use('/', PostRouter);

// listen
app.listen(process.env.PORT || 8081);

