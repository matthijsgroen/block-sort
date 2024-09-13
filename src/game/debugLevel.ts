import process from "node:process";

import { shapeMapping } from "./blocks";
import { LevelState } from "./types";

export const print = (text: string) => process.stdout.write(`${text}\n`);

export const debugLevel = (level: LevelState) => {
  // top of columns
  for (const col of level.columns) {
    if (col.type === "placement") {
      process.stdout.write("┌──┐ ");
    }
    if (col.type === "buffer") {
      process.stdout.write("     ");
    }
  }
  process.stdout.write("\n");
  const maxHeight = level.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );

  for (let i = 0; i < maxHeight + 2; i++) {
    for (const col of level.columns) {
      if (i < col.columnSize) {
        const block = col.blocks[col.blocks.length - col.columnSize + i];

        if (block === undefined) {
          if (i < col.columnSize - 1) {
            process.stdout.write("│﹍│ ");
          } else {
            process.stdout.write("│  │ ");
          }
        } else {
          if (block.revealed === false) {
            process.stdout.write(`│﹖│ `);
          } else {
            process.stdout.write(`│${shapeMapping[block.color]}│ `);
          }
        }
      }

      if (i === col.columnSize) {
        if (col.type === "placement") {
          process.stdout.write("╘══╛ ");
        } else {
          process.stdout.write("└──┘ ");
        }
      }
      if (i === col.columnSize + 1 && col.limitColor) {
        process.stdout.write(` ${shapeMapping[col.limitColor]}  `);
      } else if (i > col.columnSize) {
        process.stdout.write("     ");
      }
    }
    process.stdout.write("\n");
  }
};
