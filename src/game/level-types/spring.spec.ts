import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getSpringSettings } from "./spring";

describe(getSpringSettings, () => {
  testDifficulties(getSpringSettings);
});
