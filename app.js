require('dotenv').config();
require('./config/database').connect();

const bcryptjs = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      city,
      dob,
    } = req.body;
    if (!(email && password && firstName && lastName && city && dob)) {
      return res.status(400).send('All input is required');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send('User Already Exist');
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      city,
      dob,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    );

    const userResponse = {
      userId: user._id,
      token,
    };

    return res.status(201).json(userResponse);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }

    const user = await User.findOne({ email });
    if (user && (await bcryptjs.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        },
      );

      const userResponse = {
        userId: user._id,
        token,
      };

      return res.status(200).json(userResponse);
    }
    return res.status(400).send('Invalid credentials');
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

app.post('/token', auth, (_req, res) => res.status(200).send('Valid token'));

module.exports = app;
