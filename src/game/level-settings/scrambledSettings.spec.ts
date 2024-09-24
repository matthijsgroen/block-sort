import { describe } from "vitest";

import { testDifficulties } from "./difficultyTester";
import { getSettings } from "./scrambledSettings";

describe("scrambledSettings", () => {
  testDifficulties(getSettings);
});
