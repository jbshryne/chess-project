console.log($(".board")[0]);

const fen = $(".board")[0].dataset.fen

const config = {
    position: fen,
    draggable: true
}

Chessboard($(".board")[0], config)