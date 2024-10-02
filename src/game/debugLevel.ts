import { shapeMap } from "./themes/default";
import { LevelState } from "./types";

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
            lineStr += `│${shapeMap[block.color]}│ `;
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
        lineStr += ` ${shapeMap[col.limitColor]}  `;
      } else if (i > col.columnSize) {
        lineStr += "     ";
      }
    }
    console.log(lineStr);
  }
};
