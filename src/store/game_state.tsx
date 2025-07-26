//
import { create } from "zustand";
//
import { Board, PieceType, Position, SelectedPiece } from "@/utils/chess_types";
import { buildBoard, generateFen } from "@/utils/board";
import { calculatePseudoLegalMoves } from "@/utils/moves";
import generateNotation from "@/utils/notation";

type GameStateStore = {
  board: Board;
  //
  selectedPiece?: SelectedPiece;
  onlySelectdPiece: boolean;
  //
  previousMoves: string[];
  //
  selectPiece: (piece: PieceType) => void;
  makeMove: (position: Position) => void;
};

const useGameState = create<GameStateStore>((set) => ({
  board: buildBoard({ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }),
  //
  selectedPiece: undefined,
  onlySelectdPiece: false,
  //
  previousMoves: [],
  //
  selectPiece: (piece: PieceType) => {
    const { board, selectedPiece } = useGameState.getState();

    if (piece.type !== "empty" && piece.color !== board.currentPlayerTurn) return;
    if (selectedPiece?.piece != piece) set({ onlySelectdPiece: false });

    const validMoves = calculatePseudoLegalMoves(
      piece.type,
      board.board,
      piece.color!,
      board.currentPlayerTurn === "white" ? "black" : "white",
      piece.position.row,
      piece.position.column,
      piece.settings
    );

    return set({ selectedPiece: { piece, validMoves: validMoves } });
  },
  makeMove: (position: Position) => {
    const { selectedPiece, board, onlySelectdPiece, previousMoves } = useGameState.getState();

    if (!selectedPiece) return;

    if (selectedPiece.piece.position.row === position.row && selectedPiece.piece.position.column === position.column) {
      if (!onlySelectdPiece) set({ onlySelectdPiece: true });
      else set({ selectedPiece: undefined });

      return;
    }

    const isValidMove = selectedPiece.validMoves.some((move) => move.row === position.row && move.column === position.column);
    if (!isValidMove) return;

    const newBoard = board.board.map((row) => [...row]);
    const oldRow = selectedPiece.piece.position.row;
    const oldColumn = selectedPiece.piece.position.column;

    const moveNotation = generateNotation(board, selectedPiece.piece, position);

    const newPiece = { ...selectedPiece.piece, position: { row: position.row, column: position.column } };
    if (newPiece.type === "pawn") newPiece.settings.hasMoved = true;
    if (newPiece.type === "rook") newPiece.settings.hasMoved = true;
    if (newPiece.type === "king") newPiece.settings.hasMoved = true;

    newBoard[position.row][position.column] = newPiece;
    newBoard[oldRow][oldColumn] = {
      type: "empty",
      position: { row: oldRow, column: oldColumn },
      color: null,
      settings: {},
      notation: "",
      fen: null,
    };

    let castlingRights = board.castlingRights;
    // King
    if (newPiece.type === "king" && board.currentPlayerTurn === "white") {
      castlingRights = castlingRights.replace("K", "").replace("Q", "");
    }
    if (newPiece.type === "king" && board.currentPlayerTurn === "black") {
      castlingRights = castlingRights.replace("k", "").replace("q", "");
    }
    // Rook
    if (newPiece.type === "rook" && board.currentPlayerTurn === "white") {
      if (oldRow === 7 && oldColumn === 7) castlingRights = castlingRights.replace("K", "");
      if (oldRow === 7 && oldColumn === 0) castlingRights = castlingRights.replace("Q", "");
    }
    if (newPiece.type === "rook" && board.currentPlayerTurn === "black") {
      if (oldRow === 0 && oldColumn === 7) castlingRights = castlingRights.replace("k", "");
      if (oldRow === 0 && oldColumn === 0) castlingRights = castlingRights.replace("q", "");
    }

    const updatedBoard = {
      board: newBoard,
      currentPlayerTurn: board.currentPlayerTurn === "white" ? "black" : "white",
      castlingRights,
      enPassantTarget: board.enPassantTarget,
      halfMoveClock: board.halfMoveClock,
      fullMoveNumber: board.currentPlayerTurn === "black" ? board.fullMoveNumber + 1 : board.fullMoveNumber,
    };

    set({
      board: updatedBoard,
      selectedPiece: undefined,
      previousMoves: [...previousMoves, moveNotation],
    });

    return;
  },
}));

export default useGameState;
