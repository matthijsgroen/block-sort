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

export const useOfflineStorage = <T>(
  key: string,
  initialValue: T,
  storeName = "defaultStore"
): [value: T, setValue: Dispatch<SetStateAction<T>>] => {
  const [localState, setLocalState] = useState(initialValue);
  const store = useRef<LocalForage | null>(null);

  useEffect(() => {
    store.current = localForage.createInstance({
      driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
      name: storeName,
    });
    store.current.getItem<T>(key).then((value) => {
      if (value !== null) {
        setLocalState(value);
      }
    });
  }, []);

  const setValue = useCallback((value: SetStateAction<T>) => {
    if (isSetFunction(value)) {
      store.current?.getItem<T>(key).then((previousValue) => {
        const nextValue = value(previousValue ?? localState);
        store.current?.setItem<T>(key, nextValue).then(() => {
          setLocalState(nextValue);
        });
      });
    } else {
      store.current?.setItem<T>(key, value).then(() => {
        setLocalState(value);
      });
    }
  }, []);

  return [localState, setValue];
};
