////// piece promotion

// Function to show the promotion dialog
// function showPromotionDialog(move) {
//   // const promotion = window.prompt("dialog box called");
//   // Display the dialog
//   const dialog = document.getElementById("promotionDialog");
//   dialog.style.display = "block";
//   debugger;
//   // Attach event listeners to the dialog buttons
//   const buttons = dialog.querySelectorAll("button");
//   buttons.forEach((button) => {
//     button.addEventListener("click", () =>
//       handlePromotionSelection(button.dataset.piece, move)
//     );
//   });
// }

// Function to handle promotion piece selection
// function handlePromotionSelection(selectedPiece, move) {
//   // Hide the dialog
//   const dialog = document.getElementById("promotionDialog");
//   dialog.style.display = "none";

//   // Remove event listeners
//   const buttons = dialog.querySelectorAll("button");
//   buttons.forEach((button) => {
//     button.removeEventListener("click", handlePromotionSelection);
//   });

//   // Apply the promotion piece to the move and update the board
//   move.promotion = selectedPiece;
//   chess.move(move);
//   board.position(chess.fen());
//   updateStatus();

//   // // Call the onChange function to update the server
//   // onChange();
// }



// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null;
var game = new Chess();
var $status = $("#status");
// var $fen = $('#fen')
// var $pgn = $('#pgn')

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};
board = Chessboard("myBoard", config);

updateStatus();

////// ATTEMPTING TO INTEGRATE STOCKFISH GAME ENGINE & PARSER

////// In update move:
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

////// Test route:
// Add a new route for the communication test
router.get("/test", async (req, res) => {
  try {
    const { spawn } = require("child_process");

    // Spawn a new Stockfish process
    const stockfishProcess = spawn("/opt/homebrew/bin/stockfish");

    let responseData = "";

    // Event listeners to capture Stockfish responses
    stockfishProcess.stdout.on("data", (data) => {
      responseData += data;

      // Check if the responseData contains the "uciok" message
      if (responseData.includes("uciok")) {
        // Send the "isready" command to Stockfish
        stockfishProcess.stdin.write("isready\n");
        stockfishProcess.stdin.end();
      }

      // Check if the responseData contains the "readyok" message
      if (responseData.includes("readyok")) {
        // Send the "ucinewgame" command to Stockfish
        stockfishProcess.stdin.write("ucinewgame\n");

        // Send the starting position to Stockfish
        stockfishProcess.stdin.write("position startpos\n");

        // Send the "go depth 1" command to Stockfish
        stockfishProcess.stdin.write("go depth 1\n");
        stockfishProcess.stdin.end();
      }

      // Check if the responseData contains the best move information
      const bestMoveMatch = responseData.match(/bestmove\s+(\w+)/);
      if (bestMoveMatch) {
        const bestMove = bestMoveMatch[1];

        // Return the best move as a response
        res.json({ bestMove });
      }
    });

    // Send the "uci" command to Stockfish
    stockfishProcess.stdin.write("uci\n");
  } catch (error) {
    console.error("Error during communication test:", error);
    res.status(500).json({ error: "An error occurred during the test." });
  }
});



////// html for dialog box

// <!-- <div id="promotionDialog" class="dialog">
// <p>Choose a piece to promote your pawn:</p>
// <button data-piece="q">Queen</button>
// <button data-piece="r">Rook</button>
// <button data-piece="n">Knight</button>
// <button data-piece="b">Bishop</button>
// </div> -->