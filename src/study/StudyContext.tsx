import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import appInfo from "../../package.json";

import { type LoggerStatus, ServerSync } from "./ServerSync";
import { loadStoredUser, persistUser } from "./user";
import { useStudyTimer } from "./useStudyTimer";

type ProgressState = {
  levelNr: number;
  inLevel: boolean;
  inZenMode: boolean;
};

type StudyContextType = {
  locked: boolean;
  username: string;
  userKey: string | null;
  timerLabel: string;
  remainingSeconds: number;
  cooldownSeconds: number;
  canUnlock: boolean;
  loggerStatus: LoggerStatus;
  unlockWithStudy: (username: string, studyEntry: string) => Promise<boolean>;
  trackEvent: (eventType: string, payload?: Record<string, unknown>) => void;
  setProgress: (progress: ProgressState) => void;
  loadedProgress: ProgressState | null;
};

const appVersion = appInfo.version;

const defaultLogger: LoggerStatus = {
  enabled: false,
  format: "jsonl",
  endpoint: "",
  persistedCount: 0,
  lastSuccessAt: null,
  lastError: null
};

const StudyContext = createContext<StudyContextType | null>(null);

export const StudyProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const storedUser = loadStoredUser();
  const [locked, setLocked] = useState(true);
  const [username, setUsername] = useState(storedUser.username);
  const [userKey, setUserKey] = useState<string | null>(
    storedUser.userKey || null
  );
  const [sessionId, setSessionId] = useState("");
  const sessionStartRef = useRef<number | null>(null);
  const progressRef = useRef<ProgressState>({
    levelNr: 0,
    inLevel: false,
    inZenMode: false
  });
  const [loadedProgress, setLoadedProgress] = useState<ProgressState | null>(
    null
  );

  const [loggerStatus, setLoggerStatus] = useState<LoggerStatus>(defaultLogger);
  const timer = useStudyTimer();

  const updateLogger = useCallback((change: Partial<LoggerStatus>) => {
    setLoggerStatus((state) => ({
      ...state,
      ...change,
      persistedCount:
        change.persistedCount === 1
          ? state.persistedCount + 1
          : (change.persistedCount ?? state.persistedCount)
    }));
  }, []);

  const serverSync = useMemo(
    () => new ServerSync(() => ({ userKey }), updateLogger),
    [userKey, updateLogger]
  );

  const createEventPayload = useCallback(
    (eventType: string, payload: Record<string, unknown> = {}) => {
      const elapsed = sessionStartRef.current
        ? Math.floor((Date.now() - sessionStartRef.current) / 1000)
        : 0;
      return {
        event_type: eventType,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_key: userKey,
        elapsed_seconds: elapsed,
        app_version: appVersion,
        ...payload
      };
    },
    [sessionId, userKey]
  );

  const trackEvent = useCallback(
    (eventType: string, payload: Record<string, unknown> = {}) => {
      if (!sessionId && eventType !== "session_start") {
        return;
      }
      const eventPayload = createEventPayload(eventType, payload);
      void serverSync.logEvent(eventPayload);
    },
    [createEventPayload, serverSync, sessionId]
  );

  const startSession = useCallback(
    async (studyEntry: string) => {
      const nextSessionId = crypto.randomUUID();
      setSessionId(nextSessionId);
      sessionStartRef.current = Date.now();

      const sessionPayload = {
        session_id: nextSessionId,
        event_type: "session_start",
        timestamp: new Date().toISOString(),
        user_key: userKey,
        result: "unlocked",
        study_entry: studyEntry
      };
      void serverSync.logSession(sessionPayload);
      void serverSync.logEvent({
        ...createEventPayload("session_start", { study_entry: studyEntry }),
        session_id: nextSessionId
      });
      void serverSync.logEvent({
        ...createEventPayload("resume", { study_entry: studyEntry }),
        session_id: nextSessionId
      });
    },
    [createEventPayload, serverSync, userKey]
  );

  const endSession = useCallback(
    (result: string) => {
      if (!sessionId) {
        return;
      }
      const sessionPayload = {
        session_id: sessionId,
        event_type: "session_end",
        timestamp: new Date().toISOString(),
        user_key: userKey,
        result
      };
      void serverSync.logSession(sessionPayload);
      trackEvent("session_end", { result });
    },
    [serverSync, sessionId, trackEvent, userKey]
  );

  const unlockWithStudy = useCallback(
    async (nextUsername: string, studyEntry: string) => {
      if (studyEntry.trim().length < 3 || timer.cooldownSeconds > 0) {
        return false;
      }
      const normalizedKey = persistUser(nextUsername);
      setUsername(nextUsername);
      setUserKey(normalizedKey);
      setLocked(false);
      await startSession(studyEntry.trim());
      timer.startTimer(60 + Math.floor(Math.random() * 121));
      return true;
    },
    [startSession, timer]
  );

  useEffect(() => {
    if (timer.remainingSeconds > 0 || locked) {
      return;
    }
    setLocked(true);
    timer.startCooldown(45);
    trackEvent("pause", { result: "timer_expired" });
    endSession("timer_expired");
  }, [timer.remainingSeconds, locked, timer, trackEvent, endSession]);

  useEffect(() => {
    const onUnload = () => {
      if (!sessionId) {
        return;
      }
      const payload = {
        session_id: sessionId,
        event_type: "session_end",
        timestamp: new Date().toISOString(),
        user_key: userKey,
        result: "unload"
      };
      serverSync.sendBeaconSessionEnd(payload);
      serverSync.sendBeaconEvent({
        ...createEventPayload("session_end", { result: "unload" }),
        session_id: sessionId
      });
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [createEventPayload, serverSync, sessionId, userKey]);

  useEffect(() => {
    void serverSync
      .loadProgress()
      .then((data) => {
        if (data.progress) {
          progressRef.current = data.progress;
          setLoadedProgress(data.progress);
        }
      })
      .catch(() => undefined);
  }, [serverSync]);

  const setProgress = useCallback(
    (progress: ProgressState) => {
      progressRef.current = progress;
      void serverSync.saveProgress(progress).catch(() => undefined);
    },
    [serverSync]
  );

  return (
    <StudyContext.Provider
      value={{
        locked,
        username,
        userKey,
        timerLabel: timer.timerLabel,
        remainingSeconds: timer.remainingSeconds,
        cooldownSeconds: timer.cooldownSeconds,
        canUnlock: timer.cooldownSeconds === 0,
        loggerStatus,
        unlockWithStudy,
        trackEvent,
        setProgress,
        loadedProgress
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used inside StudyProvider");
  }
  return context;
};
