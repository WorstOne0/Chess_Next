"use client";

import { create } from "zustand";
import axiosInstance from "@/services/axios";
//
import { Board, PieceType, Position, SelectedPiece } from "@/utils/chess_types";
import {
  buildBoard,
  generateFen,
  generateNewBoard,
  handleCastlingRights,
  handleEnPassantTarget,
  generateAttackedSquares,
  getMoveFromStockfish,
  generateCheckedSquares,
  generateCaptureAndPushMask,
} from "@/utils/board";
import { calculatePseudoLegalMoves } from "@/utils/moves";

type GameStateStore = {
  board: Board;
  player: string;
  isSinglePlayer: boolean;
  //
  selectedPiece?: SelectedPiece;
  onlySelectdPiece: boolean;
  //
  previousMoves: string[];
  evaluation: number;
  //
  selectPiece: (piece: PieceType) => void;
  makeMove: (position: Position) => { sound: string };
  makeBotMove: () => Promise<{ sound: string }>;
};

const useGameState = create<GameStateStore>((set) => ({
  board: buildBoard({ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }),
  // board: buildBoard({ fen: "4k3/8/6n1/1R6/8/8/8/4K3 w - - 0 1" }),
  // board: buildBoard({ fen: "5k2/8/5r2/8/8/5Q2/3K4/8 w - - 0 1" }),
  player: "white",
  isSinglePlayer: true,
  //
  selectedPiece: undefined,
  onlySelectdPiece: false,
  //
  previousMoves: [],
  evaluation: 0,
  //
  selectPiece: (piece: PieceType) => {
    const { board, selectedPiece, player, isSinglePlayer } = useGameState.getState();

    if (piece.type !== "empty" && piece.color !== board.currentPlayerTurn) return;
    if (!isSinglePlayer && piece.color !== player) return;
    if (selectedPiece?.piece != piece) set({ onlySelectdPiece: false });

    const validMoves = calculatePseudoLegalMoves(board, piece);

    return set({ selectedPiece: { piece, validMoves: validMoves } });
  },
  makeMove: (position: Position) => {
    const { selectedPiece, board, onlySelectdPiece, previousMoves, isSinglePlayer, makeBotMove } = useGameState.getState();

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
      //
      currentPlayerTurn: board.currentPlayerTurn === "white" ? "black" : "white",
      castlingRights,
      enPassantTarget,
      halfMoveClock: board.halfMoveClock,
      fullMoveNumber: board.currentPlayerTurn === "black" ? board.fullMoveNumber + 1 : board.fullMoveNumber,
      //
      attackedSquares: {},
      checkedSquares: {},
      captureMask: {},
      pushMask: {},
    };

    const fen = generateFen(updatedBoard);
    const attackedSquares = generateAttackedSquares(updatedBoard);
    const checkedSquares = generateCheckedSquares(updatedBoard);
    const { captureMask, pushMask } = generateCaptureAndPushMask(updatedBoard, checkedSquares);

    set({
      board: { ...updatedBoard, fen, attackedSquares, checkedSquares, captureMask, pushMask },
      selectedPiece: undefined,
      previousMoves: [...previousMoves, `${moveNotation}${Object.entries(checkedSquares).length ? "+" : ""}`],
    });

    let sound = "move-self.mp3";
    if (moveNotation.includes("x")) sound = "capture.mp3";
    if (moveNotation === "O-O" || moveNotation === "O-O-O") sound = "castle.mp3";
    if (Object.entries(checkedSquares).length) sound = "move-check.mp3";
    if (moveNotation.includes("=")) sound = "promote.mp3";

    if (!isSinglePlayer) makeBotMove();

    return { sound };
  },
  makeBotMove: async () => {
    const { board, previousMoves } = useGameState.getState();

    const response = await axiosInstance.get(`https://stockfish.online/api/s/v2.php?fen=${board.fen}&depth=12`);
    const { evaluation, continuation, mate } = response.data;

    const move = continuation.split(" ")[0];
    const { selectedPiece, position, oldRow, oldColumn } = getMoveFromStockfish(move, board);

    const { newBoard, newPiece, moveNotation } = generateNewBoard(board, selectedPiece.piece, position);

    const castlingRights = handleCastlingRights(board, newPiece, { row: oldRow, column: oldColumn });
    const enPassantTarget = handleEnPassantTarget(board, newPiece, { row: oldRow, column: oldColumn });

    const updatedBoard = {
      board: newBoard,
      fen: "",
      //
      currentPlayerTurn: board.currentPlayerTurn === "white" ? "black" : "white",
      castlingRights,
      enPassantTarget,
      halfMoveClock: board.halfMoveClock,
      fullMoveNumber: board.currentPlayerTurn === "black" ? board.fullMoveNumber + 1 : board.fullMoveNumber,
      //
      attackedSquares: {},
      checkedSquares: {},
      captureMask: {},
      pushMask: {},
    };

    const fen = generateFen(updatedBoard);
    const attackedSquares = generateAttackedSquares(updatedBoard);
    const checkedSquares = generateCheckedSquares(updatedBoard);

    set({
      board: { ...updatedBoard, fen, attackedSquares, checkedSquares },
      selectedPiece: undefined,
      previousMoves: [...previousMoves, moveNotation],
    });

    let sound = "move-self.mp3";
    if (moveNotation.includes("x")) sound = "capture.mp3";
    if (moveNotation === "O-O" || moveNotation === "O-O-O") sound = "castle.mp3";
    if (Object.entries(checkedSquares).length) sound = "move-check.mp3";
    if (moveNotation.includes("=")) sound = "promote.mp3";

    return { sound };
  },
}));

export default useGameState;
