import { useEffect, useState } from "react";
import { LevelTrack } from "./modules/LevelTrack/index.tsx";
import PWABadge from "./PWABadge.tsx";
import { Level } from "./modules/Level/index.tsx";
import { generateNewSeed, mulberry32 } from "./support/random.ts";
import {
  getHardSettings,
  getNormalSettings,
  getSpecialSettings,
} from "./game/levelSettings.ts";
import { isHard, isSpecial } from "./modules/LevelTrack/levelType.ts";

const BASE_SEED = 12345678901234;

export const App: React.FC = () => {
  const [levelNr, setLevelNr] = useState(0);

  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );

  const [inLevel, setInLevel] = useState(false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const special = isSpecial(levelNr);
  const hard = isHard(levelNr);
  const random = mulberry32(levelSeed);

  const settings = hard
    ? getHardSettings(levelNr)
    : special
    ? getSpecialSettings(levelNr)
    : getNormalSettings(random, levelNr);

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
        <Level
          onComplete={(won) => {
            setInLevel(false);
            if (won) {
              setLevelNr((nr) => nr + 1);
            }
          }}
          seed={levelSeed}
          {...settings}
        />
      )}
      <PWABadge />
    </>
  );
};
