import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";

import { Block } from "../Block/Block";

import { AnimationPath } from "./useBlockAnimation";

type Props = {
  theme: BlockTheme;
  path: AnimationPath;
  duration?: number;
};

export const BlockAnimation: React.FC<Props> = ({
  theme,
  path,
  duration = 400
}) => (
  <div
    style={{
      top: path.startY,
      left: path.startX,
      offsetPath: `path('${path.path}')`,
      offsetRotate: "0deg",
      "--animation-duration": `${duration}ms`
    }}
    className={`animate-blockMove pointer-events-none absolute will-change-[offset-distance]`}
  >
    <Block
      color={getColorMapping(theme)[path.color]}
      shape={getShapeMapping(theme)[path.color]}
      moved
      shadow={false}
    />
  </div>
);
