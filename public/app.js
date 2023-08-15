console.log("app.js says 'En Garde'!");

const $testDisplay = $("#testDisplay")
const testBoard = document.querySelector("#testBoard")

console.log($testDisplay, testBoard)

$testDisplay.append(Chessboard(testBoard))


