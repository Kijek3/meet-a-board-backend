const { default: mongoose } = require('mongoose');

const bcryptjs = require('bcryptjs');
const User = require('../models/user');

exports.getUserInfoById = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('User id needed');
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send('Invalid userId');
  }

  try {
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
  return res.status(404).send('User doesn\'t exist');
};

exports.editUserInfo = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.userId;
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      dob,
    } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send('Invalid userId');
    }
    if (!(email && password && firstName && lastName && city && dob)) {
      return res.status(400).send('All input is required');
    }
    const check = await User.findById(id);
    const encryptedPassword = await bcryptjs.hash(password, 10);
    if (req.user.user_id !== check._id.toString()) {
      return res.status(403).send('Forbidden');
    }
    const editUserQuery = await User.findOneAndUpdate({ _id: id }, {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      city,
      dob,
    });
    return res.status(200).json(editUserQuery);
  }).catch(next);
};

exports.deleteUser = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.userId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send('All input is required');
    }
    const check = await User.findById(id);
    if (req.user.user_id !== check._id.toString()) {
      return res.status(403).send('Forbidden');
    }
    const removedUser = await User.findOneAndRemove({ _id: id });
    // console.log(removedUser);
    return res.status(200).json(removedUser);
  }).catch(next);
};

/* test function */
// exports.getAllUsers = async (req, res, next) => {
//   Promise.resolve().then(async () => {
//     User.find({}, (err, users) => {
//       const userMap = {};
//
//       users.forEach((user) => {
//         userMap[user._id] = user;
//       });
//
//       res.send(userMap);
//     });
//   }).catch(next);
// };
