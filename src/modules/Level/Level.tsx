import { use, useEffect, useState } from "react";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { isHard, isSpecial } from "@/game/level-settings/levelSettings";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { useGameStorage } from "@/support/useGameStorage";
import { colorMap } from "@/ui/Block/colorMap";
import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";

import { BackgroundContext } from "../Layout/BackgroundContext";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  levelNr: number;
  levelSettings: LevelSettings;
};

const getLevelType = (nr: number): undefined | "hard" | "easy" | "special" => {
  if (isSpecial(nr)) {
    return "special";
  }
  if (isHard(nr)) {
    return "hard";
  }
  // TODO: Implement easy
  return undefined;
};

export const Level: React.FC<Props> = ({ onComplete, level, levelNr }) => {
  const [playState, setPlayState] = useState<
    "won" | "lost" | "busy" | "restarting"
  >("busy");

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

  const onColumnClick = (columnIndex: number) => {
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

  const [, setTheme] = use(BackgroundContext);
  setTheme(getLevelType(levelNr));

  return (
    <div className="flex flex-col h-full">
      {playState === "restarting" && (
        <Message
          delay={100}
          message="Restarting"
          color="#888"
          shape="&#10226;"
          afterShow={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
          onShow={() => {
            sound.play("lose");
          }}
        />
      )}
      {playState === "won" && (
        <Message
          delay={1000}
          message="You won!"
          color={colorMap["green"]}
          shape="✔️"
          afterShow={() => {
            deleteLevelState();
            onComplete(playState === "won");
          }}
          onShow={() => {
            sound.play("win");
          }}
        />
      )}
      {playState === "lost" && (
        <Message
          delay={2000}
          color={colorMap["red"]}
          message="You lost!"
          shape="❌"
          afterShow={() => {
            setLevelState(initialLevelState);
            setPlayState("busy");
          }}
          onShow={() => {
            sound.play("lose");
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
        <div className="flex-1"></div>
        <TopButton
          buttonType="restart"
          onClick={() => {
            setPlayState("restarting");
          }}
        />
      </div>
      <LevelLayout
        levelState={levelState}
        started={started}
        onColumnClick={(column) => onColumnClick(column)}
        selection={
          selectStart && selectStart[2] === levelState
            ? [selectStart[0], selectStart[1]]
            : undefined
        }
        onLock={() => {
          sound.play("lock");
        }}
        onDrop={() => {
          sound.play("place");
        }}
        onPickUp={() => {
          sound.play("pickup");
        }}
      />
    </div>
  );
};
