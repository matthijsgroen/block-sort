import { use, useEffect, useState } from "react";

import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { colorMap } from "@/game/themes/default";
import { LevelState } from "@/game/types";
import { LevelType } from "@/support/getLevelType";
import { mulberry32, pick } from "@/support/random";
import { ThemeContext } from "@/support/ThemeProvider";
import { useGameStorage } from "@/support/useGameStorage";

import { BackgroundContext } from "../Layout/BackgroundContext";

import { getAutoMoveCount, MAX_SOLVE_PERCENTAGE } from "./autoMove";
import { WIN_SENTENCES } from "./winSentences";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  title: string;
  levelNr: number;
  levelType: LevelType;
  levelSettings: LevelSettings;
  storageKey: string;
  storagePrefix?: string;
};

export const Level: React.FC<Props> = ({
  onComplete,
  level,
  title,
  levelType,
  levelNr,
  storageKey,
  storagePrefix = "",
}) => {
  const [playState, setPlayState] = useState<
    "won" | "lost" | "busy" | "restarting"
  >("busy");

  const initialLevelState = use(level);

  const localRandom = mulberry32(levelNr * 386);

  const [levelState, setLevelState, deleteLevelState] =
    useGameStorage<LevelState>(storageKey, initialLevelState);
  const [lostCounter, setLostCounter] = useGameStorage(
    `${storagePrefix}lostCounter`,
    0
  );
  const [autoMoves, setAutoMoves] = useGameStorage(
    `${storagePrefix}autoMoves`,
    0
  );
  const autoMoveLimit = Math.min(
    getAutoMoveCount(lostCounter),
    Math.floor(initialLevelState.moves.length * MAX_SOLVE_PERCENTAGE)
  );

  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number, state: LevelState] | null
  >(null);

  const [started, setStarted] = useState(false);

  const [, setTheme] = use(BackgroundContext);
  useEffect(() => {
    setTheme(levelType);

    const cleanup = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(cleanup);
  }, []);

  const { activeTheme } = use(ThemeContext);

  useEffect(() => {
    if (hasWon(levelState)) {
      setPlayState("won");
      setLostCounter(0);
    } else if (isStuck(levelState)) {
      setPlayState("lost");
      setLostCounter((a) => a + 1);
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
      setAutoMoves(0);
    } else {
      const selection = selectFromColumn(levelState, columnIndex);
      if (selection.length > 0) {
        setSelectStart([columnIndex, selection.length, levelState]);
      }
    }
  };

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
            setAutoMoves(autoMoveLimit);
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
          message={pick(WIN_SENTENCES, localRandom)}
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
          message="Blocked!"
          shape="❌"
          afterShow={() => {
            setLevelState(initialLevelState);
            setAutoMoves(autoMoveLimit);
            setPlayState("busy");
          }}
          onShow={() => {
            sound.play("lose");
          }}
        />
      )}
      <div className="flex flex-row pt-2 pl-safeLeft pr-safeRight gap-x-2 items-center">
        <TopButton
          buttonType="back"
          onClick={() => {
            onComplete(false);
          }}
        />
        <div className="flex-1"></div>
        {autoMoves > 0 && (
          <WoodButton
            onClick={() => {
              const moveIndex = autoMoveLimit - autoMoves;
              setAutoMoves((a) => a - 1);
              const move = initialLevelState.moves[moveIndex];
              if (move) {
                const selection = selectFromColumn(levelState, move.from);
                if (selection.length > 0) {
                  setSelectStart([move.from, selection.length, levelState]);
                }
                setTimeout(() => {
                  setLevelState((levelState) =>
                    moveBlocks(levelState, move.from, move.to)
                  );
                }, 200);
              }
            }}
          >
            <>
              <span className={"text-lg pt-[4px] inline-block px-2"}>
                Automove
              </span>
              <span className="inline-block bg-black/20 p-1 text-xs rounded-md mr-1">
                {autoMoves}
              </span>
            </>
          </WoodButton>
        )}
        {autoMoves === 0 && (
          <div className="font-block-sort text-center text-orange-400 tracking-widest">
            {title}
          </div>
        )}
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
        theme={activeTheme}
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
