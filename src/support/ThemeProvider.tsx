import { createContext, PropsWithChildren } from "react";

import { THEMES } from "@/featureFlags";
import { BlockTheme } from "@/game/themes";

import { getActiveTheme, getToday } from "./themes";

export const ThemeContext = createContext<{ activeTheme: BlockTheme }>({
  activeTheme: "default",
});

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themesEnabled: boolean }>
> = ({ children, themesEnabled }) => {
  const theme =
    themesEnabled && THEMES ? getActiveTheme(getToday()) : "default";

  return <ThemeContext value={{ activeTheme: theme }}>{children}</ThemeContext>;
};
