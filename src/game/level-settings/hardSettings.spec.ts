import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getHardSettings } from "./hardSettings";

describe(getHardSettings, () => {
  testDifficulties(getHardSettings);
});
