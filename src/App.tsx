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
import { generateNewSeed } from "@/support/random.ts";
import { useGameStorage } from "@/support/useGameStorage.ts";

import { sound } from "./audio.ts";
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

  const settings = hard
    ? getHardSettings(levelNr)
    : special
      ? getSpecialSettings(levelNr)
      : getNormalSettings(levelNr);

  return (
    <>
      {!inLevel && (
        <LevelTrack
          levelNr={levelNr}
          onLevelStart={() => {
            sound.playMusic();
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
          levelNr={levelNr}
          seed={levelSeed}
          levelSettings={settings}
        />
      )}
      <PWABadge />
    </>
  );
};
