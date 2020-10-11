export interface Board {
  cells: Piece[][];
}

export enum Faction {
  BLACK, WHITE,
}

export const initBoard : Board = {
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
  type: PieceType|undefined;
  faction : Faction;
}

function toPieces(s:string, faction: Faction) : Piece[] {
  const ret = [];
  for (let i =0 ; i < 8; i++) {
    const c = s[i];
    let piece = undefined;
    switch(c) {
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
