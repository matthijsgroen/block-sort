import { useEffect, useState } from "react";

type Options = {
  initialValue?: boolean;
  onDelay?: number;
  offDelay?: number;
  onOn?: VoidFunction;
  onOff?: VoidFunction;
};
export const useDelayedToggle = (
  value: boolean,
  { initialValue = value, onDelay = 0, offDelay = 0, onOn, onOff }: Options = {}
) => {
  const [delayedValue, setDelayedValue] = useState(initialValue ?? value);

  useEffect(() => {
    if (value && value !== delayedValue) {
      if (onDelay === 0) {
        setDelayedValue(value);
      } else {
        const clear = setTimeout(() => {
          setDelayedValue(value);
          onOn?.();
        }, onDelay);
        return () => clearTimeout(clear);
      }
    } else if (value !== delayedValue) {
      if (offDelay === 0) {
        setDelayedValue(value);
      } else {
        const clear = setTimeout(() => {
          setDelayedValue(value);
          onOff?.();
        }, offDelay);
        return () => clearTimeout(clear);
      }
    }
  }, [value]);

  return delayedValue;
};
