import { BlockColor } from "../types";

import { colorMap, shapeMap } from "./default";
import {
  colorMap as colorMapHalloween,
  shapeMap as shapeMapHalloween,
} from "./halloween";

export type BlockTheme = "default" | "halloween";

export const getShapeMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return shapeMapHalloween;
  }
  return shapeMap;
};

export const getColorMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return colorMapHalloween;
  }
  return colorMap;
};
