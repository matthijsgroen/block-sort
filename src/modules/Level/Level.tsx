import { use, useCallback, useEffect, useState } from "react";

import { LevelLayout } from "@/ui/LevelLayout/LevelLayout";
import { Message } from "@/ui/Message/Message";
import { StartAnimation } from "@/ui/StartAnimation/StartAnimation";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { sound } from "@/audio";
import { hideBlock, moveBlocks, selectFromColumn } from "@/game/actions";
import type { LevelTypeString } from "@/game/level-types";
import { getLevelTypeByType } from "@/game/level-types";
import type { LevelModifiers } from "@/game/level-types/types";
import {
  getRevealedIndices,
  hasWon,
  isStuck,
  revealBlocks
} from "@/game/state";
import { getActiveModifiers } from "@/game/themes";
import { colorMap } from "@/game/themes/default";
import type { LevelSettings, LevelState, Move } from "@/game/types";
import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { mulberry32, pick } from "@/support/random";
import { getToday } from "@/support/schedule";
import { useGameStorage, useLevelStateStorage } from "@/support/useGameStorage";

import { BackgroundContext } from "../Layout/BackgroundContext";

import type { HintMode } from "./autoMove";
import { getAutoMoveCount } from "./autoMove";
import { ghostModeModifier } from "./ghostModeModifier";
import { Tutorial } from "./Tutorial";
import { WIN_SENTENCES } from "./winSentences";

type Props = {
  onComplete: (won: boolean) => void;
  level: Promise<LevelState>;
  useStreak?: boolean;
  title: string;
  levelNr: number;
  levelType: LevelTypeString;
  levelSettings: LevelSettings;
  showTutorial?: boolean;
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
  useStreak = false,
  showTutorial = false,
  storagePrefix = ""
}) => {
  const initialLevelState = use(level);

  const localRandom = mulberry32(levelNr * 386);

  const [storedLevelState, setLevelState, deleteLevelState] =
    useLevelStateStorage(storageKey, initialLevelState);
  const [frozenLevelState, setFrozenLevelState] = useState<LevelState | null>(
    null
  );
  const levelState = frozenLevelState ?? storedLevelState;

  const [lostCounter, setLostCounter] = useGameStorage(
    `${storagePrefix}lostCounter`,
    0
  );
  const [usedAutoMoves, setUsedAutoMoves] = useGameStorage(
    `${storagePrefix}usedAutoMoves`,
    0
  );
  const [levelMoves, setLevelMoves, deleteMoves] = useGameStorage<Move[]>(
    `${storagePrefix}moves`,
    []
  );
  const [playState, setPlayState] = useState<
    "won" | "lost" | "starting" | "busy" | "restarting"
  >("starting");

  const [revealed, setRevealed, deleteRevealed] = useGameStorage<
    { col: number; row: number }[]
  >(`${storagePrefix}revealed`, []);
  const [previousLevelMoves, setPreviousLevelMoves, deletePreviousMoves] =
    useGameStorage<Move[]>(`${storagePrefix}previousMoves`, []);

  const [hintMode] = useGameStorage<HintMode | null>("hintMode", null);

  const autoMoveLimit = getAutoMoveCount(
    lostCounter,
    initialLevelState.moves.length,
    hintMode ?? "standard"
  );

  const movesInSync = levelMoves.every(
    (move, i) =>
      initialLevelState.moves[i].from === move.from &&
      initialLevelState.moves[i].to === move.to
  );

  const autoMoves =
    usedAutoMoves === -1 || !movesInSync
      ? 0
      : Math.max(0, autoMoveLimit - Math.max(levelMoves.length, 0));

  const [selectStart, setSelectStart] = useState<{
    selection: [column: number, amount: number];
    state: LevelState;
  } | null>(null);

  const activeSelectStart =
    selectStart && selectStart.state !== levelState ? null : selectStart;

  const [started, setStarted] = useState(false);
  const levelTypePlugin = getLevelTypeByType(levelType);
  const { setThemeOverride, clearThemeOverride } = use(ThemeContext);
  const [, setStreak] = useGameStorage<number | null>("streak", null);

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
      setFrozenLevelState(levelState);
    } else if (isStuck(levelState)) {
      setPlayState("lost");
      setLostCounter((a) => a + 1);
    }
  }, [levelState]);

  useEffect(() => {
    if (playState === "starting" && levelMoves.length > 0) {
      setPlayState("busy");
    }
  }, [playState, levelMoves]);

  const levelModifiers = getActiveModifiers(getToday());

  const getLevelModifier = <TModifier extends keyof LevelModifiers>(
    modifier: TModifier
  ): LevelModifiers[TModifier] =>
    levelTypePlugin.levelModifiers?.[modifier] ??
    levelModifiers.find((m) => m.modifiers[modifier])?.modifiers[modifier];

  const ghostMode = !!getLevelModifier("ghostMode");
  const hideFormat = getLevelModifier("hideMode");
  const keepRevealed = getLevelModifier("keepRevealed");
  const hideEvery = getLevelModifier("hideEvery");

  // Level modifier: Ghost mode
  const { ghostSelection, ghostTarget } = ghostModeModifier(
    levelState,
    previousLevelMoves,
    levelMoves,
    { enabled: ghostMode }
  );

  const move = useCallback(
    (from: number, to: number) => {
      if (hintMode !== "off" && hintMode !== null && useStreak) {
        setStreak(0);
      }
      setLevelState((levelState) => {
        let updatedLevelState = moveBlocks(levelState, { from, to });
        if (keepRevealed) {
          // Detect revealed item on 'from' column, mark as revealed in
          // column, index fashion to 'reveal' fog

          const revealedBlocks = getRevealedIndices(
            levelState,
            updatedLevelState,
            from
          ).map((i) => ({ col: from, row: i }));
          setRevealed((revealed) => revealed.concat(revealedBlocks));
        }
        const hasMoved = updatedLevelState !== levelState;
        if (hasMoved) {
          setLevelMoves((moves) => moves.concat({ from, to }));
        }
        if (
          hasMoved &&
          hideEvery &&
          hideEvery > 0 &&
          levelMoves.length % hideEvery === 0
        ) {
          // hide another block
          updatedLevelState = hideBlock(updatedLevelState);
        }

        return updatedLevelState;
      });
    },
    [levelMoves.length]
  );

  const onColumnDown = useCallback(
    (columnIndex: number) => {
      if (activeSelectStart) {
        if (activeSelectStart.selection[0] === columnIndex) {
          setSelectStart(null);
          return;
        }
        move(activeSelectStart.selection[0], columnIndex);
        setUsedAutoMoves(-1);
      } else {
        const selection = selectFromColumn(levelState, columnIndex);
        if (selection.length > 0) {
          setSelectStart({
            selection: [columnIndex, selection.length],
            state: levelState
          });
        }
      }
    },
    [levelState, activeSelectStart]
  );
  const onColumnUp = useCallback(
    (columnIndex: number) => {
      if (activeSelectStart) {
        if (activeSelectStart.selection[0] === columnIndex) {
          return;
        }
        move(activeSelectStart.selection[0], columnIndex);
        setUsedAutoMoves(-1);
      }
    },
    [activeSelectStart]
  );

  const [clearKey, setClearKey] = useState(0);

  /**
   * Disable block move animation on iOS, as it is not performant.
   *
   * Especially in standalone mode, apple is gimping the performance
   */
  const blockAnimations = true;

  const handleLock = useCallback(() => {
    sound.play("lock");
  }, []);
  const handleDrop = useCallback(() => {
    sound.play("place");
  }, []);
  const handlePickUp = useCallback(() => {
    sound.play("pickup");
  }, []);
  const handleMatch = useCallback(() => {
    sound.play("match");
  }, []);

  return (
    <div className={"flex h-full flex-col"}>
      {playState === "starting" &&
        levelMoves.length === 0 &&
        levelTypePlugin.showIntro && (
          <StartAnimation
            delay={10}
            message={levelTypePlugin.name}
            color={levelTypePlugin.introTextColor ?? "#fff"}
            shape={levelTypePlugin.symbol}
            shapeColor={levelTypePlugin.color}
            afterShow={() => {
              setPlayState("busy");
            }}
            onShow={() => {
              // sound.play("restart");
            }}
          />
        )}
      {playState === "restarting" && (
        <Message
          delay={100}
          message="Restarting"
          color="#888"
          shape="&#10226;"
          afterShow={() => {
            setLevelState(initialLevelState);
            setUsedAutoMoves(0);
            deleteMoves();
            deleteRevealed();
            setPlayState("busy");
            setClearKey((k) => (k + 1) % 5);
          }}
          onShow={() => {
            sound.play("restart");
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
            if (hintMode === "off" && useStreak) {
              setStreak((s) => (s ? s + 1 : 1));
            }
            deleteMoves();
            deletePreviousMoves();
            deleteRevealed();
            clearThemeOverride();
            deleteLevelState(false);
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
            if (keepRevealed) {
              setLevelState(revealBlocks(initialLevelState, revealed));
            } else {
              setLevelState(initialLevelState);
            }
            setUsedAutoMoves(0);
            setPreviousLevelMoves(levelMoves);
            deleteMoves();
            setPlayState("busy");
            setClearKey((k) => (k + 1) % 5);
          }}
          onShow={() => {
            sound.play("lose");
          }}
        />
      )}
      <div className="flex flex-row items-center gap-x-2 pl-safeLeft pr-safeRight pt-safeTop">
        <TopButton
          buttonType="back"
          onClick={() => {
            clearThemeOverride();
            onComplete(false);
          }}
        />
        <div className="flex-1"></div>
        {autoMoves > 0 ? (
          <WoodButton
            onClick={() => {
              const moveIndex = autoMoveLimit - autoMoves;
              setUsedAutoMoves((a) => a + 1);
              const nextMove = initialLevelState.moves[moveIndex];
              if (nextMove) {
                const selection = selectFromColumn(levelState, nextMove.from);
                if (selection.length > 0) {
                  setSelectStart({
                    selection: [nextMove.from, selection.length],
                    state: levelState
                  });
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
        ) : (
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
        key={clearKey}
        levelState={levelState}
        theme={activeTheme}
        started={started}
        tutorialContent={
          showTutorial ? (
            <Tutorial
              selection={activeSelectStart?.selection}
              activeTheme={activeTheme}
              levelState={levelState}
              levelMoves={levelMoves}
            />
          ) : undefined
        }
        animateBlocks={blockAnimations}
        onColumnDown={onColumnDown}
        onColumnUp={onColumnUp}
        selection={activeSelectStart?.selection}
        suggestionSelection={ghostSelection}
        suggestionTarget={ghostTarget}
        hideFormat={hideFormat}
        onLock={handleLock}
        onDrop={handleDrop}
        onPickUp={handlePickUp}
        onMatch={handleMatch}
      />
    </div>
  );
};
