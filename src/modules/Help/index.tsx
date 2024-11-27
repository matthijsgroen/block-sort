import { useState } from "react";

import { Dialog } from "@/ui/Dialog/Dialog";

import { ReactComponent as Christmas } from "@/../docs/christmas.md";
import { ReactComponent as Halloween } from "@/../docs/halloween.md";
import { ReactComponent as HowToPlay } from "@/../docs/how-to-play.md";
import { ReactComponent as LevelTypes } from "@/../docs/level-types.md";
import { ReactComponent as Motivation } from "@/../docs/making-of.md";
import { ReactComponent as ZenMode } from "@/../docs/zen-mode.md";
import { getActiveTheme } from "@/game/themes";
import { getToday } from "@/support/schedule";

import { HelpSection } from "./HelpSection";
import { MainHelp } from "./MainHelp";

export type Sections =
  | "how-to-play"
  | "level-types"
  | "zen-mode"
  | "motivation"
  | "halloween"
  | "christmas"
  | "spring"
  | "summer";

type Props = {
  onClose?: VoidFunction;
  onOpenManual?: VoidFunction;
};

export const Help: React.FC<Props> = ({ onClose }) => {
  const activeTheme = getActiveTheme(getToday());

  const [section, setSection] = useState<Sections | null>(null);
  return (
    <Dialog
      wide={false}
      onClose={() => {
        onClose?.();
      }}
    >
      {section === null && (
        <MainHelp<Sections>
          setSection={setSection}
          buttons={[
            { label: "How to play", section: "how-to-play" },
            { label: "Level types", section: "level-types" },
            { label: "Zen mode", section: "zen-mode" },
            { label: "Motivation", section: "motivation" },
            {
              label: "Halloween theme",
              section: "halloween",
              disabled: activeTheme !== "halloween"
            },
            {
              label: "Christmas theme",
              section: "christmas",
              disabled: activeTheme !== "winter"
            }
          ]}
        />
      )}
      {section === "how-to-play" && (
        <HelpSection onBack={() => setSection(null)} title="How to play">
          <HowToPlay />
        </HelpSection>
      )}
      {section === "level-types" && (
        <HelpSection onBack={() => setSection(null)} title="Level types">
          <LevelTypes />
        </HelpSection>
      )}
      {section === "zen-mode" && (
        <HelpSection onBack={() => setSection(null)} title="Zen mode">
          <ZenMode />
        </HelpSection>
      )}
      {section === "motivation" && (
        <HelpSection onBack={() => setSection(null)} title="Motivation">
          <Motivation />
        </HelpSection>
      )}
      {section === "halloween" && (
        <HelpSection
          onBack={() => setSection(null)}
          title="Halloween / Fall theme"
        >
          <Halloween />
        </HelpSection>
      )}
      {section === "christmas" && (
        <HelpSection
          onBack={() => setSection(null)}
          title="Christmas / Winter theme"
        >
          <Christmas />
        </HelpSection>
      )}
    </Dialog>
  );
};
