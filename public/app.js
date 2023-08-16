console.log("app.js says 'En Garde'!");

// const $testDisplay = $("#testDisplay")
// const testBoard = document.querySelector("#testBoard")

// console.log($testDisplay, testBoard)

// $testDisplay.append(Chessboard(testBoard, "start"))

const $boardContainers = $(".boardContainer");

$boardContainers.children().each((idx, div) => {
  const fen = $(div)[0].dataset.fen;

  const config = {
    position: fen,
    showNotation: false
  }
  Chessboard(div, config);
});
