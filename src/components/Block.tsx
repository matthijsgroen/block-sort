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

const colorMap: Record<BlockColor, string> = {
  red: "bg-block-red",
  white: "bg-block-white",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  black: "bg-slate-800",
  green: "bg-green-600",
  darkgreen: "bg-green-200",
  aqua: "bg-blue-100",
  brown: "bg-block-brown",
  pink: "bg-orange-200",
};

export const Block: React.FC<Props> = ({
  revealed,
  color,
  moved,
  selected = null,
  locked = false,
}) => (
  <div
    className={`relative size-10 text-center animate-place ${
      moved ? "" : "[animation-duration:0ms]"
    } ${
      revealed === false ? "bg-slate-500" : colorMap[color]
    } rounded-md border border-block-brown/80
    ${
      selected
        ? "outline-2 outline-white outline -translate-y-6 ease-in-out transition-transform animate-wobble"
        : ""
    }`}
  >
    <div className={`absolute z-10 size-10 pt-2 rounded-md`}>
      <span className={`inline-block ${styles.shape}`}>
        {revealed === false ? "?" : shapeMapping[color]}
      </span>
    </div>
    <div className={`absolute size-10 rounded-md ${styles.texture}`}></div>
    <div className={`absolute size-10 rounded-md ${styles.gradient}`}></div>
    <div
      className={`absolute size-10 -top-[2px] -left-[2px] ${
        styles.gradientLocked
      } ${locked ? "opacity-100" : "opacity-0"}`}
    ></div>
  </div>
);
