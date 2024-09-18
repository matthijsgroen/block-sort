import { use, useEffect, useState } from "react";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { colSizes, rowSizes } from "@/support/grid";
import { useGameStorage } from "@/support/useGameStorage";
import { BlockColumn } from "@/ui/BlockColumn/BlockColumn";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";

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
    <div className="flex flex-col h-safe-area">
      {playState === "won" && (
        <Message
          delay={1000}
          message="You won!"
          color="green"
          shape="✔️"
          afterShow={() => {
            deleteLevelState();
            onComplete(playState === "won");
          }}
          onShow={() => {
            sound.playWin();
          }}
        />
      )}
      {playState === "lost" && (
        <Message
          delay={2000}
          color="red"
          message="You lost!"
          shape="❌"
          afterShow={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
          onShow={() => {
            sound.playLose();
          }}
        />
      )}
      <div className="flex flex-row p-2 gap-x-2">
        <TopButton
          buttonType="back"
          onClick={() => {
            onComplete(false);
          }}
        />
        <TopButton buttonType="settings" onClick={() => {}} />
        <div className="flex-1"></div>
        <TopButton
          buttonType="restart"
          onClick={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
        />
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
