import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getEasySpringSettings, getSpringSettings } from "./spring";

describe(getEasySpringSettings, () => {
  testDifficulties(getEasySpringSettings);
});

describe(getSpringSettings, () => {
  testDifficulties(getSpringSettings);
});
