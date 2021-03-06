const mongoose = require('mongoose');

exports.commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  meetingId: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model('game', this.gameSchema);
