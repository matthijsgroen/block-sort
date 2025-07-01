import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getHard2Settings, getHardSettings } from "./hard";

describe(getHardSettings, () => {
  testDifficulties(getHardSettings);
});

describe(getHard2Settings, () => {
  testDifficulties(getHard2Settings);
});
