import { use, useEffect, useState } from "react";

import { BlockColumn } from "@/components/BlockColumn";
import { Message } from "@/components/Message";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { colSizes, rowSizes } from "@/support/grid";
import { useGameStorage } from "@/support/useGameStorage";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  levelNr: number;
  levelSettings: LevelSettings;
};

const determineColumns = (
  maxColumnHeight: number,
  amountColumns: number
): string => {
  if (maxColumnHeight <= 6 && amountColumns < 12) {
    const gridColumnCount = Math.ceil(amountColumns / 2);
    return colSizes[gridColumnCount];
  }
  if (maxColumnHeight <= 4 && amountColumns < 16) {
    const gridColumnCount = Math.ceil(amountColumns / 3);
    return colSizes[gridColumnCount];
  }

  return "grid-cols-6";
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
    const cleanup = setTimeout(() => setStarted(true), 300);
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

  const maxColumnSize = levelState.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );

  const cols = determineColumns(maxColumnSize, levelState.columns.length);

  return (
    <div className="flex flex-col h-safe-screen">
      {playState === "won" && (
        <Message
          delay={1000}
          message="You won!"
          color="bg-green-700"
          afterShow={() => {
            deleteLevelState();
            onComplete(playState === "won");
          }}
        />
      )}
      {playState === "lost" && (
        <Message
          delay={2000}
          color="bg-red-700"
          message="You lost!"
          afterShow={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
        />
      )}
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
      <div className="flex-1 flex flex-wrap justify-center p-2">
        <div className="w-full content-center">
          <div
            className={`grid grid-flow-dense ${cols} ${rowSizes[maxColumnSize]}`}
          >
            {levelState.columns.map((bar, i) => (
              <BlockColumn
                column={bar}
                key={i}
                onClick={onColumnClick(i)}
                started={started}
                amountSelected={
                  selectStart &&
                  selectStart[2] === levelState &&
                  i === selectStart[0]
                    ? selectStart[1]
                    : 0
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
