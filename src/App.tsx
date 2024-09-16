import { useEffect, useState } from "react";

import {
  getHardSettings,
  getNormalSettings,
  getSpecialSettings,
  isHard,
  isSpecial,
} from "@/game/levelSettings.ts";
import { LevelLoader } from "@/modules/Level/index.tsx";
import { LevelTrack } from "@/modules/LevelTrack/index.tsx";
import { generateNewSeed, mulberry32 } from "@/support/random.ts";
import { useGameStorage } from "@/support/useGameStorage.ts";

import PWABadge from "./PWABadge.tsx";

const BASE_SEED = 12345678901234;

export const App: React.FC = () => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 0);

  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const special = isSpecial(levelNr);
  const hard = !special && isHard(levelNr);
  const random = mulberry32(levelSeed);

  const settings = hard
    ? getHardSettings(levelNr, random)
    : special
      ? getSpecialSettings(levelNr)
      : getNormalSettings(levelNr, random);

  return (
    <>
      {!inLevel && (
        <LevelTrack
          levelNr={levelNr}
          onLevelStart={() => {
            setInLevel(true);
          }}
        />
      )}
      {inLevel && (
        <LevelLoader
          onComplete={(won) => {
            setInLevel(false);
            if (won) {
              setLevelNr((nr) => nr + 1);
            }
          }}
          seed={levelSeed}
          levelSettings={settings}
        />
      )}
      <PWABadge />
    </>
  );
};
