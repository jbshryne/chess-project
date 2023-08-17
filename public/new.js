const chess = new Chess();

const board = Chessboard($(".board")[0], {
  position: "start",
  draggable: true,
  dropOffBoard: "trash",
  sparePieces: true,
});

$("#startBtn").on("click", board.start);
$("#clearBtn").on("click", board.clear);
$("#submitBtn").on("click", async () => {
  // const fenValidation = chess.validateFen(board.fen());

  // if (!fenValidation.ok) {
  //   console.log(fenValidation.error);
  //   return
  // }

  let fen = board.fen();
  if (board.fen() === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    fen += " w KQkq - 0 1";
  }

  const bodyObj = {
    playerWhite: $("#playerWhiteInput").val(),
    playerBlack: $("#playerBlackInput").val(),
    fen,
  };

  let res = await fetch("/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  //   console.log(await res.json());
  let response = await res.json();
    if (response) {
      window.location = `/games/${response._id}`
    }
});
