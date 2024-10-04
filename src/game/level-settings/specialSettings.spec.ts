import { describe, expect, it } from "vitest";

import { testDifficulties } from "./difficultyTester";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
} from "./specialSettings";

describe(getSpecial1Settings, () => {
  it("returns settings based on difficulty", () => {
    const easy = getSpecial1Settings(1);
    expect(easy).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 0,
      bufferSizes: 4,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 12,
      blockColorPick: "end",
    });

    const hard = getSpecial1Settings(10);
    expect(hard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 3,
      bufferSizes: 4,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 13,
      blockColorPick: "end",
    });

    const veryHard = getSpecial1Settings(11);
    expect(veryHard).toEqual({
      amountColors: 4,
      bufferPlacementLimits: 3,
      bufferSizes: 4,
      buffers: 6,
      extraPlacementStacks: 0,
      stackSize: 13,
      blockColorPick: "end",
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
