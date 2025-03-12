import type { PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./WoodButton.module.css";

type Props = {
  onClick?: VoidFunction;
};
export const WoodButton: React.FC<PropsWithChildren<Props>> = ({
  onClick,
  children
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block h-block min-w-block rounded-3xl border border-black px-2 focus-visible:outline-none",
      styles.woodBackground
    )}
  >
    {children}
    <span
      className={clsx(styles.woodTexture, "inline-block h-block rounded-3xl")}
    ></span>
    <span
      className={clsx(
        styles.woodLabel,
        "inline-block h-block min-w-block rounded-3xl px-2"
      )}
    >
      {children}
    </span>
  </button>
);
