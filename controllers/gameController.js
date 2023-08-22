const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../models/user");
const Game = require("../models/game");
let moveUpdateTimeout = null;

// index route
router.get("/", async (req, res) => {
  const user = await User.findById(req.session.userId).populate("games");
  // const games = await Game.find();
  // console.log(user);
  res.render("game/index", { user });
});

// seed route
router.get("/seed", async (req, res) => {
  const seededGames = await Game.create([
    {
      userId: req.session.userId,
      opponent: "local",
      playerWhite: "Jon",
      playerBlack: "Ollie",
      currentTurn: "w",
      fen: "rnbq1b1r/1ppPkppp/7n/8/8/p4N2/PPPBPPPP/RN1QKB1R w KQkq - 0 1",
    },
    {
      userId: req.session.userId,
      opponent: "cpu",
      playerWhite: "Kirk",
      playerBlack: "Spock",
      currentTurn: "b",
      fen: "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 1 1",
    },
  ]);

  console.log(seededGames);

  const seededGameIds = [];
  seededGames.forEach((game) => seededGameIds.push(game._id));

  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { $set: { games: seededGameIds } },
    { new: true }
  );
  res.redirect("/games");
});

// new route
router.get("/new", async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("game/new", { user });
});

// delete route
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Game.findByIdAndRemove(id);
  res.redirect("/games");
});

// update route (main)
router.put("/:id", async (req, res) => {
  const update = await Game.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  res.json(update);
});

router.put("/:id/move", async (req, res) => {
  const { gameId, opponent, fen, currentTurn } = req.body;

  console.log("Received data: ", fen);

  if (moveUpdateTimeout) {
    clearTimeout(moveUpdateTimeout);
  }

  moveUpdateTimeout = setTimeout(async () => {
    const update = await Game.findOneAndUpdate(
      { _id: gameId },
      { fen, currentTurn },
      {
        new: true,
      }
    );
    res.json({ success: true });
    console.log(update);
  }, 1000);
});

// create route
router.post("/", async (req, res) => {
  req.body.userId = req.session.userId;
  req.body.opponent = "local";
  const game = await Game.create(req.body);
  await User.findByIdAndUpdate(req.session.userId, {
    $push: { games: game._id },
  });
  res.json(game);
});

// edit route
router.get("/:id/edit", async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.render("game/edit", { game });
});

// show route
router.get("/:id", async (req, res) => {
  const game = await Game.findById(req.params.id);
  // const chessjs = new Chess(game.fen);
  // console.log(chessjs);
  res.render("game/show", { game });
});

module.exports = router;
