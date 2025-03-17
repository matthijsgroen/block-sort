import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWakeLock } from "./useWakeLock";

describe("useWakeLock", () => {
  const release = vi.fn();
  const request = vi.fn().mockReturnValue(
    Promise.resolve({
      release
    })
  );
  let oldNavigator: Navigator;

  beforeEach(() => {
    release.mockClear();
    request.mockClear();
    const wakeLock = {
      request,
      release
    };
    const navigator = {
      wakeLock
    };
    oldNavigator = globalThis.navigator;
    globalThis.navigator = navigator as unknown as Navigator;
  });

  afterEach(() => {
    globalThis.navigator = oldNavigator;
  });

  it("allows request and auto releases on unmount", async () => {
    expect(request).not.toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();
    const { unmount, result } = renderHook(() => useWakeLock());

    expect(request).not.toHaveBeenCalled();
    result.current.requestWakeLock();
    expect(request).toHaveBeenCalled();

    expect(request).toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 1));
    unmount();
    expect(release).toHaveBeenCalled();
  });

  it("re-acquires the lock after visibility change", async () => {
    expect(request).not.toHaveBeenCalled();
    const { result } = renderHook(() => useWakeLock());

    expect(request).not.toHaveBeenCalled();
    result.current.requestWakeLock();
    expect(request).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 1));

    document.dispatchEvent(new Event("visibilitychange"));
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("allows manual release", async () => {
    expect(request).not.toHaveBeenCalled();
    const { unmount, result } = renderHook(() => useWakeLock());

    expect(request).not.toHaveBeenCalled();
    result.current.requestWakeLock();
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(request).toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();

    result.current.releaseWakeLock();
    expect(release).toHaveBeenCalledTimes(1);

    unmount();
    expect(release).toHaveBeenCalledTimes(1);
  });
});
