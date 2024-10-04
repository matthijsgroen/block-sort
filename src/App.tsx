import { useEffect, useState } from "react";

import { useGameStorage } from "@/support/useGameStorage.ts";

import { NormalMode } from "./modules/GameModi/NormalMode.tsx";
import { ZenMode } from "./modules/GameModi/ZenMode.tsx";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext.tsx";
import { Settings } from "./modules/Settings/index.tsx";
import { getThemeSong } from "./support/themeMusic.tsx";
import { getActiveTheme, ThemeProvider } from "./support/ThemeProvider.tsx";
import { sound, Stream } from "./audio.ts";
import { THEMES } from "./featureFlags.ts";
import PWABadge from "./PWABadge.tsx";

export const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);
  const [themesEnabled, setThemesEnabled] = useGameStorage(
    "themesEnabled",
    true
  );

  const [inZenMode, setInZenMode] = useGameStorage("inZenMode", false);
  const theme =
    themesEnabled && THEMES ? getActiveTheme(new Date()) : "default";
  const song = getThemeSong(theme);

  useEffect(() => {
    sound.stopAllInStream(Stream.music);
    if (musicEnabled) {
      sound.play(song);
    }
  }, [song]);

  useEffect(() => {
    sound.setStreamEnabled(Stream.effects, soundEnabled);
    sound.setStreamEnabled(Stream.music, musicEnabled);
    if (musicEnabled) {
      sound.play(song);
    } else {
      sound.stopAllInStream(Stream.music);
    }
  }, [soundEnabled, musicEnabled]);

  return (
    <ThemeProvider themesEnabled={themesEnabled}>
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
            themesEnabled={themesEnabled}
            onSoundChange={(effectsEnabled) => {
              sound.setStreamEnabled(Stream.effects, effectsEnabled);
              setSoundEnabled(effectsEnabled);
            }}
            onMusicChange={(musicEnabled) => {
              sound.setStreamEnabled(Stream.music, musicEnabled);
              if (musicEnabled) {
                // tie playback to user interaction
                sound.play(song);
              } else {
                sound.stopAllInStream(Stream.music);
              }
              setMusicEnabled(musicEnabled);
            }}
            onThemesChange={setThemesEnabled}
            onClose={() => setSettingsOpen(false)}
          />
        )}
        <PWABadge />
      </BackgroundProvider>
    </ThemeProvider>
  );
};
