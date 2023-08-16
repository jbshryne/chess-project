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

// new route
router.get("/new", (req, res) => {
  res.render("game/new")
})

// update route
router.put("/:id", async (req, res) => {
  console.log(req.body);
  const update = await Game.findOneAndUpdate({ _id: req.params.id }, req.body);
  console.log("update = " + update)
});

// seed route
router.get("/seed", async (req, res) => {
  await Game.deleteMany({});
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

// show route
router.get("/:id", async (req, res) => {
  const game = await Game.findById(req.params.id);
  // const chessjs = new Chess(game.fen);
  // console.log(chessjs);
  res.render("game/show", { game });
});

module.exports = router;
