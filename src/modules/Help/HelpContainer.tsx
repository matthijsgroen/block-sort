import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

import { DialogTitle } from "@/ui/Dialog/DialogTitle";

import styles from "../Settings/TextStyling.module.css";

export const HelpContainer: FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ title, children }) => (
  <>
    <DialogTitle>{title}</DialogTitle>
    <div
      className={clsx(
        styles.textStyling,
        "max-h-[calc(100vh-200px)] overflow-y-auto overscroll-y-contain"
      )}
    >
      {children}
    </div>
  </>
);
