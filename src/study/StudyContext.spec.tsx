import type { PropsWithChildren } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StudyProvider, useStudy } from "./StudyContext";

const wrapper = ({ children }: PropsWithChildren) => (
  <StudyProvider>{children}</StudyProvider>
);

describe("StudyContext", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does not start cooldown on first unlock submission", async () => {
    const { result } = renderHook(() => useStudy(), { wrapper });

    let didUnlock = false;
    await act(async () => {
      didUnlock = await result.current.unlockWithStudy("Tester", "Typescript");
    });

    expect(didUnlock).toBe(true);
    expect(result.current.locked).toBe(false);
    expect(result.current.canUnlock).toBe(true);
    expect(result.current.cooldownSeconds).toBe(0);
    expect(result.current.remainingSeconds).toBe(60);
  });

  it("starts 45 second cooldown only after the assigned play timer ends", async () => {
    const { result } = renderHook(() => useStudy(), { wrapper });

    await act(async () => {
      await result.current.unlockWithStudy("Tester", "Study notes");
    });

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.locked).toBe(true);
    expect(result.current.canUnlock).toBe(false);
    expect(result.current.cooldownSeconds).toBe(45);
  });

  it("logs start and end level plus both unlock form fields", async () => {
    const { result } = renderHook(() => useStudy(), { wrapper });

    await act(async () => {
      result.current.setProgress({
        levelNr: 7,
        inLevel: true,
        inZenMode: false
      });
      await result.current.unlockWithStudy("Student A", "Reading chapter 3");
    });

    await act(async () => {
      result.current.setProgress({
        levelNr: 10,
        inLevel: false,
        inZenMode: false
      });
      vi.advanceTimersByTime(60_000);
    });

    const logSessionCalls = fetchMock.mock.calls
      .map((call) => {
        const [url, init] = call;
        return {
          url: String(url),
          body: init?.body ? JSON.parse(String(init.body)) : null
        };
      })
      .filter((call) => call.url.endsWith("/log-session"));

    const sessionStartPayload = logSessionCalls.find(
      (call) => call.body?.event_type === "session_start"
    )?.body;
    const sessionEndPayload = logSessionCalls.find(
      (call) => call.body?.event_type === "session_end"
    )?.body;

    expect(sessionStartPayload).toMatchObject({
      username: "Student A",
      study_entry: "Reading chapter 3",
      session_start_level: 7,
      session_start_in_level: true,
      current_level: 7
    });

    expect(sessionEndPayload).toMatchObject({
      username: "Student A",
      study_entry: "Reading chapter 3",
      session_start_level: 7,
      session_end_level: 10,
      session_end_in_level: false,
      duration_seconds: 60
    });
  });
});
