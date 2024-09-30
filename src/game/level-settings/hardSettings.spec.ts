import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getHard2Settings, getHardSettings } from "./hardSettings";

describe(getHardSettings, () => {
  testDifficulties(getHardSettings);
});

describe(getHard2Settings, () => {
  testDifficulties(getHard2Settings);
});
