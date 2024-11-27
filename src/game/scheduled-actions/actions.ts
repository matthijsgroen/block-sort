import { filterInRange, RangedItem } from "@/support/schedule";
import { getGameValue } from "@/support/useGameStorage";

export type ActionSchedule = RangedItem & {
  name: string;
  actionKey: (date: Date) => string;
  action: () => void;
};

const actions = [
  {
    name: "April Fools",
    begin: { month: 4, day: 1 },
    end: { month: 4, day: 1 },
    actionKey: (date: Date) => `april-fools-${date.getFullYear()}`,
    action: () => {
      console.log("April Fools!");
    }
  }
];

export const getActiveActions = async (
  date: Date
): Promise<ActionSchedule[]> => {
  const handledActions =
    (await getGameValue<string[]>("handled-actions")) ?? [];
  const activeActions = filterInRange(date, actions).filter((action) => {
    const key = action.actionKey(date);
    return !handledActions.includes(key);
  });
  return activeActions;
};
