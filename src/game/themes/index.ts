import { BlockColor } from "../types";

import { colorMap, shapeMap } from "./default";
import {
  colorMap as colorMapHalloween,
  shapeMap as shapeMapHalloween,
} from "./halloween";
import {
  colorMap as colorMapWinter,
  shapeMap as shapeMapWinter,
} from "./winter";

export type BlockTheme = "default" | "halloween" | "winter";

export const getShapeMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return shapeMapHalloween;
  }
  if (theme === "winter") {
    return shapeMapWinter;
  }
  return shapeMap;
};

export const getColorMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return colorMapHalloween;
  }
  if (theme === "winter") {
    return colorMapWinter;
  }
  return colorMap;
};
