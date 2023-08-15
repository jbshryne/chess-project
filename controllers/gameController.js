const express = require("express");
const router = express.Router();
const Game = require("../models/game");

// index route
router.get("/", (req, res) => {
  res.send("Your Games");
});

// seed route
router.get("/seed", async (req, res) => {
  let seededGames = await Game.create([
    {
      playerNames: ["Jon", "Ollie"],
      fen: "rnbqkb1r/1ppp1ppp/4p2n/p7/3P4/5N2/PPPBPPPP/RN1QKB1R w KQkq - 2 4",
    },
    {
      playerNames: ["Kirk", "Spock"],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
  ]);
  res.send(seededGames);
});

module.exports = router;
