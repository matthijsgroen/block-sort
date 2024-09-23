import { Suspense, useMemo } from "react";

import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";

import { Level } from "./Level";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings;
  levelNr: number;
};

export const LevelLoader: React.FC<Props> = ({
  seed,
  onComplete,
  levelSettings,
  levelNr,
}) => {
  const level = useMemo(async () => {
    const random = mulberry32(seed);
    return generatePlayableLevel(levelSettings, random);
  }, [seed, JSON.stringify(levelSettings)]);

  return (
    <Suspense
      fallback={
        <div className="h-full flex flex-col justify-center items-center text-light-wood font-bold text-2xl opacity-0 animate-fadeIn [animation-delay:1s]">
          <p>Loading...</p>
        </div>
      }
    >
      <Level
        level={level}
        levelNr={levelNr}
        levelSettings={levelSettings}
        onComplete={onComplete}
      />
    </Suspense>
  );
};
