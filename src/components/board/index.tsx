"use client";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
// Hooks
import { useMount } from "@/hooks";
// Store
import { useGameState } from "@/store";
// Components
import { Cell } from "@/components";

import { RiTimerLine } from "react-icons/ri";

export default function Board() {
  const { board, selectPiece, makeMove } = useGameState((state) => state);

  useMount(() => {
    console.log("board", board);
  });

  const onDragStart = (event: DragStartEvent) => {
    selectPiece(event.active.data.current?.piece);
  };

  const onDragEnd = (event: DragEndEvent) => {
    makeMove(event.over?.data.current?.position);
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="h-full w-full flex flex-col bg-background">
        {/* Opponent */}
        <div className="min-h-[6rem] h-[6rem] w-full flex justify-between items-center px-[2rem] mb-[1.5rem]">
          <div className="flex items-center">
            <div className="w-[5rem] h-[5rem] bg-primary rounded-[0.8rem]"></div>
            <div className="flex flex-col ml-[1.5rem]">
              <span className="">Opponent</span>
              <span className="text-[1.4rem]">1320</span>
            </div>
          </div>
          <div className="h-[4rem] w-[10rem] bg-primary rounded-[0.8rem] flex justify-center items-center">
            <RiTimerLine className="mr-[0.8rem]" size={22} color="white" />
            <span className="text-[1.6rem] font-bold">09:10</span>
          </div>
        </div>

        {/* Header */}
        <div className="min-h-0 grow w-full flex justify-center items-center">
          <div className="max-h-full w-[78rem] aspect-square grid grid-cols-8 grid-rows-8 bg-[#826247] rounded-[0.8rem] overflow-hidden shadow-xl/20">
            {board.board.map((row, indexRow) => {
              return row.map((piece, indexColumn) => (
                <Cell key={`cell_${indexRow}_${indexColumn}`} row={indexRow} column={indexColumn} piece={piece} />
              ));
            })}
          </div>
        </div>

        {/* Player */}
        <div className="min-h-[6rem] h-[6rem] w-full flex justify-between items-center px-[2rem] my-[1.5rem]">
          <div className="flex items-center">
            <div className="w-[5rem] h-[5rem] bg-primary rounded-[0.8rem]"></div>
            <div className="flex flex-col ml-[1.5rem]">
              <span className="">Opponent</span>
              <span className="text-[1.4rem]">1320</span>
            </div>
          </div>
          <div className="h-[4rem] w-[10rem] bg-primary rounded-[0.8rem] flex justify-center items-center">
            <RiTimerLine className="mr-[0.8rem]" size={22} color="white" />
            <span className="text-[1.6rem] font-bold">09:10</span>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
