import { getToday } from "@/support/schedule";
import { useGameStorage } from "@/support/useGameStorage";

import { getActiveActions } from "./actions";

export const ScheduledActions: React.FC = () => {
  const [actionsHandled, setActionsHandled] = useGameStorage<string[]>(
    "actionsHandled",
    []
  );
  const activeActions = getActiveActions(getToday(), actionsHandled);

  return (
    <>
      {activeActions.map((action) => (
        <action.Render
          key={action.actionKey(getToday())}
          onComplete={() => {
            setActionsHandled((handledActions) => [
              ...handledActions,
              action.actionKey(getToday())
            ]);
          }}
        />
      ))}
    </>
  );
};
