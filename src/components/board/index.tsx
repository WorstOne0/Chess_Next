"use client";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
// Hooks
import { useMount } from "@/hooks";
// Store
import { useGameState } from "@/store";
// Components
import { Cell } from "@/components";

export default function Board() {
  const { board, selectPiece, makeMove } = useGameState((state) => state);

  useMount(() => {
    console.log("board", board);
  });

  const onDragStart = (event: DragStartEvent) => {
    console.log("onDragStart", event);
    selectPiece(event.active.data.current?.piece);
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log("onDragEnd", event);
    makeMove(event.over?.data.current?.position);
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="h-full w-full flex flex-col">
        {/* Opponent */}
        <div className="min-h-[5rem] h-[5rem] w-full bg-blue-500"></div>

        {/* Header */}
        <div className="min-h-0 grow w-full flex justify-center items-center bg-purple-500">
          <div className="h-[82rem] w-[82rem] grid grid-cols-8 grid-rows-8 bg-gray-500">
            {board.board.map((row, indexRow) => {
              return row.map((piece, indexColumn) => (
                <Cell key={`cell_${indexRow}_${indexColumn}`} row={indexRow} column={indexColumn} piece={piece} />
              ));
            })}
          </div>
        </div>

        {/* Player */}
        <div className="min-h-[5rem] h-[5rem] w-full bg-blue-500"></div>
      </div>
    </DndContext>
  );
}
