import { describe, expect, it } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";
import { LEVEL_SCALE } from "../level-settings/levelSettings";
import type { LevelSettings } from "../types";

import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
  special
} from "./special";

describe(getSpecial1Settings, () => {
  it("returns settings based on difficulty", () => {
    const easy = getSpecial1Settings(1);
    expect(easy).toEqual({
      amountColors: 3,
      bufferPlacementLimits: 0,
      bufferSizes: 4,
      buffers: 2,
      extraBuffers: [
        {
          amount: 1,
          limit: 0,
          size: 4
        },
        {
          amount: 1,
          limit: 0,
          size: 4
        }
      ],
      extraPlacementStacks: 0,
      stackSize: 12,
      blockColorPick: "end"
    });

    const hard = getSpecial1Settings(10);
    expect(hard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 3,
      bufferSizes: 3,
      buffers: 4,
      extraPlacementStacks: 0,
      extraBuffers: [
        {
          amount: 1,
          limit: 0,
          size: 3
        },
        {
          amount: 1,
          limit: 0,
          size: 4
        }
      ],
      stackSize: 13,
      blockColorPick: "end"
    });

    const veryHard = getSpecial1Settings(11);
    expect(veryHard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 3,
      bufferSizes: 3,
      buffers: 4,
      extraPlacementStacks: 0,
      extraBuffers: [
        {
          amount: 1,
          limit: 0,
          size: 3
        },
        {
          amount: 1,
          limit: 0,
          size: 3
        }
      ],
      stackSize: 13,
      blockColorPick: "end"
    });
  });

  testDifficulties(getSpecial1Settings);
});

describe(getSpecial2Settings, () => {
  testDifficulties(getSpecial2Settings);
});

describe(getSpecial3Settings, () => {
  testDifficulties(getSpecial3Settings);
});

describe(getSpecial4Settings, () => {
  testDifficulties(getSpecial4Settings);
});

describe(getSpecial5Settings, () => {
  testDifficulties(getSpecial5Settings);
});

const AMOUNT_TEMPLATES = 5;
const randomTemplate = (index: number) => () => (1 / AMOUNT_TEMPLATES) * index;

describe(special.getSettings, () => {
  describe("template 1", () => {
    it("returns a variant with long placement elements", () => {
      const random = randomTemplate(0);
      const result = special.getSettings(0, random);

      expect(result).toEqual({
        amountColors: 3,
        stackSize: 12,
        extraPlacementStacks: 0,
        buffers: 2,
        bufferSizes: 4,
        bufferPlacementLimits: 0,
        extraBuffers: [
          { amount: 1, size: 4, limit: 0 },
          { amount: 1, size: 4, limit: 0 }
        ],
        blockColorPick: "end"
      } satisfies LevelSettings);

      const hardResult = special.getSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 4,
        stackSize: 13,
        extraPlacementStacks: 0,
        buffers: 4,
        bufferSizes: 3,
        bufferPlacementLimits: 3,
        extraBuffers: [
          { amount: 1, size: 3, limit: 0 },
          { amount: 1, size: 3, limit: 0 }
        ],
        blockColorPick: "end"
      } satisfies LevelSettings);
    });
  });

  describe("template 2", () => {
    it("returns a variant with lots of small items", () => {
      const random = randomTemplate(1);
      const result = special.getSettings(0, random);

      expect(result).toEqual({
        amountColors: 6,
        stackSize: 3,
        extraPlacementStacks: 3,
        extraPlacementLimits: 2,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);

      const hardResult = special.getSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 16,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 0,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);
    });
  });

  describe("template 3", () => {
    it("returns a fixed difficulty variant", () => {
      const random = randomTemplate(2);
      const result = special.getSettings(0, random);

      expect(result).toEqual({
        amountColors: 5,
        stackSize: 4,
        extraPlacementStacks: 2,
        extraPlacementLimits: 0,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);

      const hardResult = special.getSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 5,
        stackSize: 5,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);
    });
  });

  describe("template 4", () => {
    it("returns a more stacks than colors", () => {
      const random = randomTemplate(3);
      const result = special.getSettings(0, random);

      expect(result).toEqual({
        amountColors: 3,
        stackSize: 3,
        extraPlacementStacks: 4,
        extraPlacementLimits: 2,
        buffers: 1,
        bufferSizes: 1,
        stacksPerColor: 2,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);

      const hardResult = special.getSettings(LEVEL_SCALE.at(-1)!, random);

      expect(hardResult).toEqual({
        amountColors: 6,
        stackSize: 3,
        extraPlacementStacks: 2,
        extraPlacementLimits: 2,
        buffers: 1,
        bufferSizes: 1,
        stacksPerColor: 2,
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);
    });
  });

  describe("template 5", () => {
    it("has buffers with steps", () => {
      const random = randomTemplate(4);
      const result = special.getSettings(0, random);

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
          { amount: 1, size: 2, limit: 1 }
        ],
        blockColorPick: "end"
      } satisfies LevelSettings);

      const hardResult = special.getSettings(LEVEL_SCALE.at(-1)!, random);

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
          { amount: 1, size: 2, limit: 1 }
        ],
        blockColorPick: "end",
        layoutMap: expect.any(Object)
      } satisfies LevelSettings);
    });
  });
});
