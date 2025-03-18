import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

import { sound, Stream } from "@/audio";
import { THEMES } from "@/featureFlags";
import { type BlockTheme, getActiveTheme } from "@/game/themes";
import { getToday } from "@/support/schedule";
import { getThemeSong } from "@/support/themeMusic";

export const ThemeContext = createContext<{
  activeTheme: BlockTheme;
  setThemeOverride: Dispatch<BlockTheme>;
  clearThemeOverride: VoidFunction;
}>({
  activeTheme: "default",
  setThemeOverride: () => {},
  clearThemeOverride: () => {}
});

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themesEnabled: boolean; musicEnabled: boolean }>
> = ({ children, themesEnabled, musicEnabled }) => {
  const [themeOverride, setThemeOverride] = useState<BlockTheme | undefined>();
  const theme =
    themeOverride ??
    (themesEnabled && THEMES ? getActiveTheme(getToday()) : "default");
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
        setThemeOverride,
        clearThemeOverride: () => setThemeOverride(undefined)
      }}
    >
      {children}
    </ThemeContext>
  );
};
