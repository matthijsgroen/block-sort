import { describe, expect, it } from "vitest";

import { LevelSettings } from "../level-creation/generateRandomLevel";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./normalSettings";

describe("normalSettings", () => {
  describe("increase in difficulty", () => {
    it.each<{ difficulty: number; result: LevelSettings }>([
      {
        difficulty: 1,
        result: {
          amountColors: 2,
          extraPlacementStacks: 1,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 2,
        result: {
          amountColors: 3,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 3,
        result: {
          amountColors: 4,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 4,
        result: {
          amountColors: 5,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 5,
        result: {
          amountColors: 6,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 6,
        result: {
          amountColors: 7,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 7,
        result: {
          amountColors: 8,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 4,
        },
      },
      {
        difficulty: 8,
        result: {
          amountColors: 9,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 5,
        },
      },
      {
        difficulty: 9,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          hideBlockTypes: false,
          stackSize: 6,
        },
      },
      {
        difficulty: 10,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          extraPlacementLimits: 1,
          hideBlockTypes: false,
          stackSize: 7,
        },
      },
      {
        difficulty: 11,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          extraPlacementLimits: 1,
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
