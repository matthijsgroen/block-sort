import { Dispatch } from "react";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import { ReactComponent as HelpText } from "@/../docs/help.md";

import { HelpContainer } from "./HelpContainer";

export const MainHelp = <T extends string>({
  buttons,
  setSection
}: {
  setSection: Dispatch<T>;
  buttons: { label: string; section: T; disabled?: boolean }[];
}) => (
  <HelpContainer title="Game Manual">
    <HelpText />
    <div className="my-4 flex flex-col gap-4">
      {buttons
        .filter((b) => !b.disabled)
        .map(({ label, section }) => (
          <TransparentButton key={section} onClick={() => setSection(section)}>
            {label}
          </TransparentButton>
        ))}
    </div>
    <p>
      <strong>Thank you for playing!</strong>
    </p>
    <p>
      If you like the game, don&apos;t forget to share it with friends &amp;
      family!
    </p>
  </HelpContainer>
);
