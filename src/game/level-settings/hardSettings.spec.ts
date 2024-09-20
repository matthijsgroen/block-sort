import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./hardSettings";

describe("hard settings", () => {
  testDifficulties(getSettings);
});
