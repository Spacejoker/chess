import 'styles.css';
import { findBestMove, findMoves, Move } from 'move';
import { initBoard, PieceType, Faction } from 'board'

let nextMove : Move|undefined;
let playerTurn : Faction = Faction.WHITE;
let lastUpdateTime: number = Date.now();
let ctx;
let pawnWhite = new Image()
let pawnBlack = new Image()
let board = {...initBoard};

function init() {
  ctx = document.querySelector('canvas').getContext('2d')
  window.requestAnimationFrame(gameLoop);
  pawnWhite.src = 'img/pawn_white.png'
  pawnBlack.src = 'img/pawn_black.png'
  document.addEventListener('keydown', (e) => {
    if (e.key == ' ') {
      performMove();
    }
  });
}

function performMove() {
  if(nextMove) {
    const {x0, y0, x1, y1} = nextMove;
    board.cells[y1][x1] = board.cells[y0][x0];
    board.cells[y0][x0] = {type:undefined, faction: Faction.WHITE};
    playerTurn = playerTurn === Faction.WHITE ? Faction.BLACK : Faction.WHITE;
    nextMove = undefined;
  }
}

function drawChessboard() {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const fillStyle = (x + y) % 2 ? 'rgb(193, 94, 66)' : 'rgb(255,248,220)';
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x * 64, y * 64, 64, 64);
    }
  }
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = board.cells[y][x];
      let gx = 7-x;
      let gy = 7-y;
      switch(piece?.type) {
        case PieceType.PAWN:
          if (piece.faction == Faction.WHITE) {
            ctx.drawImage(pawnWhite, gx * 64, gy * 64);
          } else {
            ctx.drawImage(pawnBlack, gx * 64, gy * 64);
          }
          break;
          case PieceType.KING:
          case PieceType.QUEEN:
          case PieceType.ROOK:
          case PieceType.BISHOP:
          case PieceType.KNIGHT:
            ctx.fillStyle = piece.faction == Faction.WHITE ? 'green' : 'black';
            ctx.font = '48px serif';
            ctx.fillText(piece.type, (gx+0.2)*64, (gy+0.8)*64);
            break;

      }
    }
  }
}

let gameOver = false;

function moveEval() {
  if (!nextMove) {
    nextMove = findBestMove(board, playerTurn);
    if (!nextMove) {
      gameOver = true;
    }
  }
}

function gameLoop() {
  moveEval();
  drawChessboard();
  if (!gameOver) {
    window.requestAnimationFrame(gameLoop);
  }
}

init();
gameLoop();
