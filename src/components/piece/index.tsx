"use client";

// Next
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
// Store
import { useGameState } from "@/store";
// Utils
import { PieceType } from "@/utils/chess_types";

import black_bishop from "@/../public/black_bishop.svg";
import black_king from "@/../public/black_king.svg";
import black_knight from "@/../public/black_knight.svg";
import black_pawn from "@/../public/black_pawn.svg";
import black_queen from "@/../public/black_queen.svg";
import black_rook from "@/../public/black_rook.svg";
import white_bishop from "@/../public/white_bishop.svg";
import white_king from "@/../public/white_king.svg";
import white_knight from "@/../public/white_knight.svg";
import white_pawn from "@/../public/white_pawn.svg";
import white_queen from "@/../public/white_queen.svg";
import white_rook from "@/../public/white_rook.svg";
import { PointerEventHandler } from "react";

export default function Piece({ piece }: Readonly<{ piece: PieceType }>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece_${piece.position.row}_${piece.position.column}`,
    data: { piece },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 20,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="h-full w-full flex justify-center items-center z-[10]">
      {piece.type === "pawn" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_pawn : black_pawn} alt="pawn" />}
      {piece.type === "knight" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_knight : black_knight} alt="knight" />}
      {piece.type === "bishop" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_bishop : black_bishop} alt="bishop" />}
      {piece.type === "rook" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_rook : black_rook} alt="rook" />}
      {piece.type === "queen" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_queen : black_queen} alt="queen" />}
      {piece.type === "king" && <Image className="h-[90%] w-[90%]" src={piece.color === "white" ? white_king : black_king} alt="king" />}
    </div>
  );
}
