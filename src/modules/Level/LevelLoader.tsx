import { Suspense, use, useEffect, useMemo, useState } from "react";

import { Loading } from "@/ui/Loading/Loading";

import { replayMoves } from "@/game/actions";
import { colorHustle } from "@/game/level-creation/colorHustle";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { solvers } from "@/game/level-creation/solvers";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { getLevelTypeByType, type LevelTypeString } from "@/game/level-types";
import { hasWon } from "@/game/state";
import { getActiveModifiers } from "@/game/themes";
import type {
  LevelSettings,
  LevelState,
  MultiStageLevelSettings
} from "@/game/types";
import { settingsHash } from "@/support/hash";
import { generateNewSeed, mulberry32 } from "@/support/random";
import { getToday } from "@/support/schedule";
import {
  deleteGameValue,
  getGameValue,
  getLevelStateValue,
  setGameValue,
  useGameStorage
} from "@/support/useGameStorage";

import { BackgroundContext } from "../Layout/BackgroundContext";
import { ErrorBoundary } from "../Layout/ErrorBoundary";
import { ThemeContext } from "../Layout/ThemeContext";

import { ErrorScreen } from "./ErrorScreen";
import { Level } from "./Level";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings | MultiStageLevelSettings;
  levelNr: number;
  useStreak?: boolean;
  title: string;
  levelType: LevelTypeString;
  showTutorial?: boolean;
  storagePrefix?: string;
};

const generateLevelContent = async (
  seed: number,
  storageKey: string,
  levelSettings: LevelSettings,
  levelNr: number,
  stageNr = 0
): Promise<LevelState> => {
  const existingState = await getLevelStateValue(storageKey);
  if (existingState !== null) {
    return existingState;
  }

  const hashVersion = { ...levelSettings };
  delete hashVersion["playMoves"];

  const hash = settingsHash(levelSettings);
  const levelSeeds = (await import("@/data/levelSeeds")).levelSeeds;

  const seeds = levelSeeds[hash] ?? [];
  const preSeed =
    seeds.length > 0
      ? seeds[(levelNr + stageNr) % seeds.length]?.[0]
      : undefined;
  const random = mulberry32(preSeed ?? seed);

  const solver = solvers[levelSettings.solver ?? "default"];

  let level = await generatePlayableLevel(
    levelSettings,
    {
      random,
      seed: preSeed
    },
    solver
  ).then(optimizeMoves);
  if (preSeed !== undefined && level.generationInformation?.seed === preSeed) {
    level = colorHustle(level, random);
  }

  await setGameValue(storageKey, level);

  return level;
};

const createLevel = async (
  seed: number,
  levelNr: number,
  levelSettings: LevelSettings,
  storagePrefix: string,
  levelType: LevelTypeString,
  stage: number
): Promise<LevelState> => {
  const storeKey = `${storagePrefix}initialLevelState${levelNr}${stage !== 0 ? `-${stage}` : ""}`;
  const level = await generateLevelContent(
    seed,
    storeKey,
    levelSettings,
    levelNr,
    stage
  );

  // Verify level content
  const levelState = replayMoves(level, level.moves);
  const won = hasWon(levelState);
  if (!won) {
    const newSeed = generateNewSeed(seed, 2);
    // Level content is botched, retry
    await deleteGameValue(storeKey);
    const level = await generateLevelContent(
      newSeed,
      storeKey,
      levelSettings,
      levelNr,
      stage
    );
    return level;
  }
  if (!(await getGameValue(`${storagePrefix}levelType`))) {
    await setGameValue(`${storagePrefix}levelType`, levelType);
  }

  return level;
};

const isMultiStageLevel = (
  settings: LevelSettings | MultiStageLevelSettings
): settings is MultiStageLevelSettings =>
  (settings as MultiStageLevelSettings).stages !== undefined;

export const LevelLoader: React.FC<Props> = ({
  seed,
  onComplete,
  levelSettings,
  levelNr,
  title,
  useStreak = false,
  levelType,
  showTutorial = false,
  storagePrefix = ""
}) => {
  const [locked] = useState({ levelNr, levelSettings, seed, title });
  const [stage, setStage, deleteStage] = useGameStorage(
    `${storagePrefix}levelStage`,
    0
  );
  const [storedLockedStage, setLockedStage] = useState(stage);
  const lockedStage = Math.max(storedLockedStage, stage);

  const [storedLevelType, , deleteLevelType] = useGameStorage(
    `${storagePrefix}levelType`,
    null
  );
  const stageData = isMultiStageLevel(locked.levelSettings)
    ? locked.levelSettings.stages[lockedStage]
    : undefined;
  const stageSettings = isMultiStageLevel(locked.levelSettings)
    ? locked.levelSettings.stages[lockedStage].settings
    : locked.levelSettings;

  const maxStages = isMultiStageLevel(locked.levelSettings)
    ? locked.levelSettings.stages.length
    : 1;

  const stageSettingsString = JSON.stringify(stageSettings);

  const level = useMemo(() => {
    return createLevel(
      locked.seed,
      locked.levelNr,
      stageSettings,
      storagePrefix,
      levelType,
      lockedStage
    );
  }, [locked.seed, stageSettingsString, lockedStage]);

  const levelTypePlugin = getLevelTypeByType(levelType);
  const { setThemeOverride, clearThemeOverride } = use(ThemeContext);
  const { setBackgroundClassName } = use(BackgroundContext);
  useEffect(() => {
    setBackgroundClassName(
      stageData?.backgroundClassname ?? levelTypePlugin.backgroundClassName
    );
    const themeOverride =
      stageData?.levelModifiers?.theme ?? levelTypePlugin.levelModifiers?.theme;
    if (themeOverride) {
      setThemeOverride(themeOverride);
    }
  }, [stageData, levelTypePlugin]);
  const levelModifiers = getActiveModifiers(getToday()).map((m) => m.modifiers);
  if (stageData?.levelModifiers) {
    levelModifiers.push(stageData.levelModifiers);
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorScreen
          levelNr={locked.levelNr}
          stageNr={lockedStage}
          onBack={() => {
            clearThemeOverride();
            onComplete(false);
          }}
        />
      }
    >
      <Suspense
        fallback={
          <div className="flex h-full animate-fadeIn flex-col items-center justify-center text-2xl font-bold text-light-wood opacity-0 [animation-delay:1s]">
            <Loading />
            <p>Loading...</p>
          </div>
        }
      >
        <Level
          key={`${locked.levelNr}-${lockedStage}`}
          level={level}
          title={locked.title}
          storageKey={`${storagePrefix}levelState${locked.levelNr}${lockedStage !== 0 ? `-${lockedStage}` : ""}`}
          storagePrefix={storagePrefix}
          levelNr={levelNr}
          currentStageNr={lockedStage}
          maxStages={maxStages}
          useStreak={useStreak}
          showTutorial={showTutorial}
          levelSettings={stageSettings}
          modifiers={levelModifiers}
          levelType={
            storagePrefix === "" ? (storedLevelType ?? levelType) : levelType
          }
          onComplete={async (won) => {
            clearThemeOverride();
            if (lockedStage >= maxStages - 1 && won) {
              deleteLevelType();
              deleteGameValue(
                `${storagePrefix}initialLevelState${levelNr}${lockedStage !== 0 ? `-${lockedStage}` : ""}`
              );
              deleteStage(false);
              onComplete(true);
            }
            if (lockedStage < maxStages - 1 && won) {
              await deleteGameValue(
                `${storagePrefix}initialLevelState${levelNr}${lockedStage !== 0 ? `-${lockedStage}` : ""}`
              );
              setLockedStage((stage) => stage + 1);
              setStage((stage) => stage + 1);
            }
            if (!won) {
              onComplete(false);
            }
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
