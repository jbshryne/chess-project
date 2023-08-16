const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const { Chess } = require("chess.js");
// const { Chessboard } = require("../public/js/chessboard-1.0.0");
const chess = new Chess();

// index route
router.get("/", async (req, res) => {
  const games = await Game.find();
  console.log(chess.ascii(games[0].fen));
  res.render("game/index", { games });
});

// seed route
router.get("/seed", async (req, res) => {
  let seededGames = await Game.create([
    {
      playerWhite: "Jon",
      playerBlack: "Ollie",
      fen: "rnbqkb1r/1ppp1ppp/4p2n/p7/3P4/5N2/PPPBPPPP/RN1QKB1R w KQkq - 2 4",
    },
    {
      playerWhite: "Kirk",
      playerBlack: "Spock",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
  ]);
  res.send(seededGames);
});

module.exports = router;
