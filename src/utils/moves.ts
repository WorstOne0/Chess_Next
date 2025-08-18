/* eslint-disable @typescript-eslint/no-explicit-any */

import { boardNotation } from "./board";
import { Board, PieceType } from "./chess_types";

const pawnMoves = (fullBoard: Board, piece: PieceType) => {
  const { board, checkedSquares, captureMask, pushMask } = fullBoard;
  const { row, column } = piece.position;

  // Double Check => only legal moves are king moves
  if (Object.entries(checkedSquares).length > 1) return [];

  const moves = [];
  const isInCheck = Object.entries(checkedSquares).length == 1;

  if (piece.color === "white") {
    // Move up one square if its not blocked
    if (board[row - 1][column].color === null) {
      if (isInCheck) {
        const hasPush = boardNotation[row - 1][column] in pushMask;
        if (hasPush) moves.push({ row: row - 1, column: column });
      } else {
        moves.push({ row: row - 1, column: column });
      }
    }

    // If it is the first move, move up two squares if its not blocked
    if (row === 6) {
      if (board[row - 1][column].color === null && board[row - 2][column].color === null) {
        if (isInCheck) {
          const hasPush = boardNotation[row - 2][column] in pushMask;
          if (hasPush) moves.push({ row: row - 2, column: column });
        } else {
          moves.push({ row: row - 2, column: column });
        }
      }
    }

    // Capture diagonally left
    if (column - 1 >= 0 && column - 1 < 8 && board[row - 1][column - 1].color === "black") {
      if (isInCheck) {
        const hasCapture = boardNotation[row - 1][column - 1] in captureMask;
        if (hasCapture) moves.push({ row: row - 1, column: column - 1 });
      } else {
        moves.push({ row: row - 1, column: column - 1 });
      }
    }

    // Capture diagonally right
    if (column + 1 >= 0 && column + 1 < 8 && board[row - 1][column + 1].color === "black") {
      if (isInCheck) {
        const hasCapture = boardNotation[row - 1][column + 1] in captureMask;
        if (hasCapture) moves.push({ row: row - 1, column: column + 1 });
      } else {
        moves.push({ row: row - 1, column: column + 1 });
      }
    }
  } else {
    // Move down one square if its not blocked
    if (board[row + 1][column].color === null) {
      if (isInCheck) {
        const hasPush = boardNotation[row + 1][column] in pushMask;
        if (hasPush) moves.push({ row: row + 1, column: column });
      } else {
        moves.push({ row: row + 1, column: column });
      }
    }

    // If it is the first move, move down two squares if its not blocked
    if (row === 1) {
      if (board[row + 1][column].color === null && board[row + 2][column].color === null) {
        if (isInCheck) {
          const hasPush = boardNotation[row + 2][column] in pushMask;
          if (hasPush) moves.push({ row: row + 2, column: column });
        } else {
          moves.push({ row: row + 2, column: column });
        }
      }
    }

    // Capture diagonally left
    if (column - 1 >= 0 && column - 1 < 8 && board[row + 1][column - 1].color === "white") {
      if (isInCheck) {
        const hasCapture = boardNotation[row + 1][column - 1] in captureMask;
        if (hasCapture) moves.push({ row: row + 1, column: column - 1 });
      } else {
        moves.push({ row: row + 1, column: column - 1 });
      }
    }

    // Capture diagonally right
    if (column + 1 >= 0 && column + 1 < 8 && board[row + 1][column + 1].color === "white") {
      if (isInCheck) {
        const hasCapture = boardNotation[row + 1][column + 1] in captureMask;
        if (hasCapture) moves.push({ row: row + 1, column: column + 1 });
      } else {
        moves.push({ row: row + 1, column: column + 1 });
      }
    }
  }

  return moves;
};

const knightMoves = (fullBoard: Board, piece: PieceType, addOwnColor: boolean = false) => {
  const { board, checkedSquares, captureMask, pushMask } = fullBoard;
  const { row, column } = piece.position;

  // Double Check => only legal moves are king moves
  if (Object.entries(checkedSquares).length > 1) return [];

  const moves = [];
  const rowMoves = [2, 1, -1, -2, -2, -1, 1, 2];
  const columnMoves = [1, 2, 2, 1, -1, -2, -2, -1];

  for (let i = 0; i < 8; i++) {
    const newRow = row + rowMoves[i];
    const newColumn = column + columnMoves[i];

    if (!addOwnColor) {
      if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== piece.color) {
        if (Object.entries(checkedSquares).length == 0) {
          moves.push({ row: newRow, column: newColumn });
          continue;
        }

        const hasCapture = boardNotation[newRow][newColumn] in captureMask;
        const hasPush = boardNotation[newRow][newColumn] in pushMask;

        if (hasCapture || hasPush) moves.push({ row: newRow, column: newColumn });
      }
    } else {
      if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
        const checkColor = addOwnColor ? true : board[newRow][newColumn].color !== piece.color;
        if (checkColor) moves.push({ row: newRow, column: newColumn });
      }
    }
  }

  return moves;
};

const bishopMoves = (fullBoard: Board, piece: PieceType, addOwnColor: boolean = false) => {
  const { board, checkedSquares, captureMask, pushMask } = fullBoard;
  const { row, column } = piece.position;
  const opponentColor = fullBoard.currentPlayerTurn === "white" ? "black" : "white";

  // Double Check => only legal moves are king moves
  if (Object.entries(checkedSquares).length > 1) return [];

  const moves = [];
  const rowMoves = [-1, -1, 1, 1];
  const columnMoves = [-1, 1, -1, 1];

  for (let i = 0; i < rowMoves.length; i++) {
    let newRow = row + rowMoves[i];
    let newColumn = column + columnMoves[i];

    if (!addOwnColor) {
      while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== piece.color) {
        if (Object.entries(checkedSquares).length == 0) {
          moves.push({ row: newRow, column: newColumn });

          if (board[newRow][newColumn].color === opponentColor) break;

          newRow += rowMoves[i];
          newColumn += columnMoves[i];

          continue;
        }

        const hasCapture = boardNotation[newRow][newColumn] in captureMask;
        const hasPush = boardNotation[newRow][newColumn] in pushMask;

        if (hasCapture || hasPush) moves.push({ row: newRow, column: newColumn });

        if (board[newRow][newColumn].color === opponentColor) break;

        newRow += rowMoves[i];
        newColumn += columnMoves[i];
      }
    } else {
      while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
        moves.push({ row: newRow, column: newColumn });

        if (board[newRow][newColumn].type !== "empty" && board[newRow][newColumn].color !== piece.color) break;
        if (board[newRow][newColumn].color === opponentColor) break;

        newRow += rowMoves[i];
        newColumn += columnMoves[i];
      }
    }
  }

  return moves;
};

const rookMoves = (fullBoard: Board, piece: PieceType, addOwnColor: boolean = false) => {
  const { board, checkedSquares, captureMask, pushMask } = fullBoard;
  const { row, column } = piece.position;
  const opponentColor = fullBoard.currentPlayerTurn === "white" ? "black" : "white";

  // Double Check => only legal moves are king moves
  if (Object.entries(checkedSquares).length > 1) return [];

  const moves = [];
  const rowMoves = [-1, 0, 1, 0];
  const columnMoves = [0, 1, 0, -1];

  for (let i = 0; i < rowMoves.length; i++) {
    let newRow = row + rowMoves[i];
    let newColumn = column + columnMoves[i];

    if (!addOwnColor) {
      while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== piece.color) {
        if (Object.entries(checkedSquares).length == 0) {
          moves.push({ row: newRow, column: newColumn });

          if (board[newRow][newColumn].color === opponentColor) break;

          newRow += rowMoves[i];
          newColumn += columnMoves[i];

          continue;
        }

        const hasCapture = boardNotation[newRow][newColumn] in captureMask;
        const hasPush = boardNotation[newRow][newColumn] in pushMask;

        if (hasCapture || hasPush) moves.push({ row: newRow, column: newColumn });

        if (board[newRow][newColumn].color === opponentColor) break;

        newRow += rowMoves[i];
        newColumn += columnMoves[i];
      }
    } else {
      while (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
        moves.push({ row: newRow, column: newColumn });

        if (board[newRow][newColumn].type !== "empty" && board[newRow][newColumn].color !== piece.color) break;
        if (board[newRow][newColumn].color === opponentColor) break;

        newRow += rowMoves[i];
        newColumn += columnMoves[i];
      }
    }
  }

  return moves;
};

const queenMoves = (fullBoard: Board, piece: PieceType, addOwnColor: boolean = false) => {
  // Double Check => only legal moves are king moves
  if (Object.entries(fullBoard.checkedSquares).length > 1) return [];

  let moves: any[] = [];

  moves = [...moves, ...bishopMoves(fullBoard, piece, addOwnColor)];
  moves = [...moves, ...rookMoves(fullBoard, piece, addOwnColor)];

  return moves;
};

const kingMoves = (fullBoard: Board, piece: PieceType, addOwnColor: boolean = false) => {
  const { board, attackedSquares } = fullBoard;
  const { row, column } = piece.position;

  const moves = [];
  const rowMoves = [-1, 0, 1, 0, -1, -1, 1, 1];
  const columnMoves = [0, 1, 0, -1, -1, 1, -1, 1];

  for (let i = 0; i < rowMoves.length; i++) {
    const newRow = row + rowMoves[i];
    const newColumn = column + columnMoves[i];

    if (!addOwnColor) {
      if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8 && board[newRow][newColumn].color !== piece.color) {
        if (boardNotation[newRow][newColumn] in attackedSquares) continue;
        moves.push({ row: newRow, column: newColumn });
      }
    } else {
      if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
        const checkColor = addOwnColor ? true : board[newRow][newColumn].color !== piece.color;
        if (checkColor) moves.push({ row: newRow, column: newColumn });
      }
    }
  }

  // O-O
  if (piece.color === "white" && fullBoard.castlingRights.includes("K")) {
    if (board[7][5].color === null && board[7][6].color === null) moves.push({ row: 7, column: 6 });
  }
  // O-O-O
  if (piece.color === "white" && fullBoard.castlingRights.includes("Q")) {
    if (board[7][3].color === null && board[7][2].color === null && board[7][1].color === null) moves.push({ row: 7, column: 2 });
  }

  // O-O
  if (piece.color === "black" && fullBoard.castlingRights.includes("k")) {
    if (board[0][5].color === null && board[0][6].color === null) moves.push({ row: 0, column: 6 });
  }
  // O-O-O
  if (piece.color === "black" && fullBoard.castlingRights.includes("q")) {
    if (board[0][3].color === null && board[0][2].color === null && board[0][1].color === null) moves.push({ row: 0, column: 2 });
  }

  return moves;
};

const calculatePseudoLegalMoves = (board: Board, piece: PieceType, addOwnColor: boolean = false) => {
  if (piece.type === "pawn") return pawnMoves(board, piece);

  if (piece.type === "knight") return knightMoves(board, piece, addOwnColor);

  if (piece.type === "bishop") return bishopMoves(board, piece, addOwnColor);

  if (piece.type === "rook") return rookMoves(board, piece, addOwnColor);

  if (piece.type === "queen") return queenMoves(board, piece, addOwnColor);

  if (piece.type === "king") return kingMoves(board, piece, addOwnColor);

  return [];
};

export { calculatePseudoLegalMoves };
