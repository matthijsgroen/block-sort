import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import localForage from "localforage";

const isSetFunction = <T>(v: SetStateAction<T>): v is (prevValue: T) => T =>
  typeof v === "function";

export const getOfflineValue = <T>(
  key: string,
  storeName = "defaultStore"
): Promise<T | null> => {
  const store = localForage.createInstance({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    name: storeName,
  });
  return store.getItem<T>(key);
};

export const setOfflineValue = <T>(
  key: string,
  value: T,
  storeName = "defaultStore"
): Promise<T | null> => {
  const store = localForage.createInstance({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    name: storeName,
  });
  return store.setItem<T>(key, value);
};

export const deleteOfflineValue = (
  key: string,
  storeName = "defaultStore"
): Promise<void> => {
  const store = localForage.createInstance({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    name: storeName,
  });
  return store.removeItem(key);
};

export const useOfflineStorage = <T>(
  key: string,
  initialValue: T,
  storeName = "defaultStore"
): [
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  deleteValue: VoidFunction,
] => {
  const [localState, setLocalState] = useState(initialValue);
  const store = useRef<LocalForage | null>(null);

  useEffect(() => {
    store.current = localForage.createInstance({
      driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
      name: storeName,
    });
    const storage = store.current;
    storage.getItem<T>(key).then((value) => {
      if (value !== null) {
        setLocalState(value);
      } else {
        if (initialValue !== null) {
          storage.setItem<T>(key, initialValue);
        }
      }
    });
  }, []);

  const setValue = useCallback(
    async (value: SetStateAction<T>) => {
      if (isSetFunction(value)) {
        const previousValue = await store.current?.getItem<T>(key);
        const nextValue = value(previousValue ?? localState);
        await store.current?.setItem<T>(key, nextValue);
        setLocalState(nextValue);
      } else {
        await store.current?.setItem<T>(key, value);
        setLocalState(value);
      }
    },
    [key]
  );

  const deleteValue = useCallback(async () => {
    await store.current?.removeItem(key);
  }, [key]);

  return [localState, setValue, deleteValue];
};
