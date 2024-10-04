import { createContext, PropsWithChildren } from "react";

import { THEMES } from "@/featureFlags";
import { BlockTheme } from "@/game/themes";

export const ThemeContext = createContext<{ activeTheme: BlockTheme }>({
  activeTheme: "default",
});

type ScheduleDate = { month: number; day: number };
type ThemeSchedule = {
  begin: ScheduleDate;
  end: ScheduleDate;
  theme: BlockTheme;
};

const themeSchedule: ThemeSchedule[] = [
  {
    begin: { month: 10, day: 1 },
    end: { month: 11, day: 7 },
    theme: "halloween",
  },
  {
    begin: { month: 12, day: 10 },
    end: { month: 1, day: 7 },
    theme: "winter",
  },
];

export const getActiveTheme = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const activeSchedule = themeSchedule.find((schedule) => {
    const afterStart =
      schedule.begin.month < month ||
      (schedule.begin.month === month && schedule.begin.day <= day);

    const beforeEnd =
      schedule.end.month > month ||
      (schedule.end.month === month && schedule.end.day >= day);
    return afterStart && beforeEnd;
  });

  return activeSchedule?.theme ?? "default";
};

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
