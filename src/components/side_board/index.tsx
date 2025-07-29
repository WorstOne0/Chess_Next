"use client";

import { useGameState } from "@/store";

export default function SideBoard() {
  const { previousMoves } = useGameState((state) => state);

  const groupedMoves = () => {
    const grouped = [];
    for (let i = 0; i < previousMoves.length; i += 2) {
      grouped.push(previousMoves.slice(i, i + 2));
    }

    return grouped;
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-[20rem] w-full flex"></div>

      <div className="min-h-0 w-full grow">
        {groupedMoves().map((move, index) => (
          <div key={index} className="h-full w-full flex items-center justify-center">
            {move[0]} - {move[1]}
          </div>
        ))}
      </div>

      <div className="h-[20rem] w-full flex"></div>
    </div>
  );
}
