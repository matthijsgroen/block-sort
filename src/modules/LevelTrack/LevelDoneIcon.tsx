import type { FC } from "react";
import clsx from "clsx/lite";

import styles from "./LevelDoneIcon.module.css";

type LevelDoneIconProps = {
  fadeIn?: boolean;
};

export const LevelDoneIcon: FC<LevelDoneIconProps> = ({ fadeIn = false }) => (
  <span
    className={clsx(
      "bg-green-500 bg-clip-text text-transparent",
      fadeIn &&
        "animate-fadeIn opacity-0 [animation-delay:1s] [animation-duration:2s]",
      styles.doneGlow
    )}
  >
    ✔
  </span>
);
