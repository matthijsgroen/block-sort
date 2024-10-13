import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getScrambledSettings } from "./scrambled";

describe(getScrambledSettings, () => {
  testDifficulties(getScrambledSettings);
});
