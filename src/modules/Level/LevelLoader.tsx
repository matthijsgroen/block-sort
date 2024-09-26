import { Suspense, useMemo, useState } from "react";

import { LevelSettings } from "@/game/level-creation/generateRandomLevel";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { LevelState } from "@/game/types";
import { mulberry32 } from "@/support/random";
import { getGameValue, setGameValue } from "@/support/useGameStorage";
import { Loading } from "@/ui/Loading/Loading";

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
  const [locked] = useState({ levelNr, levelSettings, seed });

  const level = useMemo(async () => {
    const random = mulberry32(locked.seed);
    const existingState = await getGameValue<LevelState>(
      `initialLevelState${locked.levelNr}`
    );
    if (existingState !== null) {
      return existingState;
    }

    const level = await generatePlayableLevel(locked.levelSettings, random);
    await setGameValue(`initialLevelState${locked.levelNr}`, level);

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
        levelNr={levelNr}
        levelSettings={levelSettings}
        onComplete={onComplete}
      />
    </Suspense>
  );
};
