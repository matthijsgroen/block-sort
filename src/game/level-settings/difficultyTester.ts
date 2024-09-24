import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { LevelSettings } from "../level-creation/generateRandomLevel";
import { generatePlayableLevel } from "../level-creation/tactics";

import { LEVEL_SCALE } from "./levelSettings";

const TEST_SEED = 123456789;

export const testDifficulties = (
  name: string,
  getSettings: (difficulty: number) => LevelSettings
) => {
  describe("playability", () => {
    it.each(
      [{ difficulty: 1, level: 1 }].concat(
        LEVEL_SCALE.map((level, i) => ({ difficulty: i + 1, level }))
      )
    )(
      "can play difficulty $difficulty at level $level",
      async ({ difficulty }) => {
        const settings = getSettings(difficulty);
        const random = mulberry32(TEST_SEED);
        const result = await generatePlayableLevel(settings, random);
        expect(result.moves.length).toBeGreaterThan(2);
        console.log(name, "Difficulty", difficulty, "Cost", result.cost);
      }
    );
  });
};
