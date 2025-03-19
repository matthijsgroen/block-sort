import { describe, expect, it } from "vitest";

import { levelSeeds } from "@/data/levelSeeds";
import { settingsHash } from "@/support/hash";
import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import { getNormal5Settings, getNormalSettings } from "../level-types/normal";
import { hasWon } from "../state";
import type { LevelSettings } from "../types";

import { optimizeMoves } from "./optimizeMoves";
import { generatePlayableLevel } from "./tactics";

const getSeed = (settings: LevelSettings, offset = 0) => {
  const hash = settingsHash(settings);
  return levelSeeds[hash][offset][0];
};

describe(optimizeMoves, () => {
  it("returns the same level", async () => {
    const settings = getNormalSettings(1);
    const seed = getSeed(settings);
    const random = mulberry32(seed);
    const level = await generatePlayableLevel(settings, { random });
    const result = optimizeMoves(level);
    expect(result.columns).toBe(level.columns);
    expect(result.blockTypes).toBe(level.blockTypes);
  });

  it("reduces the amount of moves", async () => {
    const settings = getNormal5Settings(11);
    const seed = getSeed(settings, 4);

    const random = mulberry32(seed);

    const level = await generatePlayableLevel(settings, { random, seed });
    const result = optimizeMoves(level);
    expect(level.moves.length).toBeGreaterThan(250);
    expect(result.moves.length).toBeLessThan(level.moves.length);
    expect(result.moves.length).toBeLessThan(110);
  }, 30_000);

  it("can still complete the level", async () => {
    const settings = getNormal5Settings(11);
    const seed = getSeed(settings, 4);

    const random = mulberry32(seed);

    const level = await generatePlayableLevel(settings, { random, seed });
    const result = optimizeMoves(level);

    let levelState = result;
    for (const move of result.moves) {
      levelState = moveBlocks(levelState, move);
    }
    const won = hasWon(levelState);
    expect(won).toBe(true);
  }, 30_000);
});
