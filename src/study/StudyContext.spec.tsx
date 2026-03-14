import type { PropsWithChildren } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StudyProvider, useStudy } from "./StudyContext";

const wrapper = ({ children }: PropsWithChildren) => (
  <StudyProvider>{children}</StudyProvider>
);

describe("StudyContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({})
      })
    );

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
});
