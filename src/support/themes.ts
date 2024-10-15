import { levelModifiers } from "@/game/level-types/types";
import { BlockTheme } from "@/game/themes";

type ScheduleDate = { month: number; day: number };

export type RangedItem = {
  begin: ScheduleDate;
  end: ScheduleDate;
};

export type ThemeSchedule = RangedItem & {
  name: string;
  theme: BlockTheme;
  levelModifiers?: (RangedItem & {
    modifiers: levelModifiers;
  })[];
};

export const themeSchedule: ThemeSchedule[] = [
  {
    begin: { month: 10, day: 1 },
    end: { month: 11, day: 8 },
    name: "Fall/Halloween",
    theme: "halloween",
    levelModifiers: [
      {
        modifiers: { ghostMode: true },
        begin: { month: 10, day: 15 },
        end: { month: 11, day: 2 },
      },
    ],
  },
  {
    begin: { month: 12, day: 1 },
    end: { month: 1, day: 8 },
    name: "Winter/Christmas",
    theme: "winter",
    levelModifiers: [
      {
        modifiers: { packageMode: true },
        begin: { month: 12, day: 14 },
        end: { month: 1, day: 1 },
      },
    ],
  },
  {
    begin: { month: 3, day: 15 },
    end: { month: 4, day: 20 },
    name: "Spring",
    theme: "spring",
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

const filterInRange = <TItem extends RangedItem>(
  date: Date,
  items: TItem[],
): TItem[] =>
  items.filter((schedule) => {
    if (schedule.begin.month > schedule.end.month) {
      // Schedule spans over the year, split it into two ranges
      return (
        inRange(date, schedule.begin, EOY) || inRange(date, BOY, schedule.end)
      );
    }
    return inRange(date, schedule.begin, schedule.end);
  });

const EOY: ScheduleDate = { month: 12, day: 31 };
const BOY: ScheduleDate = { month: 1, day: 1 };

export const getActiveTheme = (date: Date) => {
  const activeSchedule = filterInRange(date, themeSchedule)[0];
  return activeSchedule?.theme ?? "default";
};

export const getActiveModifiers = (date: Date) =>
  filterInRange(date, themeSchedule).flatMap((theme) =>
    theme.levelModifiers ? filterInRange(date, theme.levelModifiers) : [],
  );

/**
 * Get the current date.
 *
 * The app uses this function to determine the active theme.
 * Dates can be overridden for testing purposes.
 *
 * @returns the current date
 */
export const getToday = (): Date =>
  process.env.NODE_ENV === "production" ? new Date() : new Date();
