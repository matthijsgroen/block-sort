import { BlockColor } from "../types";

import { colorMap, shapeMap } from "./default";
import { colorMap as colorMapFall, shapeMap as shapeMapFall } from "./fall";
import {
  colorMap as colorMapSpring,
  shapeMap as shapeMapSpring,
} from "./spring";
import {
  colorMap as colorMapWinter,
  shapeMap as shapeMapWinter,
} from "./winter";

export type BlockTheme = "default" | "halloween" | "winter" | "spring";

export const getShapeMapping = (
  theme: BlockTheme,
): Record<BlockColor, string> => {
  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: shapeMap,
    halloween: shapeMapFall,
    winter: shapeMapWinter,
    spring: shapeMapSpring,
  };
  return mapping[theme];
};

export const getColorMapping = (
  theme: BlockTheme,
): Record<BlockColor, string> => {
  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: colorMap,
    halloween: colorMapFall,
    winter: colorMapWinter,
    spring: colorMapSpring,
  };
  return mapping[theme];
};
