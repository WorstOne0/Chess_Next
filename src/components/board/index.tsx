"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import useSound from "use-sound";
// Hooks
import { useMount } from "@/hooks";
// Store
import { useGameState } from "@/store";
// Components
import { Cell } from "@/components";
//
import { RiTimerLine } from "react-icons/ri";

export default function Board() {
  const { board, selectPiece, makeMove, previousMoves } = useGameState((state) => state);
  const [whiteTime, setWhiteTime] = useState(180);
  const [blackTime, setBlackTime] = useState(180);

  const [moveSelfAudio] = useSound("/sound/move-self.mp3");
  const [captureAudio] = useSound("/sound/capture.mp3");
  const [moveCheckAudio] = useSound("/sound/move-check.mp3");
  const [promoteAudio] = useSound("/sound/promote.mp3");
  const [castleAudio] = useSound("/sound/castle.mp3");

  useMount(() => {});

  useEffect(() => {
    const interval = setInterval(() => {
      if (previousMoves.length === 0) return;

      if (board.currentPlayerTurn === "white") setWhiteTime((prevTime) => Math.max(0, prevTime - 1));
      else setBlackTime((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [whiteTime, blackTime, board.currentPlayerTurn, previousMoves.length]);

  const myClock = () => {
    const seconds = whiteTime % 60;
    const minutes = Math.floor(whiteTime / 60);

    const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();

    return `${minutesString}:${secondsString}`;
  };

  const opponentClock = () => {
    const seconds = blackTime % 60;
    const minutes = Math.floor(blackTime / 60);

    const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();

    return `${minutesString}:${secondsString}`;
  };

  const onDragStart = (event: DragStartEvent) => {
    selectPiece(event.active.data.current?.piece);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { sound } = makeMove(event.over?.data.current?.position);
    if (!sound) return;

    if (sound == "move-self.mp3") moveSelfAudio();
    if (sound == "capture.mp3") captureAudio();
    if (sound == "move-check.mp3") moveCheckAudio();
    if (sound == "promote.mp3") promoteAudio();
    if (sound == "castle.mp3") castleAudio();
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[snapCenterToCursor]}>
      <div className="h-full w-full flex flex-col bg-background">
        {/* Opponent */}
        <div className="min-h-[6rem] h-[6rem] w-full flex justify-between items-center px-[2rem] mb-[1.5rem]">
          <div className="flex items-center">
            <div className="w-[5rem] h-[5rem] bg-primary rounded-[0.8rem]"></div>
            <div className="flex flex-col ml-[1.5rem]">
              <span className="">Opponent</span>
              <span className="text-[1.4rem]">400</span>
            </div>
          </div>
          <div className="h-[4rem] w-[10rem] bg-primary rounded-[0.8rem] flex justify-center items-center">
            <RiTimerLine className="mr-[0.8rem]" size={22} color="white" />
            <span className="text-[1.6rem] text-white font-bold">{opponentClock()}</span>
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
              <span className="">Player</span>
              <span className="text-[1.4rem]">9999</span>
            </div>
          </div>
          <div className="h-[4rem] w-[10rem] bg-primary rounded-[0.8rem] flex justify-center items-center">
            <RiTimerLine className="mr-[0.8rem]" size={22} color="white" />
            <span className="text-[1.6rem] text-white font-bold">{myClock()}</span>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
