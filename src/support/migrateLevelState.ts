import type { LevelState } from "@/game/types";

import { isVersion1, migrateFromVersion1 } from "./migration/levelV1";

export const migrateLevelState = (value: unknown): LevelState => {
  if (isVersion1(value)) {
    return migrateFromVersion1(value);
  }

  return value as LevelState;
};
