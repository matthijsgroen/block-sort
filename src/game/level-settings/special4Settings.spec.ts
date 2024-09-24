import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./special4Settings";

describe("special 4 settings", () => {
  testDifficulties("Special4", getSettings);
});
