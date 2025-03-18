import { useCallback } from "react";

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
  const setMigratedValue = useCallback(
    (value: LevelState | ((prev: LevelState) => LevelState)) => {
      if (typeof value === "function") {
        setValue((prev) => value(migrateLevelState(prev)));
      }
      setValue(value);
    },
    [setValue]
  );
  console.log(migratedValue);
  return [migratedValue, setMigratedValue, deleteValue] as const;
};

export const getLevelStateValue = async (
  key: string
): Promise<LevelState | null> => {
  const value = await getOfflineValue<LevelState>(key, GAME_STORE);
  if (value === null) {
    return value;
  }
  const migratedValue = migrateLevelState(value);
  return migratedValue;
};
