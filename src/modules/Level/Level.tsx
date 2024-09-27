import { use, useEffect, useState } from "react";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { hasWon, isStuck } from "@/game/state";
import { LevelState } from "@/game/types";
import { getLevelType } from "@/support/getLevelType";
import { mulberry32, pick } from "@/support/random";
import { deleteGameValue, useGameStorage } from "@/support/useGameStorage";
import { colorMap } from "@/ui/Block/colorMap";
import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { BackgroundContext } from "../Layout/BackgroundContext";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  levelNr: number;
  levelSettings: LevelSettings;
};

const MIN_LOSE_COUNT = 10;

const getAutoMoveCount = (lostCounter: number) => {
  if (lostCounter < MIN_LOSE_COUNT) {
    return 0;
  }
  return Math.min(3 + Math.round((lostCounter - MIN_LOSE_COUNT) / 2), 20);
};

export const Level: React.FC<Props> = ({ onComplete, level, levelNr }) => {
  const [playState, setPlayState] = useState<
    "won" | "lost" | "busy" | "restarting"
  >("busy");

  const initialLevelState = use(level);

  const localRandom = mulberry32(levelNr * 386);

  const [levelState, setLevelState, deleteLevelState] =
    useGameStorage<LevelState>(`levelState${levelNr}`, initialLevelState);
  const [lostCounter, setLostCounter] = useGameStorage("lostCounter", 0);
  const [autoMoves, setAutoMoves] = useGameStorage("autoMoves", 10);

  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number, state: LevelState] | null
  >(null);

  const [started, setStarted] = useState(false);

  const [, setTheme] = use(BackgroundContext);
  useEffect(() => {
    setTheme(getLevelType(levelNr));

    const cleanup = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(cleanup);
  }, []);

  useEffect(() => {
    if (hasWon(levelState)) {
      setPlayState("won");
      setLostCounter(0);
    } else if (isStuck(levelState)) {
      setPlayState("lost");
      setLostCounter((a) => a + 1);
      setAutoMoves(getAutoMoveCount(lostCounter + 1));
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
            setAutoMoves(getAutoMoveCount(lostCounter));
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
          message={pick(
            [
              "You won!",
              "Great work!",
              "Fantastic!",
              "Amazing!",
              "Terrific!",
              "Awesome!",
              "Incredible!",
              "Unbelievable!",
              "Stupendous!",
              "Spectacular!",
            ],
            localRandom
          )}
          color={colorMap["green"]}
          shape="✔️"
          afterShow={() => {
            deleteLevelState();
            deleteGameValue(`initialLevelState${levelNr}`);
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
        {autoMoves > 0 && (
          <WoodButton
            onClick={() => {
              const moveIndex = getAutoMoveCount(lostCounter) - autoMoves;
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
