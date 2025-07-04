import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

import { sound, Stream } from "@/audio";
import { THEMES } from "@/featureFlags";
import type { Particles } from "@/game/themes";
import {
  type BlockTheme,
  getActiveParticles,
  getActiveTheme
} from "@/game/themes";
import { getToday } from "@/support/schedule";
import { getThemeSong } from "@/support/themeMusic";

export const ThemeContext = createContext<{
  activeTheme: BlockTheme;
  activeParticles?: Particles;
  setParticleOverride: Dispatch<Particles>;
  clearParticleOverride: VoidFunction;
  setThemeOverride: Dispatch<BlockTheme>;
  clearThemeOverride: VoidFunction;
}>({
  activeTheme: "default",
  activeParticles: undefined,
  setThemeOverride: () => {},
  clearThemeOverride: () => {},
  setParticleOverride: () => {},
  clearParticleOverride: () => {}
});

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themesEnabled: boolean; musicEnabled: boolean }>
> = ({ children, themesEnabled, musicEnabled }) => {
  const [themeOverride, setThemeOverride] = useState<BlockTheme | undefined>();
  const [particleOverride, setParticleOverride] = useState<
    Particles | undefined
  >();
  const theme =
    themeOverride ??
    (themesEnabled && THEMES ? getActiveTheme(getToday()) : "default");
  const particles =
    particleOverride ??
    (themesEnabled && THEMES ? getActiveParticles(getToday()) : undefined);

  const song = getThemeSong(theme);

  const [, forceRerender] = useReducer((x) => (x + 1) % 6, 0);
  useEffect(() => {
    if (!themesEnabled || !THEMES) {
      return;
    }
    const today = getToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (getActiveTheme(today) !== getActiveTheme(tomorrow)) {
      const timeUntilMidnight = tomorrow.getTime() - today.getTime();
      const timeoutId = setTimeout(() => {
        forceRerender();
      }, timeUntilMidnight);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    if (musicEnabled) {
      sound.play(song);
    }
  }, [song]);

  useEffect(() => {
    sound.setStreamEnabled(Stream.music, musicEnabled);
    if (musicEnabled) {
      sound.play(song);
    } else {
      sound.stopAllInStream(Stream.music);
    }
  }, [musicEnabled]);

  return (
    <ThemeContext
      value={{
        activeTheme: theme,
        activeParticles: particles,
        setParticleOverride,
        clearParticleOverride: () => setParticleOverride(undefined),
        setThemeOverride,
        clearThemeOverride: () => setThemeOverride(undefined)
      }}
    >
      {children}
    </ThemeContext>
  );
};
