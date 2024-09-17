import { shapeMapping } from "../game/blocks";
import { BlockColor } from "../game/types";

import styles from "./Block.module.css";

export type Props = {
  moved: boolean;
  revealed?: boolean;
  color: BlockColor;
  selected?: boolean | null;
  locked?: boolean | null;
};

export const colorMap: Record<BlockColor, string> = {
  red: "#dd0000",
  white: "#eeeeee",
  yellow: "#eab308",
  blue: "#3b82f6",
  purple: "#a855f7",
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
  moved,
  selected = null,
  locked = false,
}) => (
  <div
    style={{
      "--cube-color": revealed ? colorMap[color] : "#64748b",
      "--cube-shape": `'${revealed ? shapeMapping[color] : "❓"}'`,
    }}
    className={`relative h-height-block w-block text-center ${selected ? styles.selected : locked ? "animate-locked" : "animate-place"} -mt-top-block ${
      moved ? "" : "[animation-duration:0ms]"
    } bg-block rounded-md border border-black/80`}
  >
    <div className={`${styles.layer} z-10 pt-7`}>
      <span className={`block ${styles.shape}`}></span>
    </div>
    {revealed && <div className={`${styles.layer} ${styles.texture}`}></div>}
    <div
      className={`${styles.layer} ${revealed ? styles.gradient : styles.hidden}`}
    ></div>
    <div
      className={`absolute w-block h-height-block transition-opacity -top-[2px] -left-[2px] ${
        styles.gradientLocked
      } ${locked ? "opacity-100" : "opacity-0"}`}
    ></div>
  </div>
);
