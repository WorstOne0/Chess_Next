"use client";

import Image from "next/image";
import { useGameState } from "@/store";
import { Card } from "@/components";
//
import { FaHandshake } from "react-icons/fa";
import { RiFlagFill } from "react-icons/ri";
import { LuArrowLeft, LuArrowRight, LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

import white_bishop from "@/../public/neo/white_bishop.svg";
import white_king from "@/../public/neo/white_king.svg";
import white_knight from "@/../public/neo/white_knight.svg";
import white_queen from "@/../public/neo/white_queen.svg";
import white_rook from "@/../public/neo/white_rook.svg";

export default function SideBoard() {
  const { previousMoves } = useGameState((state) => state);

  const groupedMoves = () => {
    const grouped = [];
    for (let i = 0; i < previousMoves.length; i += 2) {
      grouped.push(previousMoves.slice(i, i + 2));
    }

    return grouped;
  };

  const handleNotation = (notation: string) => {
    const defaultHtml = (move: string) => <span className="text-white font-bold leading-none ml-[0.5rem]">{move}</span>;
    if (!notation) return defaultHtml(notation);

    const firstLetter = notation[0];

    if (firstLetter === "B") {
      return (
        <div className="flex items-center">
          <Image className="h-[2.4rem] w-[2.4rem] mr-[0.3rem] mb-[0.4rem]" src={white_bishop} alt="bishop" />
          <span className="text-white font-bold leading-none">{notation.substring(1)}</span>
        </div>
      );
    }

    if (firstLetter === "N") {
      return (
        <div className="flex items-center">
          <Image className="h-[2.4rem] w-[2.4rem] mr-[0.3rem] mb-[0.4rem]" src={white_knight} alt="bishop" />
          <span className="text-white font-bold leading-none">{notation.substring(1)}</span>
        </div>
      );
    }

    if (firstLetter === "K") {
      return (
        <div className="flex items-center">
          <Image className="h-[2.4rem] w-[2.4rem] mr-[0.3rem] mb-[0.4rem]" src={white_king} alt="bishop" />
          <span className="text-white font-bold leading-none">{notation.substring(1)}</span>
        </div>
      );
    }

    if (firstLetter === "Q") {
      return (
        <div className="flex items-center">
          <Image className="h-[2.4rem] w-[2.4rem] mr-[0.3rem] mb-[0.4rem]" src={white_queen} alt="bishop" />
          <span className="text-white font-bold leading-none">{notation.substring(1)}</span>
        </div>
      );
    }

    if (firstLetter === "R") {
      return (
        <div className="flex items-center">
          <Image className="h-[2.4rem] w-[2.4rem] mr-[0.3rem] mb-[0.4rem]" src={white_rook} alt="bishop" />
          <span className="text-white font-bold leading-none">{notation.substring(1)}</span>
        </div>
      );
    }

    return defaultHtml(notation);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-primary p-[1.5rem]">
      <div className="w-full"></div>

      <div className="min-h-0 w-full grow flex flex-col items-start my-[1.5rem]">
        <div className="w-full flex justify-between items-center">
          <span className="text-[1.8rem] font-bold text-white">Previous Moves</span>
          <span className="text-[1.4rem] text-gray-300 italic">{previousMoves.length} moves</span>
        </div>

        <div className="min-h-0 grow w-full flex flex-col items-start overflow-y-auto scrollbar scrollbar-white">
          {groupedMoves().map((move, index) => (
            <div key={index} className="min-h-[3rem] h-[3rem] w-full flex items-center justify-center px-[1.5rem]">
              <span className="w-[3rem] text-[1.4rem] text-gray-300">{index + 1}.</span>
              <span className="min-w-0 grow flex items-center">
                <div className="w-[12rem]">{handleNotation(move[0])}</div>
                <div className="w-[12rem]">{handleNotation(move[1])}</div>
              </span>
              <div className="w-[3rem]"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex space-x-[1.5rem] mb-[1.5rem]">
        <Card className="h-[5.5rem] w-[50%] flex justify-center items-center">
          <FaHandshake className="text-primary" size={24} />
          <span className="text-[1.8rem] text-primary font-bold">Draw</span>
        </Card>
        <Card className="h-[5.5rem] w-[50%] flex justify-center items-center">
          <RiFlagFill className="text-primary" size={24} />
          <span className="text-[1.8rem] text-primary font-bold">Resign</span>
        </Card>
      </div>

      <div className="w-full flex space-x-[1.5rem]">
        <Card className="h-[5.5rem] min-w-0 grow flex justify-center items-center">
          <LuArrowLeftToLine size={24} />
        </Card>
        <Card className="h-[5.5rem] min-w-0 grow flex justify-center items-center">
          <LuArrowLeft size={24} />
        </Card>
        <Card className="h-[5.5rem] min-w-0 grow flex justify-center items-center">
          <LuArrowRight size={24} />
        </Card>
        <Card className="h-[5.5rem] min-w-0 grow flex justify-center items-center">
          <LuArrowRightToLine size={24} />
        </Card>
      </div>
    </div>
  );
}
