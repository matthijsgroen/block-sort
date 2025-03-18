import { lazy } from "react";

import type { RangedItem } from "@/support/schedule";
import { filterInRange } from "@/support/schedule";

export type ActionSchedule = RangedItem & {
  name: string;
  actionKey: (date: Date) => string;
  Render: React.FC<{ onComplete: VoidFunction }>;
};

const AprilFoolsAction = lazy(() => import("./AprilFools"));

const actions: ActionSchedule[] = [
  {
    name: "April Fools",
    begin: { month: 4, day: 1 },
    end: { month: 4, day: 1 },
    actionKey: (date: Date) => `april-fools-${date.getFullYear()}`,
    Render: ({ onComplete }) => <AprilFoolsAction onClose={onComplete} />
  }
];

export const getActiveActions = (
  date: Date,
  handledActions: string[] = []
): ActionSchedule[] => {
  const activeActions = filterInRange(date, actions).filter((action) => {
    const key = action.actionKey(date);
    return !handledActions.includes(key);
  });
  return activeActions;
};
