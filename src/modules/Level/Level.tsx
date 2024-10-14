import { use, useEffect, useState } from "react";

import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { getLevelTypeByType, LevelTypeString } from "@/game/level-types";
import { hasWon, isStuck } from "@/game/state";
import { colorMap } from "@/game/themes/default";
import { LevelSettings, LevelState, Move } from "@/game/types";
import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { mulberry32, pick } from "@/support/random";
import { getActiveModifiers, getToday } from "@/support/themes";
import { useGameStorage } from "@/support/useGameStorage";

import { BackgroundContext } from "../Layout/BackgroundContext";

import { getAutoMoveCount, MAX_SOLVE_PERCENTAGE } from "./autoMove";
import { ghostModeModifier } from "./ghostModeModifier";
import { WIN_SENTENCES } from "./winSentences";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  title: string;
  levelNr: number;
  levelType: LevelTypeString;
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
    0,
  );
  const [autoMoves, setAutoMoves] = useGameStorage(
    `${storagePrefix}autoMoves`,
    0,
  );
  const [levelMoves, setLevelMoves, deleteMoves] = useGameStorage<Move[]>(
    `${storagePrefix}moves`,
    [],
  );
  const [previousLevelMoves, setPreviousLevelMoves, deletePreviousMoves] =
    useGameStorage<Move[]>(`${storagePrefix}previousMoves`, []);

  const autoMoveLimit = Math.min(
    getAutoMoveCount(lostCounter),
    Math.floor(initialLevelState.moves.length * MAX_SOLVE_PERCENTAGE),
  );

  const [selectStart, setSelectStart] = useState<
    [column: number, amount: number, state: LevelState] | null
  >(null);

  const [started, setStarted] = useState(false);
  const levelTypePlugin = getLevelTypeByType(levelType);
  const { setThemeOverride, clearThemeOverride } = use(ThemeContext);

  const { setLevelType } = use(BackgroundContext);
  useEffect(() => {
    setLevelType(levelType);
    if (levelTypePlugin.levelModifiers?.theme) {
      setThemeOverride(levelTypePlugin.levelModifiers.theme);
    }

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
      if (selectStart[0] === columnIndex) {
        setSelectStart(null);
        return;
      }
      setLevelState((levelState) =>
        moveBlocks(levelState, selectStart[0], columnIndex),
      );
      setLevelMoves((moves) =>
        moves.concat({ from: selectStart[0], to: columnIndex }),
      );
      setAutoMoves(0);
    } else {
      const selection = selectFromColumn(levelState, columnIndex);
      if (selection.length > 0) {
        setSelectStart([columnIndex, selection.length, levelState]);
      }
    }
  };

  const levelModifiers = getActiveModifiers(getToday());

  const ghostMode =
    !!levelTypePlugin.levelModifiers?.ghostMode ||
    levelModifiers.some((m) => m.modifiers.ghostMode);

  // Level modifier: Ghost mode
  const { ghostSelection, ghostTarget } = ghostModeModifier(
    levelState,
    previousLevelMoves,
    levelMoves,
    { enabled: ghostMode },
  );

  return (
    <div className="flex h-full flex-col">
      {playState === "restarting" && (
        <Message
          delay={100}
          message="Restarting"
          color="#888"
          shape="&#10226;"
          afterShow={async () => {
            setLevelState(initialLevelState);
            setAutoMoves(autoMoveLimit);
            await deleteMoves();
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
          afterShow={async () => {
            deleteLevelState();
            await deleteMoves();
            await deletePreviousMoves();
            clearThemeOverride();
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
          afterShow={async () => {
            setLevelState(initialLevelState);
            setAutoMoves(autoMoveLimit);
            setPreviousLevelMoves(levelMoves);
            await deleteMoves();
            setPlayState("busy");
          }}
          onShow={() => {
            sound.play("lose");
          }}
        />
      )}
      <div className="flex flex-row items-center gap-x-2 pl-safeLeft pr-safeRight pt-2">
        <TopButton
          buttonType="back"
          onClick={() => {
            clearThemeOverride();
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
                    moveBlocks(levelState, move.from, move.to),
                  );
                }, 200);
              }
            }}
          >
            <>
              <span className={"inline-block px-2 pt-[4px] text-lg"}>
                Automove
              </span>
              <span className="mr-1 inline-block rounded-md bg-black/20 p-1 text-xs">
                {autoMoves}
              </span>
            </>
          </WoodButton>
        )}
        {autoMoves === 0 && (
          <div className="text-center font-block-sort tracking-widest text-orange-400">
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
        suggestionSelection={ghostSelection}
        suggestionTarget={ghostTarget}
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
