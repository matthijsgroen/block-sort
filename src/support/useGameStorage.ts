import type { LevelState } from "@/game/types";
import {
  deleteOfflineValue,
  getOfflineValue,
  setOfflineValue,
  useOfflineStorage
} from "@/support/useOfflineStorage";

import { migrateLevelState } from "./migrateLevelState";

const GAME_STORE = "block-sort-store";

export const useGameStorage = <T>(key: string, initialValue: T | (() => T)) =>
  useOfflineStorage<T>(key, initialValue, GAME_STORE);

export const getGameValue = <T>(key: string) =>
  getOfflineValue<T>(key, GAME_STORE);

export const setGameValue = <T>(key: string, value: T) =>
  setOfflineValue<T>(key, value, GAME_STORE);

export const deleteGameValue = (key: string) =>
  deleteOfflineValue(key, GAME_STORE);

export const useLevelStateStorage = (
  key: string,
  initialValue: LevelState | (() => LevelState)
) => {
  const [value, setValue, deleteValue] = useGameStorage<LevelState>(
    key,
    initialValue
  );
  const migratedValue = migrateLevelState(value);
  return [migratedValue, setValue, deleteValue] as const;
};
