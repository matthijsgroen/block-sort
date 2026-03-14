export type LoggerStatus = {
  enabled: boolean;
  format: "jsonl";
  endpoint: string;
  persistedCount: number;
  lastSuccessAt: string | null;
  lastError: string | null;
};

type UserIdentity = {
  userKey: string | null;
};

type ProgressPayload = {
  levelNr: number;
  inLevel: boolean;
  inZenMode: boolean;
};

type StudyEventPayload = Record<string, unknown> & {
  event_type: string;
  timestamp: string;
  session_id: string;
  user_key: string | null;
  elapsed_seconds: number;
  app_version: string;
};

type SessionPayload = Record<string, unknown> & {
  session_id: string;
  event_type: string;
  timestamp: string;
  user_key: string | null;
};

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

const resolveApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE as string;
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  return `${import.meta.env.BASE_URL}api`;
};

export class ServerSync {
  private readonly apiBase: string;

  private readonly getUserIdentity: () => UserIdentity;

  private readonly updateStatus: (change: Partial<LoggerStatus>) => void;

  constructor(
    getUserIdentity: () => UserIdentity,
    updateStatus: (change: Partial<LoggerStatus>) => void
  ) {
    this.apiBase = resolveApiBase().replace(/\/$/, "");
    this.getUserIdentity = getUserIdentity;
    this.updateStatus = updateStatus;
    this.updateStatus({
      endpoint: this.apiBase,
      enabled: true,
      format: "jsonl"
    });
  }

  get endpoint() {
    return this.apiBase;
  }

  private async retryFetch(
    path: string,
    init: RequestInit,
    includeBody = true
  ): Promise<Response> {
    const url = `${this.apiBase}${path}`;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const identity = this.getUserIdentity();
      const headers = new Headers(init.headers ?? {});
      headers.set("Content-Type", "application/json");
      if (identity.userKey) {
        headers.set("X-Study-User", identity.userKey);
      }

      try {
        const response = await fetch(url, {
          ...init,
          headers,
          body: includeBody ? init.body : undefined
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        this.updateStatus({
          enabled: true,
          lastError: null,
          lastSuccessAt: new Date().toISOString(),
          persistedCount: undefined
        });
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        this.updateStatus({
          enabled: false,
          lastError: `${path} attempt ${attempt}: ${lastError.message}`
        });
        if (attempt < 3) {
          await wait(250 * attempt);
        }
      }
    }

    throw lastError ?? new Error(`Failed request ${path}`);
  }

  async loadProgress() {
    const response = await this.retryFetch(
      "/load-progress.php",
      { method: "GET" },
      false
    );
    return (await response.json()) as { progress?: ProgressPayload };
  }

  async saveProgress(progress: ProgressPayload) {
    try {
      await this.retryFetch("/save-progress.php", {
        method: "POST",
        body: JSON.stringify({ progress })
      });
      localStorage.removeItem("study-progress-backup");
    } catch (error) {
      localStorage.setItem("study-progress-backup", JSON.stringify(progress));
      throw error;
    }
  }

  async logSession(session: SessionPayload) {
    await this.retryFetch("/log-session.php", {
      method: "POST",
      body: JSON.stringify(session)
    });
    this.updateStatus({ persistedCount: 1 });
  }

  async logEvent(event: StudyEventPayload) {
    await this.retryFetch("/log-event.php", {
      method: "POST",
      body: JSON.stringify(event)
    });
    this.updateStatus({ persistedCount: 1 });
  }

  sendBeaconEvent(payload: StudyEventPayload) {
    const url = `${this.apiBase}/log-event.php`;
    const headers = { type: "application/json" };
    if (!("sendBeacon" in navigator)) {
      return false;
    }
    return navigator.sendBeacon(
      url,
      new Blob([JSON.stringify(payload)], headers)
    );
  }

  sendBeaconSessionEnd(payload: SessionPayload) {
    const url = `${this.apiBase}/log-session.php`;
    const headers = { type: "application/json" };
    if (!("sendBeacon" in navigator)) {
      return false;
    }
    return navigator.sendBeacon(
      url,
      new Blob([JSON.stringify(payload)], headers)
    );
  }
}
