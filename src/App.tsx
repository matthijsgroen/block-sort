import { useEffect, useState } from "react";

import { useGameStorage } from "@/support/useGameStorage.ts";

import { NormalMode } from "./modules/GameModi/NormalMode.tsx";
import { ZenMode } from "./modules/GameModi/ZenMode.tsx";
import { InstallPrompt } from "./modules/InstallPrompt/index.tsx";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext.tsx";
import { BetaProvider } from "./modules/Layout/BetaContext.tsx";
import { ThemeProvider } from "./modules/Layout/ThemeContext.tsx";
import { Settings } from "./modules/Settings/index.tsx";
import { sound, Stream } from "./audio.ts";
import PWABadge from "./PWABadge.tsx";

export const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installPromptOpen, setInstallPromptOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);
  const [themesEnabled, setThemesEnabled] = useGameStorage(
    "themesEnabled",
    true,
  );

  const [inZenMode, setInZenMode] = useGameStorage("inZenMode", false);

  const canInstall: boolean = "standalone" in window.navigator;
  const isInstalled: boolean =
    "standalone" in window.navigator &&
    (window.navigator["standalone"] as boolean);

  useEffect(() => {
    sound.setStreamEnabled(Stream.effects, soundEnabled);
  }, [soundEnabled]);

  return (
    <BetaProvider>
      <ThemeProvider themesEnabled={themesEnabled} musicEnabled={musicEnabled}>
        <BackgroundProvider>
          <NormalMode
            active={!inZenMode}
            showInstallButton={!isInstalled && canInstall}
            onInstall={() => setInstallPromptOpen(true)}
            onOpenSettings={() => setSettingsOpen((settings) => !settings)}
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
                setMusicEnabled(musicEnabled);
              }}
              onThemesChange={setThemesEnabled}
              onClose={() => setSettingsOpen(false)}
            />
          )}
          {installPromptOpen && (
            <InstallPrompt onClose={() => setInstallPromptOpen(false)} />
          )}
          <PWABadge />
        </BackgroundProvider>
      </ThemeProvider>
    </BetaProvider>
  );
};
