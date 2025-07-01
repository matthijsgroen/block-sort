import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getHard2Settings, getHard3Settings, getHardSettings } from "./hard";

describe(getHardSettings, () => {
  testDifficulties(getHardSettings);
});

describe(getHard2Settings, () => {
  testDifficulties(getHard2Settings);
});

describe(getHard3Settings, () => {
  testDifficulties(getHard3Settings);
});
