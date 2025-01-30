import { FC, PropsWithChildren } from "react";
import clsx from "clsx";

import { levelTypeBorder, levelTypeTextColor } from "@/game/level-types";

import styles from "./LevelNode.module.css";

type LevelNodeProps = PropsWithChildren<{
  levelNr: number;
  className?: string;
  completed?: boolean;
  isCurrent?: boolean;
}>;

export const LevelNode: FC<LevelNodeProps> = ({
  levelNr,
  className,
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
          !completed ? levelTypeTextColor(levelNr) : undefined,
          styles.textShadow
        )}
      >
        {levelNr + 1}&nbsp;
      </span>
      <span
        className={clsx(
          "inline-block size-block rounded-md border bg-black/30 text-center align-top",
          isCurrent && "relative",
          levelTypeBorder(levelNr)
        )}
      >
        {children}
      </span>
    </div>
  );
};
