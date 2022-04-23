require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(express.json());
app.use('/user', userRouter);
app.use('/auth', authRouter);

module.exports = app;
