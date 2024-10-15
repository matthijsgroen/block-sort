import { use, useEffect, useState } from "react";

import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { sound } from "@/audio";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { getLevelTypeByType, LevelTypeString } from "@/game/level-types";
import {
  getRevealedIndices,
  hasWon,
  isStuck,
  revealBlocks,
} from "@/game/state";
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
  const [revealed, setRevealed, deleteRevealed] = useGameStorage<
    { col: number; row: number }[]
  >(`${storagePrefix}revealed`, []);
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

  const levelModifiers = getActiveModifiers(getToday());

  const ghostMode =
    !!levelTypePlugin.levelModifiers?.ghostMode ||
    levelModifiers.some((m) => m.modifiers.ghostMode);

  const packageMode =
    !!levelTypePlugin.levelModifiers?.packageMode ||
    levelModifiers.some((m) => m.modifiers.packageMode);

  // Level modifier: Ghost mode
  const { ghostSelection, ghostTarget } = ghostModeModifier(
    levelState,
    previousLevelMoves,
    levelMoves,
    { enabled: ghostMode },
  );

  const move = (from: number, to: number) => {
    setLevelState((levelState) => {
      const updatedLevelState = moveBlocks(levelState, from, to);
      if (packageMode) {
        const revealedBlocks = getRevealedIndices(
          levelState,
          updatedLevelState,
          from,
        ).map((i) => ({ col: from, row: i }));
        setRevealed((revealed) => revealed.concat(revealedBlocks));
      }

      return updatedLevelState;
    });
    // Detect revealed item on 'from' column, mark as revealed in
    // column, index fashion to 'reveal' fog

    setLevelMoves((moves) => moves.concat({ from, to }));
  };

  const onColumnClick = (columnIndex: number) => {
    if (selectStart) {
      if (selectStart[0] === columnIndex) {
        setSelectStart(null);
        return;
      }
      move(selectStart[0], columnIndex);
      setAutoMoves(0);
    } else {
      const selection = selectFromColumn(levelState, columnIndex);
      if (selection.length > 0) {
        setSelectStart([columnIndex, selection.length, levelState]);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      {playState === "restarting" && (
        <Message
          delay={100}
          message="Restarting"
          color="#888"
          shape="&#10226;"
          afterShow={() => {
            setLevelState(initialLevelState);
            setAutoMoves(autoMoveLimit);
            deleteMoves();
            deleteRevealed();
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
            onComplete(playState === "won");
            deleteMoves();
            deletePreviousMoves();
            deleteRevealed();
            clearThemeOverride();
            deleteLevelState(false);
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
            if (packageMode) {
              setLevelState(revealBlocks(initialLevelState, revealed));
            } else {
              setLevelState(initialLevelState);
            }
            setAutoMoves(autoMoveLimit);
            deleteRevealed();
            setPreviousLevelMoves(levelMoves);
            deleteMoves();
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
              const nextMove = initialLevelState.moves[moveIndex];
              if (nextMove) {
                const selection = selectFromColumn(levelState, nextMove.from);
                if (selection.length > 0) {
                  setSelectStart([nextMove.from, selection.length, levelState]);
                }
                setTimeout(() => {
                  move(nextMove.from, nextMove.to);
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
        hideFormat={packageMode ? "present" : "glass"}
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
