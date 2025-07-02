import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getHot2Settings, getHot3Settings, getHotSettings } from "./hot";

describe(getHotSettings, () => {
  testDifficulties(getHotSettings);
});

describe(getHot2Settings, () => {
  testDifficulties(getHot2Settings);
});

describe(getHot3Settings, () => {
  testDifficulties(getHot3Settings);
});
