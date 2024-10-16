import {
  deleteOfflineValue,
  getOfflineValue,
  setOfflineValue,
  useOfflineStorage,
} from "@/support/useOfflineStorage";

const GAME_STORE = "block-sort-store";

export const useGameStorage = <T>(key: string, initialValue: T | (() => T)) =>
  useOfflineStorage<T>(key, initialValue, GAME_STORE);

export const getGameValue = <T>(key: string) =>
  getOfflineValue<T>(key, GAME_STORE);

export const setGameValue = <T>(key: string, value: T) =>
  setOfflineValue<T>(key, value, GAME_STORE);

export const deleteGameValue = (key: string) =>
  deleteOfflineValue(key, GAME_STORE);
