import { useStudy } from "./StudyContext";

export const StudyStatusBar: React.FC = () => {
  const { remainingSeconds, timerLabel, loggerStatus } = useStudy();
  const danger = remainingSeconds > 0 && remainingSeconds < 10;

  return (
    <div className="pointer-events-none fixed left-3 top-28 z-[90] flex flex-col gap-2">
      {remainingSeconds > 0 && (
        <div
          className={`rounded-full px-3 py-1 text-sm font-bold text-white ${danger ? "animate-pulse bg-red-500" : "bg-emerald-600"}`}
        >
          {danger ? "⏳ " : "🎮 "}
          {timerLabel}
        </div>
      )}
      <div className="rounded bg-black/70 px-3 py-2 text-xs text-white">
        logger: {loggerStatus.enabled ? "enabled" : "disabled"} (
        {loggerStatus.format})
        <br />
        endpoint: {loggerStatus.endpoint || "-"}
        <br />
        persisted: {loggerStatus.persistedCount}
        <br />
        last success: {loggerStatus.lastSuccessAt ?? "-"}
        <br />
        last error: {loggerStatus.lastError ?? "-"}
      </div>
    </div>
  );
};
