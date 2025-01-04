import { useEffect, useRef } from "react";

export const useWakeLock = () => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const reAcquire = async () => {
      if (wakeLock.current !== null && document.visibilityState === "visible") {
        console.log("Re-acquiring wake lock");
        wakeLock.current = await navigator.wakeLock.request("screen");
      }
    };

    const requestWakeLock = async () => {
      try {
        wakeLock.current = await navigator.wakeLock.request("screen");

        document.addEventListener("visibilitychange", reAcquire);
      } catch (ignoreError) {}
    };

    requestWakeLock();

    return () => {
      if (wakeLock.current) {
        wakeLock.current.release();
      }
      document.removeEventListener("visibilitychange", reAcquire);
    };
  }, []);
};
