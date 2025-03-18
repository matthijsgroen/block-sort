import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import { getDungeonSettings } from "./dungeon";

describe(getDungeonSettings, () => {
  testDifficulties(getDungeonSettings);
});
