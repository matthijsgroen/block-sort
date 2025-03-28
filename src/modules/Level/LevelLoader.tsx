import { Suspense, useMemo, useState } from "react";

import { Loading } from "@/ui/Loading/Loading";

import { replayMoves } from "@/game/actions";
import { colorHustle } from "@/game/level-creation/colorHustle";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { solvers } from "@/game/level-creation/solvers";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import type { LevelTypeString } from "@/game/level-types";
import { hasWon } from "@/game/state";
import type { LevelSettings, LevelState } from "@/game/types";
import { settingsHash } from "@/support/hash";
import { generateNewSeed, mulberry32 } from "@/support/random";
import {
  deleteGameValue,
  getGameValue,
  getLevelStateValue,
  setGameValue,
  useGameStorage
} from "@/support/useGameStorage";

import { ErrorBoundary } from "../Layout/ErrorBoundary";

import { ErrorScreen } from "./ErrorScreen";
import { Level } from "./Level";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings;
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
  levelNr: number
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
    seeds.length > 0 ? seeds[levelNr % seeds.length]?.[0] : undefined;
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
  levelType: LevelTypeString
): Promise<LevelState> => {
  const level = await generateLevelContent(
    seed,
    `${storagePrefix}initialLevelState${levelNr}`,
    levelSettings,
    levelNr
  );

  // Verify level content
  const levelState = replayMoves(level, level.moves);
  const won = hasWon(levelState);
  if (!won) {
    const newSeed = generateNewSeed(seed, 2);
    // Level content is botched, retry
    await deleteGameValue(`${storagePrefix}initialLevelState${levelNr}`);
    const level = await generateLevelContent(
      newSeed,
      `${storagePrefix}initialLevelState${levelNr}`,
      levelSettings,
      levelNr
    );
    return level;
  }
  if (!(await getGameValue(`${storagePrefix}levelType`))) {
    await setGameValue(`${storagePrefix}levelType`, levelType);
  }

  return level;
};

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

  const [storedLevelType, , deleteLevelType] = useGameStorage(
    `${storagePrefix}levelType`,
    null
  );
  const levelSettingsString = JSON.stringify(levelSettings);

  const level = useMemo(() => {
    return createLevel(
      locked.seed,
      locked.levelNr,
      locked.levelSettings,
      storagePrefix,
      levelType
    );
  }, [locked.seed, levelSettingsString]);

  return (
    <ErrorBoundary
      fallback={
        <ErrorScreen
          levelNr={locked.levelNr}
          onBack={() => {
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
          level={level}
          title={locked.title}
          storageKey={`${storagePrefix}levelState${locked.levelNr}`}
          storagePrefix={storagePrefix}
          levelNr={levelNr}
          useStreak={useStreak}
          showTutorial={showTutorial}
          levelSettings={levelSettings}
          levelType={
            storagePrefix === "" ? (storedLevelType ?? levelType) : levelType
          }
          onComplete={(won) => {
            if (won) {
              deleteLevelType();
              deleteGameValue(
                `${storagePrefix}initialLevelState${locked.levelNr}`
              );
            }
            onComplete(won);
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
