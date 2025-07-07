import { useEffect, useState } from "react";

export const useDelay = (
  delay: number,
  duration: number,
  onShow?: () => void,
  afterShow?: () => void
) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setStarted(true);
      onShow?.();
    }, delay);
    return () => clearTimeout(timeOut);
  }, [delay, onShow]);

  useEffect(() => {
    if (started) {
      const timeOut = setTimeout(() => {
        afterShow?.();
      }, duration);
      return () => clearTimeout(timeOut);
    }
  }, [started, afterShow, duration]);

  return started;
};
