import { use, useEffect, useState } from "react";

import { Block, colorMap } from "@/components/Block";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { shapeMapping } from "@/game/blocks";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { timesMap } from "@/support/timeMap";
import { useGameStorage } from "@/support/useGameStorage";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  levelNr: number;
  levelSettings: LevelSettings;
};

const rowSpans: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  4: "row-span-4",
  8: "row-span-8",
  16: "row-span-16",
};

const rowSizes: Record<number, string> = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  4: "grid-rows-4",
  8: "grid-rows-8",
  16: "grid-rows-16",
};

export const Level: React.FC<Props> = ({ onComplete, level, levelNr }) => {
  const [playState, setPlayState] = useState<"won" | "lost" | "busy">("busy");

  const initialLevelState = use(level);

  const [levelState, setLevelState, deleteLevelState] =
    useGameStorage<LevelState>(`levelState${levelNr}`, initialLevelState);
  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number] | null
  >(null);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (hasWon(levelState)) {
      setPlayState("won");
    } else if (isStuck(levelState)) {
      setPlayState("lost");
    }
  }, [levelState]);

  useEffect(() => {
    if (playState !== "won") {
      return;
    }
    const timeOut = setTimeout(() => {
      deleteLevelState();
      onComplete(playState === "won");
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [playState, onComplete]);

  return (
    <div>
      <div className="flex text-lg flex-row justify-between p-2">
        <button
          onClick={() => {
            onComplete(false);
          }}
        >
          &larr;
        </button>
        <button
          onClick={() => {
            setPlayState("won");
          }}
        >
          🎉
        </button>
        <button
          onClick={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
            setMoves(0);
          }}
        >
          🔄
        </button>
      </div>
      {playState === "won" && <h1>Well done!</h1>}
      {playState === "lost" && <h1>You lost!</h1>}
      <div className="flex flex-wrap justify-center p-4">
        <div
          className={`grid grid-flow-dense grid-cols-6 gap-4 ${rowSizes[levelState.columns.reduce((r, c) => Math.max(r, c.columnSize), 0)]}`}
        >
          {levelState.columns.map((bar, i) => (
            <div key={i} className={rowSpans[bar.columnSize]}>
              <div
                className={`border-2 border-block-brown bg-black/20 cursor-pointer ${
                  bar.type === "buffer"
                    ? "border-t-0 rounded-b-md"
                    : "rounded-md shadow-inner"
                }`}
                onClick={() => {
                  if (selectStart) {
                    setLevelState((levelState) =>
                      moveBlocks(levelState, selectStart[0], i)
                    );
                    setMoves((m) => m + 1);
                    setSelectStart(null);
                  } else {
                    const selection = selectFromColumn(levelState, i);
                    if (selection.length > 0) {
                      setSelectStart([i, selection.length]);
                    }
                  }
                }}
              >
                {timesMap(bar.columnSize - bar.blocks.length, (p, l) =>
                  p === l - 1 && bar.limitColor ? (
                    <div
                      key={p}
                      className={`size-block text-center pt-2 ${colorMap[bar.limitColor]} bg-clip-text text-transparent`}
                    >
                      {shapeMapping[bar.limitColor]}
                    </div>
                  ) : (
                    <div key={p} className="size-block"></div>
                  )
                )}
                {bar.blocks.map((b, p) => {
                  const isSelected =
                    selectStart && p < selectStart[1] && i === selectStart[0];
                  return (
                    <Block
                      key={bar.columnSize - bar.blocks.length + p}
                      locked={bar.locked}
                      moved={moves !== 0}
                      revealed={b.revealed}
                      color={b.color}
                      selected={isSelected}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
