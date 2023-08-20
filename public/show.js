// console.log($(".board")[0]);

const opponent = $(".board")[0].dataset.opponent;
let fen = $(".board")[0].dataset.fen;
const gameId = $(".board")[0].dataset.gameid.replace(/"/g, "");
// console.log(gameId);
const chess = new Chess(fen);
let board;

// Function to show the promotion dialog
function showPromotionDialog(move) {
  const promotion = window.prompt("dialog box called");
  // Display the dialog
  const dialog = document.getElementById("promotionDialog");
  dialog.style.display = "block";
  debugger;
  // Attach event listeners to the dialog buttons
  const buttons = dialog.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () =>
      handlePromotionSelection(button.dataset.piece, move)
    );
  });
}

// Function to handle promotion piece selection
function handlePromotionSelection(selectedPiece, move) {
  // Hide the dialog
  const dialog = document.getElementById("promotionDialog");
  dialog.style.display = "none";

  // Remove event listeners
  const buttons = dialog.querySelectorAll("button");
  buttons.forEach((button) => {
    button.removeEventListener("click", handlePromotionSelection);
  });

  // Apply the promotion piece to the move and update the board
  move.promotion = selectedPiece;
  chess.move(move);
  board.position(chess.fen());
  updateStatus();

  // // Call the onChange function to update the server
  // onChange();
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (chess.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (chess.turn() === "w" && piece.search(/^b/) !== -1) ||
    (chess.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  console.log("piece dropped");
  const intendedMoves = chess.moves({ square: source, verbose: true });
  console.log(intendedMoves);
  let promotionPiece;
  // illegal move
  if (!intendedMoves.find((move) => move.from === source && move.to === target))
    return "snapback";

  if (intendedMoves[0].flags.search("p") !== -1) {
    console.log("promotion");
    promotionPiece = window.prompt(
      "Promote this pawn into...? (type lowercase letter, i.e. 'q'"
    );
    }
    // see if move is legal

    chess.move({
      from: source,
      to: target,
      promotion: promotionPiece, // Default promotion to queen
    });

    // if (move !== null && move.flags.includes("p")) {
    //   // Pawn promotion occurred, show dialog
    //   showPromotionDialog(move);
    // } else {
    // board.position(chess.fen())
    updateStatus();
  }

// }

function onSnapEnd() {
  console.log("onSnapEnd fires");
  board.position(chess.fen());
}

function updateStatus() {
  // var status = ''
  // var moveColor = 'White'
  // if (chess.turn() === 'b') {
  //   moveColor = 'Black'
  // }
  // checkmate?
  // if (chess.in_checkmate()) {
  //   status = 'Game over, ' + moveColor + ' is in checkmate.'
  // }
  // draw?
  // else if (chess.in_draw()) {
  //   status = 'Game over, drawn position'
  // }
  // game still on
  // else {
  //   status = moveColor + ' to move'
  //   // check?
  //   if (chess.in_check()) {
  //     status += ', ' + moveColor + ' is in check'
  //   }
  // }
  // $status.html(status)
  // $fen.html(chess.fen())
  // $pgn.html(chess.pgn())
}

async function onChange() {
  console.log("position changed");

  const gameConfig = {
    gameId,
    opponent,
    fen: chess.fen(),
    currentTurn: chess.turn(),
    history: chess.history(),
    difficultyLevel: "advanced",
  };

  console.log(gameConfig.fen);

  const update = await fetch("/games/" + gameId + "/move?_method=PUT", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(gameConfig).toString(),
  });

  const data = await update.json();

  // if (data.choices) {
  //   const move = JSON.parse(data.choices[0].message.content);
  //   console.log(data.choices[0].message.content);

  //   chess.move(move);
  //   board.position(chess.fen());
  // }
}

const boardConfig = {
  draggable: true,
  position: fen,
  moveSpeed: "slow",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onChange: onChange,
};

board = Chessboard($(".board")[0], boardConfig);

updateStatus();
