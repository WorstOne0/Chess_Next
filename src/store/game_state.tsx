//
import { create } from "zustand";
//
import { Board, PieceType, Position, SelectedPiece } from "@/utils/chess_types";
import buildBoard from "@/utils/board";
import { calculateValidMoves } from "@/utils/moves";

type GameStateStore = {
  board: Board;
  //
  currentPlayerTurn: string;
  selectedPiece?: SelectedPiece;
  //
  onlySelectdPiece: boolean;
  //
  selectPiece: (piece: PieceType) => void;
  makeMove: (position: Position) => void;
};

const useGameState = create<GameStateStore>((set) => ({
  board: buildBoard(),
  //
  currentPlayerTurn: "white",
  selectedPiece: undefined,
  //
  onlySelectdPiece: false,
  //
  selectPiece: (piece: PieceType) => {
    const { board, currentPlayerTurn, selectedPiece } = useGameState.getState();

    if (piece.type !== "empty" && piece.color !== currentPlayerTurn) return;
    if (selectedPiece?.piece != piece) set({ onlySelectdPiece: false });

    const validMoves = calculateValidMoves(
      piece.type,
      board.board,
      piece.color!,
      currentPlayerTurn === "white" ? "black" : "white",
      piece.position.row,
      piece.position.column,
      piece.settings
    );

    return set({ selectedPiece: { piece, validMoves: validMoves } });
  },
  makeMove: (position: Position) => {
    const { selectedPiece, board, currentPlayerTurn, onlySelectdPiece } = useGameState.getState();

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

    const newPiece = { ...selectedPiece.piece, position: { row: position.row, column: position.column } };
    if (newPiece.type === "pawn") newPiece.settings.hasMoved = true;
    if (newPiece.type === "rook") newPiece.settings.hasMoved = true;

    newBoard[position.row][position.column] = newPiece;
    newBoard[oldRow][oldColumn] = {
      type: "empty",
      position: { row: oldRow, column: oldColumn },
      color: null,

      settings: {},
    };

    set({ board: { board: newBoard }, currentPlayerTurn: currentPlayerTurn === "white" ? "black" : "white", selectedPiece: undefined });

    return;
  },
}));

export default useGameState;
