const mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  email: { type: String, unique: true, select: false },
  password: { type: String, select: false },
  firstName: { type: String },
  lastName: { type: String },
  city: { type: String },
  dob: { type: String },
  description: String,
});

module.exports = mongoose.model('user', this.userSchema);
