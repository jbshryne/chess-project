// console.log($(".board")[0]);

const fen = $(".board")[0].dataset.fen
const gameId = $(".board")[0].dataset.gameid.replace(/"/g, '')
console.log(gameId);
const chess = new Chess(fen)
let board = null

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (chess.game_over()) return false
  
    // only pick up pieces for the side to move
    if ((chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  function onDrop (source, target) {
    // see if the move is legal
    var move = chess.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
  
    // illegal move
    if (move === null) return 'snapback'
  
    updateStatus()
  }

  function onSnapEnd () {
    board.position(chess.fen())
  }

  function updateStatus () {
    // var status = ''
  
    // var moveColor = 'White'
    // if (chess.turn() === 'b') {
    //   moveColor = 'Black'
    // }
  
    // checkmate?
    // if (chess.in_checkmate()) {
    //   status = 'Game over, ' + moveColor + ' is in checkmate.'
    // }
  
    // draw?
    // else if (chess.in_draw()) {
    //   status = 'Game over, drawn position'
    // }
  
    // game still on
    // else {
    //   status = moveColor + ' to move'
  
    //   // check?
    //   if (chess.in_check()) {
    //     status += ', ' + moveColor + ' is in check'
    //   }
    // }
  
    // $status.html(status)
    // $fen.html(chess.fen())
    // $pgn.html(chess.pgn())
  }

  async function onChange() {

    console.log(chess.fen())

    const update = await fetch("/games/" + gameId + "?_method=PUT", {
      method: "PUT",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
      },
      body: new URLSearchParams({ fen: chess.fen() }).toString(), 
    });

    console.log(update);
  }
  
  
  var config = {
    draggable: true,
    position: fen,
    moveSpeed: "slow",
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onChange: onChange
  }

board = Chessboard($(".board")[0], config)

updateStatus()