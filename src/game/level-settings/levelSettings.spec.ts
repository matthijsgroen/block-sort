import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { LevelSettings } from "../level-creation/generateRandomLevel";
import { generatePlayableLevel } from "../level-creation/tactics";

import {
  getDifficultyLevel,
  getSpecialSettings,
  LEVEL_SCALE,
  nextLevelAt,
} from "./levelSettings";

const TEST_SEED = 123456789;

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

const AMOUNT_TEMPLATES = 4;
const randomTemplate = (index: number) => () => (1 / AMOUNT_TEMPLATES) * index;

describe(getSpecialSettings, () => {
  describe("template 1", () => {
    it("returns a variant with long placement elements", () => {
      const random = randomTemplate(0);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 4,
        stackSize: 12,
        extraPlacementStacks: 0,
        buffers: 6,
        bufferSizes: 4,
        bufferPlacementLimits: 0,
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 4,
        stackSize: 13,
        extraPlacementStacks: 0,
        buffers: 6,
        bufferSizes: 4,
        bufferPlacementLimits: 3,
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(0)
      );
      await generatePlayableLevel(settings, random);
    });
  });

  describe("template 2", () => {
    it("returns a variant with lots of small items", () => {
      const random = randomTemplate(1);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 11,
        stackSize: 3,
        extraPlacementStacks: 3,
        extraPlacementLimits: 2,
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 16,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 0,
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(1)
      );
      await generatePlayableLevel(settings, random);
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
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 5,
        stackSize: 5,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(2)
      );
      const level = await generatePlayableLevel(settings, random);
      expect(level.moves).toHaveLength(19);
    });
  });

  describe("template 4", () => {
    it("returns a more stacks than colors", () => {
      const random = randomTemplate(3);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 5,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
        buffers: 1,
        bufferSizes: 1,
        stacksPerColor: 2,
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
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(3)
      );
      await generatePlayableLevel(settings, random);
    });
  });
});
