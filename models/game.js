const mongoose = require("../db/connection");
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  title: String,
  playerNames: { type: [String], required: true },
  notes: [String],
  fen: { type: String, required: true },
  moveHistory: [String],
});

const Game = new model("Game", gameSchema)

module.exports = Game