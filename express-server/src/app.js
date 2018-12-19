const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');

// const conf = require('./readConfig');

const security = require('./models/mysql/security');

const boardRouter = require('./router/board-router');
const postRouter = require('./router/post-router');
const userRouter = require('./router/user-router');
const groupRouter = require('./router/group-router');

// set up express server
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(security.updateCookiesMiddleware);

// add routers here
// app.use('/', PostRouter);
app.use('/user', userRouter);
app.use('/posts', postRouter);
app.use('/boards', boardRouter);
app.use('/group', groupRouter);

// listen
app.listen(process.env.PORT || 8081);

