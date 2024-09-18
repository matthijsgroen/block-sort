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

import { TopButton } from "./ui/TopButton/TopButton.tsx";
import { sound } from "./audio.ts";
import PWABadge from "./PWABadge.tsx";

const BASE_SEED = 12345678901234;

export const App: React.FC = () => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 0);

  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);

  useEffect(() => {
    sound.setMusicEnabled(musicEnabled);
    if (musicEnabled) {
      sound.playMusic();
    } else {
      sound.stopMusic();
    }
    sound.setSoundEnabled(soundEnabled);
  }, [soundEnabled, musicEnabled]);

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
        <div className="absolute top-1/3 left-[10%] w-4/5 bg-wood-brown mx-auto rounded-xl border border-black p-4 drop-shadow-lg">
          <p>This dialog is still Work in progress</p>
          <label className="text-lg p-2">
            <input
              type="checkbox"
              checked={soundEnabled}
              className="inline-block mr-2"
              onChange={(e) => {
                setSoundEnabled(e.target.checked);
              }}
            />
            Sound Effects
          </label>
          <label className="text-lg p-2">
            <input
              type="checkbox"
              checked={musicEnabled}
              className="inline-block mr-2"
              onChange={(e) => {
                setMusicEnabled(e.target.checked);
              }}
            />
            Music
          </label>
          <div className="text-center">
            <TopButton
              buttonType="close"
              onClick={() => {
                setSettingsOpen(false);
              }}
            />
          </div>
        </div>
      )}
      <PWABadge />
    </>
  );
};
