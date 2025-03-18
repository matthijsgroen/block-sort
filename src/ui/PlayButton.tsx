import clsx from "clsx";

import type { LevelType } from "@/game/level-types/types";

import styles from "./PlayButton.module.css";

type Props = {
  label: string;
  disabled?: boolean;
  highlight?: boolean;
  type: LevelType<string>;
  onClick: VoidFunction;
};

export const PlayButton: React.FC<Props> = ({
  label,
  onClick,
  type,
  highlight,
  disabled
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      "inline-block h-12 w-[10rem] rounded-3xl pt-3 font-bold",
      {
        "opacity-50": disabled,
        "shadow-lg transition-transform active:scale-90": !disabled,
        "animate-pulseEase": highlight
      },
      type.buttonBackgroundClassName
    )}
  >
    <span
      className={`block ${type.symbol === undefined ? "-translate-y-1" : ""}`}
    >
      {label}
    </span>
    {type.symbol !== undefined && (
      <span
        className={clsx(
          "inline-block rounded-md px-2 py-1 text-xs lowercase shadow",
          type.buttonBackgroundClassName,
          styles.background
        )}
      >
        {type.symbol} {type.name}
      </span>
    )}
  </button>
);
