import { Board, Faction, PieceType } from 'board';

export interface Move {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
function findPawnMoves(board: Board, faction: Faction, x: number, y: number) {
  const moves = [];
  const cells = board.cells;
  if (faction === Faction.WHITE) {
    if (y < 7 && !board.cells[y + 1][x]?.type) {
      moves.push({ x0: x, y0: y, x1: x, y1: y + 1 });
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
      if (piece?.faction === faction && piece?.type === PieceType.PAWN) {
        const pawnMoves = findPawnMoves(board, faction, x, y);
        for (const m of pawnMoves) moves.push(m);
      }
    }
  }
  return moves;
}

export function findBestMove(board: Board, faction: Faction) : Move {
  const moves = findMoves(board, faction)
  return moves[getRandomInt(moves.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function updateState(board: Board, move: Move, faction: Faction) : Board {
    const {x0, y0, x1, y1} = move;
    board.cells[y1][x1] = board.cells[y0][x0];
    board.cells[y0][x0] = {type:undefined, faction: Faction.WHITE};
    faction === Faction.WHITE ? Faction.BLACK : Faction.WHITE;
  return board;
}
