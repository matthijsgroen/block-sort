import clsx from "clsx";

import { LevelType } from "@/support/getLevelType";

type Props = {
  levelNr: number;
  type: LevelType;
  onClick: VoidFunction;
};

export const PlayButton: React.FC<Props> = ({ levelNr, onClick, type }) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block w-[10rem] h-12 rounded-3xl shadow-lg font-bold pt-3",
      {
        "bg-orange-500": type === "normal" || type === "hard",
        "bg-purple-500": type === "special",
        "bg-green-700": type === "easy",
        "bg-slate-400": type === "scrambled",
      }
    )}
  >
    <span className={`block ${type === "normal" ? "-translate-y-1" : ""}`}>
      Level {levelNr}
    </span>
    {type === "special" && (
      <span className="inline-block text-xs translate-y-1 bg-purple-400 px-2 py-1 shadow rounded-md">
        ⭐️ special
      </span>
    )}
    {type === "hard" && (
      <span className="inline-block text-xs translate-y-1 bg-orange-600 px-2 py-1 shadow rounded-md">
        🔥️ hard
      </span>
    )}
    {type === "easy" && (
      <span className="inline-block text-xs translate-y-1 bg-green-800 px-2 py-1 shadow rounded-md">
        🍀 easy
      </span>
    )}
    {type === "scrambled" && (
      <span className="inline-block text-xs translate-y-1 bg-slate-300 px-2 py-1 shadow rounded-md">
        🧩 scrambled
      </span>
    )}
  </button>
);
