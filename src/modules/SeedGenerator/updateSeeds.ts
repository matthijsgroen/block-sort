import { writeFile } from "node:fs/promises";
import * as prettier from "prettier";

export const updateSeeds = async (
  updatedLevelSeeds: Record<string, number[]>
) => {
  const sortedSeeds = Object.fromEntries(
    Object.entries(updatedLevelSeeds).sort(
      ([a], [b]) => parseInt(a) - parseInt(b)
    )
  );
  // Update TS file
  const newCode = `/**
    * This file is generated. Do not modify. Run "yarn generate-level-seeds" to update.
  */
  export const levelSeeds: Record<string, number[]> = ${JSON.stringify(sortedSeeds)};`;
  const formattedCode = await prettier.format(newCode, {
    parser: "typescript",
    trailingComma: "none"
  });
  await writeFile("src/data/levelSeeds.ts", formattedCode);
};
