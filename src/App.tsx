import { useEffect, useState } from "react";

import { useGameStorage } from "@/support/useGameStorage.ts";

import { NormalMode } from "./modules/GameModi/NormalMode.tsx";
import { ZenMode } from "./modules/GameModi/ZenMode.tsx";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext.tsx";
import { Settings } from "./modules/Settings/index.tsx";
import { sound } from "./audio.ts";
import PWABadge from "./PWABadge.tsx";

export const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);

  const [inZenMode, setInZenMode] = useGameStorage("inZenMode", false);

  useEffect(() => {
    sound.setStreamEnabled("effects", soundEnabled);
    sound.setStreamEnabled("music", musicEnabled);
    if (musicEnabled) {
      sound.play("music");
    } else {
      sound.stop("music");
    }
  }, [soundEnabled, musicEnabled]);

  return (
    <BackgroundProvider>
      <NormalMode
        active={!inZenMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onZenModeStart={() => setInZenMode(true)}
      />
      <ZenMode
        active={inZenMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onZenModeEnd={() => setInZenMode(false)}
      />
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
