import { Suspense, useMemo, useState } from "react";

import { Loading } from "@/ui/Loading/Loading";

import { moveBlocks } from "@/game/actions";
import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { hasWon } from "@/game/state";
import { LevelState } from "@/game/types";
import { LevelType } from "@/support/getLevelType";
import { generateNewSeed, mulberry32 } from "@/support/random";
import {
  deleteGameValue,
  getGameValue,
  setGameValue,
} from "@/support/useGameStorage";

import { Level } from "./Level";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings;
  levelNr: number;
  title: string;
  levelType: LevelType;
  storagePrefix?: string;
};

const generateLevelContent = async (
  seed: number,
  storageKey: string,
  levelSettings: LevelSettings
): Promise<LevelState> => {
  const random = mulberry32(seed);
  const existingState = await getGameValue<LevelState>(storageKey);
  if (existingState !== null) {
    return existingState;
  }

  const level = await generatePlayableLevel(levelSettings, random);
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
      locked.levelSettings
    );
    // Verify level content
    let levelState = level;
    for (const move of level.moves) {
      levelState = moveBlocks(levelState, move.from, move.to);
    }
    const won = hasWon(levelState);
    if (!won) {
      const newSeed = generateNewSeed(locked.seed, 2);
      // Level content is botched, retry
      await deleteGameValue(
        `${storagePrefix}initialLevelState${locked.levelNr}`
      );
      const level = await generateLevelContent(
        newSeed,
        `${storagePrefix}initialLevelState${locked.levelNr}`,
        locked.levelSettings
      );
      return level;
    }

    return level;
  }, [locked.seed, JSON.stringify(locked.levelSettings)]);

  return (
    <Suspense
      fallback={
        <div className="h-full flex flex-col justify-center items-center text-light-wood font-bold text-2xl opacity-0 animate-fadeIn [animation-delay:1s]">
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
              `${storagePrefix}initialLevelState${locked.levelNr}`
            );
          }
          onComplete(won);
        }}
      />
    </Suspense>
  );
};
