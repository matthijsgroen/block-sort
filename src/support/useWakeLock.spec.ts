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
    release.mockReset();
    request.mockReset();
  });

  it("requests wake lock on mount and releases on unmount", async () => {
    expect(request).not.toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();
    const { unmount } = renderHook(() => useWakeLock());
    expect(request).toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 1));
    unmount();
    expect(release).toHaveBeenCalled();
  });

  it("re-acquires the lock after visibility change", async () => {
    expect(request).not.toHaveBeenCalled();
    const { unmount } = renderHook(() => useWakeLock());
    expect(request).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 1));

    document.dispatchEvent(new Event("visibilitychange"));
    expect(request).toHaveBeenCalledTimes(2);

    unmount();
  });
});
