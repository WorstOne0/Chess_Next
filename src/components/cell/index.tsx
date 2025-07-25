"use client";

import { PieceType } from "@/utils/chess_types";
import Piece from "../piece";
import { useGameState } from "@/store";

export default function Cell({ row, column, piece }: Readonly<{ row: number; column: number; piece: PieceType }>) {
  const { selectedPiece } = useGameState((state) => state);

  const backgroundColor = () => {
    if (selectedPiece) {
      if (selectedPiece.piece.position.row === row && selectedPiece.piece.position.column === column) return "#FF0000";

      if (selectedPiece.validMoves.some((move) => move.row === row && move.column === column)) return "#00FF00";
    }

    return (row + column + 1) % 2 === 0 ? "#333031" : "#ECDDE0";
  };

  return (
    <div className="h-full w-full flex justify-center items-center" style={{ backgroundColor: backgroundColor() }}>
      <Piece piece={piece} />
    </div>
  );
}
