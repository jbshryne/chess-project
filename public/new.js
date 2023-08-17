let fen;
let gameId;

if (window.location.href.match(/new$/)) {
    console.log("/new");
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
}

if (window.location.href.match(/edit$/)) {
    console.log("/edit");
    console.log($(".board")[0].dataset.fen);
  fen = $(".board")[0].dataset.fen;
  gameId = $(".board")[0].dataset.gameid.replace(/"/g, "");
}

const chess = new Chess(fen);

const board = Chessboard($(".board")[0], {
  position: fen,
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

  if (board.fen() === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    fen += " w KQkq - 0 1";
  }

  const bodyObj = {
    playerWhite: $("#playerWhiteInput").val(),
    playerBlack: $("#playerBlackInput").val(),
    fen
  };

  if (window.location.href.match(/new$/)) {
    let res = await fetch("/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    });
    let response = await res.json();
    if (response) {
      console.log(response);
    //   debugger;
      window.location.href = `/games/${response._id}`;
    }
  }

  if (window.location.href.match(/edit$/)) {
    bodyObj.fen = board.fen()
    const res = await fetch("/games/" + gameId + "?_method=PUT", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyObj),
    });

    // let response = await res;
    console.log(res);
    // debugger;
    window.location.href = `/games/${gameId}`;
  }
});
