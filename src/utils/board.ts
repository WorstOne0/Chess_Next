import { Board, PieceType } from "./chess_types";

const buildBoard: () => Board = () => {
  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  const newBoard: PieceType[][] = [[], [], [], [], [], [], [], []];

  initialBoard.map((row, rowIndex) => {
    row.map((piece, columnIndex) => {
      if (piece === "p" || piece === "P") {
        newBoard[rowIndex].push({
          type: "pawn",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "P" ? "white" : "black",
          settings: { hasMoved: false },
        });
      }

      if (piece === "n" || piece === "N") {
        newBoard[rowIndex].push({
          type: "knight",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "N" ? "white" : "black",
          settings: {},
        });
      }

      if (piece === "b" || piece === "B") {
        newBoard[rowIndex].push({
          type: "bishop",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "B" ? "white" : "black",
          settings: {},
        });
      }

      if (piece === "r" || piece === "R") {
        newBoard[rowIndex].push({
          type: "rook",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "R" ? "white" : "black",
          settings: { hasMoved: false },
        });
      }

      if (piece === "q" || piece === "Q") {
        newBoard[rowIndex].push({
          type: "queen",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "Q" ? "white" : "black",
          settings: {},
        });
      }

      if (piece === "k" || piece === "K") {
        newBoard[rowIndex].push({
          type: "king",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "K" ? "white" : "black",
          settings: {},
        });
      }

      if (piece === null) {
        newBoard[rowIndex].push({
          type: "empty",
          position: { row: rowIndex, column: columnIndex },
          color: null,
          settings: {},
        });
      }
    });
  });

  return { board: newBoard };
};

export default buildBoard;
