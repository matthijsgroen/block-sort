import { shapeMapping } from "../game/blocks";
import { BlockColor } from "../game/types";

export type Props = {
  revealed?: boolean;
  color: BlockColor;
  selected?: boolean | null;
};

const colorMap: Record<BlockColor, string> = {
  red: "bg-block-red",
  white: "bg-block-white",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  black: "bg-slate-800",
  green: "bg-green-500",
  darkgreen: "bg-green-200",
  aqua: "bg-blue-100",
  brown: "bg-block-brown",
  pink: "bg-pink-800",
};

export const Block: React.FC<Props> = ({
  revealed,
  color,
  selected = null,
}) => (
  <div
    className={`w-8 h-8 text-center pt-1  ${
      revealed === false ? "bg-slate-500" : colorMap[color]
    } rounded-md border ${
      selected
        ? "border-white outline outline-white -translate-y-3 ease-in-out transition-transform animate-wobble"
        : "border-black"
    }`}
  >
    {revealed === false ? "?" : shapeMapping[color]}
  </div>
);
