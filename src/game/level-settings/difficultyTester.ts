import { describe, expect, it } from "vitest";

import { levelSeeds } from "@/data/levelSeeds";
import { hash } from "@/support/hash";
import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import { generatePlayableLevel } from "../level-creation/tactics";
import { hasWon } from "../state";
import { LevelSettings } from "../types";

import { LEVEL_SCALE } from "./levelSettings";

export const testDifficulties = (
  getSettings: (difficulty: number) => LevelSettings,
) => {
  describe("playability", () => {
    it.each(
      [{ difficulty: 1, level: 1 }].concat(
        LEVEL_SCALE.map((level, i) => ({
          difficulty: i + 2,
          level: level + 1,
        })),
      ),
    )(
      "can play difficulty $difficulty at level $level",
      async ({ difficulty }) => {
        const settings = getSettings(difficulty);

        const hashVersion = { ...settings };
        delete hashVersion["playMoves"];

        const settingsHash = hash(JSON.stringify(hashVersion)).toString();

        const seeds = levelSeeds[settingsHash] ?? [];
        const preSeed = seeds[0];
        expect(preSeed).toBeDefined();

        const random = mulberry32(preSeed);
        const result = await generatePlayableLevel(settings, random, preSeed);
        expect(result.moves.length).toBeGreaterThan(2);
        expect(result.generationInformation?.seed).toBe(preSeed);

        // actual play level
        let levelState = result;
        for (const move of result.moves) {
          levelState = moveBlocks(levelState, move.from, move.to);
        }
        const won = hasWon(levelState);
        expect(won).toBe(true);
      },
      90_000,
    );
  });
};
