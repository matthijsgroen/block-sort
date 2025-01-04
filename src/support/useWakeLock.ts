import { useCallback, useEffect, useRef } from "react";

export const useWakeLock = () => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const reAcquire = useCallback(async () => {
    if (wakeLock.current !== null && document.visibilityState === "visible") {
      wakeLock.current = await navigator.wakeLock.request("screen");
    }
  }, []);

  const requestWakeLock = async () => {
    try {
      wakeLock.current = await navigator.wakeLock.request("screen");

      document.addEventListener("visibilitychange", reAcquire);
    } catch (ignoreError) {}
  };

  const releaseWakeLock = () => {
    if (wakeLock.current) {
      wakeLock.current.release();
      wakeLock.current = null;
    }
    document.removeEventListener("visibilitychange", reAcquire);
  };

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return { requestWakeLock, releaseWakeLock };
};
