import { describe, expect, it } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./special1Settings";

describe("special 1 settings", () => {
  it("returns settings based on difficulty", () => {
    const easy = getSettings(1);
    expect(easy).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 0,
      bufferSizes: 5,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 12,
    });

    const hard = getSettings(10);
    expect(hard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 3,
      bufferSizes: 5,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 14,
    });

    const veryHard = getSettings(11);
    expect(veryHard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 4,
      bufferSizes: 5,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 14,
    });
  });

  testDifficulties(getSettings);
});