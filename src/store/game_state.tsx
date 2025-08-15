"use client";

//
import { create } from "zustand";
//
import { Board, PieceType, Position, SelectedPiece } from "@/utils/chess_types";
import { buildBoard, generateFen, generateNewBoard, handleCastlingRights, handleEnPassantTarget } from "@/utils/board";
import { calculatePseudoLegalMoves } from "@/utils/moves";

type GameStateStore = {
  board: Board;
  //
  selectedPiece?: SelectedPiece;
  onlySelectdPiece: boolean;
  //
  previousMoves: string[];
  //
  selectPiece: (piece: PieceType) => void;
  makeMove: (position: Position) => { sound: string };
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

    const validMoves = calculatePseudoLegalMoves(board, piece);

    return set({ selectedPiece: { piece, validMoves: validMoves } });
  },
  makeMove: (position: Position) => {
    const { selectedPiece, board, onlySelectdPiece, previousMoves } = useGameState.getState();

    if (!selectedPiece) return { sound: "" };

    if (selectedPiece.piece.position.row === position.row && selectedPiece.piece.position.column === position.column) {
      if (!onlySelectdPiece) set({ onlySelectdPiece: true });
      else set({ selectedPiece: undefined });

      return { sound: "" };
    }

    const isValidMove = selectedPiece.validMoves.some((move) => move.row === position.row && move.column === position.column);
    if (!isValidMove) return { sound: "" };

    const oldRow = selectedPiece.piece.position.row;
    const oldColumn = selectedPiece.piece.position.column;
    const { newBoard, newPiece, moveNotation } = generateNewBoard(board, selectedPiece.piece, position);

    const castlingRights = handleCastlingRights(board, newPiece, { row: oldRow, column: oldColumn });
    const enPassantTarget = handleEnPassantTarget(board, newPiece, { row: oldRow, column: oldColumn });

    const updatedBoard = {
      board: newBoard,
      fen: "",
      currentPlayerTurn: board.currentPlayerTurn === "white" ? "black" : "white",
      castlingRights,
      enPassantTarget,
      halfMoveClock: board.halfMoveClock,
      fullMoveNumber: board.currentPlayerTurn === "black" ? board.fullMoveNumber + 1 : board.fullMoveNumber,
    };

    set({
      board: { ...updatedBoard, fen: generateFen(updatedBoard) },
      selectedPiece: undefined,
      previousMoves: [...previousMoves, moveNotation],
    });

    let sound = "move-self.mp3";
    if (moveNotation.includes("x")) sound = "capture.mp3";
    if (moveNotation === "O-O" || moveNotation === "O-O-O") sound = "castle.mp3";

    return { sound };
  },
}));

export default useGameState;
