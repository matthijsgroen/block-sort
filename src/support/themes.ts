import { BlockTheme } from "@/game/themes";

type ScheduleDate = { month: number; day: number };
export type ThemeSchedule = {
  begin: ScheduleDate;
  end: ScheduleDate;
  name: string;
  theme: BlockTheme;
};

export const themeSchedule: ThemeSchedule[] = [
  {
    begin: { month: 10, day: 1 },
    end: { month: 11, day: 8 },
    name: "Fall/Halloween",
    theme: "halloween",
  },
  {
    begin: { month: 12, day: 1 },
    end: { month: 1, day: 8 },
    name: "Winter/Christmas",
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

/**
 * Get the current date.
 *
 * The app uses this function to determine the active theme.
 * Dates can be overridden for testing purposes.
 *
 * @returns the current date
 */
export const getToday = (): Date =>
  process.env.NODE_ENV === "production" ? new Date() : new Date(2024, 11, 10);
