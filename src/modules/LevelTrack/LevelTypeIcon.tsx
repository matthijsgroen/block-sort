import React from "react";
import clsx from "clsx";

import { getLevelType } from "@/game/level-types";
import type { BlockTheme } from "@/game/themes";

import styles from "./LevelTypeIcon.module.css";

type Props = {
  levelNr: number;
  fadeOut?: boolean;
  theme?: BlockTheme;
};

export const LevelTypeIcon: React.FC<Props> = ({
  levelNr,
  fadeOut,
  theme = "default"
}) => {
  const levelType = getLevelType(levelNr, theme);
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
