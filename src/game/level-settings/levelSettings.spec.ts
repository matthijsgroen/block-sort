import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { LevelSettings } from "../level-creation/generateRandomLevel";
import { generatePlayableLevel } from "../level-creation/tactics";

import {
  getDifficultyLevel,
  getHardSettings,
  getNormalSettings,
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

describe(getNormalSettings, () => {
  it("creates level settings based on level nr", () => {
    const settings = getNormalSettings(0);
    expect(settings).toEqual({
      amountColors: 2,
      extraPlacementStacks: 1,
      hideBlockTypes: false,
      stackSize: 4,
    });
  });

  describe("increase in difficulty", () => {
    it.each<{ difficulty: number; result: LevelSettings }>([
      {
        difficulty: 0,
        result: {
          amountColors: 2,
          extraPlacementStacks: 1,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 1,
        result: {
          amountColors: 3,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 2,
        result: {
          amountColors: 4,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 3,
        result: {
          amountColors: 5,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 4,
        result: {
          amountColors: 6,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 5,
        result: {
          amountColors: 7,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 6,
        result: {
          amountColors: 8,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 7,
        result: {
          amountColors: 9,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 5,
        },
      },
      {
        difficulty: 8,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 6,
        },
      },
      {
        difficulty: 9,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 3,
          hideBlockTypes: false,
          stackSize: 7,
        },
      },
      {
        difficulty: 10,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 2,
          hideBlockTypes: false,
          stackSize: 8,
        },
      },
    ])("returns settings for level $difficulty", ({ difficulty, result }) => {
      const levelNr = LEVEL_SCALE[difficulty - 1] ?? 0;

      const settings = getNormalSettings(levelNr);
      expect(settings).toEqual(result);

      const hardSettings = getHardSettings(levelNr);
      expect(hardSettings).toEqual({ ...result, hideBlockTypes: true });
    });
  });

  it("can handle the most complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      getNormalSettings(LEVEL_SCALE.at(-1)!),
      random
    );
    expect(level.moves).toHaveLength(102);
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
        bufferSizes: 5,
        bufferPlacementLimits: 0,
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 4,
        stackSize: 14,
        extraPlacementStacks: 0,
        buffers: 6,
        bufferSizes: 5,
        bufferPlacementLimits: 4,
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(0)
      );
      const level = await generatePlayableLevel(settings, random);
      expect(level.moves).toHaveLength(690);
    });
  });

  describe("template 2", () => {
    it("returns a variant with lots of small items", () => {
      const random = randomTemplate(1);
      const result = getSpecialSettings(0, random);

      expect(result).toEqual({
        amountColors: 10,
        stackSize: 3,
        extraPlacementStacks: 4,
        extraPlacementLimits: 4,
        buffers: 0,
        bufferSizes: 3,
        bufferPlacementLimits: 0,
      } satisfies LevelSettings);

      const hardResult = getSpecialSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 10,
        stackSize: 4,
        extraPlacementStacks: 0,
        extraPlacementLimits: 0,
        buffers: 4,
        bufferSizes: 3,
        bufferPlacementLimits: 4,
      } satisfies LevelSettings);
    });

    it("can handle the most complex level", async () => {
      const random = mulberry32(TEST_SEED);
      const settings = getSpecialSettings(
        LEVEL_SCALE.at(-1)!,
        randomTemplate(1)
      );
      const level = await generatePlayableLevel(settings, random);
      expect(level.moves).toHaveLength(40);
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
      expect(level.moves).toHaveLength(24);
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
      const level = await generatePlayableLevel(settings, random);
      expect(level.moves).toHaveLength(261);
    });
  });
});
