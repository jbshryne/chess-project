const opponent = $(".board")[0].dataset.opponent;
let fen = $(".board")[0].dataset.fen;
const gameId = $(".board")[0].dataset.gameid.replace(/"/g, "");
// console.log(gameId);
const chess = new Chess(fen);
let board;
const $status = $("#status");
// const gameTitle = $("#status")[0].dataset.gametitle;
const playerWhite = $("#status")[0].dataset.playerwhite;
const playerBlack = $("#status")[0].dataset.playerblack;
const $statusWhite = $("#statusWhite");
const $statusBlack = $("#statusBlack");

$("body").css("background-color", "rgba(146, 145, 145, 0.9)")

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
    $statusBlack.fadeTo("slow", 0, function() {
      $statusWhite.fadeTo("slow", 1);
    });
  } else if (chess.turn() === "b") {
    $statusBlack.html(status);
    $statusWhite.fadeTo("slow", 0, function() {
      $statusBlack.fadeTo("slow", 1);

    });
  }

}

async function onChange() {
  // console.log("position changed");

  fen = chess.fen()

  const gameConfig = {
    gameId,
    opponent,
    fen: chess.fen(),
    currentTurn: chess.turn(),
    // history: chess.history(),
    // difficultyLevel: "advanced",
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
