import { PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./WoodButton.module.css";

type Props = {
  onClick?: VoidFunction;
};
export const WoodButton: React.FC<PropsWithChildren<Props>> = ({
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-block border h-block border-black rounded-3xl min-w-block px-2",
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
          "inline-block min-w-block px-2 h-block rounded-3xl"
        )}
      >
        {children}
      </span>
    </button>
  );
};
