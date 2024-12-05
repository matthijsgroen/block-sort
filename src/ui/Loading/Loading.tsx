import { useEffect, useRef } from "react";
import clsx from "clsx";

import styles from "./Loading.module.css";

const cube = "size-7 border border-black rounded-md";

const blue = "#3b82f6";
const red = "#ef4444";
const green = "#22c55e";

export const Loading: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const elem = ref.current;
      let colors = [blue, green, red];
      elem.addEventListener("animationiteration", () => {
        colors = [colors[1], colors[2], colors[0]];
        elem.style.setProperty("--blue", colors[0]);
        elem.style.setProperty("--green", colors[1]);
        elem.style.setProperty("--red", colors[2]);
      });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("flex flex-row", styles.slide)}
      style={{
        "--blue": blue,
        "--red": red,
        "--green": green
      }}
    >
      <div className={clsx(styles.topRight, styles.degrees180)}>
        <div className={clsx(styles.topLeft, styles.degrees90)}>
          <div className={clsx(styles.bottomLeft, styles.degrees180end)}>
            <div className={clsx(cube, "bg-[--blue]")}></div>
          </div>
        </div>
      </div>
      <div className={clsx(cube, "bg-[--green]")}></div>
      <div className={clsx(cube, "bg-[--red]")}></div>
    </div>
  );
};
