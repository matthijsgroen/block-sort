import { BlockColor } from "../types";

import { colorMap, shapeMapping } from "./default";
import { shapeMapping as shapeMappingHalloween } from "./halloween";

export type BlockTheme = "default" | "halloween";

export const getShapeMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return shapeMappingHalloween;
  }
  return shapeMapping;
};

export const getColorMapping = (
  theme: BlockTheme
): Record<BlockColor, string> => {
  if (theme === "halloween") {
    return colorMap;
  }
  return colorMap;
};
