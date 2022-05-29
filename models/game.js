const mongoose = require('mongoose');

exports.gameSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  minPlayers: Number,
  maxPlayers: Number,
  playingTime: Number,
});

module.exports = mongoose.model('game', this.gameSchema);
