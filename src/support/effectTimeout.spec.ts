import { describe, expect, it, vi } from "vitest";

import { effectTimeout } from "./effectTimeout";

describe(effectTimeout, () => {
  it("calls the goal after the duration", () => {
    const goal = vi.fn();
    vi.useFakeTimers();
    effectTimeout(goal, 100);
    expect(goal).not.toBeCalled();
    vi.advanceTimersByTime(100);
    expect(goal).toBeCalled();
    vi.useRealTimers();
  });

  it("clears the timeout when the effect is cleared", () => {
    const goal = vi.fn();
    vi.useFakeTimers();
    const clear = effectTimeout(goal, 100);
    clear();
    vi.advanceTimersByTime(100);
    expect(goal).not.toBeCalled();
    vi.useRealTimers();
  });
});
