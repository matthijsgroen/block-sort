import type { FC, PropsWithChildren } from "react";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import { HelpContainer } from "./HelpContainer";

export const HelpSection: FC<
  PropsWithChildren<{ onBack: VoidFunction; title: string }>
> = ({ onBack, title, children }) => (
  <HelpContainer title={title}>
    <div className="mb-2 flex flex-col pb-2">
      <TransparentButton onClick={onBack} icon="arrow_back">
        Back
      </TransparentButton>
    </div>
    <div className="max-h-[60vh] flex-1 overflow-y-auto overscroll-y-contain p-4 text-base">
      {children}
    </div>
  </HelpContainer>
);
