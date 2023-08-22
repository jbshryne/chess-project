console.log("index.js says 'En Garde'!");

const $boardContainers = $(".boardContainer");

$boardContainers.children().each((idx, div) => {
  const fen = $(div)[0].dataset.fen;
  // const gameId = $(div)[0].id;

  const config = {
    position: fen,
    showNotation: false
  }
  Chessboard(div, config);
});
