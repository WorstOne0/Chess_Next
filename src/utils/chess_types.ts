/* eslint-disable @typescript-eslint/no-explicit-any */

export type Board = {
  board: PieceType[][];
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
};

export type SelectedPiece = {
  piece: PieceType;
  //
  validMoves: Position[];
};
