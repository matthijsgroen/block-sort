import { describe } from "vitest";

import { testDifficulties } from "../level-settings/difficultyTester";

import {
  getDungeonSettings,
  getDungeonSettings2,
  getDungeonSettings3
} from "./dungeon";

describe(getDungeonSettings, () => {
  testDifficulties(getDungeonSettings);
});

describe(getDungeonSettings2, () => {
  testDifficulties(getDungeonSettings2);
});

describe(getDungeonSettings3, () => {
  testDifficulties(getDungeonSettings3);
});
