import { Suspense, useMemo, useState } from "react";

import { Loading } from "@/ui/Loading/Loading";
import { TopButton } from "@/ui/TopButton/TopButton";

import { levelSeeds } from "@/data/levelSeeds";
import { moveBlocks } from "@/game/actions";
import { colorHustle } from "@/game/level-creation/colorHustle";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { hasWon } from "@/game/state";
import { LevelSettings, LevelState } from "@/game/types";
import { LevelType } from "@/support/getLevelType";
import { hash } from "@/support/hash";
import { generateNewSeed, mulberry32 } from "@/support/random";
import {
  deleteGameValue,
  getGameValue,
  setGameValue,
} from "@/support/useGameStorage";

import { ErrorBoundary } from "./ErrorBoundary";
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
  levelSettings: LevelSettings,
  levelNr: number
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
      levelNr
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
        locked.levelSettings,
        levelNr
      );
      return level;
    }

    return level;
  }, [locked.seed, JSON.stringify(locked.levelSettings)]);

  return (
    <ErrorBoundary
      fallback={
        <div className="h-full flex flex-col text-light-wood font-bold text-2xl">
          <div className="flex flex-row pt-2 pl-safeLeft pr-safeRight gap-x-2 items-center">
            <TopButton
              buttonType="back"
              onClick={() => {
                onComplete(false);
              }}
            />
          </div>
          <div className="flex flex-col flex-1 items-center justify-center">
            <div className="text-4xl">😢</div>
            <p className="max-w-[300px] text-center">
              uh oh... failed to generate level {locked.levelNr + 1},
              <br />
              please e-mail me on{" "}
              <a
                href={`mailto:matthijsgroen@gmail.com?subject=[BlockSort]-Failed-to-generate-level-${locked.levelNr + 1}`}
                className="underline"
              >
                matthijs.groen@gmail.com
              </a>{" "}
              to notify me
            </p>
          </div>
        </div>
      }
    >
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
    </ErrorBoundary>
  );
};
