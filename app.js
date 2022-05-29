require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const meetingRouter = require('./routes/meetingRouter');
const gameRouter = require('./routes/gameRouter');

const app = express();

app.use(express.json());
app.use(xmlparser());
app.use(cors());
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/meeting', meetingRouter);
app.use('/game', gameRouter);

module.exports = app;
