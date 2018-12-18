const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// const conf = require('./readConfig');

const boardRouter = require('./router/board-router');
const postRouter = require('./router/post-router');
const userRouter = require('./router/user-router');
// set up express server
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// add routers here
// app.use('/', PostRouter);
app.use('/user', userRouter);
app.use('/posts', postRouter);
app.use('/boards', boardRouter);

// listen
app.listen(process.env.PORT || 8081);

