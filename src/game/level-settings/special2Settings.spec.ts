import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./special2Settings";

describe("special 2 settings", () => {
  testDifficulties("Special2", getSettings);
});
