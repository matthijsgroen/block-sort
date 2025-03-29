import type { Dispatch } from "react";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

export const SectionButtons = <T extends string>({
  buttons,
  setSection
}: {
  setSection: Dispatch<T>;
  buttons: { label: string; section: T; disabled?: boolean }[];
}) => (
  <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {buttons
      .filter((b) => !b.disabled)
      .map(({ label, section }) => (
        <TransparentButton key={section} onClick={() => setSection(section)}>
          {label}
        </TransparentButton>
      ))}
  </div>
);
