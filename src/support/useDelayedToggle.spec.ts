import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useDelayedToggle } from "./useDelayedToggle";

describe(useDelayedToggle, () => {
  it("returns the initial value", () => {
    const { result } = renderHook(() =>
      useDelayedToggle(false, { onDelay: 0, offDelay: 0 })
    );
    expect(result.current).toEqual(false);
  });

  it("updates immediately if delays are 0", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: boolean }) =>
        useDelayedToggle(value, { onDelay: 0, offDelay: 0 }),
      { initialProps: { value: true } }
    );
    expect(result.current).toEqual(true);

    rerender({ value: false });
    expect(result.current).toEqual(false);

    rerender({ value: true });
    expect(result.current).toEqual(true);
  });

  describe("delayed switching", () => {
    it("can delay when switching on and off", () => {
      vi.useFakeTimers();
      const { result, rerender } = renderHook(
        ({ value }: { value: boolean }) =>
          useDelayedToggle(value, { onDelay: 20, offDelay: 20 }),
        { initialProps: { value: false } }
      );
      expect(result.current).toEqual(false);

      rerender({ value: true });
      expect(result.current).toEqual(false);

      act(() => vi.advanceTimersByTime(30));
      expect(result.current).toEqual(true);

      rerender({ value: false });
      expect(result.current).toEqual(true);
      act(() => vi.advanceTimersByTime(30));
      expect(result.current).toEqual(false);
    });
  });
});
