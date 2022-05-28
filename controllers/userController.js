const { default: mongoose } = require('mongoose');

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
