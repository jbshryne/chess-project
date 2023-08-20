const mongoose = require("../db/connection");
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId, required: true },
  title: String,
  playerWhite: { type: String, required: true },
  playerBlack: { type: String, required: true },
  opponent: { type: String, required: true },
  difficultyLevel: String,
  notes: [String],
  fen: { type: String, required: true },
  capturedWhite: [String],
  capturedBlack: [String],
  moveHistory: [String],
});

const Game = new model("Game", gameSchema);

module.exports = Game;
