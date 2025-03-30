import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./LevelNode.module.css";

type LevelNodeProps = PropsWithChildren<{
  levelNr: number | string;
  className?: string;
  textColor?: string;
  borderColor?: string;
  completed?: boolean;
  isCurrent?: boolean;
}>;

export const LevelNode: FC<LevelNodeProps> = ({
  levelNr,
  className,
  textColor,
  borderColor,
  completed = false,
  isCurrent = false,
  children
}) => {
  return (
    <div
      className={clsx(
        className,
        "mx-auto whitespace-nowrap align-middle leading-10"
      )}
    >
      <span
        className={clsx(
          {
            "text-green-600": completed,
            "font-bold": isCurrent
          },
          !completed ? textColor : undefined,
          styles.textShadow
        )}
      >
        {levelNr}&nbsp;
      </span>
      <span
        className={clsx(
          "inline-block size-block rounded-md border bg-black/30 text-center align-top",
          isCurrent && "relative",
          borderColor
        )}
      >
        {children}
      </span>
    </div>
  );
};
