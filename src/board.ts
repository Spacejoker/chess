export interface Board {
  cells: Piece[][];
}

export type BoardState = Piece[][];

export enum Faction {
  BLACK, WHITE,
}

export const initBoard: Board = {
  cells: [
    toPieces("RNBKQBNR", Faction.WHITE),
    toPieces("PPPPPPPP", Faction.WHITE),
    toPieces("##########", Faction.WHITE),
    toPieces("##########", Faction.WHITE),
    toPieces("##########", Faction.WHITE),
    toPieces("##########", Faction.WHITE),
    toPieces("PPPPPPPP", Faction.BLACK),
    toPieces("RNBKQBNR", Faction.BLACK),
  ],
};

export const enum PieceType {
  KING = 'K',
  QUEEN = 'Q',
  ROOK = 'R',
  BISHOP = 'B',
  KNIGHT = 'N',
  PAWN = 'P',
}

interface Piece {
  type: PieceType | undefined;
  faction: Faction;
}

function toPieces(s: string, faction: Faction): Piece[] {
  const ret = [];
  for (let i = 0; i < 8; i++) {
    const c = s[i];
    let piece = undefined;
    switch (c) {
      case 'K':
        piece = {
          type: PieceType.KING,
          faction,
        };
        break;
      case 'Q':
        piece = {
          type: PieceType.QUEEN,
          faction,
        };
        break;
      case 'R':
        piece = {
          type: PieceType.ROOK,
          faction,
        };
        break;
      case 'B':
        piece = {
          type: PieceType.BISHOP,
          faction,
        };
        break;
      case 'N':
        piece = {
          type: PieceType.KNIGHT,
          faction,
        };
        break;
      case 'P':
        piece = {
          type: PieceType.PAWN,
          faction,
        };
        break;
    }
    ret.push(piece);
  }

  return ret;
}

export function evalBoard(board: BoardState): number {
  const pieceValues = new Map<PieceType, number>([
    [PieceType.PAWN, 1],
    [PieceType.BISHOP, 3],
    [PieceType.KNIGHT, 3],
    [PieceType.ROOK, 5],
    [PieceType.QUEEN, 9],
    [PieceType.KING, 100],
  ]);
  let sum = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const p = board[y][x];
      let val = 0;
      if (p?.type) {
        val = pieceValues.get(p.type);
        const centerDist = Math.abs(3.5-x) + Math.abs(3.5 - y);
        val += 3 - Math.sqrt(centerDist);
      }
      if (p?.faction === Faction.BLACK) {
        val *= -1;
      }
      sum += val;
    }
  }
  return sum;
}