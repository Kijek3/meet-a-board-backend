const mongoose = require('mongoose');
const Game = require('./game');

const meetingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  guests: { type: [{ userId: mongoose.Schema.Types.ObjectId, isAccepted: Boolean }] },
  title: { type: String, required: true },
  date: { type: String, required: true },
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  isInPublicPlace: { type: Boolean, required: true },
  game: { type: Game.schema, required: true },
  description: String,
  minPlayers: Number,
  maxPlayers: Number,
  gameLanguage: String,
});

module.exports = mongoose.model('meeting', meetingSchema);
