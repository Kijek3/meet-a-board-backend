require('dotenv').config();
require('./config/database').connect();

const auth = require('./middleware/auth');
const bcryptjs = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, city, dob } = req.body;
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
    })

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    user.token = token;

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
})

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
        }
      )
      user.token = token;
      
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    console.log(err);
  }
})

app.post('/dashboard', auth, (req, res) => {
  return res.status(200).send('I can let you go, you are logged in!');
})

module.exports = app;