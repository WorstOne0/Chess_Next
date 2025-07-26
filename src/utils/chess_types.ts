/* eslint-disable @typescript-eslint/no-explicit-any */

export type Board = {
  board: PieceType[][];
  //
  currentPlayerTurn: string;
  castlingRights: string;
  enPassantTarget: string;
  halfMoveClock: number;
  fullMoveNumber: number;
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
