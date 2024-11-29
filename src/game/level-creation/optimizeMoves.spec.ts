import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import { getNormal5Settings, getNormalSettings } from "../level-types/normal";
import { hasWon } from "../state";

import { optimizeMoves } from "./optimizeMoves";
import { generatePlayableLevel } from "./tactics";

describe(optimizeMoves, () => {
  it("returns the same level", async () => {
    const seed = 517311761;
    const random = mulberry32(seed);
    const level = await generatePlayableLevel(getNormalSettings(1), { random });
    const result = optimizeMoves(level);
    expect(result.columns).toBe(level.columns);
    expect(result.colors).toBe(level.colors);
  });

  it("reduces the amount of moves", async () => {
    const settings = getNormal5Settings(11);

    const seed = 517311761;
    const random = mulberry32(seed);

    const level = await generatePlayableLevel(settings, { random, seed });
    const result = optimizeMoves(level);
    expect(level.moves.length).toBeGreaterThan(350);
    expect(result.moves.length).toBeLessThan(level.moves.length);
    expect(result.moves.length).toBeLessThan(150);
  }, 30_000);

  it("can still complete the level", async () => {
    const settings = getNormal5Settings(11);

    const seed = 517311761;
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
