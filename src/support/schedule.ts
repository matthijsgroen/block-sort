import { dateForDevelopment } from "./developmentSettings";

export type ScheduleDate = { month: number; day: number };

export type RangedItem = {
  begin: ScheduleDate;
  end: ScheduleDate;
};

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

export const filterInRange = <TItem extends RangedItem>(
  date: Date,
  items: TItem[]
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

/**
 * Get the current date.
 *
 * The app uses this function to determine the active theme.
 * Dates can be overridden for testing purposes.
 *
 * @returns the current date
 */
export const getToday = (): Date =>
  process.env.NODE_ENV === "production" ? new Date() : dateForDevelopment;
