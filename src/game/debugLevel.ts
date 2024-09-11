import { BlockColor, LevelState } from "./types";
import process from "node:process";

const colorMapping: Record<BlockColor, string> = {
  black: "🎵",
  brown: "🍄",
  darkgreen: "🟢",
  yellow: "🟡",
  aqua: "⚡️",
  pink: "🐾",
  purple: "✡️",
  blue: "☽",
  red: "❌",
  white: "🔲",
  green: "🔶",
};

export const debugLevel = (level: LevelState) => {
  // top of columns
  for (const col of level.columns) {
    if (col.type === "placement") {
      process.stdout.write("┌──┐ ");
    }
    if (col.type === "buffer") {
      process.stdout.write("│  │ ");
    }
  }
  process.stdout.write("\n");
  const maxHeight = level.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );

  for (let i = 0; i < maxHeight + 1; i++) {
    for (const col of level.columns) {
      if (i < col.columnSize) {
        const block = col.blocks[col.blocks.length - col.columnSize + i];

        if (block === undefined) {
          if (i < col.columnSize - 1) {
            process.stdout.write("│__│ ");
          } else {
            process.stdout.write("│  │ ");
          }
        } else {
          process.stdout.write(`│${colorMapping[block]}│ `);
        }
      }

      if (i === col.columnSize) {
        if (col.type === "placement") {
          process.stdout.write("╘══╛ ");
        } else {
          process.stdout.write("└──┘ ");
        }
      }
      if (i > col.columnSize) {
        process.stdout.write("     ");
      }
    }
    process.stdout.write("\n");
  }
};
