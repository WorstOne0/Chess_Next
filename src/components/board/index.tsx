"use client";

// Hooks
import { useMount } from "@/hooks";
// Store
import { useGameState } from "@/store";
// Components
import { Cell } from "@/components";

export default function Board() {
  const { board } = useGameState((state) => state);

  useMount(() => {
    console.log("board", board);
  });

  return (
    <div className="h-full w-full flex flex-col">
      {/* Opponent */}
      <div className="min-h-[7rem] h-[7rem] w-full bg-blue-500"></div>

      {/* Header */}
      <div className="min-h-0 grow w-full flex justify-center items-center bg-purple-500">
        <div className="h-[70rem] w-[70rem] grid grid-cols-8 grid-rows-8 bg-gray-500">
          {board.board.map((row, indexRow) => {
            return row.map((piece, indexColumn) => (
              <Cell key={`cell_${indexRow}_${indexColumn}`} row={indexRow} column={indexColumn} piece={piece} />
            ));
          })}
        </div>
      </div>

      {/* Player */}
      <div className="min-h-[7rem] h-[7rem] w-full bg-blue-500"></div>
    </div>
  );
}
