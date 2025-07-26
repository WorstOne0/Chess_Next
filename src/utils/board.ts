import { Board, PieceType } from "./chess_types";

const buildBoard = ({ fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }: { fen?: string }) => {
  const startPosition = fen.split(" ")[0];
  const currentPlayerTurn = fen.split(" ")[1];
  const castlingRights = fen.split(" ")[2];
  const enPassantTarget = fen.split(" ")[3];
  const halfMoveClock = parseInt(fen.split(" ")[4]);
  const fullMoveNumber = parseInt(fen.split(" ")[5]);

  const initialBoard = startPosition.split("/").map((row) => {
    const rowAfter = row.split("");

    for (const column of rowAfter) {
      if (parseInt(column) > 0) rowAfter.splice(rowAfter.indexOf(column), 1, ...Array(parseInt(column)).fill(null));
    }

    return rowAfter;
  });

  const board: PieceType[][] = [[], [], [], [], [], [], [], []];

  initialBoard.map((row, rowIndex) => {
    row.map((piece, columnIndex) => {
      if (piece === "p" || piece === "P") {
        board[rowIndex].push({
          type: "pawn",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "P" ? "white" : "black",
          settings: { hasMoved: false },
          notation: "",
          fen: piece,
        });
      }

      if (piece === "n" || piece === "N") {
        board[rowIndex].push({
          type: "knight",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "N" ? "white" : "black",
          settings: {},
          notation: "N",
          fen: piece,
        });
      }

      if (piece === "b" || piece === "B") {
        board[rowIndex].push({
          type: "bishop",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "B" ? "white" : "black",
          settings: {},
          notation: "B",
          fen: piece,
        });
      }

      if (piece === "r" || piece === "R") {
        board[rowIndex].push({
          type: "rook",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "R" ? "white" : "black",
          settings: { hasMoved: false },
          notation: "R",
          fen: piece,
        });
      }

      if (piece === "q" || piece === "Q") {
        board[rowIndex].push({
          type: "queen",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "Q" ? "white" : "black",
          settings: {},
          notation: "Q",
          fen: piece,
        });
      }

      if (piece === "k" || piece === "K") {
        board[rowIndex].push({
          type: "king",
          position: { row: rowIndex, column: columnIndex },
          color: piece === "K" ? "white" : "black",
          settings: { hasMoved: false },
          notation: "K",
          fen: piece,
        });
      }

      if (piece === null) {
        board[rowIndex].push({
          type: "empty",
          position: { row: rowIndex, column: columnIndex },
          color: null,
          settings: {},
          notation: "",
          fen: piece,
        });
      }
    });
  });

  return {
    board: board,
    currentPlayerTurn: currentPlayerTurn == "b" ? "black" : "white",
    castlingRights,
    enPassantTarget,
    halfMoveClock,
    fullMoveNumber,
  };
};

const generateFen = (board: Board) => {
  let fen = "";
  let emptySpaces = 0;

  // Position
  for (const row of board.board) {
    for (const piece of row) {
      if (piece.type === "empty") {
        emptySpaces++;
        continue;
      }

      if (emptySpaces > 0) {
        fen += emptySpaces;
        emptySpaces = 0;
      }

      fen += piece.fen;
    }

    if (emptySpaces > 0) {
      fen += emptySpaces;
      emptySpaces = 0;
    }

    if (row !== board.board[board.board.length - 1]) fen += "/";
  }

  fen += " ";

  // Current Player Turn
  fen += board.currentPlayerTurn === "white" ? "w" : "b";
  fen += " ";

  // Castling Rights
  fen += board.castlingRights.length > 0 ? board.castlingRights : "-";
  fen += " ";

  // En Passant
  fen += "-";
  fen += " ";

  // Half Move Clock
  fen += board.halfMoveClock.toString();
  fen += " ";

  // Full Move Number
  fen += board.fullMoveNumber.toString();

  return fen;
};

export { buildBoard, generateFen };
