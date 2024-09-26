import { describe, expect, it } from "vitest";

import { LevelSettings } from "../level-creation/generateRandomLevel";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./normal2Settings";

describe("normal2Settings", () => {
  describe("increase in difficulty", () => {
    it.each<{ difficulty: number; result: LevelSettings }>([
      {
        difficulty: 10,
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
        difficulty: 11,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 2,
          hideBlockTypes: false,
          stackSize: 7,
        },
      },
    ])("returns settings for level $difficulty", ({ difficulty, result }) => {
      const settings = getSettings(difficulty);
      expect(settings).toEqual(result);
    });
  });

  testDifficulties(getSettings);
});