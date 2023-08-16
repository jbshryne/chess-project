const board = Chessboard($(".board")[0], {
  position: "start",
  draggable: true,
  dropOffBoard: "trash",
  sparePieces: true,
});

$("#startBtn").on("click", board.start);
$("#clearBtn").on("click", board.clear);
