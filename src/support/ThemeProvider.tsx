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
    end: { month: 1, day: 8 },
    theme: "winter",
  },
];

const inRange = (date: Date, begin: ScheduleDate, end: ScheduleDate) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const afterStart =
    begin.month < month || (begin.month === month && begin.day <= day);

  const beforeEnd =
    end.month > month || (end.month === month && end.day >= day);

  return afterStart && beforeEnd;
};

const EOY: ScheduleDate = { month: 12, day: 31 };
const BOY: ScheduleDate = { month: 1, day: 1 };

export const getActiveTheme = (date: Date) => {
  const activeSchedule = themeSchedule.find((schedule) => {
    if (schedule.begin.month > schedule.end.month) {
      // Schedule spans over the year, split it into two ranges
      return (
        inRange(date, schedule.begin, EOY) || inRange(date, BOY, schedule.end)
      );
    }
    return inRange(date, schedule.begin, schedule.end);
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
