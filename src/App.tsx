import { useEffect, useState } from "react";

import { useGameStorage } from "@/support/useGameStorage";

import { NormalMode } from "./modules/GameModi/NormalMode";
import { ZenMode } from "./modules/GameModi/ZenMode";
import { Help } from "./modules/Help";
import { InstallPrompt } from "./modules/InstallPrompt";
import { BackgroundProvider } from "./modules/Layout/BackgroundContext";
import { BetaProvider } from "./modules/Layout/BetaContext";
import { ErrorBoundary } from "./modules/Layout/ErrorBoundary";
import { ThemeProvider } from "./modules/Layout/ThemeContext";
import { ScheduledActions } from "./modules/ScheduledActions";
import { Settings } from "./modules/Settings";
import { AppCrashScreen } from "./AppCrashScreen";
import { sound, Stream } from "./audio";
import PWABadge from "./PWABadge";

export const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installPromptOpen, setInstallPromptOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useGameStorage("soundEnabled", true);
  const [musicEnabled, setMusicEnabled] = useGameStorage("musicEnabled", true);
  const [themesEnabled, setThemesEnabled] = useGameStorage(
    "themesEnabled",
    true
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
    <ErrorBoundary fallback={<AppCrashScreen />}>
      <BetaProvider>
        <ThemeProvider
          themesEnabled={themesEnabled}
          musicEnabled={musicEnabled}
        >
          <BackgroundProvider>
            <NormalMode
              active={!inZenMode}
              showInstallButton={!isInstalled && canInstall}
              onInstall={() => setInstallPromptOpen(true)}
              onManual={() => setManualOpen(true)}
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
              <InstallPrompt
                onClose={() => setInstallPromptOpen(false)}
                onOpenManual={() => {
                  setInstallPromptOpen(false);
                  setManualOpen(true);
                }}
              />
            )}
            {manualOpen && <Help onClose={() => setManualOpen(false)} />}
            <ScheduledActions />
            <PWABadge />
          </BackgroundProvider>
        </ThemeProvider>
      </BetaProvider>
    </ErrorBoundary>
  );
};
