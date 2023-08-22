let gameId;
let fen;
let currentTurn = "w";

if (window.location.href.match(/new$/)) {
  console.log("/new");
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
}

if (window.location.href.match(/edit$/)) {
  console.log("/edit");
  console.log($(".board")[0].dataset.fen);
  fen = $(".board")[0].dataset.fen;
  currentTurn = $(".board")[0].dataset.currentTurn
  gameId = $(".board")[0].dataset.gameid.replace(/"/g, "");
}

const chess = new Chess(fen);

const board = Chessboard($(".board")[0], {
  position: fen,
  draggable: true,
  dropOffBoard: "trash",
  sparePieces: true,
});

$("#blackToMove").on("change", function () {
  currentTurn = "b"; // Set currentTurn to Black
  console.log(currentTurn);
});

$("#whiteToMove").on("change", function () {
  currentTurn = "w"; // Set currentTurn to White
  console.log(currentTurn);

});

$("#startBtn").on("click", board.start);
$("#clearBtn").on("click", board.clear);


$("#submitBtn").on("click", async () => {
  if (board.fen() === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
    fen += " w KQkq - 0 1";
  }

  const bodyObj = {
    playerWhite: $("#playerWhiteInput").val(),
    playerBlack: $("#playerBlackInput").val(),
    currentTurn,
    fen: board.fen() + " " + currentTurn + " KQkq - 0 1"
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
