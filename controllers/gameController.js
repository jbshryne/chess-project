const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../models/user");
const Game = require("../models/game");

// const uci = require("node-uci");
// const stockfish = new uci.Engine("/opt/homebrew/bin/stockfish");
// stockfish.init();

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
      fen: "rnbq1b1r/1ppPkppp/7n/8/8/p4N2/PPPBPPPP/RN1QKB1R w KQkq - 0 1",
    },
    {
      userId: req.session.userId,
      opponent: "cpu",
      playerWhite: "Kirk",
      playerBlack: "Spock",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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

// // test route
// // Add a new route for the communication test
// router.get("/test", async (req, res) => {
//   try {
//     const { spawn } = require("child_process");
    
//     // Spawn a new Stockfish process
//     const stockfishProcess = spawn("/opt/homebrew/bin/stockfish");

//     let responseData = "";

//     // Event listeners to capture Stockfish responses
//     stockfishProcess.stdout.on("data", (data) => {
//       responseData += data;
      
//       // Check if the responseData contains the "uciok" message
//       if (responseData.includes("uciok")) {
//         // Send the "isready" command to Stockfish
//         stockfishProcess.stdin.write("isready\n");
//         stockfishProcess.stdin.end();
//       }
      
//       // Check if the responseData contains the "readyok" message
//       if (responseData.includes("readyok")) {
//         // Send the "ucinewgame" command to Stockfish
//         stockfishProcess.stdin.write("ucinewgame\n");
        
//         // Send the starting position to Stockfish
//         stockfishProcess.stdin.write("position startpos\n");
        
//         // Send the "go depth 1" command to Stockfish
//         stockfishProcess.stdin.write("go depth 1\n");
//         stockfishProcess.stdin.end();
//       }
      
//       // Check if the responseData contains the best move information
//       const bestMoveMatch = responseData.match(/bestmove\s+(\w+)/);
//       if (bestMoveMatch) {
//         const bestMove = bestMoveMatch[1];
        
//         // Return the best move as a response
//         res.json({ bestMove });
//       }
//     });

//     // Send the "uci" command to Stockfish
//     stockfishProcess.stdin.write("uci\n");
//   } catch (error) {
//     console.error("Error during communication test:", error);
//     res.status(500).json({ error: "An error occurred during the test." });
//   }
// });

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

// update route for moves
router.put("/:id/move", async (req, res) => {
  // console.log("update move route hit, req.body.turn = ", req.body.currentTurn);
  const { gameId, opponent, fen, currentTurn, history, difficultyLevel } =
    req.body;

  // if (opponent === "cpu" && currentTurn === "b") {
  // let bestMove;
  // stockfish.position(fen);
  // stockfish.go({ depth: 20 }, async (response) => {
  //   console.log("stockfish?")
  //   bestMove = await response.bestmove;
  //   console.log("bestMove =", bestMove);
  // });
  // // }
  // console.log("bestMove = ", bestMove);

  // console.log('"updated fen" fen: ', fen);

  await Game.findOneAndUpdate(
    { _id: gameId },
    { fen },
    {
      new: true,
    }
  );
  // console.log(game);
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

// process.on('exit', () => {
//   stockfish.quit();
// });
