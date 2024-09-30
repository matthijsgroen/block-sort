import { useEffect, useState } from "react";

import {
  getEasySettings,
  getHardSettings,
  getNormalSettings,
  getScrambledSettings,
  getSpecialSettings,
} from "@/game/level-settings/levelSettings.ts";
import { LevelLoader } from "@/modules/Level/LevelLoader.tsx";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack.tsx";
import { generateNewSeed, mulberry32 } from "@/support/random.ts";
import { useGameStorage } from "@/support/useGameStorage.ts";

import { LevelSettings } from "./game/level-creation/generateRandomLevel.ts";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext.tsx";
import { Settings } from "./modules/Settings/index.tsx";
import { ZenSelection } from "./modules/ZenSelection/ZenSelection.tsx";
import { getLevelType, LevelType } from "./support/getLevelType.ts";
import { Transition } from "./ui/Transition/Transition.tsx";
import { sound } from "./audio.ts";
import { ZEN_MODE } from "./featureFlags.ts";
import PWABadge from "./PWABadge.tsx";

const BASE_SEED = 12345678901234;
const SCREEN_TRANSITION = 500; // ms

export const App: React.FC = () => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 280);

  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);
  const [inZenMode, setInZenMode] = useGameStorage("inZenMode", false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);

  useEffect(() => {
    sound.setStreamEnabled("effects", soundEnabled);
    sound.setStreamEnabled("music", musicEnabled);
    if (musicEnabled) {
      sound.play("music");
    } else {
      sound.stop("music");
    }
  }, [soundEnabled, musicEnabled]);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const random = mulberry32(levelSeed);

  const settingProducers: Record<LevelType, (nr: number) => LevelSettings> = {
    easy: (nr: number) => getEasySettings(nr, random),
    hard: (nr: number) => getHardSettings(nr, random),
    normal: (nr: number) => getNormalSettings(nr, random),
    special: (nr: number) => getSpecialSettings(nr, random),
    scrambled: (nr: number) => getScrambledSettings(nr),
  };

  const settings = settingProducers[getLevelType(levelNr)](levelNr);

  return (
    <BackgroundProvider>
      <Transition
        className={"h-full"}
        active={!inLevel && !inZenMode}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <LevelTrack
          levelNr={levelNr}
          hasZenMode={levelNr >= 49 && ZEN_MODE}
          onLevelStart={() => {
            // tie playback to user interaction
            sound.play("music");
            setInLevel(true);
          }}
          onOpenSettings={() => {
            setSettingsOpen(true);
          }}
          onZenModeStart={() => {
            setInZenMode(true);
          }}
        />
      </Transition>
      <Transition
        className={"h-full"}
        active={inLevel && !inZenMode}
        startDelay={
          SCREEN_TRANSITION /* wait for level track to be unmounted */
        }
        duration={SCREEN_TRANSITION}
      >
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
          title={`Level ${levelNr + 1}`}
        />
      </Transition>
      <Transition
        className={"h-full"}
        active={!inLevel && inZenMode}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <ZenSelection
          levelNr={levelNr}
          onLevelStart={() => {
            // tie playback to user interaction
            sound.play("music");
            setInLevel(true);
          }}
          onOpenSettings={() => {
            setSettingsOpen(true);
          }}
          onZenModeEnd={() => {
            setInZenMode(false);
          }}
        />
      </Transition>
      {settingsOpen && (
        <Settings
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onSoundChange={(effectsEnabled) => {
            sound.setStreamEnabled("effects", effectsEnabled);
            setSoundEnabled(effectsEnabled);
          }}
          onMusicChange={(musicEnabled) => {
            sound.setStreamEnabled("music", musicEnabled);
            if (musicEnabled) {
              // tie playback to user interaction
              sound.play("music");
            } else {
              sound.stop("music");
            }
            setMusicEnabled(musicEnabled);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <PWABadge />
    </BackgroundProvider>
  );
};
