/* eslint-disable @typescript-eslint/no-explicit-any */

import { PieceType } from "./chess_types";

const pawnMoves = (board: PieceType[][], color: string, row: number, column: number, hasMoved: boolean) => {
  const moves = [];

  if (color === "white") {
    // Move up one square if its not blocked
    if (board[row - 1][column].color === null) moves.push({ row: row - 1, column: column });

    // If it is the first move, move up two squares if its not blocked
    if (!hasMoved) {
      if (board[row - 1][column].color === null && board[row - 2][column].color === null) moves.push({ row: row - 2, column: column });
    }

    // Capture diagonally left
    if (column - 1 >= 0 && column - 1 < 8 && board[row - 1][column - 1].color === "black") moves.push({ row: row - 1, column: column - 1 });

    // Capture diagonally right
    if (column + 1 >= 0 && column + 1 < 8 && board[row - 1][column + 1].color === "black") moves.push({ row: row - 1, column: column + 1 });
  } else {
    // Move down one square if its not blocked
    if (board[row + 1][column].color === null) moves.push({ row: row + 1, column: column });

    // If it is the first move, move down two squares if its not blocked
    if (!hasMoved) {
      if (board[row + 1][column].color === null && board[row + 2][column].color === null) moves.push({ row: row + 2, column: column });
    }

    // Capture diagonally left
    if (column - 1 >= 0 && column - 1 < 8 && board[row + 1][column - 1].color === "white") moves.push({ row: row + 1, column: column - 1 });

    // Capture diagonally right
    if (column + 1 >= 0 && column + 1 < 8 && board[row + 1][column + 1].color === "white") moves.push({ row: row + 1, column: column + 1 });
  }

  return moves;
};

const knightMoves = (board: PieceType[][], color: string, row: number, column: number) => {
  const moves = [];

  const rowMoves = [2, 1, -1, -2, -2, -1, 1, 2];
  const columnMoves = [1, 2, 2, 1, -1, -2, -2, -1];

  for (let i = 0; i < 8; i++) {
    const newRow = row + rowMoves[i];
    const newColumn = column + columnMoves[i];

    if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== color) {
      moves.push({ row: newRow, column: newColumn });
    }
  }

  return moves;
};

const bishopMoves = (board: PieceType[][], color: string, opponentColor: string, row: number, column: number) => {
  const moves = [];

  const rowMoves = [-1, -1, 1, 1];
  const columnMoves = [-1, 1, -1, 1];

  for (let i = 0; i < rowMoves.length; i++) {
    let newRow = row + rowMoves[i];
    let newColumn = column + columnMoves[i];

    while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== color) {
      moves.push({ row: newRow, column: newColumn });

      if (board[newRow][newColumn].color === opponentColor) break;

      newRow += rowMoves[i];
      newColumn += columnMoves[i];
    }
  }

  return moves;
};

const rookMoves = (board: PieceType[][], color: string, opponentColor: string, row: number, column: number) => {
  const moves = [];

  const rowMoves = [-1, 0, 1, 0];
  const columnMoves = [0, 1, 0, -1];

  for (let i = 0; i < rowMoves.length; i++) {
    let newRow = row + rowMoves[i];
    let newColumn = column + columnMoves[i];

    while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== color) {
      moves.push({ row: newRow, column: newColumn });

      if (board[newRow][newColumn].color === opponentColor) break;

      newRow += rowMoves[i];
      newColumn += columnMoves[i];
    }
  }

  return moves;
};

const queenMoves = (board: PieceType[][], color: string, opponentColor: string, row: number, column: number) => {
  let moves: any[] = [];

  moves = [...moves, ...bishopMoves(board, color, opponentColor, row, column)];
  moves = [...moves, ...rookMoves(board, color, opponentColor, row, column)];

  return moves;
};

const kingMoves = (board: PieceType[][], color: string, row: number, column: number) => {
  const moves = [];

  const rowMoves = [-1, 0, 1, 0, -1, -1, 1, 1];
  const columnMoves = [0, 1, 0, -1, -1, 1, -1, 1];

  for (let i = 0; i < rowMoves.length; i++) {
    const newRow = row + rowMoves[i];
    const newColumn = column + columnMoves[i];

    if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== color) {
      moves.push({ row: newRow, column: newColumn });
    }
  }

  return moves;
};

const calculateValidMoves = (
  type: string,
  board: PieceType[][],
  color: string,
  opponentColor: string,
  row: number,
  column: number,
  settings: any
) => {
  if (type === "pawn") return pawnMoves(board, color, row, column, settings.hasMoved);

  if (type === "knight") return knightMoves(board, color, row, column);

  if (type === "bishop") return bishopMoves(board, color, opponentColor, row, column);

  if (type === "rook") return rookMoves(board, color, opponentColor, row, column);

  if (type === "queen") return queenMoves(board, color, opponentColor, row, column);

  if (type === "king") return kingMoves(board, color, row, column);

  return [];
};

export { calculateValidMoves };
