import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getOversized1Settings, getOversized2Settings } from "./oversized";

describe(getOversized1Settings, () => {
  testDifficulties(getOversized1Settings);
});

describe(getOversized2Settings, () => {
  testDifficulties(getOversized2Settings);
});
