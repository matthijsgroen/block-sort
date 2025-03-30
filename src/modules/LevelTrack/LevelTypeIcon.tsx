import React from "react";
import clsx from "clsx";

import type { LevelType } from "@/game/level-types/types";

import styles from "./LevelTypeIcon.module.css";

type Props = {
  fadeOut?: boolean;
  levelType: LevelType<string>;
};

export const LevelTypeIcon: React.FC<Props> = ({ fadeOut, levelType }) => {
  if (levelType.symbol === undefined) {
    return null;
  }

  return (
    <span
      style={levelType.color ? { "--color": levelType.color } : undefined}
      className={clsx({
        [styles.colorEmoji]: levelType.color !== undefined,
        ["animate-fadeOut"]: fadeOut
      })}
    >
      {levelType.symbol}
    </span>
  );
};
