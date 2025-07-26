"use client";

import { useDroppable } from "@dnd-kit/core";
import { PieceType } from "@/utils/chess_types";
import Piece from "../piece";
import { useGameState } from "@/store";

export default function Cell({ row, column, piece }: Readonly<{ row: number; column: number; piece: PieceType }>) {
  const { setNodeRef } = useDroppable({ id: `cell_${row}_${column}`, data: { position: { row, column } } });
  const { selectedPiece } = useGameState((state) => state);

  const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const backgroundColor = () => {
    if (selectedPiece) {
      if (selectedPiece.piece.position.row === row && selectedPiece.piece.position.column === column) return "#FF0000";

      if (selectedPiece.validMoves.some((move) => move.row === row && move.column === column)) return "#00FF00";
    }

    return (row + column + 1) % 2 === 0 ? "#b58863" : "#f0d9b5";
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
    </div>
  );
}
