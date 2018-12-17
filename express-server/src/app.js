const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// const conf = require('./readConfig');
// const PostRouter = require('./router/post-router-mysql');

const loginRouter = require('./router/login-router');
const registerRouter = require('./router/register-router');
// set up express server
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// add routers here
// app.use('/', PostRouter);
app.use('/user', loginRouter);
app.use('/user', registerRouter);

// listen
app.listen(process.env.PORT || 8081);

