import { keys, locks } from "./level-creation/lock-n-key";
import { shapeMap } from "./themes/default";
import type { BlockColor, BlockType } from "./blocks";
import type { LevelState } from "./types";

const isColor = (color: BlockType): color is BlockColor => color in shapeMap;

const singleWidth: BlockType[] = ["lightyellow", "dinosaur-key", "dragon-key"];

const shape = (blockType: BlockType) => {
  const char = isColor(blockType)
    ? shapeMap[blockType]
    : [...locks, ...keys].find((lk) => lk.name === blockType)?.symbol;

  if (singleWidth.includes(blockType)) {
    return `${char} `;
  }
  return char;
};

export const debugLevel = (level: LevelState) => {
  // top of columns
  let lineStr = "";
  for (const col of level.columns) {
    if (col.type === "placement") {
      lineStr += "┌──┐ ";
    }
    if (col.type === "buffer") {
      lineStr += "     ";
    }
    if (col.type === "inventory") {
      lineStr += ".--. ";
    }
  }
  console.log(lineStr);
  const maxHeight = level.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );

  for (let i = 0; i < maxHeight + 2; i++) {
    lineStr = "";
    for (const col of level.columns) {
      if (i < col.columnSize) {
        const block = col.blocks[col.blocks.length - col.columnSize + i];

        if (block === undefined) {
          if (i < col.columnSize - 1) {
            lineStr += "│﹍│ ";
          } else {
            lineStr += "│  │ ";
          }
        } else {
          if (block.revealed === false) {
            lineStr += `│﹖│ `;
          } else {
            lineStr += `│${shape(block.blockType)}│ `;
          }
        }
      }

      if (i === col.columnSize) {
        if (col.type === "placement") {
          lineStr += "╘══╛ ";
        } else {
          lineStr += "└──┘ ";
        }
      }
      if (i === col.columnSize + 1 && col.limitColor) {
        lineStr +=
          col.limitColor === "rainbow"
            ? ` 🌈  `
            : ` ${shape(col.limitColor)}  `;
      } else if (i > col.columnSize) {
        lineStr += "     ";
      }
    }
    console.log(lineStr);
  }
};
