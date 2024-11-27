import { FC, PropsWithChildren } from "react";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import { HelpContainer } from "./HelpContainer";

export const HelpSection: FC<
  PropsWithChildren<{ onBack: VoidFunction; title: string }>
> = ({ onBack, title, children }) => (
  <HelpContainer title={title}>
    <div className="mb-4 flex flex-col">
      <TransparentButton onClick={onBack} icon="arrow_back">
        Back
      </TransparentButton>
    </div>
    {children}
  </HelpContainer>
);
