import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./special3Settings";

describe("special 3 settings", () => {
  testDifficulties(getSettings);
});
