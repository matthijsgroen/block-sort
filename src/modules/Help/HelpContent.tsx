import { useState } from "react";

import Christmas from "@/docs/christmas.md";
import Halloween from "@/docs/halloween.md";
import HowToPlay from "@/docs/how-to-play.mdx";
import RefreshInstallation from "@/docs/how-to-refresh-installation.md";
import RefreshInstallationAndroid from "@/docs/how-to-refresh-installation-android.md";
import RefreshInstallationIOS from "@/docs/how-to-refresh-installation-ios.md";
import LevelTypes from "@/docs/level-types.mdx";
import Motivation from "@/docs/making-of.md";
import Spring from "@/docs/spring.mdx";
import Summer from "@/docs/summer.md";
import ZenMode from "@/docs/zen-mode.md";
import { getActiveTheme } from "@/game/themes";
import { getToday } from "@/support/schedule";

import { HelpSection } from "./HelpSection";
import { MainHelp } from "./MainHelp";
import { SectionButtons } from "./SectionButtons";

export type Sections =
  | "how-to-play"
  | "level-types"
  | "zen-mode"
  | "motivation"
  | "refresh-installation"
  | "refresh-installation-ios"
  | "refresh-installation-android"
  | "halloween"
  | "christmas"
  | "spring"
  | "summer";

type Props = {
  onClose?: VoidFunction;
  onOpenManual?: VoidFunction;
};

const HelpContent: React.FC<Props> = () => {
  const activeTheme = getActiveTheme(getToday());

  const [section, setSection] = useState<Sections | null>(null);
  if (section === null) {
    return (
      <MainHelp<Sections>
        setSection={setSection}
        buttons={[
          { label: "How to play", section: "how-to-play" },
          { label: "Level types", section: "level-types" },
          { label: "Zen mode", section: "zen-mode" },
          {
            label: "Refresh installation",
            section: "refresh-installation"
          },
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
          },
          {
            label: "Spring theme",
            section: "spring",
            disabled: activeTheme !== "spring"
          },
          {
            label: "Summer theme",
            section: "summer",
            disabled: activeTheme !== "summer"
          }
        ]}
      />
    );
  }
  if (section === "how-to-play") {
    return (
      <HelpSection onBack={() => setSection(null)} title="How to play">
        <HowToPlay />
      </HelpSection>
    );
  }
  if (section === "level-types") {
    return (
      <HelpSection onBack={() => setSection(null)} title="Level types">
        <LevelTypes />
      </HelpSection>
    );
  }
  if (section === "zen-mode") {
    return (
      <HelpSection onBack={() => setSection(null)} title="Zen mode">
        <ZenMode />
      </HelpSection>
    );
  }
  if (section === "motivation") {
    return (
      <HelpSection onBack={() => setSection(null)} title="Motivation">
        <Motivation />
      </HelpSection>
    );
  }
  if (section === "refresh-installation") {
    return (
      <HelpSection onBack={() => setSection(null)} title="Refresh installation">
        <RefreshInstallation />
        <SectionButtons<Sections>
          buttons={[
            { label: "iOS", section: "refresh-installation-ios" },
            { label: "Android", section: "refresh-installation-android" }
          ]}
          setSection={setSection}
        />
      </HelpSection>
    );
  }
  if (section === "refresh-installation-ios") {
    return (
      <HelpSection
        onBack={() => setSection("refresh-installation")}
        title="Refresh installation"
      >
        <RefreshInstallationIOS />
      </HelpSection>
    );
  }
  if (section === "refresh-installation-android") {
    return (
      <HelpSection
        onBack={() => setSection("refresh-installation")}
        title="Refresh installation"
      >
        <RefreshInstallationAndroid />
      </HelpSection>
    );
  }
  if (section === "halloween") {
    return (
      <HelpSection
        onBack={() => setSection(null)}
        title="Halloween / Fall theme"
      >
        <Halloween />
      </HelpSection>
    );
  }
  if (section === "christmas") {
    return (
      <HelpSection
        onBack={() => setSection(null)}
        title="Christmas / Winter theme"
      >
        <Christmas />
      </HelpSection>
    );
  }
  if (section === "spring") {
    return (
      <HelpSection
        onBack={() => setSection(null)}
        title="Easter / Spring theme"
      >
        <Spring />
      </HelpSection>
    );
  }
  if (section === "summer") {
    return (
      <HelpSection onBack={() => setSection(null)} title="Summer theme">
        <Summer />
      </HelpSection>
    );
  }
  return null;
};

export default HelpContent;
