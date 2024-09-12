import { use, useEffect, useState } from "react";
import { timesMap } from "@/support/timeMap";
import { LevelState } from "@/game/types";
import { LevelSettings } from "@/game/generateLevel";
import { shapeMapping } from "@/game/blocks";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { hasWon, isStuck } from "@/game/state";
import { Block } from "@/components/Block";
import { Settings } from "./Settings";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
} & LevelSettings;

export const Level: React.FC<Props> = ({
  onComplete,
  level,
  ...levelSettings
}) => {
  const [playState, setPlayState] = useState<"won" | "lost" | "busy">("busy");

  const initialLevelState = use(level);

  const [levelState, setLevelState] = useState<LevelState>(initialLevelState);
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
      <div className="flex flex-wrap justify-center p-8">
        <div className="inline-flex flex-row flex-wrap gap-4 mx-auto">
          {levelState.columns.map((bar, i) => (
            <div key={i}>
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
                    <div key={p} className="size-10 text-center pt-2">
                      {shapeMapping[bar.limitColor]}
                    </div>
                  ) : (
                    <div key={p} className="size-10"></div>
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
      <Settings levelSettings={levelSettings} level={initialLevelState} />
    </div>
  );
};
