import { lighten } from "@/support/colors";

import { BlockColor } from "../types";

export const shapeMap: Record<BlockColor, string> = {
  white: "1",
  red: "2",
  yellow: "3",
  blue: "4",
  purple: "5",
  black: "6",
  green: "7",
  aqua: "8",
  pink: "A",
  brown: "B",
  darkgreen: "C",
  darkblue: "D",
  turquoise: "E",
  orange: "F",
  lightyellow: "G",
  gray: "H"
};

export const colorMap: Record<BlockColor, string> = {
  white: "#FFF8A5",
  red: "#FFC078",
  yellow: "#FF8A47",
  blue: "#FF4C4C",
  purple: "#9B30FF",
  black: "#305EFF",
  green: "#2BA84A",
  aqua: "#007F2A",
  darkgreen: "#15803d",
  darkblue: "#1e40af",
  brown: "#a07353",
  pink: "#fdba74",
  turquoise: "#06b6d4",
  orange: "#f97316",
  lightyellow: "#f9c74f",
  gray: "#718096"
};

const orderedKeys: BlockColor[] = Object.keys(shapeMap) as BlockColor[];

/**
 * Generate a color map based on a main color, which will be the middle shape, where the first colors
 * are lighter and the last colors are darker.
 *
 * @param mainColor a hex string for a color, e.g. #000099
 */
export const generateColorMap = (
  mainColor: string
): Record<BlockColor, string> => {
  const colorMap = Object.fromEntries(
    orderedKeys.map<[BlockColor, string]>((k) => [k, mainColor])
  ) as unknown as Record<BlockColor, string>;

  // There are 16 colors, where the middle one is the main color
  for (let i = 0; i < orderedKeys.length; i++) {
    const color = orderedKeys[i];
    const offset = i - 5;
    colorMap[color] = lighten(mainColor, Math.round(-offset * 24));
  }
  return colorMap;
};

export const generateShapeMap = (
  symbol: string
): Record<BlockColor, string> => {
  const colorMap = Object.fromEntries(
    orderedKeys.map<[BlockColor, string]>((k) => [k, symbol])
  ) as unknown as Record<BlockColor, string>;

  return colorMap;
};
