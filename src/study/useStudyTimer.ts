import { useEffect, useMemo, useState } from "react";

const formatTimerText = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")} of fun time!`;
};

export const useStudyTimer = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setRemainingSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setCooldownSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  return {
    remainingSeconds,
    cooldownSeconds,
    timerLabel: useMemo(
      () => formatTimerText(remainingSeconds),
      [remainingSeconds]
    ),
    startTimer: (seconds: number) => setRemainingSeconds(seconds),
    stopTimer: () => setRemainingSeconds(0),
    startCooldown: (seconds: number) => setCooldownSeconds(seconds)
  };
};
