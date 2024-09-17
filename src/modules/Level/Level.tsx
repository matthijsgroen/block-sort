import { use, useEffect, useState } from "react";

import { Block, colorMap } from "@/components/Block";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { shapeMapping } from "@/game/blocks";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { timesMap } from "@/support/timeMap";
import { useGameStorage } from "@/support/useGameStorage";

import styles from "./Level.module.css";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  levelNr: number;
  levelSettings: LevelSettings;
};

const rowSpans: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  8: "row-span-8",
  9: "row-span-8",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
  13: "row-span-13",
  14: "row-span-14",
  15: "row-span-15",
  16: "row-span-16",
};

const rowSizes: Record<number, string> = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  4: "grid-rows-4",
  8: "grid-rows-8",
  12: "grid-rows-12",
  13: "grid-rows-13",
  14: "grid-rows-14",
  16: "grid-rows-16",
};

export const Level: React.FC<Props> = ({ onComplete, level, levelNr }) => {
  const [playState, setPlayState] = useState<"won" | "lost" | "busy">("busy");

  const initialLevelState = use(level);

  const [levelState, setLevelState, deleteLevelState] =
    useGameStorage<LevelState>(`levelState${levelNr}`, initialLevelState);

  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number, state: LevelState] | null
  >(null);

  const [started, setStarted] = useState(false);

  useEffect(() => {
    const cleanup = setTimeout(() => setStarted(true), 200);
    return () => clearTimeout(cleanup);
  }, []);

  useEffect(() => {
    if (hasWon(levelState)) {
      setPlayState("won");
    } else if (isStuck(levelState)) {
      setPlayState("lost");
    }
    if (selectStart && selectStart[2] !== levelState) {
      setSelectStart(null);
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

  const onColumnClick = (columnIndex: number) => () => {
    if (selectStart) {
      setLevelState((levelState) =>
        moveBlocks(levelState, selectStart[0], columnIndex)
      );
    } else {
      const selection = selectFromColumn(levelState, columnIndex);
      if (selection.length > 0) {
        setSelectStart([columnIndex, selection.length, levelState]);
      }
    }
  };

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
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
        >
          🔄
        </button>
      </div>
      {playState === "won" && <h1>Well done!</h1>}
      {playState === "lost" && <h1>You lost!</h1>}
      <div className="flex flex-wrap justify-center p-2">
        <div
          className={`grid grid-flow-dense grid-cols-6 gap-y-8 w-full ${rowSizes[levelState.columns.reduce((r, c) => Math.max(r, c.columnSize), 0)]}`}
        >
          {levelState.columns.map((bar, i) => (
            <div
              key={i}
              className={`${rowSpans[bar.columnSize]} justify-self-center`}
            >
              <div
                className={`
                  border-2 border-transparent border-t-block-brown
                  ${bar.locked ? "contain-paint" : ""}
                    ${bar.type === "buffer" ? "rounded-b-md" : "rounded-md"}
               box-content pb-4`}
              >
                <div
                  className={`border-2 border-block-brown w-block box-content bg-black/20 cursor-pointer flex flex-col-reverse ${
                    bar.type === "buffer"
                      ? "border-t-0 rounded-b-md"
                      : "border-t-0 rounded-md shadow-inner"
                  } `}
                  onTouchStart={onColumnClick(i)}
                >
                  {bar.blocks.map((_b, p, l) => {
                    const index = l.length - 1 - p;
                    const block = l[index];
                    const isSelected =
                      selectStart &&
                      selectStart[2] === levelState &&
                      index < selectStart[1] &&
                      i === selectStart[0];
                    return (
                      <Block
                        key={bar.columnSize - bar.blocks.length + index}
                        locked={bar.locked}
                        moved={started}
                        revealed={block.revealed}
                        color={block.color}
                        selected={isSelected}
                      />
                    );
                  })}
                  {timesMap(bar.columnSize - bar.blocks.length, (p, l) =>
                    l - p === l && bar.limitColor !== undefined ? (
                      <div
                        key={bar.blocks.length + p}
                        className={`${p === 0 && bar.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
                      >
                        <div
                          style={{ "--cube-color": colorMap[bar.limitColor] }}
                          className={`${styles.limit} animate-fadeIn`}
                        >
                          {shapeMapping[bar.limitColor]}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={bar.blocks.length + p}
                        className={`${p === 0 && bar.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
