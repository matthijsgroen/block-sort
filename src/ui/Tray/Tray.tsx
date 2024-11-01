import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./Tray.module.css";

export type Props = {
  locked?: boolean | null;
  onLock?: VoidFunction;
};

export const Tray: React.FC<Props> = ({ locked, onLock }) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (locked) {
      const clear = setTimeout(() => {
        setIsLocked(locked);
        onLock?.();
      }, 10);
      return () => clearTimeout(clear);
    } else {
      setIsLocked(false);
    }
  }, [locked]);

  return (
    <div
      style={{
        "--cube-color": "#a07353"
      }}
      className={clsx(
        `relative -mb-2 -mt-top-block h-8 w-block rounded-md text-center outline outline-1 outline-black/10`,
        {
          "animate-trayLocked": isLocked,
          "translate-y-3": !isLocked
        }
      )}
    >
      {!locked && <div className={styles.shadow}></div>}
      <div
        className={clsx(
          styles.layer,
          "rounded-md border border-black/10 bg-block"
        )}
      ></div>
      <div className={clsx(styles.layer, "z-10 pt-7")}>
        <span className={clsx("block", styles.shape)}></span>
      </div>
      <div className={clsx(styles.layer, styles.gradient)}></div>
      <div
        className={clsx(
          "absolute h-full w-full rounded-md",
          styles.gradientLocked,
          { ["opacity-100"]: isLocked, ["opacity-0"]: !isLocked }
        )}
      ></div>
    </div>
  );
};
