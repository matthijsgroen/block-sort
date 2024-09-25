import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./Loading.module.css";

const cube = "size-7 border border-black rounded-md";

export const Loading: React.FC = () => {
  const [colors, setColors] = useState([
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
  ]);

  useEffect(() => {
    const clear = setInterval(() => {
      setColors((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2000);
    return () => clearInterval(clear);
  }, []);

  return (
    <div className={clsx("flex-row flex", styles.slide)} key={colors[0]}>
      <div className={clsx(styles.topRight, styles.degrees180)}>
        <div className={clsx(styles.topLeft, styles.degrees90)}>
          <div className={clsx(styles.bottomLeft, styles.degrees180end)}>
            <div className={clsx(cube, colors[0])}></div>
          </div>
        </div>
      </div>
      <div className={clsx(cube, colors[1])} key={colors[1]}></div>
      <div className={clsx(cube, colors[2])} key={colors[2]}></div>
    </div>
  );
};
