import { describe, expect, it } from "vitest";

import { getDifficultyLevel, LEVEL_SCALE, nextLevelAt } from "./levelSettings";

describe("Level scale", () => {
  it("reaches maximum level at level 267", () => {
    expect(LEVEL_SCALE.at(-1)).toEqual(267);
  });
});

describe(getDifficultyLevel, () => {
  it("starts with level 1", () => {
    const result = getDifficultyLevel(0);
    expect(result).toEqual(1);
  });

  it("at level 3 you reach difficulty 2", () => {
    const result = getDifficultyLevel(3);
    expect(result).toEqual(2);
  });

  it("has a max difficulty of 11", () => {
    const result = getDifficultyLevel(Infinity);
    expect(result).toEqual(11);
  });
});

describe(nextLevelAt, () => {
  it("returns when the next level up will be", () => {
    expect(nextLevelAt(30)).toEqual(39);
  });
});
