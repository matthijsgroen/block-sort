import { useEffect, useState } from "react";
import { timesMap } from "../../support/timeMap";
import { BlockColor, LevelState } from "../../game/types";
import { generatePlayableLevel } from "../../game/generateLevel";
import { mulberry32 } from "../../support/random";
import { shapeMapping } from "../../game/blocks";
import { moveBlocks, selectFromColumn } from "../../game/actions";
import { hasWon } from "../../game/state";

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
  const [playState, setPlayState] = useState<"won" | "lost" | "busy">("busy");

  const [levelState, setLevelState] = useState<LevelState>(() => {
    const random = mulberry32(seed);
    return generatePlayableLevel(random, { stackSize, amountColors });
  });
  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number] | null
  >(null);

  useEffect(() => {
    if (hasWon(levelState)) {
      setPlayState("won");
    }
  }, [levelState]);

  return (
    <div>
      <h1>Hello {levelNr}</h1>
      {playState === "won" && <h1>You won!</h1>}
      {playState === "lost" && <h1>You lost!</h1>}
      <div className="flex justify-center p-8">
        <div className="inline-flex flex-row gap-4 mx-auto">
          {levelState.columns.map((bar, i) => (
            <div
              key={i}
              className="border-2 border-black bg-black/20 rounded-md cursor-pointer"
              onClick={() => {
                if (selectStart) {
                  setLevelState((levelState) =>
                    moveBlocks(levelState, selectStart[0], i)
                  );
                  setSelectStart(null);
                } else {
                  const selection = selectFromColumn(levelState, i);
                  if (selection.length > 0) {
                    setSelectStart([i, selection.length]);
                  }
                }
              }}
            >
              {timesMap(bar.columnSize - bar.blocks.length, (p) => (
                <div key={p} className="w-8 h-8"></div>
              ))}
              {bar.blocks.map((b, p) => {
                const isSelected =
                  selectStart && p < selectStart[1] && i === selectStart[0];
                return (
                  <div
                    key={p}
                    className={`w-8 h-8 ${
                      colorMap[b.color]
                    } rounded-md border ${
                      isSelected
                        ? "border-white outline outline-white"
                        : "border-black"
                    }`}
                  >
                    {shapeMapping[b.color]}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
