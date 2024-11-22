import clsx from "clsx";

import { getDifficultyLevel } from "@/game/level-settings/levelSettings";
import { timesMap } from "@/support/timeMap";

import { DIFFICULTIES } from "../GameModi/constants";

const translates = [
  "",
  "translate-x-10",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10"
];

export const DifficultyBar: React.FC<{ levelNr: number }> = ({ levelNr }) => {
  const difficulty = DIFFICULTIES[getDifficultyLevel(levelNr) - 1];
  const offset = levelNr % 8;
  return (
    <div
      className={clsx(
        "inline-block h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-xs tracking-widest text-transparent",
        translates[offset]
      )}
    >
      {timesMap(difficulty.stars, () => "⭐️").join("")} {difficulty.name}{" "}
      {timesMap(difficulty.stars, () => "⭐️").join("")}
    </div>
  );
};
