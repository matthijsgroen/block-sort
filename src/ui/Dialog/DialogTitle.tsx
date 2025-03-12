import type { PropsWithChildren } from "react";
import clsx from "clsx";

export const DialogTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <h1 className={clsx("mb-2 font-block-sort font-bold tracking-widest")}>
    {children}
  </h1>
);
