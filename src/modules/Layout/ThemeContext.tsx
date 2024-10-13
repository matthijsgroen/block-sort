import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import { sound, Stream } from "@/audio";
import { THEMES } from "@/featureFlags";
import { BlockTheme } from "@/game/themes";
import { getThemeSong } from "@/support/themeMusic";

import { getActiveTheme, getToday } from "../../support/themes";

export const ThemeContext = createContext<{
  activeTheme: BlockTheme;
  setThemeOverride: Dispatch<BlockTheme>;
  clearThemeOverride: VoidFunction;
}>({
  activeTheme: "default",
  setThemeOverride: () => {},
  clearThemeOverride: () => {},
});

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themesEnabled: boolean; musicEnabled: boolean }>
> = ({ children, themesEnabled, musicEnabled }) => {
  const [themeOverride, setThemeOverride] = useState<BlockTheme | undefined>();
  const theme =
    themeOverride ??
    (themesEnabled && THEMES ? getActiveTheme(getToday()) : "default");
  const song = getThemeSong(theme);

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
        clearThemeOverride: () => setThemeOverride(undefined),
      }}
    >
      {children}
    </ThemeContext>
  );
};
