import { describe, expect, it } from "vitest";

import { testDifficulties } from "./difficultyTester";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "./specialSettings";

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
          size: 4,
        },
        {
          amount: 1,
          limit: 0,
          size: 4,
        },
      ],
      extraPlacementStacks: 0,
      stackSize: 12,
      blockColorPick: "end",
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
          size: 3,
        },
        {
          amount: 1,
          limit: 0,
          size: 4,
        },
      ],
      stackSize: 13,
      blockColorPick: "end",
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
          size: 3,
        },
        {
          amount: 1,
          limit: 0,
          size: 3,
        },
      ],
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

describe(getSpecial5Settings, () => {
  testDifficulties(getSpecial5Settings);
});
