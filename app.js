require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const meetingRouter = require('./routes/meetingRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/meeting', meetingRouter);

module.exports = app;
