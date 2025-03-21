import type { Dispatch } from "react";

import HelpText from "@/docs/help.md";

import { HelpContainer } from "./HelpContainer";
import { SectionButtons } from "./SectionButtons";

export const MainHelp = <T extends string>({
  buttons,
  setSection
}: {
  setSection: Dispatch<T>;
  buttons: { label: string; section: T; disabled?: boolean }[];
}) => (
  <HelpContainer title="Game Manual">
    <HelpText />
    <SectionButtons buttons={buttons} setSection={setSection} />
    <p>
      <strong>Thank you for playing!</strong>
    </p>
    <p>
      If you like the game, don&apos;t forget to share it with friends &amp;
      family!
    </p>
  </HelpContainer>
);
