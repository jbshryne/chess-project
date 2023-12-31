const mongoose = require("../db/connection");
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId, required: true },
  opponent: { type: String, required: true },
  playerWhite: { type: String, required: true },
  playerBlack: { type: String, required: true },
  fen: { type: String, required: true },
  currentTurn: { type: String, required: true },
  gameTitle: String,
  capturedWhite: [String],
  capturedBlack: [String],
  // moveHistory: [String],
  // notes: [String],
  // difficultyLevel: String,
});

const Game = new model("Game", gameSchema);

module.exports = Game;
