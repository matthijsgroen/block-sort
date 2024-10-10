import { describe, expect, it } from "vitest";

import { LevelSettings } from "../level-creation/generateRandomLevel";

import {
  getDifficultyLevel,
  getSpecialSettings,
  LEVEL_SCALE,
  nextLevelAt,
} from "./levelSettings";

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

const AMOUNT_TEMPLATES = 5;
const randomTemplate = (index: number) => () => (1 / AMOUNT_TEMPLATES) * index;

describe(getSpecialSettings, () => {
  describe("template 1", () => {
    it("returns a variant with long placement elements", () => {
      const random = randomTemplate(0);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 3,
        stackSize: 12,
        extraPlacementStacks: 0,
        buffers: 2,
        bufferSizes: 4,
        bufferPlacementLimits: 0,
        extraBuffers: [
          { amount: 1, size: 4, limit: 0 },
          { amount: 1, size: 4, limit: 0 },
        ],
        blockColorPick: "end",
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 4,
        stackSize: 13,
        extraPlacementStacks: 0,
        buffers: 4,
        bufferSizes: 3,
        bufferPlacementLimits: 3,
        extraBuffers: [
          { amount: 1, size: 3, limit: 0 },
          { amount: 1, size: 3, limit: 0 },
        ],
        blockColorPick: "end",
      } satisfies LevelSettings);
    });
  });

  describe("template 2", () => {
    it("returns a variant with lots of small items", () => {
      const random = randomTemplate(1);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 6,
        stackSize: 3,
        extraPlacementStacks: 3,
        extraPlacementLimits: 2,
        blockColorPick: "end",
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 16,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 0,
        blockColorPick: "end",
      } satisfies LevelSettings);
    });
  });

  describe("template 3", () => {
    it("returns a fixed difficulty variant", () => {
      const random = randomTemplate(2);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 5,
        stackSize: 4,
        extraPlacementStacks: 2,
        extraPlacementLimits: 0,
        blockColorPick: "end",
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 5,
        stackSize: 5,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
        blockColorPick: "end",
      } satisfies LevelSettings);
    });
  });

  describe("template 4", () => {
    it("returns a more stacks than colors", () => {
      const random = randomTemplate(3);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 3,
        stackSize: 3,
        extraPlacementStacks: 4,
        extraPlacementLimits: 2,
        buffers: 1,
        bufferSizes: 1,
        stacksPerColor: 2,
        blockColorPick: "end",
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 6,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
        buffers: 1,
        bufferSizes: 1,
        stacksPerColor: 2,
        blockColorPick: "end",
      } satisfies LevelSettings);
    });
  });

  describe("template 5", () => {
    it("has buffers with steps", () => {
      const random = randomTemplate(4);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 0,
        extraPlacementLimits: 0,
        buffers: 1,
        bufferPlacementLimits: 1,
        bufferSizes: 4,
        extraBuffers: [
          { amount: 1, size: 3, limit: 1 },
          { amount: 1, size: 2, limit: 1 },
        ],
        blockColorPick: "end",
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 5,
        stackSize: 5,
        extraPlacementStacks: 0,
        extraPlacementLimits: 0,
        buffers: 1,
        bufferPlacementLimits: 1,
        bufferSizes: 4,
        extraBuffers: [
          { amount: 1, size: 3, limit: 1 },
          { amount: 1, size: 2, limit: 1 },
        ],
        blockColorPick: "end",
      } satisfies LevelSettings);
    });
  });
});
