import { type Dispatch, lazy, Suspense } from "react";

import { Checkbox } from "@/ui/Checkbox";

import { getActiveTheme, themeSchedule } from "@/game/themes";
import { getToday } from "@/support/schedule";
import { useGameStorage } from "@/support/useGameStorage";

import styles from "./TextStyling.module.css";

const ThemeInfo = lazy(() => import("./ThemeInfo"));

const Themes = ({
  themesEnabled,
  onThemesChange
}: {
  themesEnabled: boolean;
  onThemesChange?: Dispatch<boolean>;
}) => {
  const today = getToday();
  const displayTheme = getActiveTheme(today);
  const [disableGhostHand, setDisableGhostHand] = useGameStorage(
    "disableGhostHand",
    false
  );

  const theme = themeSchedule.find((t) => t.theme === displayTheme);
  return (
    <div className="flex max-h-[60vh] flex-1 flex-col gap-3 overflow-y-scroll overscroll-y-contain">
      <Checkbox
        value={themesEnabled}
        onChange={(value) => onThemesChange?.(value)}
        label="Seasonal Themes"
        description="Automatically switch to themed content when available"
      />
      <p className="text-md font-semibold">Themed content contains:</p>
      <ul className="list-inside list-disc pl-2 text-sm">
        <li>New colors and symbols on blocks</li>
        <li>New background music</li>
        <li>New backgrounds and particle effects</li>
      </ul>
      <p className="text-sm">
        During these themes new gameplay elements will also be active, like new
        level types and mechanics.
      </p>
      {theme?.theme === "halloween" && (
        <>
          <h3 className="text-md font-semibold">{theme?.name} settings</h3>
          <Checkbox
            value={!disableGhostHand}
            onChange={(value) => setDisableGhostHand?.(!value)}
            label="Ghost Hand"
            description="Allow a ghost hand to show you your previous choice"
          />
        </>
      )}
      {theme && (
        <div className={styles.textStyling}>
          <Suspense fallback={<p>Loading...</p>}>
            <ThemeInfo />
          </Suspense>
        </div>
      )}
    </div>
  );
};
export default Themes;
