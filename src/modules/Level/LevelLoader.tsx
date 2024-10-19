import { Suspense, useMemo, useState } from "react";

import { Loading } from "@/ui/Loading/Loading";

import { levelSeeds } from "@/data/levelSeeds";
import { replayMoves } from "@/game/actions";
import { colorHustle } from "@/game/level-creation/colorHustle";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { LevelTypeString } from "@/game/level-types";
import { hasWon } from "@/game/state";
import { LevelSettings, LevelState } from "@/game/types";
import { hash } from "@/support/hash";
import { generateNewSeed, mulberry32 } from "@/support/random";
import {
  deleteGameValue,
  getGameValue,
  setGameValue,
} from "@/support/useGameStorage";

import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorScreen } from "./ErrorScreen";
import { Level } from "./Level";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings;
  levelNr: number;
  title: string;
  levelType: LevelTypeString;
  storagePrefix?: string;
};

const generateLevelContent = async (
  seed: number,
  storageKey: string,
  levelSettings: LevelSettings,
  levelNr: number,
): Promise<LevelState> => {
  const random = mulberry32(seed);
  const existingState = await getGameValue<LevelState>(storageKey);
  if (existingState !== null) {
    return existingState;
  }

  const hashVersion = { ...levelSettings };
  delete hashVersion["playMoves"];

  const settingsHash = hash(JSON.stringify(hashVersion)).toString();

  const seeds = levelSeeds[settingsHash] ?? [];
  const preSeed = seeds.length > 0 ? seeds[levelNr % seeds.length] : undefined;

  let level = await generatePlayableLevel(levelSettings, random, preSeed);
  if (preSeed !== undefined && level.generationInformation?.seed === preSeed) {
    level = colorHustle(level, random);
  }

  await setGameValue(storageKey, level);

  return level;
};

export const LevelLoader: React.FC<Props> = ({
  seed,
  onComplete,
  levelSettings,
  levelNr,
  title,
  levelType,
  storagePrefix = "",
}) => {
  const [locked] = useState({ levelNr, levelSettings, seed, title });

  const level = useMemo(async () => {
    const level = await generateLevelContent(
      locked.seed,
      `${storagePrefix}initialLevelState${locked.levelNr}`,
      locked.levelSettings,
      levelNr,
    );
    // Verify level content
    const levelState = replayMoves(level, level.moves);
    const won = hasWon(levelState);
    if (!won) {
      const newSeed = generateNewSeed(locked.seed, 2);
      // Level content is botched, retry
      await deleteGameValue(
        `${storagePrefix}initialLevelState${locked.levelNr}`,
      );
      const level = await generateLevelContent(
        newSeed,
        `${storagePrefix}initialLevelState${locked.levelNr}`,
        locked.levelSettings,
        levelNr,
      );
      return level;
    }

    return level;
  }, [locked.seed, JSON.stringify(locked.levelSettings)]);

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
          levelSettings={levelSettings}
          levelType={levelType}
          onComplete={(won) => {
            if (won) {
              deleteGameValue(
                `${storagePrefix}initialLevelState${locked.levelNr}`,
              );
            }
            onComplete(won);
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
