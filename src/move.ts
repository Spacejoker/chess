import { evalBoard, Board, BoardState, Faction, PieceType } from 'board';


export interface Move {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function findRookMoves(board: Board, faction: Faction, x: number, y: number) {
  const moves = [];
  const cells = board.cells;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  for (const d of dirs) {
    let tx = x;
    let ty = y;
    while(true) {
      tx += d[0];
      ty += d[1];
      console.log('txty', tx, ty);
      //debugger;
      if (tx > 7 || tx < 0 || ty >7 || ty < 0) {
        break;
      }
      const targetSquare = cells[tx][ty];
      if (targetSquare?.type) {
        if (targetSquare.faction != faction) {
          moves.push({ x0: x, y0: y, x1: tx, y1: ty});
        }
        break;
      } else {
        moves.push({ x0: x, y0: y, x1: tx, y1: ty});
      }
    }
  }
  return moves;
}

function findPawnMoves(board: Board, faction: Faction, x: number, y: number) {
  const moves = [];
  const cells = board.cells;
  if (faction === Faction.WHITE) {
    if (y < 7 && !board.cells[y + 1][x]?.type) {
      moves.push({ x0: x, y0: y, x1: x, y1: y + 1 });
    }
    if (y == 1 && !board.cells[y + 2][x]?.type) {
      moves.push({ x0: x, y0: y, x1: x, y1: y + 2 });
    }
    if (y < 7 && x < 7) {
      const upRight = cells[y + 1][x + 1];
      if (upRight && upRight.type != undefined && upRight.faction == Faction.BLACK) {
        moves.push({ x0: x, y0: y, x1: x + 1, y1: y + 1 });
      }
    }
    if (y < 7 && x > 0) {
      const upLeft = cells[y + 1][x - 1];
      if (upLeft && upLeft.type != undefined && upLeft.faction == Faction.BLACK) {
        moves.push({ x0: x, y0: y, x1: x - 1, y1: y + 1 });
      }
    }
  }
  if (faction === Faction.BLACK) {
    if (y > 0 && !board.cells[y - 1][x]?.type) {
      moves.push({ x0: x, y0: y, x1: x, y1: y - 1 });
    }
    if (y == 6 && !board.cells[y - 2][x]?.type) {
      moves.push({ x0: x, y0: y, x1: x, y1: y - 2 });
    }
    if (y > 0 && x < 7) {
      const downRight = cells[y - 1][x + 1];
      if (downRight && downRight.type != undefined && downRight.faction == Faction.WHITE) {
        moves.push({ x0: x, y0: y, x1: x + 1, y1: y - 1 });
      }
    }
    if (y > 0 && x > 0) {
      const downLeft = cells[y - 1][x - 1];
      if (downLeft && downLeft.type != undefined && downLeft.faction == Faction.WHITE) {
        moves.push({ x0: x, y0: y, x1: x - 1, y1: y - 1 });
      }
    }
  }
  return moves;
}

export function findMoves(board: Board, faction: Faction): Move[] {
  const moves: Move[] = [];
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = board.cells[y][x];
      const cells = board.cells;
      if (piece?.faction === faction) {
        let pieceMoves = [];
        if (piece?.type === PieceType.PAWN) {
          pieceMoves = findPawnMoves(board, faction, x, y);
        }
        if (piece?.type === PieceType.ROOK) {
          pieceMoves = findRookMoves(board, faction, x, y);
        }
        for (const m of pieceMoves) moves.push(m);
      }
    }
  }
  return moves;
}

export function findBestMove(board: Board, faction: Faction) : Move {
  const moves = findMoves(board, faction)
  const evals = [];
  for (const m of moves) {
    const newBoard = applyMove(board.cells, m, faction);
    let evaluation = evalBoard(newBoard);
    if (faction == Faction.BLACK) {
      evaluation *= -1;
    }
    evals.push([m, evaluation]);
  }
  let maxVal = -10000000;
  let maxMove = moves[0];
  shuffleArray(evals);
  for (const [m, ev] of evals) {
    if (ev > maxVal) {
      maxMove = m;
      maxVal = ev;
    }
  }
  return maxMove;
}

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function applyMove(board: BoardState, move: Move, faction: Faction) : BoardState {
  const { x0, y0, x1, y1 } = move;
  const newBoard = board.map((a) => a.slice());
  console.log('mv', move, newBoard);
  newBoard[y1][x1] = newBoard[y0][x0];
  newBoard[y0][x0] = { type: undefined, faction: Faction.WHITE };
  return newBoard;
}
