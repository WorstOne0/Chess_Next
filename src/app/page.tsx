import { Board, SideBoard } from "@/components";

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      {/* Sidebar */}
      <div className="h-full w-[50rem]">
        <SideBoard />
      </div>

      {/* Board */}
      <div className="h-full min-w-0 grow">
        <Board />
      </div>
    </div>
  );
}
