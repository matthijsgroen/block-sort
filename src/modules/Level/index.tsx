import { Suspense, useMemo } from "react";

import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";

import { Level } from "./Level";
import { Settings } from "./Settings";

type Props = {
  seed: number;
  onComplete: (won: boolean) => void;
  levelSettings: LevelSettings;
};

export const LevelLoader: React.FC<Props> = ({
  seed,
  onComplete,
  levelSettings,
}) => {
  const level = useMemo(() => {
    const random = mulberry32(seed);
    console.log("generating level");
    return generatePlayableLevel(levelSettings, random);
  }, [seed, JSON.stringify(levelSettings)]);
  console.log("render", seed, JSON.stringify(levelSettings));

  return (
    <Suspense
      fallback={
        <div>
          <p>Loading...</p>
          <label>Seed:</label>
          <output>{seed}</output>
          <Settings levelSettings={levelSettings} />
        </div>
      }
    >
      <Level
        level={level}
        levelSettings={levelSettings}
        onComplete={onComplete}
      />
    </Suspense>
  );
};
