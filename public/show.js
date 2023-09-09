const boardData = $(".board")[0].dataset;
const gameId = boardData.gameid.replace(/"/g, "");
let fen = boardData.fen;
const opponent = boardData.opponent;

const chess = new Chess(fen);
let board;

const playerWhite = $("#status")[0].dataset.playerwhite;
const playerBlack = $("#status")[0].dataset.playerblack;
const $statusWhite = $("#statusWhite");
const $statusBlack = $("#statusBlack");
const $capturedWhite = $("#capturedWhite");
const $capturedBlack = $("#capturedBlack");

// $("body").css("background-color", "rgba(146, 145, 145, 0.9)");

// Chessboard.js integration
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
  // allow if move is legal
  const possibleMoves = chess.moves({ square: source, verbose: true });
  const intendedMove = possibleMoves.find(
    (move) => move.from === source && move.to === target
  );
  if (!intendedMove) return "snapback";

  // check for pawn promotion
  let promotionPiece;
  if (intendedMove.flags.search("p") !== -1) {
    // NOTE: window.prompt is a temporary functional solution
    // as I haven't been able to integrate a custom dialog box
    // into the chessboard.js function chain yet
    promotionPiece = window.prompt(
      "Promote this pawn into...? (type symbol letter, i.e. 'n' for knight)"
    );
  }
  // check for capture
  if (intendedMove.captured) {
    const capturedColor = chess.turn() === "w" ? "b" : "w";
    const capturedPiece = capturedColor + intendedMove.captured.toUpperCase();
    const imageEl = `<img data-piece=${capturedPiece} src="/img/${capturedPiece}.png" alt="captured piece: ${capturedColor}${capturedPiece}"/>`;
    console.log(capturedPiece);
    // if (capturedColor === "w") $capturedWhite.append(imageEl);
    // if (capturedColor === "b") $capturedBlack.append(imageEl);
  }

  chess.move({
    from: source,
    to: target,
    promotion: promotionPiece,
  });

  updateStatus();
}

function onSnapEnd() {
  board.position(chess.fen());
}

async function onChange() {
  fen = chess.fen();

  const gameConfig = {
    gameId,
    opponent,
    fen: chess.fen(),
    pgn: chess.pgn(),
    currentTurn: chess.turn(),
    validMoves: chess.moves(),
    // history: chess.history(),
    // difficultyLevel: "advanced",
  };

  console.log(gameConfig.fen);

  const response = await fetch("/games/" + gameId + "/move?_method=PUT", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(gameConfig).toString(),
  });

  if (opponent === "cpu" && chess.turn() === "b") {
    const newMove = await response.json();
    console.log(newMove);
    if (newMove.from && newMove.to && newMove.newFen) {
      chess.move({ from: newMove.from, to: newMove.to });
      board.position(newMove.newFen);
    }
  }
}
// Updating each player's "status box" w/ every move
function updateStatus() {
  let status = "";
  let currentPlayer;
  let moveColor = "White";
  if (chess.turn() === "b") {
    moveColor = "Black";
  }

  if (chess.turn() === "w") currentPlayer = playerWhite;
  if (chess.turn() === "b") currentPlayer = playerBlack;

  if (chess.in_checkmate()) {
    status = currentPlayer + " is in checkmate, Game over!";
  } else if (chess.in_draw()) {
    status = "Game over, drawn position";
  } else {
    status = currentPlayer + " to move";
    if (chess.in_check()) {
      status = currentPlayer + " must move out of check!";
    }
  }
  if (chess.turn() === "w") {
    $statusWhite.html(status);
    $statusBlack.fadeTo("slow", 0);
    $statusWhite.fadeTo("slow", 0.9);
  } else if (chess.turn() === "b") {
    $statusBlack.html(status);
    $statusWhite.fadeTo("slow", 0);
    $statusBlack.fadeTo("slow", 0.9);
  }
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
