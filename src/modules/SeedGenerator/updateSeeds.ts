import { writeFile } from "node:fs/promises";
import * as prettier from "prettier";

import type { SeedMap } from "@/data/levelSeeds";

export const updateSeeds = async (updatedLevelSeeds: SeedMap) => {
  const sortedSeeds = Object.fromEntries(
    Object.entries(updatedLevelSeeds).sort(
      ([a], [b]) => parseInt(a) - parseInt(b)
    )
  );
  // Update TS file
  const newCode = `/**
    * This file is generated. Do not modify. Run "yarn generate-level-seeds" to update.
  */
  export type SeedMap = Record<string, [seed: number, moves: number][]>;
  export const levelSeeds: SeedMap = JSON.parse('${JSON.stringify(sortedSeeds)}');
  `;
  const formattedCode = await prettier.format(newCode, {
    parser: "typescript",
    trailingComma: "none"
  });
  await writeFile("src/data/levelSeeds.ts", formattedCode);
};
