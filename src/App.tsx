import { useEffect, useState } from "react";

import {
  getEasySettings,
  getHardSettings,
  getNormalSettings,
  getSpecialSettings,
} from "@/game/level-settings/levelSettings.ts";
import { LevelLoader } from "@/modules/Level/index.tsx";
import { LevelTrack } from "@/modules/LevelTrack/index.tsx";
import { generateNewSeed, mulberry32 } from "@/support/random.ts";
import { useGameStorage } from "@/support/useGameStorage.ts";

import { LevelSettings } from "./game/level-creation/generateRandomLevel.ts";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext.tsx";
import { Settings } from "./modules/Settings/index.tsx";
import { getLevelType, LevelType } from "./support/getLevelType.ts";
import { sound } from "./audio.ts";
import PWABadge from "./PWABadge.tsx";

const BASE_SEED = 12345678901234;

export const App: React.FC = () => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 151);

  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);

  useEffect(() => {
    sound.setStreamEnabled("music", musicEnabled);
    if (musicEnabled) {
      sound.play("music");
    } else {
      sound.stop("music");
    }
    sound.setStreamEnabled("effects", soundEnabled);
  }, [soundEnabled, musicEnabled]);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const random = mulberry32(levelSeed);

  const settingProducers: Record<LevelType, (nr: number) => LevelSettings> = {
    easy: (nr: number) => getEasySettings(nr, random),
    hard: getHardSettings,
    normal: getNormalSettings,
    special: (nr: number) => getSpecialSettings(nr, random),
  };

  const settings = settingProducers[getLevelType(levelNr)](levelNr);

  return (
    <BackgroundProvider>
      {!inLevel && (
        <LevelTrack
          levelNr={levelNr}
          onLevelStart={() => {
            sound.play("music");
            setInLevel(true);
          }}
          onOpenSettings={() => {
            setSettingsOpen(true);
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
      {settingsOpen && (
        <Settings
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onSoundChange={(v) => setSoundEnabled(v)}
          onMusicChange={(v) => setMusicEnabled(v)}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <PWABadge />
    </BackgroundProvider>
  );
};
