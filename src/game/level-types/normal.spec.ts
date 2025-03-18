import { describe, expect, it } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";
import type { LevelSettings } from "../types";

import {
  getNormal2Settings,
  getNormal3Settings,
  getNormal4Settings,
  getNormal5Settings,
  getNormalSettings
} from "./normal";

describe(getNormalSettings, () => {
  describe("increase in difficulty", () => {
    it.each<{ difficulty: number; result: LevelSettings }>([
      {
        difficulty: 1,
        result: {
          amountColors: 2,
          extraPlacementStacks: 1,
          hideBlockTypes: "none",
          stackSize: 4
        }
      },
      {
        difficulty: 2,
        result: {
          amountColors: 3,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 4
        }
      },
      {
        difficulty: 3,
        result: {
          amountColors: 4,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 4
        }
      },
      {
        difficulty: 4,
        result: {
          amountColors: 5,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 4
        }
      },
      {
        difficulty: 5,
        result: {
          amountColors: 6,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 4
        }
      },
      {
        difficulty: 6,
        result: {
          amountColors: 7,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 5
        }
      },
      {
        difficulty: 7,
        result: {
          amountColors: 8,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 5
        }
      },
      {
        difficulty: 8,
        result: {
          amountColors: 9,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 6
        }
      },
      {
        difficulty: 9,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          hideBlockTypes: "none",
          stackSize: 6
        }
      },
      {
        difficulty: 10,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          extraPlacementLimits: 1,
          hideBlockTypes: "none",
          stackSize: 7
        }
      },
      {
        difficulty: 11,
        result: {
          amountColors: 10,
          extraPlacementStacks: 2,
          extraPlacementLimits: 1,
          hideBlockTypes: "none",
          stackSize: 7
        }
      }
    ])("returns settings for level $difficulty", ({ difficulty, result }) => {
      const settings = getNormalSettings(difficulty);
      expect(settings).toEqual(result);
    });
  });

  testDifficulties(getNormalSettings);
});

describe(getNormal2Settings, () => {
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
          hideBlockTypes: "none",
          stackSize: 7
        }
      },
      {
        difficulty: 11,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 2,
          hideBlockTypes: "none",
          stackSize: 7
        }
      }
    ])("returns settings for level $difficulty", ({ difficulty, result }) => {
      const settings = getNormal2Settings(difficulty);
      expect(settings).toEqual(result);
    });
  });

  testDifficulties(getNormal2Settings);
});

describe(getNormal3Settings, () => {
  describe("increase in difficulty", () => {
    it.each<{ difficulty: number; result: LevelSettings }>([
      {
        difficulty: 10,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 2,
          hideBlockTypes: "none",
          stackSize: 7,
          extraBuffers: [{ size: 1, amount: 1, limit: 0 }]
        }
      },
      {
        difficulty: 11,
        result: {
          amountColors: 10,
          extraPlacementStacks: 1,
          extraPlacementLimits: 1,
          buffers: 2,
          bufferSizes: 2,
          hideBlockTypes: "none",
          stackSize: 7
        }
      }
    ])("returns settings for level $difficulty", ({ difficulty, result }) => {
      const settings = getNormal3Settings(difficulty);
      expect(settings).toEqual(result);
    });
  });

  testDifficulties(getNormal3Settings);
});

describe(getNormal4Settings, () => {
  testDifficulties(getNormal4Settings);
});

describe(getNormal5Settings, () => {
  testDifficulties(getNormal5Settings, [11]);
});
