"use client";

import { useDroppable } from "@dnd-kit/core";
import { PieceType } from "@/utils/chess_types";
import Piece from "../piece";
import { useGameState } from "@/store";

export default function Cell({ row, column, piece }: Readonly<{ row: number; column: number; piece: PieceType }>) {
  const { setNodeRef } = useDroppable({ id: `cell_${row}_${column}`, data: { position: { row, column } } });
  const { board, selectedPiece } = useGameState((state) => state);

  const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const backgroundColor = () => {
    return (row + column + 1) % 2 === 0 ? "#b58863" : "#f0d9b5";
  };

  const isSelectedPiece = selectedPiece && selectedPiece.piece.position.row === row && selectedPiece.piece.position.column === column;
  const isValidMove = () => {
    if (!selectedPiece) return false;

    const move = selectedPiece.validMoves.find((move) => move.row === row && move.column === column);
    if (!move) return false;

    const pieceOnPosition = board.board[row][column];
    if (pieceOnPosition.type !== "empty") return false;

    return true;
  };
  const isCapture = () => {
    if (!selectedPiece) return false;

    const move = selectedPiece.validMoves.find((move) => move.row === row && move.column === column);
    if (!move) return false;

    const pieceOnPosition = board.board[row][column];
    if (pieceOnPosition.type === "empty") return false;

    return true;
  };

  return (
    <div ref={setNodeRef} className="h-full w-full flex justify-center items-center relative" style={{ backgroundColor: backgroundColor() }}>
      <Piece piece={piece} />

      {column === 0 && (
        <div className="absolute top-[0rem] left-[0.5rem]">
          <span className={`font-bold ${(row + column + 1) % 2 === 0 ? "text-white" : "text-black"}`}>{rows.reverse()[row]}</span>
        </div>
      )}

      {row === 7 && (
        <div className="absolute bottom-[-0.2rem] right-[0.5rem]">
          <span className={`font-bold text-[2rem]  ${(row + column + 1) % 2 === 0 ? "text-white" : "text-black"}`}>{columns[column]}</span>
        </div>
      )}

      {isValidMove() && (
        <div className="h-[30%] w-[30%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-500 opacity-20 rounded-full"></div>
      )}

      {isCapture() && <div className="h-full w-full absolute absolute top-0 left-0 bg-red-500"></div>}

      {isSelectedPiece && <div className="h-full w-full absolute top-0 left-0 border-[0.5rem] border-white"></div>}
    </div>
  );
}
