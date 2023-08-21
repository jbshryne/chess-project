const opponent = $(".board")[0].dataset.opponent;
let fen = $(".board")[0].dataset.fen;
const gameId = $(".board")[0].dataset.gameid.replace(/"/g, "");
// console.log(gameId);
const chess = new Chess(fen);
let board;
const $status = $("#status");
const playerWhite = $("#status")[0].dataset.playerwhite;
const playerBlack = $("#status")[0].dataset.playerblack;
const $statusWhite = $("#statusWhite");
const $statusBlack = $("#statusBlack");

$("body").css("background-color", "rgba(146, 145, 145, 0.8)")

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
  // console.log("piece dropped");
  const intendedMoves = chess.moves({ square: source, verbose: true });
  console.log(intendedMoves);
  let promotionPiece;
  // illegal move
  if (!intendedMoves.find((move) => move.from === source && move.to === target))
    return "snapback";

  if (intendedMoves[0].flags.search("p") !== -1) {
    // console.log("promotion");
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
  // console.log("onSnapEnd fires");
  board.position(chess.fen());
}

function updateStatus() {
  let status = "";
  let currentPlayer;
  let moveColor = "White";
  if (chess.turn() === "b") {
    moveColor = "Black";
  }

  if (playerWhite === playerBlack) {
    currentPlayer = moveColor;
  } else {
    if (chess.turn() === "w") currentPlayer = playerWhite;
    if (chess.turn() === "b") currentPlayer = playerBlack;
  }

  // checkmate?
  if (chess.in_checkmate()) {
    status = currentPlayer + " is in checkmate, Game over!";
  }
  // draw?
  else if (chess.in_draw()) {
    status = "Game over, drawn position";
  }
  // game still on
  else {
    status = currentPlayer + " to move";
    // check?
    if (chess.in_check()) {
      status = currentPlayer + " must move out of check!";
    }
  }
  // $status.html(status);
  if (chess.turn() === "w") {
    $statusWhite.html(status);
    $statusWhite.css("opacity", "1")
    $statusBlack.css("opacity", "0"); 
   }
  if (chess.turn() === "b") {
    $statusBlack.html(status);
    $statusBlack.css("opacity", "1")
    $statusWhite.css("opacity", "0"); 
  }
}

async function onChange() {
  // console.log("position changed");

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
