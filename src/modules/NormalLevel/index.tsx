import { useState } from "react";
import { timesMap } from "../../support/timeMap";
import { BlockColor, LevelState } from "../../game/types";
import { generateLevel } from "../../game/generateLevel";
import { mulberry32 } from "../../support/random";

type Props = {
  levelNr: number;
  seed: number;
  stackSize?: number;
};

const colorMap: Record<BlockColor, string> = {
  red: "bg-block-red",
  white: "bg-block-white",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  black: "bg-slate-800",
  green: "bg-green-500",
  darkgreen: "bg-green-200",
  aqua: "bg-blue-100",
  brown: "bg-brown-500",
  pink: "bg-pink-800",
};

export const NormalLevel: React.FC<Props> = ({
  levelNr,
  seed,
  stackSize = 4,
}) => {
  const amountColors = levelNr + 2;

  const [levelState, setLevelState] = useState<LevelState>(() => {
    const random = mulberry32(seed);
    return generateLevel(random, { stackSize, amountColors });
  });

  return (
    <div>
      <h1>Hello {levelNr}</h1>
      <div className="flex justify-center p-8">
        <div className="inline-flex flex-row gap-4 mx-auto">
          {levelState.columns.map((bar, i) => (
            <div
              key={i}
              className="border-2 border-black bg-black/20 rounded-md"
            >
              {timesMap(bar.columnSize - bar.blocks.length, (p) => (
                <div key={p} className="w-8 h-8"></div>
              ))}
              {bar.blocks.map((b, p) => (
                <div
                  key={p}
                  className={`w-8 h-8 ${colorMap[b]} rounded-md border border-black`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
