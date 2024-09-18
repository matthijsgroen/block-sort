import { useEffect, useState } from "react";
import clsx from "clsx";

import { sound } from "@/audio";

import { shapeMapping } from "../../game/blocks";
import { BlockColor } from "../../game/types";

import styles from "./Block.module.css";

export type Props = {
  moved: boolean;
  revealed?: boolean;
  color: BlockColor;
  selected?: boolean | null;
  locked?: boolean | null;
  shape?: string;
  shadow?: boolean;
};

export const colorMap: Record<BlockColor, string> = {
  red: "#dd0000",
  white: "#eeeeee",
  yellow: "#eab308",
  blue: "#3b82f6",
  purple: "#d80dbd",
  black: "#29374e",
  green: "#16a34a",
  darkgreen: "#15803d",
  darkblue: "#1e40af",
  aqua: "#bfdbfe",
  brown: "#a07353",
  pink: "#fdba74",
};

export const Block: React.FC<Props> = ({
  revealed,
  color,
  shape,
  moved,
  selected = null,
  locked = false,
  shadow = true,
}) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (locked) {
      const clear = setTimeout(() => {
        setIsLocked(locked);
        sound.playLock();
      }, 10);
      return () => clearTimeout(clear);
    } else {
      setIsLocked(false);
    }
  }, [locked]);

  const displayShape = shape ?? (revealed ? shapeMapping[color] : "❓");

  useEffect(() => {
    if (moved && !selected && !isLocked) {
      sound.playPlace();
    }
  }, []);

  return (
    <div
      style={{
        "--cube-color": revealed ? colorMap[color] : "#64748b",
        "--cube-shape": `'${displayShape}'`,
      }}
      className={clsx(
        "relative h-height-block w-block text-center -mt-top-block",
        {
          [styles.selected]: selected && !isLocked,
          "animate-locked": !selected && isLocked,
          "animate-place": !selected && !isLocked,
          "[animation-duration:0ms]": !moved,
        }
      )}
    >
      {shadow && <div className={styles.shadow}></div>}
      <div
        className={clsx(
          styles.layer,
          "bg-block rounded-md border border-black/80 ",
          { [styles.selectedOutline]: selected }
        )}
      ></div>
      <div className={clsx(styles.layer, "z-10 pt-7")}>
        <span className={clsx("block", styles.shape)}></span>
      </div>
      {revealed && <div className={clsx(styles.layer, styles.texture)}></div>}
      <div
        className={clsx(styles.layer, {
          [styles.gradient]: revealed,
          [styles.hidden]: !revealed,
        })}
      ></div>
      <div
        className={clsx(
          "absolute w-full h-full rounded-md",
          styles.gradientLocked,
          { ["opacity-100"]: isLocked, ["opacity-0"]: !isLocked }
        )}
      ></div>
    </div>
  );
};
