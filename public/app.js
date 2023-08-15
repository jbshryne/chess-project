console.log("app.js says 'En Garde'!");

// const $testDisplay = $("#testDisplay")
// const testBoard = document.querySelector("#testBoard")

// console.log($testDisplay, testBoard)

// $testDisplay.append(Chessboard(testBoard, "start"))

const $gameContainers = $(".gameContainer");
// console.log($gameContainers.children());

$gameContainers.children().each((idx, div) => {
  console.log($(div).children()[0].innerText);
  const fen = $(div).children()[0].innerText
  Chessboard(div, fen)
  // $(div).child()
});
