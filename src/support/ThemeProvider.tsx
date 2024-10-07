import { createContext, PropsWithChildren } from "react";

import { THEMES } from "@/featureFlags";
import { BlockTheme } from "@/game/themes";

import { getActiveTheme } from "./themes";

export const ThemeContext = createContext<{ activeTheme: BlockTheme }>({
  activeTheme: "default",
});

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themesEnabled: boolean }>
> = ({ children, themesEnabled }) => {
  const theme =
    themesEnabled && THEMES ? getActiveTheme(new Date()) : "default";

  return (
    <ThemeContext.Provider value={{ activeTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
