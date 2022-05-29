const mongoose = require('mongoose');
const Game = require('./game');

exports.librarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  game: { type: Game.schema, required: true },
});

module.exports = mongoose.model('library', this.librarySchema);
