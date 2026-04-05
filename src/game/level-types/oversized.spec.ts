import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getOversized1Settings } from "./oversized";

describe(getOversized1Settings, () => {
  testDifficulties(getOversized1Settings);
});
