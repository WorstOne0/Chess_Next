"use client";

import { useGameState } from "@/store";

export default function SideBoard() {
  const { previousMoves } = useGameState((state) => state);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[20rem] w-full flex"></div>

      <div className="min-h-0 grow">
        {previousMoves.map((move, index) => (
          <div key={index} className="h-full w-full flex items-center justify-center">
            {move}
          </div>
        ))}
      </div>

      <div className="h-[20rem] w-full flex"></div>
    </div>
  );
}
