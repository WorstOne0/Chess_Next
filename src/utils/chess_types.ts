/* eslint-disable @typescript-eslint/no-explicit-any */

export type Board = {
  board: PieceType[][];
  fen: string;
  //
  currentPlayerTurn: string;
  castlingRights: string;
  enPassantTarget: string;
  halfMoveClock: number;
  fullMoveNumber: number;
  //
  attackedSquares: Record<string, Position>;
  checkedSquares: Record<string, Position>;
  captureMask: Record<string, Position>;
  pushMask: Record<string, Position>;
};

export type Position = {
  row: number;
  column: number;
};

export type PieceType = {
  type: string;
  color: string | null;
  //
  position: Position;
  //
  settings: any;
  notation: string;
  fen: string | null;
};

export type SelectedPiece = {
  piece: PieceType;
  //
  validMoves: Position[];
};
