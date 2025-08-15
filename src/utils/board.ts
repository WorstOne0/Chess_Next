import { Board, PieceType, Position } from "./chess_types";

const boardNotation = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
];

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
          settings: {},
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
          settings: {},
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
          settings: {},
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
    fen,
    currentPlayerTurn: currentPlayerTurn == "b" ? "black" : "white",
    castlingRights,
    enPassantTarget,
    halfMoveClock,
    fullMoveNumber,
  };
};

const generateNewBoard = (board: Board, piece: PieceType, position: Position) => {
  const newBoard = board.board.map((row) => [...row]);
  const oldRow = piece.position.row;
  const oldColumn = piece.position.column;

  let moveNotation = generateNotation(board, piece, position);
  const newPiece = { ...piece, position: { row: position.row, column: position.column } };

  // O-O
  if (piece.type === "king" && position.column - oldColumn === 2) {
    const rook = board.board[oldRow][7];
    newBoard[oldRow][5] = { ...rook, position: { row: oldRow, column: 5 } };
    newBoard[oldRow][7] = {
      type: "empty",
      position: { row: oldRow, column: 7 },
      color: null,
      settings: {},
      notation: "",
      fen: null,
    };

    moveNotation = "O-O";
  }
  // O-O-O
  if (piece.type === "king" && oldColumn - position.column === 2) {
    const rook = board.board[oldRow][0];
    newBoard[oldRow][3] = rook;
    newBoard[oldRow][0] = {
      type: "empty",
      position: { row: oldRow, column: 0 },
      color: null,
      settings: {},
      notation: "",
      fen: null,
    };

    moveNotation = "O-O-O";
  }

  newBoard[position.row][position.column] = newPiece;
  newBoard[oldRow][oldColumn] = {
    type: "empty",
    position: { row: oldRow, column: oldColumn },
    color: null,
    settings: {},
    notation: "",
    fen: null,
  };

  console.log({ newBoard, newPiece, moveNotation });
  return { newBoard, newPiece, moveNotation };
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
  fen += board.enPassantTarget.length > 0 ? board.enPassantTarget : "-";
  fen += " ";

  // Half Move Clock
  fen += board.halfMoveClock.toString();
  fen += " ";

  // Full Move Number
  fen += board.fullMoveNumber.toString();

  return fen;
};

const generateNotation = (board: Board, movedPiece: PieceType, toPositon: Position) => {
  let move = movedPiece.notation;

  const pieceOnPosition = board.board[toPositon.row][toPositon.column];

  if (pieceOnPosition.type !== "empty" && movedPiece.type !== "pawn") move += "x";
  if (pieceOnPosition.type !== "empty" && movedPiece.type === "pawn") {
    move += `${boardNotation[movedPiece.position.row][movedPiece.position.column].split("")[0]}x`;
  }

  move += boardNotation[toPositon.row][toPositon.column];

  return move;
};

const handleCastlingRights = (board: Board, piece: PieceType, oldPosition: Position) => {
  let castlingRights = board.castlingRights;

  // King
  if (piece.type === "king" && board.currentPlayerTurn === "white") {
    castlingRights = castlingRights.replace("K", "").replace("Q", "");
  }
  if (piece.type === "king" && board.currentPlayerTurn === "black") {
    castlingRights = castlingRights.replace("k", "").replace("q", "");
  }

  // Rook
  if (piece.type === "rook" && board.currentPlayerTurn === "white") {
    if (oldPosition.row === 7 && oldPosition.column === 7) castlingRights = castlingRights.replace("K", "");
    if (oldPosition.row === 7 && oldPosition.column === 0) castlingRights = castlingRights.replace("Q", "");
  }
  if (piece.type === "rook" && board.currentPlayerTurn === "black") {
    if (oldPosition.row === 0 && oldPosition.column === 7) castlingRights = castlingRights.replace("k", "");
    if (oldPosition.row === 0 && oldPosition.column === 0) castlingRights = castlingRights.replace("q", "");
  }

  return castlingRights;
};

const handleEnPassantTarget = (board: Board, piece: PieceType, oldPosition: Position) => {
  let enPassantTarget = "";

  if (piece.type === "pawn" && board.currentPlayerTurn === "white") {
    const movedSquares = oldPosition.row - piece.position.row;

    if (movedSquares == 2) enPassantTarget = `${boardNotation[oldPosition.row - 1][oldPosition.column]}`;
  }

  if (piece.type === "pawn" && board.currentPlayerTurn === "black") {
    const movedSquares = piece.position.row - oldPosition.row;

    if (movedSquares == 2) enPassantTarget = `${boardNotation[oldPosition.row + 1][oldPosition.column]}`;
  }

  return enPassantTarget;
};

const getMoveFromStockfish = (move: string, board: Board) => {
  const moveFrom = move.substring(0, 2);
  const moveTo = move.substring(2, 4);

  let rowFrom = 0;
  let columnFrom = 0;
  let rowTo = 0;
  let columnTo = 0;

  for (const row of boardNotation) {
    if (row.includes(moveFrom)) {
      columnFrom = row.indexOf(moveFrom);
      rowFrom = boardNotation.indexOf(row);
    }

    if (row.includes(moveTo)) {
      columnTo = row.indexOf(moveTo);
      rowTo = boardNotation.indexOf(row);
    }
  }

  const selectedPiece = board.board[rowFrom][columnFrom];
  const position = { row: rowTo, column: columnTo };

  return { selectedPiece: { piece: selectedPiece }, position, oldRow: rowFrom, oldColumn: columnFrom };
};

export { buildBoard, generateNewBoard, generateFen, generateNotation, handleCastlingRights, handleEnPassantTarget, getMoveFromStockfish };
