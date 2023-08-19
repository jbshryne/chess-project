const express = require("express");
const router = express.Router();
require("dotenv").config();
const Game = require("../models/game");

// index route
router.get("/", async (req, res) => {
  const games = await Game.find();
  // console.log(chess.ascii(games[3].fen));
  res.render("game/index", { games });
});

// new route
router.get("/new", (req, res) => {
  res.render("game/new");
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

// update route for moves
router.put("/:id/move", async (req, res) => {
  console.log("update move route hit, req.body.turn = ", req.body.currentTurn);
  const { gameId, opponent, fen, currentTurn, history, difficultyLevel } =
    req.body;

  // if (opponent === "cpu" && currentTurn === "b") {
  //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.OPENAI_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       model: "gpt-4",
  //       messages: [
  //         {
  //           role: "user",
  //           content: `You are the engine of a chess app.
  //           I'll provide you with the current gamestate, and will then make a move, by responding with a move object:
  //           {
  //             from: /* string of starting square, i.e. "g7" */,
  //             to: /* string of destination square, i.e. "g5" */,
  //             position?: /* if needed, string of piece symbol, i.e. "q"
  //           }
  //           Your response to this query will be read by a JSON parser as part of a function.
  //           Your response must simply be the JSON object.
  //           Do not preface your response object with any conversational setup, as that would cause the function to fail.`,
  //         },
  //         {
  //           role: "user",
  //           content: `{ colorToMoveOnYourTurn: "${currentTurn}, currentDifficulty: ${difficultyLevel}, fen: ${fen}, history: ${history}}`,
  //         },
  //       ],
  //       max_tokens: 50,
  //     }),
  //   });

  //   const data = await response.json();
  //   console.log("response from GPT: ", data.choices[0].message.content);

  //   res.json(data);
  // }

  console.log('"updated fen" fen: ', fen);

  await Game.findOneAndUpdate(
    { _id: gameId },
    { fen },
    {
      new: true,
    }
  );
  // console.log(game);
});

// seed route
router.get("/seed", async (req, res) => {
  await Game.deleteMany({});
  await Game.create([
    {
      opponent: "local",
      playerWhite: "Jon",
      playerBlack: "Ollie",
      fen: "rnbq1b1r/1ppPkppp/7n/8/8/p4N2/PPPBPPPP/RN1QKB1R w KQkq - 0 1",
    },
    {
      opponent: "cpu",
      playerWhite: "Kirk",
      playerBlack: "Spock",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
  ]);
  res.redirect("/games");
});

// create route
router.post("/", async (req, res) => {
  // console.log(req.body);
  let game = await Game.create(req.body);
  // console.log(game._id);
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
