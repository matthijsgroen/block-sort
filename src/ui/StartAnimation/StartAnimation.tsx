import type { FC } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./StartAnimation.module.css";

type Props = {
  message: string;
  color: string;
  shape?: string;
  shapeColor?: string;
  delay?: number;
  afterShow?: VoidFunction;
  onShow?: VoidFunction;
};

export const StartAnimation: FC<Props> = ({
  message = "Special",
  color = "#ff00ff",
  shape = "⭐️",
  shapeColor,
  delay = 0,
  onShow,
  afterShow
}) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setStarted(true);
      onShow?.();
    }, delay);
    return () => clearTimeout(timeOut);
  }, [delay]);

  useEffect(() => {
    if (started) {
      const timeOut = setTimeout(() => {
        afterShow?.();
      }, 2000);
      return () => clearTimeout(timeOut);
    }
  }, [started]);

  return started ? (
    <div
      className={"absolute z-50 h-full w-full"}
      style={{ "--color": color, "--shapeColor": shapeColor ?? color }}
    >
      <div
        className={clsx(
          "pointer-events-none absolute left-0 top-0 h-full w-full animate-intro-bg",
          styles.background
        )}
      ></div>
      <div
        className={clsx(
          "absolute left-1/2 top-0 animate-center-tr text-2xl/[4.5rem]",
          shapeColor ? styles.recolor : styles.glow
        )}
      >
        {shape}
      </div>
      <div
        className={clsx(
          "absolute left-1/2 top-0 animate-center-br text-2xl/[4.5rem]",
          shapeColor ? styles.recolor : styles.glow
        )}
      >
        {shape}
      </div>
      <div
        className={clsx(
          "absolute left-1/2 top-0 animate-center-bl text-2xl/[4.5rem]",
          shapeColor ? styles.recolor : styles.glow
        )}
      >
        {shape}
      </div>
      <div
        className={clsx(
          "absolute left-1/2 top-0 animate-center-tl text-2xl/[4.5rem]",
          shapeColor ? styles.recolor : styles.glow
        )}
      >
        {shape}
      </div>
      <div
        className={clsx(
          "animate-bg-shift",
          "absolute top-[47dvh] w-full text-center font-block-sort text-4xl tracking-widest",
          styles.levelTitle
        )}
      >
        {message}
      </div>
    </div>
  ) : null;
};
